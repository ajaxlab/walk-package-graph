

# Hierarchy

**IPackageNode**

# Implemented by

* [PackageNode](../classes/packagenode.md)

# Properties

<a id="children"></a>

##  children

**● children**: *`object`*

*Defined in [types.ts:8](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/types.ts#L8)*

Child nodes inside of a `node_modules` path under this package.

#### Type declaration

[packageName: `string`]: [IPackageNode](ipackagenode.md)

___
<a id="dependencies"></a>

##  dependencies

**● dependencies**: *[IPackageNode](ipackagenode.md)[]*

*Defined in [types.ts:15](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/types.ts#L15)*

An array of resolved dependencies of this package.

___
<a id="dependencyresolved"></a>

##  dependencyResolved

**● dependencyResolved**: *`boolean`*

*Defined in [types.ts:21](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/types.ts#L21)*

Indicates all dependencies are resolved or not.

*__see__*: [validate](ipackagenode.md#validate)

___
<a id="id"></a>

##  id

**● id**: *`string`*

*Defined in [types.ts:26](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/types.ts#L26)*

A package's unique id as `{package name}/{package version}` format.

___
<a id="linked"></a>

##  linked

**● linked**: *`boolean`*

*Defined in [types.ts:33](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/types.ts#L33)*

Indicates this node and it's dependencies are linked or not. This value is changed as `true` after [linkDependencies](ipackagenode.md#linkdependencies) call.

*__see__*: [linkDependencies](ipackagenode.md#linkdependencies)

___
<a id="manifest"></a>

##  manifest

**● manifest**: *`IPackageJson`*

*Defined in [types.ts:39](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/types.ts#L39)*

Contents of the package.json file of this package.

*__see__*: [IPackageJson](https://ajaxlab.github.io/package-json-type/interfaces/ipackagejson.html )

___
<a id="parent"></a>

##  parent

**● parent**: *[IPackageNode](ipackagenode.md) \| `undefined`*

*Defined in [types.ts:47](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/types.ts#L47)*

An upper directory node of child nodes in a `node_modules` directory.

```
parent1/node_modules/child1
```

___
<a id="path"></a>

##  path

**● path**: *`string`*

*Defined in [types.ts:52](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/types.ts#L52)*

An absolute path of this node.

___
<a id="unresolveddependencies"></a>

##  unresolvedDependencies

**● unresolvedDependencies**: *`IDependencyMap`*

*Defined in [types.ts:58](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/types.ts#L58)*

An array of dependencies which remain unresolved after dependency resolution try.

*__see__*: [linkDependencies](ipackagenode.md#linkdependencies)

___
<a id="validated"></a>

##  validated

**● validated**: *`boolean`*

*Defined in [types.ts:64](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/types.ts#L64)*

Indicates this node is validated.

*__see__*: [validate](ipackagenode.md#validate)

___

# Methods

<a id="getdependency"></a>

##  getDependency

▸ **getDependency**(depName: *`string`*): [IPackageNode](ipackagenode.md) \| `void`

*Defined in [types.ts:70](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/types.ts#L70)*

Returns a node with the given name which this node depends on.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| depName | `string` |  The name of a dependency. |

**Returns:** [IPackageNode](ipackagenode.md) \| `void`

___
<a id="hasdependency"></a>

##  hasDependency

▸ **hasDependency**(name: *`string`*, version?: *`undefined` \| `string`*): `boolean`

*Defined in [types.ts:78](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/types.ts#L78)*

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

*Defined in [types.ts:89](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/types.ts#L89)*

For each unresolved dependencies, this method check if the dependency node exist, and if it exists and satisfies version then add to [dependencies](ipackagenode.md#dependencies) and remove from [unresolvedDependencies](ipackagenode.md#unresolveddependencies).

If the `package.json` has the `optionalDependencies` and some of it also exists unresolved dependencies, this method will remove them from the unresolved dependencies.

**Returns:** `void`

___
<a id="resolve"></a>

##  resolve

▸ **resolve**(cb?: *`undefined` \| `function`*, resolveDevDependency?: *`undefined` \| `false` \| `true`*): `void`

*Defined in [types.ts:96](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/types.ts#L96)*

Calls [linkDependencies](ipackagenode.md#linkdependencies), then calls [validate](ipackagenode.md#validate)

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| `Optional` cb | `undefined` \| `function` |  Called when the resolution process for this node has been ended. |
| `Optional` resolveDevDependency | `undefined` \| `false` \| `true` |  If this value is true this node will resolve \`devDependencies\` too. |

**Returns:** `void`

___
<a id="validate"></a>

##  validate

▸ **validate**(cb?: *`undefined` \| `function`*): `boolean`

*Defined in [types.ts:102](https://github.com/ajaxlab/walk-package-graph/blob/bd8527d/src/types.ts#L102)*

Validates all of this node's dependencies recursively.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| `Optional` cb | `undefined` \| `function` |   |

**Returns:** `boolean`

___

