import { PackageJson } from 'package-json';
import { IBooleanRecord, IPackageNode } from './types';

class PackageNode implements IPackageNode {

  dependencies: IPackageNode[] = [];
  dependencyResolved: boolean = false;
  id: string;
  manifest: PackageJson;
  path: string;
  toBeResolved: IBooleanRecord;

  constructor(manifest: PackageJson, path: string) {
    this.id = manifest.name + '@' + manifest.version;
    this.manifest = manifest;
    this.path = path;
    this.toBeResolved = manifest.dependencies
      ? Object.assign(
        Object.create(null),
        manifest.dependencies
      )
      : Object.create(null);
  }

}

export default PackageNode;