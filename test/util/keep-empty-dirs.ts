import fs from 'fs';
import p from 'path';
import readDir from '../common/readDir';

let count = 0;

readDir('./test/pseudo-projects/heavy/npm', {
  onDir(dirPath, item, stats) {
    if (item !== 'node_modules') {
      fs.readFile(dirPath + p.sep + 'package.json', (readFileErr) => {
        if (readFileErr) {
          if (readFileErr.code === 'ENOENT') {
            const filePath = dirPath + p.sep + 'mark';
            fs.writeFile(filePath, '.', (writeFileErr) => {
              if (writeFileErr) {
                console.error(writeFileErr);
                return;
              }
              console.info(++count, filePath, 'written'); // 2267
            });
          } else {
            console.error(readFileErr);
          }
        }
      });
    }
  }
});
