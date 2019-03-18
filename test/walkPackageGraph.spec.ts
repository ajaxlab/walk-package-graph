/* tslint:disable: max-line-length */

import { expect, use } from 'chai';
import { LogLevel } from '../src/types';
import walkPackageGraph from '../src/walkPackageGraph';

describe('walkPackageGraph(root, walkHandlers, walkOptions)', function () {

  it('traverses a normal project', function (done) {
    const model = {
      dependencies: [],
    };
    walkPackageGraph('./test/pseudo-projects/normal', {
      onComplete(rootNode) {
        console.info(rootNode);
        // expect(graph).to.deep.equal(model);
        done();
      },
      onVisit(node) {
        console.info(node);
      }
    }, {
      logLevel: LogLevel.debug
    });
  });

  it('handles dir name ends with /', function () {
    //
  });

});
