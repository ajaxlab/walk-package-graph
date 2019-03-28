import fs from 'fs';
import { PackageJson } from 'package-json';
import p from 'path';
import PackageNode from './PackageNode';
import {
  IPackageNode, IPackageNodeMap, IPackageResolveHandler,
  IPackageVisitHandler, IWalkEndHandler, IWalkErrorHandler,
  IWalkHandlers
} from './types';

class PackageWalker {

  private _dependentsMap: IPackageNodeMap = Object.create(null);
  private _onEnd: IWalkEndHandler | undefined;
  private _onError: IWalkErrorHandler | undefined;
  private _onResolve: IPackageResolveHandler | undefined;
  private _onVisit: IPackageVisitHandler | undefined;

  constructor(walkHandlers: IWalkHandlers) {
    this._onEnd = walkHandlers.onEnd;
    this._onError = walkHandlers.onError;
    this._onResolve = walkHandlers.onResolve;
    this._onVisit = walkHandlers.onVisit;
  }

  start(path: string) {
    const abs = p.resolve(path);
    fs.readFile(abs + p.sep + 'package.json', 'utf8', (readFileErr) => {
      if (readFileErr) {
        this._handleError(abs, readFileErr);
        if (this._onEnd) this._onEnd(void 0);
      } else {
        this._visit(abs, (node) => {
          if (this._onEnd) this._onEnd(node);
        });
      }
    });
  }

  private _handleError(path: string, err: Error) {
    if (this._onError) this._onError(err, path);
  }

  private _linkPhysical(node: IPackageNode, nodeModules: IPackageNode[]) {
    const { children } = node;
    const { length } = nodeModules;
    for (let i = 0; i < length; i++) {
      const subNode = nodeModules[i];
      const { name } = subNode.manifest;
      if (name) {
        children[name] = subNode;
        subNode.parent = node;
        this._validate(subNode);
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

  private _validate(node: IPackageNode) {
    node.validate((target, missing) => {
      if (missing) {
        const unresolvedLen = missing.length;
        for (let j = 0; j < unresolvedLen; j++) {
          if (!this._dependentsMap[missing[j]]) {
            this._dependentsMap[missing[j]] = [];
          }
          // TODO performance
          if (this._dependentsMap[missing[j]].indexOf(target) === -1) {
            this._dependentsMap[missing[j]].push(target);
          }
        }
      } else if (this._onResolve) {
        this._onResolve(target);
        if (target.manifest.name && this._dependentsMap[target.manifest.name]) {
          const dependents = this._dependentsMap[target.manifest.name];
          while (dependents.length) {
            const dep = dependents.pop();
            if (dep) this._validate(dep);
          }
        }
      }
    });
  }

  private _visit(abs: string, cb: (node?: IPackageNode) => void) {
    let node: IPackageNode | undefined;
    let nodeModules: IPackageNode[] | undefined;
    let resolved = 0;
    const resolve = () => {
      if (++resolved > 1) {
        if (node && nodeModules) this._linkPhysical(node, nodeModules);
        cb(node);
      }
    };
    this._readPackage(abs, (e, manifest) => {
      if (manifest) {
        node = new PackageNode(manifest, abs);
        if (this._onVisit) this._onVisit(node);
      } else if (e) {
        this._handleError(abs, e);
      }
      resolve();
    });
    this._visitNodeModules(abs, (nodes) => {
      nodeModules = nodes;
      resolve();
    });
  }

  private _visitNodeModules(abs: string, cb: (nodes?: IPackageNode[]) => void) {
    const nmPath = abs + p.sep + 'node_modules';
    fs.readdir(nmPath, (readdirErr, items) => {
      if (readdirErr) {
        if (readdirErr.code !== 'ENOENT') {
          this._handleError(abs, readdirErr);
        }
        return cb();
      }
      const { length } = items;
      if (!length) return cb();
      let pending = length;
      const nodes: IPackageNode[] = [];
      for (let i = 0; i < length; i++) {
        const item = items[i];
        const itemPrefix = item[0];
        if (itemPrefix === '.') {
          if (!--pending) cb(nodes);
          continue;
        } else if (itemPrefix === '@') {
          this._visitScopedPackages(nmPath + p.sep + item, (snodes) => {
            if (snodes) nodes.push(...snodes);
            if (!--pending) cb(nodes);
          });
        } else {
          this._visit(nmPath + p.sep + item, (node) => {
            if (node) nodes.push(node);
            if (!--pending) cb(nodes);
          });
        }
      }
    });
  }

  /*
  scopePath example:
  '/home/walk-package-graph/node_modules/@types'
  */
  private _visitScopedPackages(scopePath: string, cb: (nodes?: IPackageNode[]) => void) {
    fs.readdir(scopePath, (readdirErr, items) => {
      if (readdirErr) {
        this._handleError(scopePath, readdirErr);
        return cb();
      }
      const { length } = items;
      if (!length) return cb();
      let pending = length;
      const nodes: IPackageNode[] = [];
      for (let i = 0; i < length; i++) {
        const item = items[i];
        this._visit(scopePath + p.sep + item, (node) => {
          if (node) nodes.push(node);
          if (!--pending) cb(nodes);
        });
      }
    });
  }
}

export default PackageWalker;
