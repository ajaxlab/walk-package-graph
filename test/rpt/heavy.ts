import rpt from 'read-package-tree';

const hrstart = process.hrtime();
rpt('./test/pseudo-projects/heavy/npm', (err, data) => {
  console.info(data.path);
  const hrend = process.hrtime(hrstart);
  console.info('%ds %dms', hrend[0], hrend[1] / 1000000);
});
