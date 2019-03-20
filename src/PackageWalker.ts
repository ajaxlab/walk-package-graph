import fs from 'fs';
import { PackageJson } from 'package-json';
import p from 'path';
import semver from 'semver';
import Logger from './Logger';
import PackageNode from './PackageNode';
import {
  IBooleanRecord, IPackageNode, IPackageNodeMap, IPackageResolveHandler,
  IPackageVisitHandler, IReverseDependency, IWalkCompleteHandler,
  IWalkHandlers, IWalkOptions
} from './types';

class PackageWalker {

  private _logger: Logger;
  private _nodeMap: IPackageNodeMap = Object.create(null);
  private _onComplete: IWalkCompleteHandler | void;
  private _onResolve: IPackageResolveHandler | void;
  private _onVisit: IPackageVisitHandler | void;
  private _options: IWalkOptions;
  private _rootNode!: IPackageNode;
  private _toVisit: IBooleanRecord = Object.create(null);
  private _visited: IBooleanRecord = Object.create(null);

  constructor(walkHandlers: IWalkHandlers, options: IWalkOptions) {
    this._onComplete = walkHandlers.onComplete;
    this._onResolve = walkHandlers.onResolve;
    this._onVisit = walkHandlers.onVisit;
    this._options = options;
    this._logger = new Logger(options.logLevel);
  }

  start(rootPath: string) {
    this._visit(rootPath, (rootNode) => {
      this._rootNode = rootNode;
    });
  }

  private _addToNodeMap(node: IPackageNode) {
    const { name, version } = node.manifest;
    if (name && version) {
      const nodeMap = this._nodeMap;
      if (nodeMap[name]) {
        // push & sort by path.length ascend
        const nodesByName = nodeMap[name];
        nodesByName[nodesByName.length] = node;
        nodesByName.sort((a, b) => {
          return a.path.length - b.path.length;
        });
      } else {
        nodeMap[name] = [ node ];
      }
    }
  }

  private _clearVisitJob(path: string) {
    delete this._toVisit[path];
    if (Object.keys(this._toVisit).length === 0) {
      if (this._onComplete) {
        this._onComplete(this._rootNode);
      }
    }
  }

  // c
  private _readPackage(abs: string, cb: (err?: Error, manifest?: PackageJson) => void) {
    this._logger.debug('_readPackage(' + abs + ', cb)');
    this._toVisit[abs] = true;
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

  private _visit(path: string, cb?: (node: IPackageNode) => void) {
    const abs = p.resolve(path);
    if (this._visited[abs]) {
      this._logger.debug('already visited :', abs);
      return;
    }
    this._visited[abs] = true;
    this._readPackage(abs, (e, manifest) => {
      if (manifest) {
        const node = new PackageNode(manifest, abs);
        this._addToNodeMap(node);
        if (cb) {
          cb(node);
        }
      } else if (e) {
        this._logger.error(e);
      }
      if (this._onVisit) {
        this._onVisit(e, manifest, abs);
      }
      this._clearVisitJob(abs);
    });
    this._visitNodeModules(abs);
  }

  // c
  private _visitNodeModules(abs: string) {
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

export default PackageWalker;
