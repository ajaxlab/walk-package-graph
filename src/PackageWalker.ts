import fs from 'fs';
import p from 'path';
import PackageNode from './PackageNode';
import {
  IPackageJson, IPackageNode, IWalkHandlers
} from './types';

class PackageWalker {

  private _onEnd: ((rootNode?: IPackageNode) => void) | undefined;
  private _onError: ((error: NodeJS.ErrnoException) => void) | undefined;
  private _onResolve: ((node: IPackageNode) => void) | undefined;
  private _onUnresolve: ((node: IPackageNode, unresolvedNames: string[]) => void) | undefined;
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
        this._handleError(readFileErr);
        if (this._onEnd) this._onEnd(void 0);
      } else {
        this._visit(abs, (rootNode) => {
          if (rootNode) this._resolve(rootNode);
          if (this._onEnd) this._onEnd(rootNode);
        });
      }
    });
  }

  private _handleError(err: NodeJS.ErrnoException) {
    if (this._onError) {
      this._onError(err);
    }
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

  private _readPackage(abs: string, cb: (manifest?: IPackageJson) => void) {
    const pkgPath = abs + p.sep + 'package.json';
    fs.readFile(pkgPath, 'utf8', (readFileErr, txt) => {
      if (readFileErr) {
        this._handleError(readFileErr);
        return cb();
      }
      try {
        cb(JSON.parse(txt));
      } catch (jsonErr) {
        jsonErr.path = pkgPath;
        this._handleError(jsonErr);
        cb();
      }
    });
  }

  /*
   * DFS
   */
  private _resolve(root: IPackageNode) {
    const traverse = (node: IPackageNode) => {
      const { children } = node;
      const childNames = Object.keys(children);
      const childrenLen = childNames.length;
      for (let i = 0; i < childrenLen; i++) {
        const name = childNames[i];
        const child = children[name];
        traverse(child);
      }
      node.validate((validatedNode, unresolvedNodeNames) => {
        if (unresolvedNodeNames) {
          if (this._onUnresolve) {
            this._onUnresolve(validatedNode, unresolvedNodeNames);
          }
        } else {
          if (this._onResolve) {
            this._onResolve(validatedNode);
          }
        }
      });
    };
    traverse(root);
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
    this._readPackage(abs, (manifest) => {
      if (manifest) {
        node = new PackageNode(manifest, abs);
        if (this._onVisit) {
          this._onVisit(node);
        }
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
          this._handleError(readdirErr);
        }
        return cb();
      }
      const { length } = items;
      if (!length) { return cb(); }
      let pending = length;
      const nodes: IPackageNode[] = [];
      for (let i = 0; i < length; i++) {
        const item = items[i];
        const itemPrefix = item[0];
        if (itemPrefix === '.') {
          if (!--pending) { cb(nodes); }
          continue;
        } else if (itemPrefix === '@') {
          this._visitScopedPackages(nmPath + p.sep + item, (snodes) => {
            if (snodes) { nodes.push(...snodes); }
            if (!--pending) { cb(nodes); }
          });
        } else {
          this._visit(nmPath + p.sep + item, (node) => {
            if (node) { nodes.push(node); }
            if (!--pending) { cb(nodes); }
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
        this._handleError(readdirErr);
        return cb();
      }
      const { length } = items;
      if (!length) { return cb(); }
      let pending = length;
      const nodes: IPackageNode[] = [];
      for (let i = 0; i < length; i++) {
        const item = items[i];
        this._visit(scopePath + p.sep + item, (node) => {
          if (node) { nodes.push(node); }
          if (!--pending) { cb(nodes); }
        });
      }
    });
  }
}

export default PackageWalker;
