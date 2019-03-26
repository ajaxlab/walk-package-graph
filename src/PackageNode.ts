import { PackageJson } from 'package-json';
import { IPackageNode } from './types';

class PackageNode implements IPackageNode {

  children: IPackageNode[] = [];
  dependencies: IPackageNode[] = [];
  dependencyResolved: boolean = false;
  id: string;
  manifest: PackageJson;
  path: string;

  private _unresolvedDeps: {
    [name: string]: string;
  };

  constructor(manifest: PackageJson, path: string) {
    this.id = manifest.name + '@' + manifest.version;
    this.manifest = manifest;
    this.path = path;
    this._unresolvedDeps = manifest.dependencies
      ? Object.assign(Object.create(null), manifest.dependencies)
      : Object.create(null);
  }

  toString() {
    return '<PackageNode>' + this.id;
  }

  validate(cb: (name: string, range: string) => boolean) {
    const deps = this._unresolvedDeps;
    const depNames = Object.keys(deps);
    const { length } = depNames;
    for (let i = 0; i < length; i++) {
      const name = depNames[i];
      if (cb(name, deps[name])) {
        delete deps[name];
      }
    }
    if (!Object.keys(deps).length) {
      return this._resolve();
    }
  }

  private _resolve() {
    //
  }
}

export default PackageNode;
