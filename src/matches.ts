import { satisfies } from 'mini-semver';

export function matches(version: string, depValue: string) {
  if (depValue.split(':')[1]) {
    return true;
  } else if (depValue.split('/').length === 2) {
    return true;
  } else if (depValue === 'latest') {
    return true;
  }
  return satisfies(version, depValue);
}
