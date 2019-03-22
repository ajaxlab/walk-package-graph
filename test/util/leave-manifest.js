const fs = require('fs');
const readDir = require('./readDir');

let count = 0;

readDir('./test/pseudo-projects/heavy/npm', {
  onFileFound(path, item, stats) {
    if (!stats.isSymbolicLink() && (item !== 'package.json')) {
      fs.unlink(path, (unlinkErr) => {
        if (unlinkErr) {
          console.error(unlinkErr);
          return;
        }
        console.info(++count, path, 'removed');
      });
    }
  }
});
