import { PackageJson } from 'package-json';
import { IPackageNode, IPackageResolveHandler } from './types';

class PackageNode implements IPackageNode {

  children: {
    [name: string]: IPackageNode
  } = Object.create(null);
  dependencies: IPackageNode[] = [];
  dependencyResolved: boolean = false;
  id: string;
  manifest: PackageJson;
  parent: IPackageNode | undefined = void 0;
  path: string;

  private _unresolvedDeps: {
    [name: string]: string;
  };

  constructor(manifest: PackageJson, path: string) {
    this.id = manifest.name + '/' + manifest.version;
    this.manifest = manifest;
    this.path = path;
    this._unresolvedDeps = manifest.dependencies
      ? Object.assign(Object.create(null), manifest.dependencies)
      : Object.create(null);
  }

  toString() {
    return '<PackageNode>' + this.id;
  }

  validate(cb?: (node: IPackageNode, unresolved?: string[]) => void) {
    process.nextTick(() => {
      if (this.dependencyResolved) return;
///      console.info(' - ' + this.id + ' . validate()');
///      console.info(' - ' + this.id + ' . this._unresolvedDeps', this._unresolvedDeps);
      const deps = this._unresolvedDeps;
      const depNames = Object.keys(deps);
      const { length } = depNames;
      if (
        this.path.endsWith('import-fresh\\node_modules\\caller-path')
        || this.path.endsWith('webpack-cli\\node_modules\\import-local')
      ) {
        console.info(' - ' + this.id + ' . validate()', depNames);
      }
      for (let i = 0; i < length; i++) {
        const depName = depNames[i];
        const depNode = this._getDependency(depName);
        if (this.manifest.name === 'b') {
///          console.info(' - depNode', depName, depNode ? depNode.id : '');
        }
        if (depNode) {
          this.dependencies.push(depNode);
          delete deps[depName];
        }
      }
      if (
        this.path.endsWith('import-fresh\\node_modules\\caller-path')
        || this.path.endsWith('webpack-cli\\node_modules\\import-local')
      ) {
        console.info(' - ' + this.id + ' deps = ', deps);
      }
      const unresolved = Object.keys(deps);
      if (unresolved.length) {
        if (cb) cb(this, unresolved);
      } else {
        this.dependencyResolved = true;
        if (cb) cb(this);
        if (this.parent) {
//          console.info(' = ' + this.id + ' has parent');
          this.parent.validate(cb);
        } else {
//          console.info(' - ' + this.id + ' has no parent');
        }
      }
    });
  }

  private _getDependency(depName: string): IPackageNode | undefined {
    let node: IPackageNode | void = this;
    while (node) {
      if (node.children[depName]) {
        return node.children[depName];
      }
      node = node.parent;
    }
  }
}

export default PackageNode;
