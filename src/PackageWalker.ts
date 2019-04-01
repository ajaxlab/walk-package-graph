import fs from 'fs';
import p from 'path';
import PackageNode from './PackageNode';
import {
  IPackageJson, IPackageNode, IWalkHandlers
} from './types';

class PackageWalker {

  private _onEnd: ((rootNode?: IPackageNode) => void) | undefined;
  private _onError: ((error: NodeJS.ErrnoException, path: string) => void) | undefined;
  private _onResolve: ((node: IPackageNode) => void) | undefined;
  private _onUnresolve: ((unresolvedNames: string[]) => void) | undefined;
  private _onVisit: ((node: IPackageNode) => void) | undefined;

  constructor(walkHandlers: IWalkHandlers) {
    this._onEnd = walkHandlers.onEnd;
    this._onError = walkHandlers.onError;
    this._onResolve = walkHandlers.onResolve;
    this._onUnresolve = walkHandlers.onUnresolve;
    this._onVisit = walkHandlers.onVisit;
  }

  start(path: string) {
    const abs = p.resolve(path);
    fs.readFile(abs + p.sep + 'package.json', 'utf8', (readFileErr) => {
      if (readFileErr) {
        this._handleError(abs, readFileErr);
        if (this._onEnd) this._onEnd(void 0);
      } else {
        this._visit(abs, (rootNode) => {
          if (rootNode) this._resolve(rootNode);
          if (this._onEnd) this._onEnd(rootNode);
        });
      }
    });
  }

  private _handleError(path: string, err: Error) {
    if (this._onError) this._onError(err, path);
  }

  /*
  @parentNode : a package
  @childNodes : the above package's node_modules's packages
  */
  private _linkFamilyTree(parentNode: IPackageNode, childNodes: IPackageNode[]) {
    const { children } = parentNode;
    const { length } = childNodes;
    for (let i = 0; i < length; i++) {
      const childNode = childNodes[i];
      const { name } = childNode.manifest;
      if (name) {
        children[name] = childNode;
        childNode.parent = parentNode;
      }
    }
  }

  private _readPackage(abs: string, cb: (err?: Error, manifest?: IPackageJson) => void) {
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

  /*
   * DFS
   */
  private _resolve(root: IPackageNode) {
    const stack: IPackageNode[] = [];
    function traverse(node: IPackageNode) {
      stack.push(node);
      const { children } = node;
      const childNames = Object.keys(children);
      const childrenLen = childNames.length;
      for (let i = 0; i < childrenLen; i++) {
        const name = childNames[i];
        const child = children[name];
        traverse(child);
      }
    }
    traverse(root);
    while (stack.length) {
      const node = stack.pop();
      if (node) {
        node.validate((resolvedNode, unresolvedNodeNames) => {
          if (resolvedNode && this._onResolve) {
            this._onResolve(node);
          } else if (unresolvedNodeNames && this._onUnresolve) {
            this._onUnresolve(unresolvedNodeNames);
          }
        });
      }
    }
  }

  private _visit(abs: string, cb: (node?: IPackageNode) => void) {
    let node: IPackageNode | undefined;
    let nodeModules: IPackageNode[] | undefined;
    let resolved = 0;
    const resolve = () => {
      if (++resolved > 1) {
        if (node && nodeModules) this._linkFamilyTree(node, nodeModules);
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
