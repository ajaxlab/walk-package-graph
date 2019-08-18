# walk-package-graph

[![npm](https://img.shields.io/npm/v/walk-package-graph.svg)](https://www.npmjs.com/package/walk-package-graph)
[![Build Status][badge-build-status]][link-build-status]
[![Coverage Status][badge-coverage]][link-coverage]

`walk-package-graph` traverses a Node.js package's dependency graph using [Node.js module resolution algorithm](https://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders)

## Performances

Traverses 1,633 packages within average 130ms with a core-i5 8GB ram machine.

```
npm run test
```

## Installation

```
npm install walk-package-graph
```

## Usages

```ts
import { walkPackageGraph } from 'walk-package-graph';

walkPackageGraph('/path/to/start', {
  onEnd(rootNode) {
    console.info('onEnd', rootNode.path);
  },
  onError(error) {
    console.error('onError', error.path, error.message);
  },
  onResolve(node) {
    console.info('onResolve', node.id, node.path, node.dependencies);
  },
  onUnresolve(node, unresolvedNames) {
    console.error('onUnresolve', node.path, unresolvedNames);
  },
  onVisit(node) {
    console.info('onVisit', node.path);
  }
});
```

## API

* [TS Doc](http://ajaxlab.github.io/walk-package-graph/0.1.0)

* [Markdown](https://github.com/ajaxlab/walk-package-graph/blob/master/md/0.1.0/SUMMARY.md)

## License

This project is licensed under [MIT](./LICENSE) license.

<!-- badges -->
[badge-build-status]: https://travis-ci.org/ajaxlab/walk-package-graph.svg?branch=master
[badge-coverage]: https://coveralls.io/repos/github/ajaxlab/walk-package-graph/badge.svg

<!-- links -->
[link-coverage]: https://coveralls.io/github/ajaxlab/walk-package-graph
[link-build-status]: https://travis-ci.org/ajaxlab/walk-package-graph