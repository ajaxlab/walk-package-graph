const fs = require('fs');
const p = require('path');
const readDir = require('./readDir');

let count = 0;

readDir('./test/pseudo-projects/heavy/npm', {
  onDirFound(dirPath, item, stats) {
    if (!stats.isSymbolicLink() && (item !== 'node_modules')) {
      fs.readFile(dirPath + p.sep + 'package.json', (readFileErr) => {
        if (readFileErr) {
          if (readFileErr.code === 'ENOENT') {
            const filePath = dirPath + p.sep + 'mark';
            fs.writeFile(filePath, '.', (writeFileErr) => {
              if (writeFileErr) {
                console.error(writeFileErr);
                return;
              }
              console.info(++count, filePath, 'written');
            });
          } else {
            console.error(readFileErr);
          }
        }
      });
    }
  }
});
