export interface IPackageNode {
  children: IPackageNode[];
}

export interface IPackageNodeMap {
  [path: string]: IPackageNode;
}

export type IVisitPackageHandler = (packageNode: IPackageNode) => void;

export type ICreatePackageNodeCallBack = (err: NodeJS.ErrnoException | null, packageNode: IPackageNode | null) => void;
