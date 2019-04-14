import fs from 'fs';
import { walkPackageGraph } from '../../src/';
import { IBooleanMap } from '../../src/types';
import pkgs from '../json/packages.json';

console.info('pkgs0', pkgs);

let count = 0;
const pkgMap: IBooleanMap = Object.assign(Object.create(null), pkgs);
const visited: IBooleanMap = {};
const cwd = process.cwd();
const regSep = /\\/g;

walkPackageGraph('./test/pseudo-projects/heavy/npm', {
  onEnd() {
    const notVisitedJsonPath = './test/json/not-visited.json';
    const notVisitedContents = JSON.stringify(pkgMap, Object.keys(pkgMap).sort(), 2);
    fs.writeFile(notVisitedJsonPath, notVisitedContents, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.info(notVisitedJsonPath, 'written');
        console.info(Object.keys(pkgMap).length, 'not visited'); // 1937 TODO
        console.info(count, 'visited'); // 1937 TODO
      }
    });
    const visitedJsonPath = './test/json/visited.json';
    const visitedContents = JSON.stringify(visited, Object.keys(visited).sort(), 2);
    fs.writeFile(visitedJsonPath, visitedContents, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.info(visitedJsonPath, 'written');
      }
    });
  },
  onVisit(node) {
    const pkgPath = node.path.replace(cwd, '').replace(regSep, '/');
    visited[pkgPath] = true;
    delete pkgMap[pkgPath];
    count++;
  }
});
