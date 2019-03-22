const fs = require('fs');
const p = require('path');

function readDir(path, handlers) {

  const onFileFound = handlers.onFileFound || (() => void 0);
  const onDirFound = handlers.onDirFound || (() => void 0);

  _readDir(p.resolve(path));

  function _readDir(abs) {
    fs.readdir(abs, (readdirErr, items) => {
      if (readdirErr) {
        console.error(readdirErr);
        return;
      }
      const { length } = items;
      for (let i = 0; i < length; i++) {
        const item = items[i];
        const absItemPath = abs + p.sep + item;
        fs.lstat(absItemPath, (lstatErr, stats) => {
          if (lstatErr) {
            console.error(lstatErr);
            return;
          }
          if (stats.isDirectory()) {
            onDirFound(absItemPath, item, stats);
            _readDir(absItemPath);
          } else if (stats.isFile()) {
            onFileFound(absItemPath, item, stats);
          }
        });
      }
    });
  }
}

module.exports = readDir;
