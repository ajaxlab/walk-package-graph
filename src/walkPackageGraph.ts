import PackageWalker from './PackageWalker';
import { IWalkHandlers } from './types';

function walkPackageGraph(root: string,  walkHandlers: IWalkHandlers = {}) {
  const walker = new PackageWalker(walkHandlers);
  walker.start(root);
}

export default walkPackageGraph;
