export interface IBooleanRecord {
  [key: string]: boolean;
}

export interface IDependencyMap {
  [name: string]: string;
}

export interface IPackageNode {
  children: {
    [name: string]: IPackageNode
  };
  dependencies: IPackageNode[];
  dependencyResolved: boolean;  // TODO
  id: string;
  manifest: IPackageJson;
  parent: IPackageNode | undefined;
  path: string;
  getDependency(depName: string): IPackageNode | void;
  hasDependency(name: string, version?: string): boolean;
  validate(cb?: (node: IPackageNode, unresolved?: string[]) => void): void;
}

// TODO publish @types
export interface IPackageJson {
  readonly bundledDependencies?: string[];
  readonly dependencies?: IDependencyMap;
  readonly devDependencies?: IDependencyMap;
  readonly name?: string;
  readonly optionalDependencies?: IDependencyMap;
  readonly peerDependencies?: IDependencyMap;
  readonly private?: boolean;
  readonly version?: string;
}

export interface IWalkHandlers {
  onEnd?: (rootNode?: IPackageNode) => void;
  onError?: (error: NodeJS.ErrnoException, path: string) => void;
  onResolve?: (node: IPackageNode) => void;
  onUnresolve?: (node: IPackageNode, unresolvedNames: string[]) => void;
  onVisit?: (node: IPackageNode) => void;
}
