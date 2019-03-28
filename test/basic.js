const { walkPackageGraph } = require('../dist/cjs');

walkPackageGraph('./test/pseudo-projects/complex', {
  onEnd(rootNode) {
    console.log('rootNode', rootNode);
  },
  onVisit(node) {
    console.log(node.path);
  }
});
