import PackageNodeWalker from './PackageNodeWalker';
import { IPackageNode, IVisitPackageHandler } from './types';

function walkPackageGraph(
  root: string,
  onVisitPackage: IVisitPackageHandler,
  stopOnError: boolean = false
): Promise<IPackageNode> {
  const walker = new PackageNodeWalker(onVisitPackage, stopOnError);
  return walker.getGraph(root);
}

export default walkPackageGraph;
