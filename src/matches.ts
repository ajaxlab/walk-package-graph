import { satisfies } from 'mini-semver';

/**
 * @hidden
 * @param version package's version
 * @param depValue semver, file:, http://, user/rep
 */
export function matches(version: string, depValue: string) {
  if (
    depValue.split(':')[1]
    || depValue.split('/').length === 2
    || depValue === 'latest'
  ) {
    return true;
  }
  return satisfies(version, depValue);
}
