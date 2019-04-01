import { walkPackageGraph } from '../src/';

walkPackageGraph('./test/pseudo-projects/complex', {
  onEnd(rootNode) {
    console.info('rootNode', rootNode);
  },
  onVisit(node) {
    console.info(node.path);
  }
});
