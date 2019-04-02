import { expect, use } from 'chai';
import PackageNode from '../src/PackageNode';

describe('walkPackageGraph(root, walkHandlers, walkOptions)', function () {

  it('converts to string', function () {
    const manifest = {
      name: 'test',
      version: '0.1.0'
    };
    const node = new PackageNode(manifest, './');
    expect(node + '').to.be.equal('<PackageNode>test/0.1.0');
  });
});
