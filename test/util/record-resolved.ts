import fs from 'fs';
import { walkPackageGraph } from '../../src/';
import { IBooleanMap } from '../common/types';
import pkgs from '../json/visited.json';

let count = 0;
const notResolved: IBooleanMap = Object.assign(Object.create(null), pkgs);
const resolved: IBooleanMap = {};
const cwd = process.cwd();
const regSep = /\\/g;

walkPackageGraph('./test/pseudo-projects/heavy/npm', {
  onEnd(root) {
    setTimeout(() => {
      // console.info(root);
      const notResolvedJsonPath = './test/json/not-resolved.json';
      const notResolvedContents = JSON.stringify(notResolved, Object.keys(notResolved).sort(), 2);
      fs.writeFile(notResolvedJsonPath, notResolvedContents, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.info(notResolvedJsonPath, 'written');
          console.info(Object.keys(notResolved).length, 'not resolved');
          console.info(count, 'resolved');
        }
      });
      const resolvedJsonPath = './test/json/resolved.json';
      const resolvedContents = JSON.stringify(resolved, Object.keys(resolved).sort(), 2);
      fs.writeFile(resolvedJsonPath, resolvedContents, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.info(resolvedJsonPath, 'written');
        }
      });
    }, 3000);
  },
  onResolve(node) {
    const pkgPath = node.path.replace(cwd, '').replace(regSep, '/');
    resolved[pkgPath] = true;
    delete notResolved[pkgPath];
    count++;
  },
  onUnresolve(node, unresolveds) {
    console.info('unresolved', unresolveds);
  }
}, true);
