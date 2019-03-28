import PackageWalker from './PackageWalker';
import { IWalkHandlers } from './types';

export function walkPackageGraph(root: string,  walkHandlers: IWalkHandlers = {}) {
  const walker = new PackageWalker(walkHandlers);
  walker.start(root);
}
