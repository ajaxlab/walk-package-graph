/* tslint:disable: no-console */

import fs from 'fs';
import p from 'path';

interface IHandlers {
  onDir?: (path: string, item: string, stats: fs.Stats) => void;
  onEnd?: (err?: Error) => void;
  onFile?: (path: string, item: string, stats: fs.Stats) => void;
}

function readDir(path: string, handlers: IHandlers) {

  const onFile = handlers.onFile || (() => void 0);
  const onEnd = handlers.onEnd || (() => void 0);
  const onDir = handlers.onDir || (() => void 0);

  _readDir(p.resolve(path), (err) => {
    onEnd(err);
  });

  function _readDir(abs: string, done: (err?: Error) => void) {
    fs.readdir(abs, (readdirErr, items) => {
      if (readdirErr) {
        console.error(readdirErr);
        return done(readdirErr);
      }
      const { length } = items;
      let pending = length;
      if (!pending) {
        return done();
      }
      for (let i = 0; i < length; i++) {
        const item = items[i];
        const absItemPath = abs + p.sep + item;
        fs.stat(absItemPath, (statErr, stats) => {
          if (statErr) {
            console.error(statErr);
            return done(statErr);
          }
          if (stats.isDirectory()) {
            onDir(absItemPath, item, stats);
            _readDir(absItemPath, (_readDirErr) => {
              if (_readDirErr) {
                return done(_readDirErr);
              }
              if (!--pending) done();
            });
          } else if (stats.isFile()) {
            onFile(absItemPath, item, stats);
            if (!--pending) done();
          }
        });
      }
    });
  }
}

export default readDir;
