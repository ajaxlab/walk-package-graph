import fs from 'fs';
import { PackageJson } from 'package-json';
import p from 'path';
import Logger from './Logger';
import PackageNode from './PackageNode';
import {
  IPackageNode, IPackageNodeMap, IPackageResolveHandler,
  IPackageVisitHandler, IWalkEndHandler,
  IWalkHandlers, IWalkOptions
} from './types';

class PackageWalker {

  private _dependentsMap: IPackageNodeMap = Object.create(null);
  private _logger: Logger;
  private _nodeMap: IPackageNodeMap = Object.create(null);
  private _onEnd: IWalkEndHandler | void;
  private _onResolve: IPackageResolveHandler | void;
  private _onVisit: IPackageVisitHandler | void;
  private _options: IWalkOptions;

  constructor(walkHandlers: IWalkHandlers, options: IWalkOptions) {
    this._onEnd = walkHandlers.onEnd;
    this._onResolve = walkHandlers.onResolve;
    this._onVisit = walkHandlers.onVisit;
    this._options = options;
    this._logger = new Logger(options.logLevel);
  }

  start(path: string) {
    const abs = p.resolve(path);
    fs.readFile(abs + p.sep + 'package.json', 'utf8', (readFileErr) => {
      if (readFileErr) {
        if (this._onEnd) {
          this._onEnd(readFileErr);
        }
        if (this._onVisit) {
          this._onVisit(readFileErr);
        }
        return;
      }
      this._visit(abs, (err, node) => {
        if (this._onEnd) {
          this._onEnd(err, node);
        }
      });
    });
  }

  private _addToDependentsMap(node: IPackageNode) {
    // _dependentsMap
    // console.log(node.manifest.dependencies);
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

  private _readPackage(abs: string, cb: (err?: Error, manifest?: PackageJson) => void) {
    fs.readFile(abs + p.sep + 'package.json', 'utf8', (readFileErr, txt) => {
      if (readFileErr) {
        if (readFileErr.code === 'ENOENT') return cb();
        return cb(readFileErr);
      }
      try {
        cb(void 0, JSON.parse(txt));
      } catch (jsonErr) {
        cb(jsonErr);
      }
    });
  }

  private _visit(abs: string, cb: (err?: Error, node?: IPackageNode) => void) {
    let node: IPackageNode;
    let resolved = 0;
    function resolve(err?: Error) {
      if (err) return cb(err);
      if (++resolved > 1) cb(void 0, node);
    }
    this._readPackage(abs, (e, manifest) => {
      if (manifest) {
        node = new PackageNode(manifest, abs);
        this._addToNodeMap(node);
        this._addToDependentsMap(node);
        if (this._onVisit) {
          this._onVisit(e, manifest, abs);
        }
      }
      resolve(e);
    });
    this._visitNodeModules(abs, (e) => {
      resolve(e);
    });
  }

  private _visitNodeModules(abs: string, cb: (err?: Error) => void) {
    const nmPath = abs + p.sep + 'node_modules';
    fs.readdir(nmPath, (readdirErr, items) => {
      if (readdirErr) {
        if (readdirErr.code === 'ENOENT') {
          return cb();
        }
        return cb(readdirErr);
      }
      const { length } = items;
      let pending = length;
      if (!pending) return cb();
      for (let i = 0; i < length; i++) {
        const item = items[i];
        const itemPrefix = item[0];
        if (itemPrefix === '.') {
          if (!--pending) cb();
          continue;
        } else if (itemPrefix === '@') {
          this._visitScopedPackages(nmPath + p.sep + item, (scopeErr) => {
            if (scopeErr) return cb(scopeErr);
            if (!--pending) cb();
          });
        } else {
          this._visit(nmPath + p.sep + item, (visitErr) => {
            if (visitErr) return cb(visitErr);
            if (!--pending) cb();
          });
        }
      }
    });
  }

  /*
  scopePath example:
  '/home/walk-package-graph/node_modules/@types'
  */
  private _visitScopedPackages(scopePath: string, cb: (err?: Error) => void) {
    fs.readdir(scopePath, (readdirErr, items) => {
      if (readdirErr) {
        if (readdirErr.code === 'ENOENT') return cb();
        return cb(readdirErr);
      }
      const { length } = items;
      let pending = length;
      if (!pending) return cb();
      for (let i = 0; i < length; i++) {
        const item = items[i];
        this._visit(scopePath + p.sep + item, (visitErr) => {
          if (visitErr) return cb(visitErr);
          if (!--pending) cb();
        });
      }
    });
  }
}

export default PackageWalker;
