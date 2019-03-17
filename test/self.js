const { LogLevel, walkPackageGraph } = require('../dist/cjs');

walkPackageGraph('./', {
  onComplete(rootNode) {
    console.log(rootNode);
  },
  onVisit(node) {
    console.log(node);
  }
}, {
  logLevel: LogLevel.debug
});
