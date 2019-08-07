
walk-package-graph
==================

Traverse a Node.js package's dependency graph using Node.js module resolution algorithm

# Functions

<a id="walkpackagegraph"></a>

##  walkPackageGraph

▸ **walkPackageGraph**(root: *`string`*, walkHandlers?: *[IWalkHandlers](interfaces/iwalkhandlers.md)*, resolveDevDependency?: *`boolean`*): `void`

*Defined in [index.ts:42](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/index.ts#L42)*

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

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| root | `string` | - |  A start path (a project root usually) |
| `Default value` walkHandlers | [IWalkHandlers](interfaces/iwalkhandlers.md) |  {} |  Event handlers<br><br>```typescript export interface IWalkHandlers { onEnd?: (rootNode?: IPackageNode) => void; onError?: (error: NodeJS.ErrnoException) => void; onResolve?: (node: IPackageNode) => void; onUnresolve?: (node: IPackageNode, unresolvedNames: string\[\]) => void; onVisit?: (node: IPackageNode) => void; } ``` |
| `Default value` resolveDevDependency | `boolean` | false |

**Returns:** `void`

___

