import semver from 'mini-semver';
import { IPackageJson, IPackageNode } from './types';

/**
 * Represents a graph node for a package
 */
class PackageNode implements IPackageNode {

  /**
   * A physical children inside of a `node_modules` path under this package
   */
  children: {
    [packageName: string]: IPackageNode
  } = Object.create(null);

  /**
   * An array of resolved dependencies of this package
   */
  dependencies: IPackageNode[] = [];
  dependencyResolved: boolean = false;
  id: string;
  manifest: IPackageJson;
  parent: IPackageNode | undefined = void 0;
  path: string;
  validated: boolean = false;

  private _unresolvedDeps: {
    [packageName: string]: string;
  };

  constructor(manifest: IPackageJson, path: string) {
    const { optionalDependencies } = manifest;
    this.id = manifest.name + '/' + manifest.version;
    this.manifest = manifest;
    this.path = path;
    this._unresolvedDeps = manifest.dependencies
      ? Object.assign(Object.create(null), manifest.dependencies)
      : Object.create(null);
    if (optionalDependencies) {
      const optionalNames = Object.keys(optionalDependencies);
      const { length } = optionalNames;
      for (let i = 0; i < length; i++) {
        // delete this._unresolvedDeps[optionalNames[i]];
        // TODO warn optionalDependencies
      }
    }
  }

  getDependency(depName: string): IPackageNode | void {
    let node: IPackageNode | void = this;
    while (node) {
      if (node.children[depName]) {
        return node.children[depName];
      }
      node = node.parent;
    }
  }

  hasCycle(node: IPackageNode) {
    return true;
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
   * Pseudo Logic
   * 1. link dependencies
   *  1.1. loop dependencies
   *  1.2.   if !dependency.linked dependency._link() first
   *  1.3. if this.unlinked.length mark insufficientDependency
   * 2. validate this
   *  2.1. loop dependencies
   *  2.2.   if !dependency.validated dependency._validate() first
   *  2.3.   dependency._validate() returns whether it's dependencies are sufficient or not
   *  2.4. if one of dependencies's _validate() returns false then returns false else true
   *  2.5. before 2.4's return, execute onResolve, onUnresolve callback
   * @param cb
   * @param resolveDevDependency
   */
  resolve(cb: any, resolveDevDependency?: boolean) {
    // this._linkDependencies();
    // can check cycle
    // this._validate(); -> onResolve, onUnresolve
  }

  resolveCycle(node: IPackageNode) {
    //
  }

  toString() {
    return '<PackageNode>' + this.id;
  }

  validate(
    cb?: (node: IPackageNode, unresolved?: string[]) => void,
    resolveDevDependency?: boolean
  ) {
    this.validated = true;
    if (resolveDevDependency) this._mergeDevDependency();
    const unresolvedDeps = this._unresolvedDeps;
    const unresolvedDepNames = Object.keys(unresolvedDeps);
    const { length } = unresolvedDepNames;
    for (let i = 0; i < length; i++) {
      const unresolvedDepName = unresolvedDepNames[i];
      const unresolvedDepRange = unresolvedDeps[unresolvedDepName];
      const unresolvedDepNode = this.getDependency(unresolvedDepName);
      if (unresolvedDepNode) {
        if (!unresolvedDepNode.validated) {
          unresolvedDepNode.validate(cb);
        }
        if (unresolvedDepNode.manifest.version
          && semver.satisfies(unresolvedDepNode.manifest.version, unresolvedDepRange)
        ) {
          this.dependencies.push(unresolvedDepNode);
          delete unresolvedDeps[unresolvedDepName];
        }
      }
    }
    if (Object.keys(unresolvedDeps) && this.manifest.optionalDependencies) {
      const optionalNames = Object.keys(this.manifest.optionalDependencies);
      const optsLength = optionalNames.length;
      for (let i = 0; i < optsLength; i++) {
        delete unresolvedDeps[optionalNames[i]];
        // TODO warn optionalDependencies
      }
    }
    const stillUnresolved = Object.keys(unresolvedDeps);
    if (stillUnresolved.length) {
      if (cb) {
        cb(this, stillUnresolved);
      }
    } else {
      this.dependencyResolved = true;
      if (cb) {
        cb(this);
      }
    }
  }

  validate0(cb?: (node: IPackageNode, unresolved?: string[]) => void) {
    const unresolvedDeps = this._unresolvedDeps;
    const unresolvedDepNames = Object.keys(unresolvedDeps);
    const { length } = unresolvedDepNames;
    for (let i = 0; i < length; i++) {
      const unresolvedDepName = unresolvedDepNames[i];
      const unresolvedDepRange = unresolvedDeps[unresolvedDepName];
      const unresolvedDepNode = this.getDependency(unresolvedDepName);
      if (unresolvedDepNode
        && unresolvedDepNode.manifest.version
        && semver.satisfies(unresolvedDepNode.manifest.version, unresolvedDepRange)
      ) {
        this.dependencies.push(unresolvedDepNode);
        delete unresolvedDeps[unresolvedDepName];
      }
    }
    const stillUnresolved = Object.keys(unresolvedDeps);
    if (stillUnresolved.length) {
      if (cb) {
        cb(this, stillUnresolved);
      }
    } else {
      this.dependencyResolved = true;
      if (cb) {
        cb(this);
      }
    }
  }

  private _mergeDevDependency() {
    if (this.manifest.devDependencies) {
      Object.assign(this._unresolvedDeps, this.manifest.devDependencies);
    }
  }
}

export default PackageNode;
