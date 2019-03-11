export interface IPackageNode {
  children: IPackageNode[];
}

export interface INodeCache {
  [key: string]: IPackageNode;
}

export type IResolveHandler = (packageNode: IPackageNode) => void;

export type ICreatePackageNodeCallBack = (err: NodeJS.ErrnoException | null, packageNode: IPackageNode | null) => void;
