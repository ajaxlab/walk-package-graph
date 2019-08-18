> # Class: PackageWalker

## Hierarchy

* **PackageWalker**

## Index

### Constructors

* [constructor](packagewalker.md#constructor)

### Properties

* [_onEnd](packagewalker.md#private-_onend)
* [_onError](packagewalker.md#private-_onerror)
* [_onResolve](packagewalker.md#private-_onresolve)
* [_onUnresolve](packagewalker.md#private-_onunresolve)
* [_onVisit](packagewalker.md#private-_onvisit)
* [_resolveDevDependency](packagewalker.md#private-_resolvedevdependency)

### Methods

* [_handleError](packagewalker.md#private-_handleerror)
* [_linkFamilyTree](packagewalker.md#private-_linkfamilytree)
* [_readPackage](packagewalker.md#private-_readpackage)
* [_resolve](packagewalker.md#private-_resolve)
* [_visit](packagewalker.md#private-_visit)
* [_visitNodeModules](packagewalker.md#private-_visitnodemodules)
* [_visitScopedPackages](packagewalker.md#private-_visitscopedpackages)
* [start](packagewalker.md#start)

## Constructors

###  constructor

\+ **new PackageWalker**(`walkHandlers`: [IWalkHandlers](../interfaces/iwalkhandlers.md), `resolveDevDependency`: boolean): *[PackageWalker](packagewalker.md)*

*Defined in [PackageWalker.ts:14](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/PackageWalker.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`walkHandlers` | [IWalkHandlers](../interfaces/iwalkhandlers.md) |
`resolveDevDependency` | boolean |

**Returns:** *[PackageWalker](packagewalker.md)*

## Properties

### `Private` _onEnd

• **_onEnd**: *function | undefined*

*Defined in [PackageWalker.ts:9](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/PackageWalker.ts#L9)*

___

### `Private` _onError

• **_onError**: *function | undefined*

*Defined in [PackageWalker.ts:10](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/PackageWalker.ts#L10)*

___

### `Private` _onResolve

• **_onResolve**: *function | undefined*

*Defined in [PackageWalker.ts:11](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/PackageWalker.ts#L11)*

___

### `Private` _onUnresolve

• **_onUnresolve**: *function | undefined*

*Defined in [PackageWalker.ts:12](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/PackageWalker.ts#L12)*

___

### `Private` _onVisit

• **_onVisit**: *function | undefined*

*Defined in [PackageWalker.ts:13](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/PackageWalker.ts#L13)*

___

### `Private` _resolveDevDependency

• **_resolveDevDependency**: *boolean*

*Defined in [PackageWalker.ts:14](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/PackageWalker.ts#L14)*

## Methods

### `Private` _handleError

▸ **_handleError**(`err`: `ErrnoException`): *void*

*Defined in [PackageWalker.ts:45](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/PackageWalker.ts#L45)*

**Parameters:**

Name | Type |
------ | ------ |
`err` | `ErrnoException` |

**Returns:** *void*

___

### `Private` _linkFamilyTree

▸ **_linkFamilyTree**(`parentNode`: [IPackageNode](../interfaces/ipackagenode.md), `childNodes`: [IPackageNode](../interfaces/ipackagenode.md)[]): *void*

*Defined in [PackageWalker.ts:55](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/PackageWalker.ts#L55)*

**Parameters:**

Name | Type |
------ | ------ |
`parentNode` | [IPackageNode](../interfaces/ipackagenode.md) |
`childNodes` | [IPackageNode](../interfaces/ipackagenode.md)[] |

**Returns:** *void*

___

### `Private` _readPackage

▸ **_readPackage**(`abs`: string, `cb`: function): *void*

*Defined in [PackageWalker.ts:65](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/PackageWalker.ts#L65)*

**Parameters:**

▪ **abs**: *string*

▪ **cb**: *function*

▸ (`manifest?`: `IPackageJson`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`manifest?` | `IPackageJson` |

**Returns:** *void*

___

### `Private` _resolve

▸ **_resolve**(`root`: [IPackageNode](../interfaces/ipackagenode.md)): *void*

*Defined in [PackageWalker.ts:85](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/PackageWalker.ts#L85)*

**Parameters:**

Name | Type |
------ | ------ |
`root` | [IPackageNode](../interfaces/ipackagenode.md) |

**Returns:** *void*

___

### `Private` _visit

▸ **_visit**(`abs`: string, `cb`: function): *void*

*Defined in [PackageWalker.ts:99](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/PackageWalker.ts#L99)*

**Parameters:**

▪ **abs**: *string*

▪ **cb**: *function*

▸ (`node?`: [IPackageNode](../interfaces/ipackagenode.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`node?` | [IPackageNode](../interfaces/ipackagenode.md) |

**Returns:** *void*

___

### `Private` _visitNodeModules

▸ **_visitNodeModules**(`abs`: string, `cb`: function): *void*

*Defined in [PackageWalker.ts:124](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/PackageWalker.ts#L124)*

**Parameters:**

▪ **abs**: *string*

▪ **cb**: *function*

▸ (`nodes?`: [IPackageNode](../interfaces/ipackagenode.md)[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`nodes?` | [IPackageNode](../interfaces/ipackagenode.md)[] |

**Returns:** *void*

___

### `Private` _visitScopedPackages

▸ **_visitScopedPackages**(`scopePath`: string, `cb`: function): *void*

*Defined in [PackageWalker.ts:162](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/PackageWalker.ts#L162)*

**Parameters:**

▪ **scopePath**: *string*

▪ **cb**: *function*

▸ (`nodes?`: [IPackageNode](../interfaces/ipackagenode.md)[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`nodes?` | [IPackageNode](../interfaces/ipackagenode.md)[] |

**Returns:** *void*

___

###  start

▸ **start**(`root`: string): *void*

*Defined in [PackageWalker.ts:30](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/PackageWalker.ts#L30)*

Starts walk. You don't need to call this method directly.
[walkPackageGraph](../globals.md#walkpackagegraph) calls this method instead.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`root` | string | A start path (a project root usually)  |

**Returns:** *void*