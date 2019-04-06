import { walkPackageGraph } from '../../src/';

let count = 0;
const { argv } = process;
const repeat = parseInt(argv[2], 10) || 500;
const start = Date.now();

function walk() {
  walkPackageGraph('./test/pseudo-projects/heavy/npm', {
    onEnd() {
      ++count;
      console.info('walk', count);
      if (count === repeat) {
        const end = Date.now() - start;
        console.info(end / repeat);
      } else {
        walk();
      }
    }
  });
}

walk();
