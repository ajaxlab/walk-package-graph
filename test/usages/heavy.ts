import { walkPackageGraph } from '../../src/';

let count = 0;
let unresolved = 0;
const hrstart = process.hrtime();
walkPackageGraph('./test/pseudo-projects/heavy/npm', {
  onEnd() {
    const hrend = process.hrtime(hrstart);
    console.info('%d visits : %ds %dms', count, hrend[0], hrend[1] / 1000000);
    console.info('unresolved', unresolved);
  },
  onResolve(node) {
    // console.info('onResolve', node.id);
  },
  onUnresolve() {
    console.info('unresolved', ++unresolved);
  },
  onVisit(node) {
    ++count;
    // console.info(count, node.path);
  }
});
