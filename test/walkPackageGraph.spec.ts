/* tslint:disable: max-line-length */

import { expect, use } from 'chai';
import p from 'path';
import { walkPackageGraph } from '../src/';
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
    walkPackageGraph(rootPath, {
      onError(err, path) {
        if (path === p.resolve(rootPath) && err.code === 'ENOENT') {
          done();
        }
      }
    });
  });

  it('throws an error with an invalid project', function (done) {
    const rootPath = './test/pseudo-projects/invalid';
    walkPackageGraph(rootPath, {
      onError(err, path) {
        if (path === p.resolve(rootPath)) {
          done();
        }
      }
    });
  });

  it('resolves nested dependency', function (done) {
    const rootPath = './test/pseudo-projects/nested';
    walkPackageGraph(rootPath, {
      onEnd(rootNode) {
        if (rootNode
          && rootNode.children['b']
          && rootNode.children['b'].id === 'b/1.1.0'
          && rootNode.children['c']
          && rootNode.children['c'].id === 'c/1.1.0'
          && rootNode.children['d']
          && rootNode.children['d'].id === 'd/1.1.0'
          && rootNode.children['e']
          && rootNode.children['e'].id === 'e/1.1.0'
          && rootNode.children['d'].children['e']
          && rootNode.children['d'].children['e'].id === 'e/2.1.0'
        ) {
          const nodeB = rootNode.getDependency('b');
          const nodeD = rootNode.getDependency('d');
          if (
            rootNode.hasDependency('b', '1.1.0')
            && rootNode.hasDependency('d', '1.1.0')
            && !rootNode.hasDependency('c', '1.1.0')
            && !rootNode.hasDependency('e', '1.1.0')
            && nodeB && nodeD
            && nodeB.hasDependency('e', '1.1.0')
            && nodeD.hasDependency('e', '2.1.0')
          ) {
            done();
          }
        }
      }
    });
  });

  it('resolves duplicate parallel dependency', function (done) {
    const rootPath = './test/pseudo-projects/parallel';
    walkPackageGraph(rootPath, {
      onEnd(rootNode) {
        if (rootNode
          && rootNode.children['b']
          && rootNode.children['b'].id === 'b/1.1.0'
          && rootNode.children['b'].children['e']
          && rootNode.children['b'].children['e'].id === 'e/2.3.0'
          && rootNode.children['c']
          && rootNode.children['c'].id === 'c/1.1.0'
          && rootNode.children['d']
          && rootNode.children['d'].id === 'd/1.1.0'
          && rootNode.children['d'].children['e']
          && rootNode.children['d'].children['e'].id === 'e/3.1.0'
          && rootNode.children['e']
          && rootNode.children['e'].id === 'e/1.1.0'
        ) {
          const nodeB = rootNode.getDependency('b');
          const nodeD = rootNode.getDependency('d');
          if (
            rootNode.hasDependency('b', '1.1.0')
            && rootNode.hasDependency('d', '1.1.0')
            && rootNode.hasDependency('e', '1.1.0')
            && !rootNode.hasDependency('c', '1.1.0')
            && nodeB && nodeD
            && nodeB.hasDependency('c', '1.1.0')
            && nodeB.hasDependency('e', '2.3.0')
            && nodeD.hasDependency('c', '1.1.0')
            && nodeD.hasDependency('e', '3.1.0')
          ) {
            done();
          }
        }
      }
    });
  });

  it('handles dir name ends with /', function () {
    //
  });

});
