import { PackageJson } from 'package-json';

export interface IBooleanRecord {
  [key: string]: boolean;
}

export interface IPackageNode {
  children: {
    [name: string]: IPackageNode
  };
  dependencies: IPackageNode[];
  dependencyResolved: boolean;  // TODO
  id: string;
  manifest: PackageJson;
  parent: IPackageNode | undefined;
  path: string;
  hasDependency(name: string, version?: string): boolean;
  validate(cb?: (node: IPackageNode, unresolved?: string[]) => void): void;
}

export interface IWalkHandlers {
  onEnd?: (rootNode?: IPackageNode) => void;
  onError?: (error: NodeJS.ErrnoException, path: string) => void;
  onResolve?: (node: IPackageNode) => void;
  onUnresolve?: (unresolvedNames: string[]) => void;
  onVisit?: (node: IPackageNode) => void;
}
