import fs from 'fs';
import p from 'path';
import readDir from '../common/readDir';

let count = 0;
const pkgMap = Object.create(null);
const cwd = process.cwd();
const regSep = /\\/g;

readDir('./test/pseudo-projects/heavy/npm', {
  onEnd() {
    const pkgsPath = './test/json/packages.json';
    const contents = JSON.stringify(pkgMap, Object.keys(pkgMap).sort(), 2);
    fs.writeFile(pkgsPath, contents, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.info(pkgsPath, 'written'); // 2166
      }
    });
  },
  onFile(path, item, stats) {
    if (!stats.isSymbolicLink() && (item === 'package.json')) {
      const pkgJsonPath = p.dirname(path).replace(cwd, '').replace(regSep, '/');
      pkgMap[pkgJsonPath] = true;
      console.info(++count, path, 'found');
    }
  }
});
