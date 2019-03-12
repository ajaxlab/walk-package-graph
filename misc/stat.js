/*
https://stackoverflow.com/questions/32478698/what-is-the-different-between-stat-fstat-and-lstat-functions-in-node-js

stat follows symlinks. When given a path that is a symlink, it returns the stat of the target of the symlink.
lstat doesn't follow symlinks. When given a path that is a symlink it returns the stat of the symlink and not its target.
fstat takes a file descriptor rather than a path.
*/

const fs = require('fs');

fs.lstat('./real', (e, stats) => {
  if (e) {
    console.info(e);
  }
  console.info('stats', stats);
});

fs.lstat('./sym', (e, stats) => {
  if (e) {
    console.info(e);
  }
  console.info('stats', stats);
});
