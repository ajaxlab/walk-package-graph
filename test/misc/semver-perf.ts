/* tslint:disable no-var-requires */

const hrstart = process.hrtime();
const semver = require('semver');

const hrend = process.hrtime(hrstart);
console.info('load sermver lib : %ds %dms', hrend[0], hrend[1] / 1000000);
