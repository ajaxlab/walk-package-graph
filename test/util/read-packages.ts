import fs from 'fs';
import p from 'path';

let count = 0;
const path = './test/pseudo-projects/heavy/npm/node_modules';

fs.readdir(path, (err, items) => {
  const normals = items.filter((item) => {
    return !item.startsWith('@') && !item.startsWith('.');
  });
  console.info('normals', normals.length);
  normals.forEach((itemPath) => {
    const packagePath = path + p.sep + itemPath + p.sep + 'package.json';
    fs.readFile(packagePath, 'utf-8', (e, txt) => {
      if (e) {
        console.info(++count, e);
      }
      try {
        const x = JSON.parse(txt);
      } catch (e) {
        console.info(++count, e);
      }
    });
  });
});
