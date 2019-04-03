import { walkPackageGraph } from '../../src/';

walkPackageGraph('./', {
  onEnd(rootNode) {
    console.info(rootNode);
  },
  onVisit(node) {
    console.info(node.path);
  }
});
