const { LogLevel, walkPackageGraph } = require('../dist/cjs');
const pkgs = require('./json/packages.json');
const p = require('path');
const fs = require('fs');

// console.log('pkgs', pkgs);

let count = 0;
const visited = {};
const hrstart = process.hrtime();
walkPackageGraph('./test/pseudo-projects/heavy/npm', {
  onEnd() {
    hrend = process.hrtime(hrstart);
    console.info('%d visits : %ds %dms', count, hrend[0], hrend[1] / 1000000);
  },
  onVisit(e, manifest, abs) {
    console.info(++count, abs);
  }
});
