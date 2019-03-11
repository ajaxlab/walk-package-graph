/* tslint:disable: max-line-length */

import fs from 'fs';
import PackageNode from './PackageNode';
import { ICreatePackageNodeCallBack, INodeCache, IPackageNode, IResolveHandler } from './types';

function createPackageNode(
  path: string,
  nodeCache: INodeCache,
  onResolve: IResolveHandler,
  callback: ICreatePackageNodeCallBack
) {
  fs.realpath(path, (e, realpath) => {
    if (e) {
      callback(e, null);
    } else {
      const node = new PackageNode(path, nodeCache, onResolve);
      callback(null, node);
    }
  });
}

function walkPackageGraph(root: string, onResolve: IResolveHandler): Promise<IPackageNode> {
  return new Promise((resolve, reject) => {
    const nodeCache: INodeCache = Object.create(null);
    createPackageNode(root, nodeCache, onResolve, (e, rootNode) => {
      if (rootNode) {
        resolve(rootNode);
      } else if (e) {
        reject(e);
      } else {
        reject(new Error('unknown error'));
      }
    });
  });
}

export default walkPackageGraph;
