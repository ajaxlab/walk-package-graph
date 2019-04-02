import { expect, use } from 'chai';
import { walkPackageGraph } from '../src/';
import PackageNode from '../src/PackageNode';

describe('PackageNode', function () {

  it('toString()', function () {
    const manifest = {
      name: 'test',
      version: '0.1.0'
    };
    const node = new PackageNode(manifest, './');
    expect(node + '').to.be.equal('<PackageNode>test/0.1.0');
  });

  it('getDependency(depName: string)', function (done) {
    const rootPath = './test/pseudo-projects/nested';
    walkPackageGraph(rootPath, {
      onEnd(rootNode) {
        if (rootNode) {
          const nodeB = rootNode.getDependency('b');
          const nodeD = rootNode.getDependency('d');
          if (
            rootNode.hasDependency('b')
            && rootNode.hasDependency('d')
            && !rootNode.hasDependency('c')
            && !rootNode.hasDependency('e')
            && nodeB && nodeD
            && nodeB.hasDependency('e')
            && nodeD.hasDependency('e')
          ) {
            done();
          }
        }
      }
    });
  });

  it('getDependency(depName: string)', function (done) {
    const rootPath = './test/pseudo-projects/parallel';
    walkPackageGraph(rootPath, {
      onEnd(rootNode) {
        if (rootNode) {
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
});
