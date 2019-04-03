import fs from 'fs';
import { walkPackageGraph } from '../../src/';

walkPackageGraph('./test/pseudo-projects/scoped', {
  onEnd(rootNode) {
    // console.info(rootNode);
  },
  onResolve(node) {
    console.info(' ----', node.id, 'resolved');
  }
});
