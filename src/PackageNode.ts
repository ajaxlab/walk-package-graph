import { PackageJson } from 'package-json';
import { IPackageNode } from './types';

class PackageNode implements IPackageNode {

  dependencies: IPackageNode[] = [];
  dependencyResolved: boolean = false;
  id: string;
  manifest: PackageJson;

  constructor(manifest: PackageJson) {
    this.id = manifest.name + '@' + manifest.version;
    this.manifest = manifest;
  }

}

export default PackageNode;
