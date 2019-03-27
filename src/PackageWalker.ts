import fs from 'fs';
import { PackageJson } from 'package-json';
import p from 'path';
import semver from 'semver';
import canRequire from './canRequire';
import Logger from './Logger';
import PackageNode from './PackageNode';
import {
  IPackageNode, IPackageNodeMap, IPackageResolveHandler,
  IPackageVisitHandler, IWalkEndHandler, IWalkErrorHandler,
  IWalkHandlers, IWalkOptions
} from './types';

class PackageWalker {

  private _dependentsMap: IPackageNodeMap = Object.create(null);
  private _logger: Logger;
  private _nodeMap: IPackageNodeMap = Object.create(null);
  private _onEnd: IWalkEndHandler | undefined;
  private _onError: IWalkErrorHandler | undefined;
  private _onResolve: IPackageResolveHandler | undefined;
  private _onVisit: IPackageVisitHandler | undefined;
  private _options: IWalkOptions;

  constructor(walkHandlers: IWalkHandlers, options: IWalkOptions) {
    this._onEnd = walkHandlers.onEnd;
    this._onError = walkHandlers.onError;
    this._onResolve = walkHandlers.onResolve;
    this._onVisit = walkHandlers.onVisit;
    this._options = options;
    this._logger = new Logger(options.logLevel);
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
          setTimeout(() => {
            const keys = Object.keys(this._dependentsMap);
            console.info('_dependentsMap');
            keys.forEach((key) => {
              if (this._dependentsMap[key].length) {
                console.info(
                  key,
                  this._dependentsMap[key].length
                );
              }
            });
          }, 3000);
        });
      }
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

  private _findDependencyNodes(node: IPackageNode) {
    //
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
        if (
          subNode.path.endsWith('import-fresh\\node_modules\\caller-path')
          || subNode.path.endsWith('webpack-cli\\node_modules\\import-local')
        ) {
          console.info( ' - ' + subNode.id + ' . parent = ', node.id);
        }
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
        if (
          node.path.endsWith('import-fresh\\node_modules\\caller-path')
          || node.path.endsWith('webpack-cli\\node_modules\\import-local')
        ) {
          console.info( ' - ' + node.id + ' . unresolved = ', missing);
          // console.info( ' - this._dependentsMap = ', this._dependentsMap);
        }
      } else if (this._onResolve) {
        this._onResolve(target);
        if (target.manifest.name && this._dependentsMap[target.manifest.name]) {
          const dependents = this._dependentsMap[target.manifest.name];
          if (dependents.length > 5) console.info('dependents.length', target.id, '(', dependents.length, ')');
          while (dependents.length) {
            const dep = dependents.pop();
            if (dep) this._validate(dep);
          }
          if (this._dependentsMap[target.manifest.name].length) {
            console.info('hm............');
          } else {
            console.info('>>>>>>>', target.manifest.name, this._dependentsMap[target.manifest.name].length);
          }
        }
      }
    });
  }

  /*
  private _validate0(node: IPackageNode) {
    const nodeMap = this._nodeMap;
    node.validate((depName, depRange) => {
      const depNodes = nodeMap[depName];
      if (depNodes) {
        const { length } = depNodes;
        for (let i = length - 1; i > -1; i--) {
          const depNode = depNodes[i];
          const depVer = depNode.manifest.version;
          if (
            depVer
            && semver.satisfies(depVer, depRange)
            // && canRequire(this._rootPath, node, depNode)
          ) {
            return true;
          }
        }
      }
      return false;
    });
  }
  */

  private _visit(abs: string, cb: (node?: IPackageNode) => void) {
    let node: IPackageNode | undefined;
    let nodeModules: IPackageNode[] | undefined;
    let resolved = 0;
    const resolve = () => {
      if (++resolved > 1) {
        if (node && (
          node.path.endsWith('\\anymatch\\node_modules\\normalize-path')
          || node.path.endsWith('node_modules\\anymatch')
        )) {
          console.info('>>>', node ? node.path : 'no node');
          console.info(' - nodeModules', nodeModules ? nodeModules.length : 0);
        }
        if (node && nodeModules) this._linkPhysical(node, nodeModules);
        // if (node) node.validate(this._onResolve);
        cb(node);
      }
    };
    this._readPackage(abs, (e, manifest) => {
      if (manifest) {
        node = new PackageNode(manifest, abs);
        // this._addToNodeMap(node);
        // this._addToDependentsMap(node);
        if (this._onVisit) this._onVisit(node);
      } else if (e) {
        this._handleError(abs, e);
      }
      resolve();
    });
    this._visitNodeModules(abs, (nodes) => {
      // console.info('abs', abs, nodes ? nodes.length : 0);
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
