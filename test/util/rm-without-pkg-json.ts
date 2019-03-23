import fs from 'fs';
import readDir from '../common/readDir';

let count = 0;

readDir('./test/pseudo-projects/heavy/npm', {
  onEnd() {
    console.info('finished');
  },
  onFile(path, item, stats) {
    if (!stats.isSymbolicLink() && (item !== 'package.json')) {
      fs.unlink(path, (unlinkErr) => {
        if (unlinkErr) {
          console.error(unlinkErr);
          return;
        }
        console.info(++count, path, 'removed'); // 2267
      });
    }
  }
});
