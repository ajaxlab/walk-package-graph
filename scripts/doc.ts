import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

function execute(command: string) {
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.info(stdout);
    if (stderr.trim()) {
      console.info(`stderr: ${stderr}`);
    }
  });
}

fs.readFile('./package.json', 'utf8', (errFs, pkgJson) => {
  if (errFs) {
    console.error(errFs);
    return;
  }
  try {
    const pkg = JSON.parse(pkgJson);
    const exe = ['.', 'node_modules', '.bin', 'typedoc'].join(path.sep);
    execute(`${exe} --excludePrivate --mode file --out docs/${pkg.version} src`);
    // execute(`${exe} --mode file --theme markdown --mdEngine gitbook --out md/${pkg.version} src`);
  } catch (errJson) {
    console.error(errJson);
  }
});
