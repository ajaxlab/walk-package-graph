import { walkPackageGraph } from '../src/';

walkPackageGraph('./test/pseudo-projects/parallel', {
  onEnd(rootNode) {
    // console.info(rootNode);
  },
  onResolve(node) {
    console.info(node.id, node.path, node.dependencies.map((n) => n.id));
  }
});
