import { PackageJson } from 'package-json';
import { IPackageNode } from './types';

let count = 0;

class PackageNode implements IPackageNode {

  dependencies: IPackageNode[] = [];
  dependencyResolved: boolean = false;
  id: string;
  manifest: PackageJson;
  nodeModulesMap: {
    [name: string]: IPackageNode
  } = Object.create(null);
  path: string;
  upperModule: IPackageNode | void = void 0;

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

  validate() {
    if (this.dependencyResolved) return;
    console.info(this + '.validate()');
    const deps = this._unresolvedDeps;
    const depNames = Object.keys(deps);
    const { length } = depNames;
    if (this.manifest.name === 'b') {
      console.info(' - b._unresolvedDeps', depNames);
    }
    for (let i = 0; i < length; i++) {
      const depName = depNames[i];
      const depNode = this._getDependency(depName);
      if (this.manifest.name === 'b') {
        console.info(' - depNode', depName, depNode ? depNode.id : '');
      }
      if (depNode) {
        this.dependencies.push(depNode);
        delete deps[depName];
      }
    }
    if (!Object.keys(deps).length) {
      console.info(this + ' resolved', ++count);
      this.dependencyResolved = true;
    }
  }

  private _getDependency(depName: string): IPackageNode | void {
    let node: IPackageNode | void = this;
    while (node) {
      if (node.nodeModulesMap[depName]) {
        return node.nodeModulesMap[depName];
      }
      node = node.upperModule;
    }
  }
}

export default PackageNode;
