/* tslint:disable: max-line-length */

import { expect, use } from 'chai';
import p from 'path';
import { LogLevel } from '../src/types';
import walkPackageGraph from '../src/walkPackageGraph';

describe('walkPackageGraph(root, walkHandlers, walkOptions)', function () {

  it('traverses all packages', function (done) {
    const regSep = /\\/g;
    const packDirs = [
      '',
      '/node_modules/amelia',
      '/node_modules/jacob',
      '/node_modules/olivia',
      '/node_modules/oscar',
      '/node_modules/olivia/node_modules/amelia',
      '/node_modules/oscar/node_modules/amelia'
    ];
    const rootPath = './test/pseudo-projects/complex';
    const absRootPath = p.resolve(rootPath);
    walkPackageGraph(rootPath, {
      onVisit(e, manifest, path) {
        if (path) {
          const packPath = path.replace(absRootPath, '').replace(regSep, '/');
          const index = packDirs.indexOf(packPath);
          if (index > -1) {
            packDirs.splice(index, 1);
          }
          if (packDirs.length === 0) {
            done();
          }
        }
      }
    });
  });

  it('resolves nested dependency', function () {
    //
  });

  it('resolves duplicate parallel dependency', function () {
    //
  });

  it('handles dir name ends with /', function () {
    //
  });

});
