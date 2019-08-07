

# Hierarchy

**IWalkHandlers**

# Properties

<a id="onend"></a>

## `<Optional>` onEnd

**● onEnd**: *`undefined` \| `function`*

*Defined in [types.ts:122](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/types.ts#L122)*

```typescript
onEnd?: (rootNode?: IPackageNode) => void;
```

Called when all nodes are visited and tried resolving.

```typescript
walkPackageGraph('/path/to/start', {
  onEnd(rootNode) {
    if (rootNode) console.info('rootNode', rootNode);
  }
});
```

___
<a id="onerror"></a>

## `<Optional>` onError

**● onError**: *`undefined` \| `function`*

*Defined in [types.ts:139](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/types.ts#L139)*

```typescript
onError?: (error: NodeJS.ErrnoException) => void;
```

Called every time an error occurs while traversing.

```typescript
walkPackageGraph('/path/to/start', {
  onError(error) {
    console.error('onError', error.code, error.path, error.message);
  }
});
```

___
<a id="onresolve"></a>

## `<Optional>` onResolve

**● onResolve**: *`undefined` \| `function`*

*Defined in [types.ts:156](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/types.ts#L156)*

```typescript
onResolve?: (resolvedNode: IPackageNode) => void;
```

Called every time a package node resolves all of it's dependencies.

```typescript
walkPackageGraph('/path/to/start', {
  onResolve(node) {
    console.info('onResolve', node.id, node.path, node.dependencies);
  }
});
```

___
<a id="onunresolve"></a>

## `<Optional>` onUnresolve

**● onUnresolve**: *`undefined` \| `function`*

*Defined in [types.ts:173](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/types.ts#L173)*

```typescript
onUnresolve?: (unresolvedNode: IPackageNode, unresolvedDependencyNames: string[]) => void;
```

Called every time a package node has failed resolving it's dependency.

```typescript
walkPackageGraph('/path/to/start', {
  onUnresolve(node, unresolvedNames) {
    console.info('onUnresolve', node.path, unresolvedNames);
  }
});
```

___
<a id="onvisit"></a>

## `<Optional>` onVisit

**● onVisit**: *`undefined` \| `function`*

*Defined in [types.ts:190](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/types.ts#L190)*

```typescript
onVisit?: (visitedNode: IPackageNode) => void;
```

Called every time a package node has been visited.

```typescript
walkPackageGraph('/path/to/start', {
  onVisit(node) {
    console.info(node.path, 'visited');
  }
});
```

___

