const { LogLevel, walkPackageGraph } = require('../dist/cjs');

walkPackageGraph('./test/pseudo-projects/complex', {
  onComplete(err, rootNode) {
    console.log('rootNode', rootNode);
  },
  onVisit(e, manifest, path) {
    console.log(path);
  }
}, {
  logLevel: LogLevel.debug
});
