import { IPackageNode } from './types';

class PackageNode implements IPackageNode {

  children: IPackageNode[] = [];

  constructor(public path: string) {
  }

}

export default PackageNode;
