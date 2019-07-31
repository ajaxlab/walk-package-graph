import { walkPackageGraph } from '../../src/';

walkPackageGraph('./test/pseudo-projects/file-protocol-yarn', {
  onEnd(rootNode) {
    console.info('onEnd', rootNode + '');
  },
  onError(error) {
    console.error('onError', error.path, error.message);
  },
  onResolve(node) {
    console.info('onResolve', node.path);
  },
  onUnresolve(node, unresolvedNames) {
    console.info('onUnresolve', node.path, unresolvedNames);
  },
  onVisit(node) {
    console.info('onVisit', node.path);
  }
});
