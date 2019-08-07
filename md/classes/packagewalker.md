

# Hierarchy

**PackageWalker**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new PackageWalker**(walkHandlers: *[IWalkHandlers](../interfaces/iwalkhandlers.md)*, resolveDevDependency: *`boolean`*): [PackageWalker](packagewalker.md)

*Defined in [PackageWalker.ts:14](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageWalker.ts#L14)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| walkHandlers | [IWalkHandlers](../interfaces/iwalkhandlers.md) |
| resolveDevDependency | `boolean` |

**Returns:** [PackageWalker](packagewalker.md)

___

# Properties

<a id="_onend"></a>

## `<Private>` _onEnd

**● _onEnd**: *`function` \| `undefined`*

*Defined in [PackageWalker.ts:9](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageWalker.ts#L9)*

___
<a id="_onerror"></a>

## `<Private>` _onError

**● _onError**: *`function` \| `undefined`*

*Defined in [PackageWalker.ts:10](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageWalker.ts#L10)*

___
<a id="_onresolve"></a>

## `<Private>` _onResolve

**● _onResolve**: *`function` \| `undefined`*

*Defined in [PackageWalker.ts:11](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageWalker.ts#L11)*

___
<a id="_onunresolve"></a>

## `<Private>` _onUnresolve

**● _onUnresolve**: *`function` \| `undefined`*

*Defined in [PackageWalker.ts:12](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageWalker.ts#L12)*

___
<a id="_onvisit"></a>

## `<Private>` _onVisit

**● _onVisit**: *`function` \| `undefined`*

*Defined in [PackageWalker.ts:13](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageWalker.ts#L13)*

___
<a id="_resolvedevdependency"></a>

## `<Private>` _resolveDevDependency

**● _resolveDevDependency**: *`boolean`*

*Defined in [PackageWalker.ts:14](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageWalker.ts#L14)*

___

# Methods

<a id="_handleerror"></a>

## `<Private>` _handleError

▸ **_handleError**(err: *`ErrnoException`*): `void`

*Defined in [PackageWalker.ts:45](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageWalker.ts#L45)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| err | `ErrnoException` |

**Returns:** `void`

___
<a id="_linkfamilytree"></a>

## `<Private>` _linkFamilyTree

▸ **_linkFamilyTree**(parentNode: *[IPackageNode](../interfaces/ipackagenode.md)*, childNodes: *[IPackageNode](../interfaces/ipackagenode.md)[]*): `void`

*Defined in [PackageWalker.ts:55](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageWalker.ts#L55)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| parentNode | [IPackageNode](../interfaces/ipackagenode.md) |
| childNodes | [IPackageNode](../interfaces/ipackagenode.md)[] |

**Returns:** `void`

___
<a id="_readpackage"></a>

## `<Private>` _readPackage

▸ **_readPackage**(abs: *`string`*, cb: *`function`*): `void`

*Defined in [PackageWalker.ts:68](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageWalker.ts#L68)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| abs | `string` |
| cb | `function` |

**Returns:** `void`

___
<a id="_resolve"></a>

## `<Private>` _resolve

▸ **_resolve**(root: *[IPackageNode](../interfaces/ipackagenode.md)*): `void`

*Defined in [PackageWalker.ts:88](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageWalker.ts#L88)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| root | [IPackageNode](../interfaces/ipackagenode.md) |

**Returns:** `void`

___
<a id="_visit"></a>

## `<Private>` _visit

▸ **_visit**(abs: *`string`*, cb: *`function`*): `void`

*Defined in [PackageWalker.ts:102](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageWalker.ts#L102)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| abs | `string` |
| cb | `function` |

**Returns:** `void`

___
<a id="_visitnodemodules"></a>

## `<Private>` _visitNodeModules

▸ **_visitNodeModules**(abs: *`string`*, cb: *`function`*): `void`

*Defined in [PackageWalker.ts:127](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageWalker.ts#L127)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| abs | `string` |
| cb | `function` |

**Returns:** `void`

___
<a id="_visitscopedpackages"></a>

## `<Private>` _visitScopedPackages

▸ **_visitScopedPackages**(scopePath: *`string`*, cb: *`function`*): `void`

*Defined in [PackageWalker.ts:165](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageWalker.ts#L165)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| scopePath | `string` |
| cb | `function` |

**Returns:** `void`

___
<a id="start"></a>

##  start

▸ **start**(root: *`string`*): `void`

*Defined in [PackageWalker.ts:30](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageWalker.ts#L30)*

Starts walk. You don't need to call this method directly. [walkPackageGraph](../#walkpackagegraph) calls this method instead.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| root | `string` |  A start path (a project root usually) |

**Returns:** `void`

___

