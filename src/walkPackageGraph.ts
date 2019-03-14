import PackageNodeWalker from './PackageNodeWalker';
import { IWalkHandlers, IWalkOptions } from './types';

function walkPackageGraph(root: string,  walkHandlers: IWalkHandlers = {}, options: IWalkOptions = {}) {
  const walker = new PackageNodeWalker(walkHandlers, options);
  walker.start(root);
}

export default walkPackageGraph;
