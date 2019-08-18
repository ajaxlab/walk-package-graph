> # Interface: IWalkHandlers

## Hierarchy

* **IWalkHandlers**

## Index

### Properties

* [onEnd](iwalkhandlers.md#optional-onend)
* [onError](iwalkhandlers.md#optional-onerror)
* [onResolve](iwalkhandlers.md#optional-onresolve)
* [onUnresolve](iwalkhandlers.md#optional-onunresolve)
* [onVisit](iwalkhandlers.md#optional-onvisit)

## Properties

### `Optional` onEnd

• **onEnd**? : *undefined | function*

*Defined in [types.ts:130](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/types.ts#L130)*

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

### `Optional` onError

• **onError**? : *undefined | function*

*Defined in [types.ts:147](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/types.ts#L147)*

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

### `Optional` onResolve

• **onResolve**? : *undefined | function*

*Defined in [types.ts:164](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/types.ts#L164)*

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

### `Optional` onUnresolve

• **onUnresolve**? : *undefined | function*

*Defined in [types.ts:181](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/types.ts#L181)*

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

### `Optional` onVisit

• **onVisit**? : *undefined | function*

*Defined in [types.ts:198](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/types.ts#L198)*

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