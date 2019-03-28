import fs from 'fs';
import { walkPackageGraph } from '../src/';

walkPackageGraph('./test/pseudo-projects/error', {
  onEnd(rootNode) {
    console.info('onEnd', rootNode + '');
  },
  onError(error, path) {
    console.error('onError', path, error.message);
  },
  onVisit(node) {
    console.info('onVisit', node.path);
  }
});
