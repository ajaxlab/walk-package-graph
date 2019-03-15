import PackageWalker from './PackageWalker';
import { IWalkHandlers, IWalkOptions } from './types';

function walkPackageGraph(root: string,  walkHandlers: IWalkHandlers = {}, options: IWalkOptions = {}) {
  const walker = new PackageWalker(walkHandlers, options);
  walker.start(root);
}

export default walkPackageGraph;
