const fs = require('fs');

function check(cb) {
  const hrstart = process.hrtime();
  fs.readdir('../node_modules', (e, files) => {
    console.info('files.length', files.length);
    const hrend = process.hrtime(hrstart);
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
    cb(hrend);
  });
}

let count = 0;
const record0 = [];
const record1 = [];

const interval = setInterval(() => {
  check((hrend) => {
    count++;
    record0.push(hrend[0]);
    record1.push(hrend[1]);
    if (count === 100) {
      clearInterval(interval);
      console.log('record0', record0);
      console.log('record1', record1);
      const avg0 = record0.length ? record0.reduce((acc, cur) => {
        return acc + cur;
      }) / record0.length : 0;
      const avg1 = record1.reduce((acc, cur) => {
        return acc + cur;
      }) / record1.length;
      console.info('Average Execution time (hr): %ds %dms', avg0, avg1 / 1000000);
    }
  });
}, 100);
