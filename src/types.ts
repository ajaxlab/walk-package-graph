export interface IBooleanMap {
  [key: string]: boolean;
}

export interface IDependencyMap {
  [packageName: string]: string;
}

export interface IPackageNode {
  children: {
    [packageName: string]: IPackageNode
  };
  dependencies: IPackageNode[];
  dependencyResolved: boolean;
  id: string;
  linked: boolean;
  manifest: IPackageJson;
  parent: IPackageNode | undefined;
  path: string;
  unresolvedDependencies: IDependencyMap;
  validated: boolean;
  getDependency(depName: string): IPackageNode | void;
  hasDependency(name: string, version?: string): boolean;
  linkDependencies(): void;
  resolve(cb?: (node: IPackageNode, unresolvedNodeNames?: string[]) => void, resolveDevDependency?: boolean): void;
  validate(cb?: (node: IPackageNode, unresolved?: string[]) => void): boolean;
}

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

  /**
   * ```typescript
   * onEnd?: (rootNode?: IPackageNode) => void;
   * ```
   *
   * Called when all nodes are visited and resolved.
   *
   * ```typescript
   * walkPackageGraph('/path/to/start', {
   *   onEnd(rootNode) {
   *     if (rootNode) console.info('rootNode', rootNode);
   *   }
   * });
   * ```
   */
  onEnd?: (rootNode?: IPackageNode) => void;

  /**
   * ```typescript
   * onError?: (error: NodeJS.ErrnoException) => void;
   * ```
   *
   * Called every time an error occurs while traversing.
   *
   * ```typescript
   * walkPackageGraph('/path/to/start', {
   *   onError(error) {
   *     console.error('onError', error.code, error.path, error.message);
   *   }
   * });
   * ```
   */
  onError?: (error: NodeJS.ErrnoException) => void;

  /**
   * ```typescript
   * onResolve?: (resolvedNode: IPackageNode) => void;
   * ```
   *
   * Called every time a package node has resolved it's dependencies.
   *
   * ```typescript
   * walkPackageGraph('/path/to/start', {
   *   onResolve(node) {
   *     console.info('onResolve', node.id, node.path, node.dependencies);
   *   }
   * });
   * ```
   */
  onResolve?: (node: IPackageNode) => void;

  /**
   * ```typescript
   * onUnresolve?: (unresolvedNode: IPackageNode, unresolvedDependencyNames: string[]) => void;
   * ```
   *
   * Called every time a package node has failed resolving it's dependency.
   *
   * ```typescript
   * walkPackageGraph('/path/to/start', {
   *   onUnresolve(node, unresolvedNames) {
   *     console.info('onUnresolve', node.path, unresolvedNames);
   *   }
   * });
   * ```
   */
  onUnresolve?: (node: IPackageNode, unresolvedNames: string[]) => void;

  /**
   * ```typescript
   * onUnresolve?: (unresolvedNode: IPackageNode, unresolvedDependencyNames: string[]) => void;
   * ```
   *
   * Called every time a package node has failed resolving it's dependency.
   *
   * ```typescript
   * walkPackageGraph('/path/to/start', {
   *   onUnresolve(node, unresolvedNames) {
   *     console.info('onUnresolve', node.path, unresolvedNames);
   *   }
   * });
   * ```
   */
  onVisit?: (node: IPackageNode) => void;
}
