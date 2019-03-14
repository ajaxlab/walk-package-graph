const { LogLevel, walkPackageGraph } = require('../dist/cjs');

walkPackageGraph('./test/pseudo-projects/normal', {
  onComplete(rootNode) {
    console.log(rootNode);
  },
  onVisit(node) {
    console.log(node);
  }
}, {
  logLevel: LogLevel.debug
});
