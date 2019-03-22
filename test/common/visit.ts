import p from 'path';
import walkPackageGraph from '../../src/walkPackageGraph';

function visit(rootPath: string, packDirs: string[], onResolve: () => void) {

  const regSep = /\\/g;
  const absRootPath = p.resolve(rootPath);
  walkPackageGraph(rootPath, {
    onVisit(e, manifest, path) {
      if (path) {
        const packPath = path.replace(absRootPath, '').replace(regSep, '/');
        const index = packDirs.indexOf(packPath);
        if (index > -1) {
          packDirs.splice(index, 1);
        }
        if (packDirs.length === 0) {
          onResolve();
        }
      }
    }
  });
}

export default visit;
