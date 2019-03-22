const { LogLevel, walkPackageGraph } = require('../dist/cjs');
const pkgs = require('./json/packages.json');
const p = require('path');
const fs = require('fs');

// console.log('pkgs', pkgs);

let count = 0;
const visited = {};
const hrstart = process.hrtime();
walkPackageGraph('./test/pseudo-projects/heavy/npm', {
  onComplete() {
    hrend = process.hrtime(hrstart);
    console.info('%d visits : %ds %dms', count, hrend[0], hrend[1] / 1000000);
  },
  onVisit(e, manifest, abs) {
    visited[abs] = true;
    delete pkgs[abs];
    count++;
  }
});

setTimeout(() => {
  const notVisiteJsonPath = './test/json/not-visited.json';
  fs.writeFile(notVisiteJsonPath, JSON.stringify(pkgs), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.info(notVisiteJsonPath, 'written');
      console.info(Object.keys(pkgs).length, 'not visited'); // 1937 TODO
      console.info(count, 'visited'); // 1937 TODO
    }
  });
  const visiteJsonPath = './test/json/visited.json';
  fs.writeFile(visiteJsonPath, JSON.stringify(visited, Object.keys(visited).sort()), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.info(visiteJsonPath, 'written');
    }
  });
}, 5000);
