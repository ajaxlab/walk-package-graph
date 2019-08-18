> # walk-package-graph

## Index

### Classes

* [PackageNode](classes/packagenode.md)
* [PackageWalker](classes/packagewalker.md)

### Interfaces

* [IPackageNode](interfaces/ipackagenode.md)
* [IWalkHandlers](interfaces/iwalkhandlers.md)

### Functions

* [walkPackageGraph](globals.md#walkpackagegraph)

## Functions

###  walkPackageGraph

▸ **walkPackageGraph**(`root`: string, `walkHandlers`: [IWalkHandlers](interfaces/iwalkhandlers.md), `resolveDevDependency`: boolean): *void*

*Defined in [index.ts:33](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/index.ts#L33)*

Starts to walk package dependency graph and runs walkHandlers

```typescript
import { walkPackageGraph } from 'walk-package-graph';

walkPackageGraph('/path/to/start', {
  onEnd(rootNode) {
    console.info('onEnd', rootNode + '');
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

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`root` | string | - | A start path (a project root usually) |
`walkHandlers` | [IWalkHandlers](interfaces/iwalkhandlers.md) |  {} | Event handlers |
`resolveDevDependency` | boolean | false | Resolve `devDependencies` or not.  |

**Returns:** *void*