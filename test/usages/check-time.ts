import { walkPackageGraph } from '../../src/';

let count = 0;
const start = Date.now();

function walk() {
  walkPackageGraph('./test/pseudo-projects/heavy/npm', {
    onEnd() {
      ++count;
      // console.info('walk', count);
      if (count === 50) {
        const end = Date.now() - start;
        console.info(end / 50);
      } else {
        walk();
      }
    }
  });
}

walk();
