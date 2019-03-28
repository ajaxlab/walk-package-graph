import { walkPackageGraph } from '../../src/';

let count = 0;

walkPackageGraph('./test/pseudo-projects/heavy/npm', {
  onEnd(root) {
    if (root) console.info(root.path);
  },
  onResolve(node) {
    console.info(++count, node.path);
  }
});
