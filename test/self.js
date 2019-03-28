const { walkPackageGraph } = require('../dist/cjs');

walkPackageGraph('./', {
  onEnd(rootNode) {
    console.log(rootNode);
  },
  onVisit(node) {
    console.log(node.path);
  }
});
