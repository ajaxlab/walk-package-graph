import fs from 'fs';
import { IPackageNode, IPackageNodeMap, IVisitPackageHandler } from './types';

class PackageNodeWalker {

  private _onVisitPackage: IVisitPackageHandler;
  private _packageNodeMap: IPackageNodeMap = Object.create(null);
  private _reject!: (reason: Error) => void;
  private _resolve!: (value: IPackageNode) => void;
  private _stopOnError: boolean;
  private _toVisit: string[] = [];

  constructor(onVisitPackage: IVisitPackageHandler, stopOnError: boolean) {
    this._onVisitPackage = onVisitPackage;
    this._stopOnError = stopOnError;
  }

  getGraph(root: string): Promise<IPackageNode> {
    return new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
      this._visit(root);
    });
  }

  private _resolveVisit(path: string) {
    // TODO
  }

  private _visit(path: string) {
    fs.readdir(path, (errReaddir, files) => {
      const promises = [];
      if (files.includes('package.json')) {
        promises.push(new Promise((resolve, reject) => {
          fs.readFile(path + '/package.json', 'utf8', (errReadFile, txt) => {
            const rawPkg = JSON.parse(txt);
            resolve(rawPkg);
          });
        }));
      }
      if (files.includes('node_modules')) {
        promises.push(new Promise((resolve, reject) => {
          const nmPath = path + '/node_modules/';
          fs.readdir(nmPath, (errReadNM, dirs) => {
            dirs.forEach((dir) => {
              this._toVisit.push(nmPath + dir);
            });
            resolve();
          });
        }));
      }
      Promise.all(promises).then((results) => {
        console.log('results', results);
        const nextPath = this._toVisit.shift();
        if (nextPath) {
          this._visit(nextPath);
        } else {
          this._resolve({
            children: []
          });
        }
      });
    });
  }
}

export default PackageNodeWalker;
