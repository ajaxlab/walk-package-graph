import { walkPackageGraph } from '../src/';

walkPackageGraph('./test/pseudo-projects/nested', {
  onEnd(rootNode) {
    // console.info(rootNode);
  },
  onResolve(node) {
    console.info('onResolve', node.path);
  }
});
