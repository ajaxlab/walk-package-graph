import { PackageJson } from 'package-json';
import { IPackageNode } from './types';

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
    const { optionalDependencies } = manifest;
    this.id = manifest.name + '/' + manifest.version;
    this.manifest = manifest;
    this.path = path;
    this._unresolvedDeps = manifest.dependencies
      ? Object.assign(Object.create(null), manifest.dependencies)
      : Object.create(null);
    if (optionalDependencies) {
      const optionalNames = Object.keys(optionalDependencies);
      const { length } = optionalNames;
      for (let i = 0; i < length; i++) {
        delete this._unresolvedDeps[optionalNames[i]];
        // TODO warn
      }
    }
  }

  toString() {
    return '<PackageNode>' + this.id;
  }

  validate(cb?: (node: IPackageNode, unresolved?: string[]) => void) {
    const unresolvedDeps = this._unresolvedDeps;
    const unresolvedDepNames = Object.keys(unresolvedDeps);
    const { length } = unresolvedDepNames;
    for (let i = 0; i < length; i++) {
      const unresolvedDepName = unresolvedDepNames[i];
      const unresolvedDepNode = this._getDependency(unresolvedDepName);
      if (unresolvedDepNode) {
        this.dependencies.push(unresolvedDepNode);
        delete unresolvedDeps[unresolvedDepName];
      }
    }
    const stillUnresolved = Object.keys(unresolvedDeps);
    if (stillUnresolved.length) {
      if (cb) cb(this, stillUnresolved);
    } else {
      this.dependencyResolved = true;
      if (cb) cb(this);
    }
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
