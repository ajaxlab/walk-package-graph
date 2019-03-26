import p from 'path';
import { IPackageNode } from './types';

/**

/a
can access b with
  /a/node_modules/b

/a/node_modules/d
can access
  /a/node_modules/d/node_modules/e
  /a/node_modules/e
can not access
  /a/node_modules/d/node_modules/z/node_modules/e
  /a/node_modules/z/node_modules/e
*/

let count = 0;
let inside = 0;

const cwd = process.cwd();

function canRequire(rootPath: string, node: IPackageNode, depNode: IPackageNode) {
  const nodePath = node.path;
  const depPath = depNode.path;
  const nodeLen = nodePath.length;
  const depLen = depPath.length;
  const depName = depNode.manifest.name;
  const delta = p.sep + 'node_modules' + p.sep + depName;
  if (nodeLen > depLen) {
    let compare = rootPath;
    while (compare.length < nodeLen) {
      compare += delta; // 'a /node_modules/c'
      if (compare === depPath) {
        return true;
      }
    }
  } else {

  }

  /*
  if (depNode.manifest.name === 'tapable') {
    console.info('node.path ----', node.path.replace(cwd, ''));
    console.info('- depNode.path', depNode.path.replace(cwd, ''));
    console.info('----------------------------');
  }
  */
  /*
  const elems = depNode.path.split(p.sep);
  if (elems.length > 9) {
    inside++;
    console.info('node.path ----', node.path.replace(cwd, ''));
    console.info('- depNode.path', depNode.path.replace(cwd, ''));
    console.info('----------------------------', inside, count);
  } else {
    count++;
  }
  */
  return false;
}

export default canRequire;
