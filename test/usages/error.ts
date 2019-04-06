import { walkPackageGraph } from '../../src/';

walkPackageGraph('./test/pseudo-projects/error', {
  onEnd(rootNode) {
    console.info('onEnd', rootNode + '');
  },
  onError(error) {
    console.error('onError', error.path, error.message);
  },
  onVisit(node) {
    console.info('onVisit', node.path);
  }
});
