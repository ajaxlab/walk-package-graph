const { LogLevel, walkPackageGraph } = require('../dist/cjs');

walkPackageGraph('./test/pseudo-projects/complex', {
  onComplete(rootNode) {
    console.log(rootNode);
  },
  onVisit(e, manifest, path) {
    console.log(path);
  }
}, {
  logLevel: LogLevel.debug
});
