import fs from 'fs';
import { PackageJson } from 'package-json';
import p from 'path';
import semver from 'semver';
import Logger from './Logger';
import PackageNode from './PackageNode';
import {
  IBooleanRecord, IPackageNode, IPackageNodeHandler, IPackageNodeMap, IWalkHandlers, IWalkOptions
} from './types';

class PackageNodeWalker {

  private _logger: Logger;
  private _nodeMap: IPackageNodeMap = Object.create(null);
  private _onComplete: IPackageNodeHandler | void;
  private _onVisit: IPackageNodeHandler | void;
  private _options: IWalkOptions;
  private _reverseDependency: any = Object.create(null);
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

  private _addReverseDependency(node: IPackageNode) {
    this._logger.debug('_addReverseDependency :', node.id, node.manifest.dependencies);
    const { dependencies } = node.manifest;
    if (dependencies) {
      const depNames = Object.keys(dependencies);
      const length = depNames.length;
      if (length) {
        const reverse = this._reverseDependency;
        for (let i = 0; i < length; i++) {
          const depName = depNames[i];
          if (!reverse[depName]) {
            reverse[depName] = {};
          }
          const version = dependencies[depName];
          if (!reverse[depName][version]) {
            reverse[depName][version] = {};
          }
          reverse[depName][version][node.id] = true;
        }
        this._logger.debug('reverse', reverse);
      }
    }
  }

  private _finishVisitJob(path: string) {
    delete this._visitJob[path];
    if (Object.keys(this._visitJob).length === 0) {
      if (this._onComplete) {
        this._onComplete(this._rootNode);
        console.log('_reverseDependency >>', this._reverseDependency);
      }
    }
  }

  private _readPackage(abs: string, cb: (err?: Error, manifest?: PackageJson) => void) {
    // this._logger.debug('_readPackage(' + abs + ', cb)');
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
    console.log('_resolveDependency -----------', node.id);
    const reverse = this._reverseDependency;
    const { name, version } = node.manifest;
    if (name && version && reverse[name]) {
      console.log(name, 'reverse 있어', reverse[name]);
      const versions = Object.keys(reverse[name]);
      console.log(' -> versions', versions);
      const length = versions.length;
      for (let i = 0; i < length; i++) {
        if (semver.satisfies(version, versions[i])) {
          const dependantMap = reverse[name][versions[i]];
          const dependants = Object.keys(dependantMap);
          console.log(node.id, 'satisfy', versions[i], dependants);
          const len = dependants.length;
          for (let j = 0; j < len; j++) {
            if (this._nodeMap[dependants[j]]) {
              console.log('nodemap 있음', dependants[j]);
              this._nodeMap[dependants[j]].dependencies.push(node);
              console.log('here', reverse[name]);
              delete reverse[name][versions[i]][dependants[j]];
            } else {
              console.log('nodemap 없음', dependants[j]);
            }
          }
          break;
        }
      }
    } else {
      console.log(name, 'reverse 없어');
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
        const node = new PackageNode(manifest);
        this._nodeMap[node.id] = node;
        console.debug('new PackageNode() :', node.id);
        this._addReverseDependency(node);
        this._resolveDependency(node);
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
