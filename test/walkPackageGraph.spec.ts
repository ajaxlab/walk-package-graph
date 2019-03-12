/* tslint:disable: max-line-length */

import { expect, use } from 'chai';
import walkPackageGraph from '../src/walkPackageGraph';

describe('walkPackageGraph(root: string, onResolve: (packageNode: IPackageNode) => void): Promise<IPackageNode>', function () {

  it('traverses a normal project', async function () {
    const graph = await walkPackageGraph('./test/pseudo-projects/normal', (node) => {
      console.log(node);
    });
    const model = {
      children: [],
    };
    expect(graph).to.deep.equal(model);
  });

});
