/* tslint:disable: max-line-length */

import { expect, use } from 'chai';
import p from 'path';
import { LogLevel } from '../src/types';
import walkPackageGraph from '../src/walkPackageGraph';
import { visit } from './common';

describe('walkPackageGraph(root, walkHandlers, walkOptions)', function () {

  it('traverses all packages', function (done) {
    const dirs = [
      '',
      '/node_modules/amelia',
      '/node_modules/jacob',
      '/node_modules/olivia',
      '/node_modules/oscar',
      '/node_modules/olivia/node_modules/amelia',
      '/node_modules/oscar/node_modules/amelia'
    ];
    visit('./test/pseudo-projects/complex', dirs, done);
  });

  it('traverses scoped packages', function (done) {
    const dirs = [
      '',
      '/node_modules/@birds/eagle',
      '/node_modules/@birds/hawk',
      '/node_modules/@birds/raven',
      '/node_modules/@cats/norwegian',
      '/node_modules/@cats/siamese',
      '/node_modules/@cats/sphinx',
      '/node_modules/amy',
      '/node_modules/amy/node_modules/@birds/hawk',
      '/node_modules/amy/node_modules/@cats/siamese',
      '/node_modules/olive'
    ];
    visit('./test/pseudo-projects/scoped', dirs, done);
  });

  it('traverses heavy npm node_modules in 500ms', function (done) {
    this.timeout(500);
    const rootPath = './test/pseudo-projects/heavy/npm';
    walkPackageGraph(rootPath, {
      onEnd() {
        done();
      }
    });
  });

  it('traverses heavy yarn node_modules in 500ms', function (done) {
    this.timeout(500);
    const rootPath = './test/pseudo-projects/heavy/yarn';
    walkPackageGraph(rootPath, {
      onEnd() {
        done();
      }
    });
  });

  it('throws an error with a nonexistent project path', function (done) {
    const rootPath = './test/pseudo-projects/not-exists';
    let count = 0;
    function resolve() {
      if (++count === 2) done();
    }
    walkPackageGraph(rootPath, {
      onEnd(err) {
        if (err && err.code === 'ENOENT') resolve();
      },
      onVisit(err) {
        if (err && err.code === 'ENOENT') resolve();
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
