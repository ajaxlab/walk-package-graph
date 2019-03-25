import fs from 'fs';
import walkPackageGraph from '../src/walkPackageGraph';

walkPackageGraph('./pseudo-projects/paralel', {
  onEnd(rootNode) {
    console.info(rootNode);
  },
  onVisit(node) {
    console.info(node.path);
  }
});
