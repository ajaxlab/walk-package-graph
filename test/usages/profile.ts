import { walkPackageGraph } from '../../src';

function profile() {
  let count = 0;
  walkPackageGraph('./test/pseudo-projects/heavy/npm', {
    onEnd() {
      console.info('end', count);
      profile();
    },
    onVisit(node) {
      ++count;
    }
  });
}

profile();
