

Represents a package as a graph node.

# Hierarchy

**PackageNode**

# Implements

* [IPackageNode](../interfaces/ipackagenode.md)

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new PackageNode**(manifest: *`IPackageJson`*, path: *`string`*): [PackageNode](packagenode.md)

*Defined in [PackageNode.ts:71](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageNode.ts#L71)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| manifest | `IPackageJson` |
| path | `string` |

**Returns:** [PackageNode](packagenode.md)

___

# Properties

<a id="children"></a>

##  children

**● children**: *`object`* =  Object.create(null)

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[children](../interfaces/ipackagenode.md#children)*

*Defined in [PackageNode.ts:13](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageNode.ts#L13)*

Child nodes inside of a `node_modules` path under this package.

#### Type declaration

[packageName: `string`]: [IPackageNode](../interfaces/ipackagenode.md)

___
<a id="dependencies"></a>

##  dependencies

**● dependencies**: *[IPackageNode](../interfaces/ipackagenode.md)[]* =  []

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[dependencies](../interfaces/ipackagenode.md#dependencies)*

*Defined in [PackageNode.ts:20](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageNode.ts#L20)*

An array of resolved dependencies of this package.

___
<a id="dependencyresolved"></a>

##  dependencyResolved

**● dependencyResolved**: *`boolean`* = false

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[dependencyResolved](../interfaces/ipackagenode.md#dependencyresolved)*

*Defined in [PackageNode.ts:26](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageNode.ts#L26)*

Indicates all dependencies are resolved or not.

*__see__*: [validate](packagenode.md#validate)

___
<a id="id"></a>

##  id

**● id**: *`string`*

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[id](../interfaces/ipackagenode.md#id)*

*Defined in [PackageNode.ts:31](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageNode.ts#L31)*

A package's unique id as `{package name}/{package version}` format.

___
<a id="linked"></a>

##  linked

**● linked**: *`boolean`* = false

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[linked](../interfaces/ipackagenode.md#linked)*

*Defined in [PackageNode.ts:38](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageNode.ts#L38)*

Indicates this node and it's dependencies are linked or not. This value is changed as `true` after [linkDependencies](packagenode.md#linkdependencies) call.

*__see__*: [linkDependencies](packagenode.md#linkdependencies)

___
<a id="manifest"></a>

##  manifest

**● manifest**: *`IPackageJson`*

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[manifest](../interfaces/ipackagenode.md#manifest)*

*Defined in [PackageNode.ts:44](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageNode.ts#L44)*

Contents of the package.json file of this package.

*__see__*: [IPackageJson](https://ajaxlab.github.io/package-json-type/interfaces/ipackagejson.html )

___
<a id="parent"></a>

##  parent

**● parent**: *[IPackageNode](../interfaces/ipackagenode.md) \| `undefined`* =  void 0

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[parent](../interfaces/ipackagenode.md#parent)*

*Defined in [PackageNode.ts:52](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageNode.ts#L52)*

An upper directory node of child nodes in a `node_modules` directory.

```
parent1/node_modules/child1
```

___
<a id="path"></a>

##  path

**● path**: *`string`*

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[path](../interfaces/ipackagenode.md#path)*

*Defined in [PackageNode.ts:57](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageNode.ts#L57)*

An absolute path of this node.

___
<a id="unresolveddependencies"></a>

##  unresolvedDependencies

**● unresolvedDependencies**: *`object`*

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[unresolvedDependencies](../interfaces/ipackagenode.md#unresolveddependencies)*

*Defined in [PackageNode.ts:63](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageNode.ts#L63)*

An array of dependencies which remain unresolved after dependency resolution try.

*__see__*: [linkDependencies](packagenode.md#linkdependencies)

#### Type declaration

[packageName: `string`]: `string`

___
<a id="validated"></a>

##  validated

**● validated**: *`boolean`* = false

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[validated](../interfaces/ipackagenode.md#validated)*

*Defined in [PackageNode.ts:71](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageNode.ts#L71)*

Indicates this node is validated.

*__see__*: [validate](packagenode.md#validate)

___

# Methods

<a id="_mergedevdependency"></a>

## `<Private>` _mergeDevDependency

▸ **_mergeDevDependency**(): `void`

*Defined in [PackageNode.ts:219](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageNode.ts#L219)*

**Returns:** `void`

___
<a id="getdependency"></a>

##  getDependency

▸ **getDependency**(depName: *`string`*): [IPackageNode](../interfaces/ipackagenode.md) \| `void`

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[getDependency](../interfaces/ipackagenode.md#getdependency)*

*Defined in [PackageNode.ts:86](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageNode.ts#L86)*

Returns a node with the given name which this node depends on.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| depName | `string` |  The name of a dependency. |

**Returns:** [IPackageNode](../interfaces/ipackagenode.md) \| `void`

___
<a id="hasdependency"></a>

##  hasDependency

▸ **hasDependency**(name: *`string`*, version?: *`undefined` \| `string`*): `boolean`

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[hasDependency](../interfaces/ipackagenode.md#hasdependency)*

*Defined in [PackageNode.ts:102](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageNode.ts#L102)*

Returns `true` if this node depends on the package with the given name and optional version.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  The name of a dependency. |
| `Optional` version | `undefined` \| `string` |  The version of the dependency. |

**Returns:** `boolean`

___
<a id="linkdependencies"></a>

##  linkDependencies

▸ **linkDependencies**(): `void`

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[linkDependencies](../interfaces/ipackagenode.md#linkdependencies)*

*Defined in [PackageNode.ts:128](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageNode.ts#L128)*

For each unresolved dependencies, this method check if the dependency node exist, and if it exists and satisfies version then add to [dependencies](packagenode.md#dependencies) and remove from [unresolvedDependencies](packagenode.md#unresolveddependencies).

If the `package.json` has the `optionalDependencies` and some of it also exists unresolved dependencies, this method will remove them from the unresolved dependencies.

**Returns:** `void`

___
<a id="resolve"></a>

##  resolve

▸ **resolve**(cb?: *`undefined` \| `function`*, resolveDevDependency?: *`undefined` \| `false` \| `true`*): `void`

*Defined in [PackageNode.ts:177](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageNode.ts#L177)*

Calls [linkDependencies](packagenode.md#linkdependencies), then calls [validate](packagenode.md#validate)

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| `Optional` cb | `undefined` \| `function` |  Called when the resolution process for this node has been ended. |
| `Optional` resolveDevDependency | `undefined` \| `false` \| `true` |  If this value is true this node will resolve \`devDependencies\` too. |

**Returns:** `void`

___
<a id="tostring"></a>

##  toString

▸ **toString**(): `string`

*Defined in [PackageNode.ts:186](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageNode.ts#L186)*

**Returns:** `string`

___
<a id="validate"></a>

##  validate

▸ **validate**(cb?: *`undefined` \| `function`*): `boolean`

*Defined in [PackageNode.ts:194](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/PackageNode.ts#L194)*

Validates all of this node's dependencies recursively.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| `Optional` cb | `undefined` \| `function` |   |

**Returns:** `boolean`

___

