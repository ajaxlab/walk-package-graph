import semver from 'semver';

const reNum = /^[0-9]*$/;
const miniSemver = Object.assign({}, semver);

// let count = 0;

miniSemver.satisfies = function satisfies (version, range, options) {

  if (typeof range === 'string' && typeof version === 'string') {

    // exact match
    if (range === version) {
      return true;
    } else if (range === '^' + version) {
      return true;
    } else if (range === '~' + version) {
      return true;
    }

    const ranges = range.split('.');
    const range0o = ranges[0];
    const rangePrefix = range0o[0];
    const range0 = range0o.substring(1);
    const range1 = ranges[1];
    const range2 = ranges[2];
    const versions = version.split('.');
    const version0 = versions[0];
    const version1 = versions[1];
    const version2 = versions[2];

    // ^1.2.3
    if (reNum.test(range2) && reNum.test(version2)) {
      if (rangePrefix === '^') {
        if (range0 === '0') {
          // ^0.7
          if (version1 === range1) {
            if (range1 === '0') {
              // ^0.0.x 0.0.z
              return false;
            } else {
              // ^0.7.a 0.7.b
              if (parseInt(version2, 10) > parseInt(range2, 10)) {
                // ^0.7.1 0.7.2
                return true;
              }
              return false;
            }
          }
          return false;
        } else {
          // ^17.
          if (version0 === range0) {
            // ^17.a.b 17.c.d
            if (version1 === range1) {
              // ^17.1.a 17.1.b
              if (parseInt(version2, 10) > parseInt(range2, 10)) {
                // ^17.1.1 17.1.2
                return true;
              }
              return false;
            } else if (parseInt(version1, 10) > parseInt(range1, 10)) {
              // ^17.1.a 17.2.b
              return true;
            }
            // ^17.1.a 17.0.b
            return false;
          }
          // ^17.a 14.b
          return false;
        }
      } else if (rangePrefix === '~') {
        // console.info(++count, range, version);
      }
    }
  }

  // console.info(++count, range, version);

  return semver.satisfies(version, range, options);
};

export default miniSemver;
