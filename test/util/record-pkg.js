const fs = require('fs');
const p = require('path');
const readDir = require('./readDir');

let count = 0;
const pkgMap = Object.create(null);

readDir('./test/pseudo-projects/heavy/npm', {
  onFileFound(path, item, stats) {
    if (!stats.isSymbolicLink() && (item === 'package.json')) {
      console.info(++count, path, 'package.json found');
      pkgMap[p.dirname(path)] = true;
    }
  }
});

setTimeout(() => {
  const pkgsPath = './test/json/packages.json';
  fs.writeFile(pkgsPath, JSON.stringify(pkgMap), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.info(pkgsPath, 'written'); // 2166
    }
  });
}, 5000);
