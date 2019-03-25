import fs from 'fs';
import walkPackageGraph from '../src/walkPackageGraph';

walkPackageGraph('./pseudo-projects/paralel', {
  onEnd(err, rootNode) {
    console.info(rootNode);
  },
  onVisit(e, manifest, path) {
    console.info(path);
  }
});
