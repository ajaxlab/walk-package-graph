import { walkPackageGraph } from '../../src/';

walkPackageGraph('./test/pseudo-projects/unmet', {
  onEnd(rootNode) {
    // console.info(rootNode);
  },
  onUnresolve(unresolvedNode, unresolvedNames) {
    console.info(unresolvedNode.path, unresolvedNames);
  }
});
