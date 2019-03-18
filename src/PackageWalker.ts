import fs from 'fs';
import { PackageJson } from 'package-json';
import p from 'path';
import semver from 'semver';
import Logger from './Logger';
import PackageNode from './PackageNode';
import {
  IBooleanRecord, IPackageNode, IPackageNodeHandler, IPackageNodeMap,
  IReverseDependency, IWalkHandlers, IWalkOptions
} from './types';

class PackageNodeWalker {

  private _logger: Logger;
  private _nodeMap: IPackageNodeMap = Object.create(null);
  private _onComplete: IPackageNodeHandler | void;
  private _onVisit: IPackageNodeHandler | void;
  private _options: IWalkOptions;
  private _reverseDependency: IReverseDependency = Object.create(null);
  private _rootNode!: IPackageNode;
  private _visited: IBooleanRecord = Object.create(null);
  private _visitJob: IBooleanRecord = Object.create(null);

  constructor(walkHandlers: IWalkHandlers, options: IWalkOptions) {
    this._onComplete = walkHandlers.onComplete;
    this._onVisit = walkHandlers.onVisit;
    this._options = options;
    this._logger = new Logger(options.logLevel);
  }

  start(rootPath: string) {
    this._visit(rootPath, (rootNode) => {
      this._rootNode = rootNode;
    });
  }

  private _finishVisitJob(path: string) {
    delete this._visitJob[path];
    if (Object.keys(this._visitJob).length === 0) {
      if (this._onComplete) {
        this._onComplete(this._rootNode);
        this._logger.debug('reverseDependency', this._reverseDependency);
      }
    }
  }

  private _readPackage(abs: string, cb: (err?: Error, manifest?: PackageJson) => void) {
    this._logger.debug('_readPackage(' + abs + ', cb)');
    this._visitJob[abs] = true;
    fs.readFile(abs + p.sep + 'package.json', 'utf8', (readFileErr, txt) => {
      if (readFileErr) {
        cb(readFileErr);
        return;
      }
      try {
        cb(void 0, JSON.parse(txt));
      } catch (jsonErr) {
        cb(jsonErr);
      }
    });
  }

  private _resolveDependency(node: IPackageNode) {
    const { dependencies } = node.manifest;
    this._logger.debug('_resolveDependency(' + node.id + ')', dependencies);
    if (dependencies) {
      const depNames = Object.keys(dependencies);
      const depNamesLen = depNames.length;
      if (depNamesLen) {
        const nodeMap = this._nodeMap;
        const reverse = this._reverseDependency;
        depNamesLoop: for (let i = 0; i < depNamesLen; i++) {
          const depName = depNames[i];
          const depRange = dependencies[depName];
          const depVersMap = nodeMap[depName];
          if (depVersMap) {
            const versions = Object.keys(depVersMap);
            const versionsLen = versions.length;
            for (let j = 0; j < versionsLen; j++) {
              const depVer = versions[j];
              if (semver.satisfies(depVer, depRange)) {
                node.dependencies.push(depVersMap[depVer]);
                // check all resolved
                continue depNamesLoop;
              }
            }
          }
          if (!reverse[depName]) {
            reverse[depName] = Object.create(null);
          }
          if (!reverse[depName][depRange]) {
            reverse[depName][depRange] = [];
          }
          reverse[depName][depRange].push(node);
        }
      }
    }
  }

  private _resolveReverseDependency(node: IPackageNode) {
    this._logger.debug('_resolveReverseDependency(' + node.id + ')');
    const reverse = this._reverseDependency;
    const { name, version } = node.manifest;
    if (name && version && reverse[name]) {
      const rangesMap = reverse[name];
      const ranges = Object.keys(rangesMap);
      const rangeLen = ranges.length;
      for (let i = 0; i < rangeLen; i++) {
        const range = ranges[i];
        if (semver.satisfies(version, range)) {
          const dependantNodes = rangesMap[range];
          const len = dependantNodes.length;
          for (let j = 0; j < len; j++) {
            const dependantNode = dependantNodes[j];
            dependantNode.dependencies.push(node);
            // check all resolved
          }
          delete rangesMap[range];
          break;
        }
      }
    }
  }

  private _visit(path: string, cb?: (node: IPackageNode) => void) {
    const abs = p.resolve(path);
    if (this._visited[abs]) {
      this._logger.debug('already visited :', abs);
      return;
    }
    this._visited[abs] = true;
    this._readPackage(abs, (e, manifest) => {
      if (manifest) {
        const { name, version } = manifest;
        const node = new PackageNode(manifest);
        if (name && version) {
          const nodeMap = this._nodeMap;
          if (!nodeMap[name]) {
            nodeMap[name] = Object.create(null);
          }
          nodeMap[name][version] = node;
        }
        this._logger.debug('>>> new PackageNode() :', node.id);
        this._resolveDependency(node);
        this._resolveReverseDependency(node);
        if (cb) {
          cb(node);
        }
      } else if (e) {
        this._logger.error(e);
      }
      this._finishVisitJob(abs);
    });
    this._visitDependency(abs);
  }

  private _visitDependency(abs: string) {
    const nmPath = abs + p.sep + 'node_modules';
    fs.readdir(nmPath, (readdirErr, items) => {
      if (readdirErr) {
        if (readdirErr.code !== 'ENOENT') {
          this._logger.error(readdirErr);
        }
        return;
      }
      this._logger.debug(abs, 'node_modules items', items.length);
      const { length } = items;
      for (let i = 0; i < length; i++ ) {
        const item = items[i];
        const itemPrefix = item[0];
        if (itemPrefix === '.') {
          continue;
        } else if (itemPrefix === '@') {
          // TODO
          continue;
        } else {
          this._visit(nmPath + p.sep + item);
        }
      }
    });
  }
}

export default PackageNodeWalker;
