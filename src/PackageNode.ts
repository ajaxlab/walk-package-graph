import { INodeCache, IPackageNode, IResolveHandler } from './types';

class PackageNode implements IPackageNode {

  children: IPackageNode[] = [];
  realpath: string | null = null;

  constructor(public path: string, nodeCache: INodeCache, onResolve: IResolveHandler) {
  }

}

export default PackageNode;
