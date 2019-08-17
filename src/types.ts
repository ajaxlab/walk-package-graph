import { IDependencyMap, IPackageJson } from 'package-json-type';

export interface IPackageNode {

  /**
   * Child nodes inside of a `node_modules` path under this package.
   */
  children: {
    [packageName: string]: IPackageNode
  };

  /**
   * An array of resolved dependencies of this package.
   */
  dependencies: IPackageNode[];

  /**
   * Indicates all dependencies are resolved or not.
   * @see [[validate]]
   */
  dependencyResolved: boolean;

  /**
   * A package's unique id as `{package name}/{package version}` format.
   */
  id: string;

  /**
   * Indicates this node and it's dependencies are linked or not.
   * This value is changed as `true` after [[linkDependencies]] call.
   * @see [[linkDependencies]]
   */
  linked: boolean;

  /**
   * Contents of the package.json file of this package.
   * @see {@link https://ajaxlab.github.io/package-json-type/interfaces/ipackagejson.html | IPackageJson}
   */
  manifest: IPackageJson;

  /**
   * Name of the package.
   * The name field of package.json.
   * If the name field of package.json is empty,
   * directory name of the package will be used.
   */
  name: string;

  /**
   * An upper directory node of child nodes in a `node_modules` directory.
   * ```
   * parent1/node_modules/child1
   * ```
   */
  parent: IPackageNode | undefined;

  /**
   * An absolute path of this node.
   */
  path: string;

  /**
   * An array of dependencies which remain unresolved after dependency resolution try.
   * @see [[linkDependencies]]
   */
  unresolvedDependencies: IDependencyMap;

  /**
   * Indicates this node is validated.
   * @see [[validate]]
   */
  validated: boolean;

  /**
   * Returns a node with the given name which this node depends on.
   * @param depName The name of a dependency.
   */
  getDependency(depName: string): IPackageNode | void;

  /**
   * Returns `true` if this node depends on the package
   * with the given name and optional version.
   * @param name The name of a dependency.
   * @param version The version of the dependency.
   */
  hasDependency(name: string, version?: string): boolean;

  /**
   * For each unresolved dependencies, this method check if the dependency node exist,
   * and if it exists and satisfies version then add to [[dependencies]]
   * and remove from [[unresolvedDependencies]].
   *
   * If the `package.json` has the `optionalDependencies` and some of it also
   * exists unresolved dependencies, this method will remove them from
   * the unresolved dependencies.
   */
  linkDependencies(): void;

  /**
   * Calls [[linkDependencies]], then calls [[validate]]
   * @param cb Called when the resolution process for this node has been ended.
   * @param resolveDevDependency If this value is true this node will resolve `devDependencies` too.
   */
  resolve(cb?: (node: IPackageNode, unresolvedNodeNames?: string[]) => void, resolveDevDependency?: boolean): void;

  /**
   * Validates all of this node's dependencies recursively.
   * @param cb
   */
  validate(cb?: (node: IPackageNode, unresolvedNodeNames?: string[]) => void): boolean;
}

export interface IWalkHandlers {

  /**
   * ```typescript
   * onEnd?: (rootNode?: IPackageNode) => void;
   * ```
   *
   * Called when all nodes are visited and tried resolving.
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
   * Called every time a package node resolves all of it's dependencies.
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
   * onVisit?: (visitedNode: IPackageNode) => void;
   * ```
   *
   * Called every time a package node has been visited.
   *
   * ```typescript
   * walkPackageGraph('/path/to/start', {
   *   onVisit(node) {
   *     console.info(node.path, 'visited');
   *   }
   * });
   * ```
   */
  onVisit?: (node: IPackageNode) => void;
}
