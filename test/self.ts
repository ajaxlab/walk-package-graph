import { walkPackageGraph } from '../src/';

walkPackageGraph('./', {
  onEnd(rootNode) {
    console.log(rootNode);
  },
  onVisit(node) {
    console.log(node.path);
  }
});
