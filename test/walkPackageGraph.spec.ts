/* tslint:disable: max-line-length */

import fs from 'fs';
import p from 'path';
import { walkPackageGraph } from '../src/';
import { visit } from './common';

const PKG_JSON = 'package.json';

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
    const root = './test/pseudo-projects/scoped';
    fs.mkdir(root + '/node_modules/@empty', () => {
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
      visit(root, dirs, done);
    });
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

  it('visits valid packages', function (done) {
    let count = 0;
    const rootPath = './test/pseudo-projects/heavy/npm';
    walkPackageGraph(rootPath, {
      onEnd() {
        if (count === 1937) {
          done();
        }
      },
      onVisit() {
        count++;
      }
    });
  });

  it('resolves valid packages', function (done) {
    let count = 0;
    const rootPath = './test/pseudo-projects/heavy/npm';
    walkPackageGraph(rootPath, {
      onEnd() {
        if (count === 1937) {
          done();
        }
      },
      onResolve() {
        count++;
      },
      onUnresolve(node, unresolveds) {
        console.info(node.id, unresolveds, node.manifest.dependencies);
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
      onEnd(rootNode) {
        resolve();
      },
      onError(err) {
        if (
          err.path === p.resolve(rootPath, PKG_JSON)
          && err.code === 'ENOENT'
        ) {
          resolve();
        }
      }
    });
  });

  it('throws an error with a project with no manifest', function (done) {
    const rootPath = './test/pseudo-projects/empty';
    let count = 0;
    function resolve() {
      if (++count === 2) done();
    }
    walkPackageGraph(rootPath, {
      onEnd(rootNode) {
        resolve();
      },
      onError(err) {
        if (err.path === p.resolve(rootPath, PKG_JSON) && err.code === 'ENOENT') {
          resolve();
        }
      }
    });
  });

  it('throws an error with an empty dependency', function (done) {
    const rootPath = './test/pseudo-projects/empty-dep';
    let count = 0;
    function resolve() {
      if (++count === 3) done();
    }
    walkPackageGraph(rootPath, {
      onEnd(rootNode) {
        resolve();
      },
      onError(err) {
        resolve();
      },
      onUnresolve(node, unresolveds) {
        resolve();
      }
    });
  });

  it('throws an error with an invalid project', function (done) {
    const rootPath = './test/pseudo-projects/invalid';
    let count = 0;
    function resolve() {
      if (++count === 2) done();
    }
    walkPackageGraph(rootPath, {
      onEnd(rootNode) {
        resolve();
      },
      onError(err) {
        if (err.path === p.resolve(rootPath, PKG_JSON)) {
          resolve();
        }
      }
    });
  });

  it('runs onUnresolve handler with an unmet dependency', function (done) {
    const rootPath = './test/pseudo-projects/unmet';
    let count = 0;
    function resolve() {
      if (++count === 2) done();
    }
    walkPackageGraph(rootPath, {
      onUnresolve(unresolvedNode, unresolvedNames) {
        if (
          (unresolvedNode.id === 'unmet/0.1.0' && unresolvedNames[0] === 'julia')
          || (unresolvedNode.id === 'olivia/0.1.0' && unresolvedNames[0] === 'amelia')
        ) {
          resolve();
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

  it('handles dir name ends with /', function (done) {
    const dirs = [
      '',
      '/node_modules/amelia',
      '/node_modules/jacob',
      '/node_modules/olivia',
      '/node_modules/oscar',
      '/node_modules/olivia/node_modules/amelia',
      '/node_modules/oscar/node_modules/amelia'
    ];
    visit('./test/pseudo-projects/complex/', dirs, done);
  });

  it('runs with empty handler', function (done) {
    walkPackageGraph('./test/pseudo-projects/complex');
    done();
  });

  it('passes a hidden directory', function (done) {
    walkPackageGraph('./test/pseudo-projects/hidden', {
      onEnd(rootNode) {
        if (rootNode && rootNode.id === 'hidden/0.1.0') {
          done();
        }
      }
    });
  });

  it('throws an error with unpermitted directory', function (done) {
    walkPackageGraph('./test/pseudo-projects/file', {
      onError(err) {
        if (err.code === 'ENOENT' || err.code === 'ENOTDIR') {
          done();
        }
      }
    });
  });

  it('throws an error with abnormal manifest', function (done) {
    walkPackageGraph('./test/pseudo-projects/abnormal-pkg', {
      onError(err) {
        if (err.code === 'EISDIR') {
          done();
        }
      }
    });
  });

  it('throws an error with abnormal node_modules', function (done) {
    walkPackageGraph('./test/pseudo-projects/abnormal-nm', {
      onError(err) {
        if (err.code === 'ENOTDIR') {
          done();
        }
      }
    });
  });

  it('traverses a project which has no dependency', function (done) {
    fs.mkdir('./test/pseudo-projects/single/node_modules', (err) => {
      walkPackageGraph('./test/pseudo-projects/single', {
        onEnd(rootNode) {
          if (rootNode) {
            done();
          }
        }
      });
    });
  });
});
