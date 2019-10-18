import PackageWalker from './PackageWalker';
import { IPackageNode, IWalkHandlers } from './types';
export { IPackageNode, IWalkHandlers };

/**
 * Starts to walk package dependency graph and runs walkHandlers
 *
 * ```typescript
 * import { walkPackageGraph } from 'walk-package-graph';
 *
 * walkPackageGraph('/path/to/start', {
 *   onEnd(rootNode) {
 *     console.info('onEnd', rootNode + '');
 *   },
 *   onError(error) {
 *     console.error('onError', error.path, error.message);
 *   },
 *   onResolve(node) {
 *     console.info('onResolve', node.id, node.path, node.dependencies);
 *   },
 *   onUnresolve(node, unresolvedNames) {
 *     console.error('onUnresolve', node.path, unresolvedNames);
 *   },
 *   onVisit(node) {
 *     console.info('onVisit', node.path);
 *   }
 * });
 * ```
 *
 * @param root A start path (a project root usually)
 * @param walkHandlers Event handlers
 * @param resolveDevDependency Resolve `devDependencies` or not.
 */
export function walkPackageGraph(
  root: string,
  walkHandlers: IWalkHandlers = {},
  resolveDevDependency: boolean = false
) {
  const walker = new PackageWalker(walkHandlers, resolveDevDependency);
  walker.start(root);
}
