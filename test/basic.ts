import { walkPackageGraph } from '../src/';

walkPackageGraph('./test/pseudo-projects/complex', {
  onEnd(rootNode) {
    console.log('rootNode', rootNode);
  },
  onVisit(node) {
    console.log(node.path);
  }
});
