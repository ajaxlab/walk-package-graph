import { IPackageJson } from 'package-json-type';
import { matches } from './matches';
import { IPackageNode } from './types';

/**
 * Represents a package as a graph node.
 */
class PackageNode implements IPackageNode {

  /**
   * A physical children inside of a `node_modules` path under this package.
   */
  children: {
    [packageName: string]: IPackageNode
  } = Object.create(null);

  /**
   * An array of resolved dependencies of this package.
   */
  dependencies: IPackageNode[] = [];

  /**
   * Indicate all dependencies are resolved or not.
   * @see [[validate]]
   */
  dependencyResolved: boolean = false;

  /**
   * A package's unique id as `{package name}/{package version}` format.
   */
  id: string;

  /**
   * Indicate this node and it's dependencies are linked or not.
   * @see [[linkDependencies]]
   */
  linked: boolean = false;

  /**
   * Contents of the package.json file of this package.
   * @see {@link https://ajaxlab.github.io/package-json-type/interfaces/ipackagejson.html | IPackageJson}
   */
  manifest: IPackageJson;

  /**
   * An upper directory node of a child node in a `node_modules` directory.
   * ```
   * parent1/node_modules/child1
   * ```
   */
  parent: IPackageNode | undefined = void 0;

  /**
   * An absolute path of this node.
   */
  path: string;

  /**
   * An array of dependencies which remain unresolved after dependency resolution.
   * @see [[linkDependencies]]
   */
  unresolvedDependencies: {
    [packageName: string]: string;
  };

  /**
   * Indicate this node is validated.
   * @see [[validate]]
   */
  validated: boolean = false;

  constructor(manifest: IPackageJson, path: string) {
    this.id = manifest.name + '/' + manifest.version;
    this.manifest = manifest;
    this.path = path;
    this.unresolvedDependencies = manifest.dependencies
      ? Object.assign(Object.create(null), manifest.dependencies)
      : Object.create(null);
  }

  /**
   * Returns a node with the given name which this node depends on.
   * @param depName The name of a dependency.
   */
  getDependency(depName: string): IPackageNode | void {
    let node: IPackageNode | void = this;
    while (node) {
      if (node.children[depName]) {
        return node.children[depName];
      }
      node = node.parent;
    }
  }

  hasDependency(name: string, version?: string): boolean {
    if (version) {
      const target = name + '/' + version;
      return this.dependencies.some((dep) => {
        return dep.id === target;
      });
    }
    return this.dependencies.some((dep) => {
      return dep.manifest.name === name;
    });
  }

  /**
   *  1.1. loop dependencies
   *  1.2.   if !dependency.linked dependency.linkDependencies() first
   *  1.3. if this.unlinked.length mark insufficientDependency
   */
  linkDependencies() {
    this.linked = true;
    const { dependencies } = this;
    const unresolvedDeps = this.unresolvedDependencies;
    const depNames = Object.keys(unresolvedDeps);
    const { length } = depNames;
    for (let i = 0; i < length; i++) {
      const depName = depNames[i];
      const dependency = this.getDependency(depName);
      if (dependency) {
        if (!dependency.linked) {
          dependency.linkDependencies();
        }
        const { version } = dependency.manifest;
        const depValue = unresolvedDeps[depName];
        if (version && matches(version, depValue)) {
          dependencies.push(dependency);
          delete unresolvedDeps[depName];
        }
      }
    }
    const { optionalDependencies } = this.manifest;
    if (Object.keys(unresolvedDeps).length && optionalDependencies) {
      const optionalNames = Object.keys(optionalDependencies);
      const optsLength = optionalNames.length;
      for (let i = 0; i < optsLength; i++) {
        delete unresolvedDeps[optionalNames[i]];
      }
    }
  }

  /**
   * Pseudo Logic
   * 1. link dependencies
   *  1.1. loop unresolvedDependencies
   *  1.2.   if !dependency.linked dependency._link() first
   *  1.3. if this.unlinked.length mark insufficientDependency
   * 2. validate this
   *  2.1. loop dependencies
   *  2.2.   if !dependency.validated dependency.validate() first
   *  2.3.   dependency.validate() returns whether it's dependencies are sufficient or not
   *  2.4. if one of dependencies's validate() returns false then returns false else true
   *  2.5. before 2.4's return, execute onResolve, onUnresolve callback
   * @param cb
   * @param resolveDevDependency
   */
  resolve(cb: any, resolveDevDependency?: boolean) {
    if (resolveDevDependency) this._mergeDevDependency();
    this.linkDependencies();
    this.validate(cb);
  }

  toString() {
    return '<PackageNode>' + this.id;
  }

  validate(cb?: (node: IPackageNode, unresolved?: string[]) => void) {
    this.validated = true;
    const { dependencies } = this;
    const { length } = dependencies;
    const invalidDeps = [];
    let valid = true;
    for (let i = 0; i < length; i++) {
      const dep = dependencies[i];
      if (!dep.validated && !dep.validate(cb)) {
        const { name } = dep.manifest;
        if (name) { invalidDeps.push(name); }
        valid = false;
      }
    }
    const unresolved = Object.keys(this.unresolvedDependencies).concat(invalidDeps);
    if (unresolved.length) {
      valid = false;
      if (cb) { cb(this, unresolved); }
    } else {
      this.dependencyResolved = true;
      if (cb) { cb(this); }
    }
    return valid;
  }

  private _mergeDevDependency() {
    const { devDependencies } = this.manifest;
    if (devDependencies) {
      Object.assign(this.unresolvedDependencies, devDependencies);
    }
  }
}

export default PackageNode;
