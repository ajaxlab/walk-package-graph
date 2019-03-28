import fs from 'fs';
import { walkPackageGraph } from '../src/';

walkPackageGraph('./test/pseudo-projects/nested', {
  onEnd(rootNode) {
    // console.info(rootNode);
  },
  onVisit(node) {
    // console.info(node.path);
  }
});
