> # Interface: IPackageNode

## Hierarchy

* **IPackageNode**

## Implemented by

* [PackageNode](../classes/packagenode.md)

## Index

### Properties

* [children](ipackagenode.md#children)
* [dependencies](ipackagenode.md#dependencies)
* [dependencyResolved](ipackagenode.md#dependencyresolved)
* [id](ipackagenode.md#id)
* [linked](ipackagenode.md#linked)
* [manifest](ipackagenode.md#manifest)
* [name](ipackagenode.md#name)
* [parent](ipackagenode.md#parent)
* [path](ipackagenode.md#path)
* [unresolvedDependencies](ipackagenode.md#unresolveddependencies)
* [validated](ipackagenode.md#validated)

### Methods

* [getDependency](ipackagenode.md#getdependency)
* [hasDependency](ipackagenode.md#hasdependency)
* [linkDependencies](ipackagenode.md#linkdependencies)
* [resolve](ipackagenode.md#resolve)
* [validate](ipackagenode.md#validate)

## Properties

###  children

• **children**: *object*

*Defined in [types.ts:8](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/types.ts#L8)*

Child nodes inside of a `node_modules` path under this package.

#### Type declaration:

* \[ **packageName**: *string*\]: [IPackageNode](ipackagenode.md)

___

###  dependencies

• **dependencies**: *[IPackageNode](ipackagenode.md)[]*

*Defined in [types.ts:15](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/types.ts#L15)*

An array of resolved dependencies of this package.

___

###  dependencyResolved

• **dependencyResolved**: *boolean*

*Defined in [types.ts:21](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/types.ts#L21)*

Indicates all dependencies are resolved or not.

**`see`** [validate](ipackagenode.md#validate)

___

###  id

• **id**: *string*

*Defined in [types.ts:26](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/types.ts#L26)*

A package's unique id as `{package name}/{package version}` format.

___

###  linked

• **linked**: *boolean*

*Defined in [types.ts:33](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/types.ts#L33)*

Indicates this node and it's dependencies are linked or not.
This value is changed as `true` after [linkDependencies](ipackagenode.md#linkdependencies) call.

**`see`** [linkDependencies](ipackagenode.md#linkdependencies)

___

###  manifest

• **manifest**: *`IPackageJson`*

*Defined in [types.ts:39](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/types.ts#L39)*

Contents of the package.json file of this package.

**`see`** https://ajaxlab.github.io/package-json-type/interfaces/ipackagejson.html 

___

###  name

• **name**: *string*

*Defined in [types.ts:47](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/types.ts#L47)*

Name of the package.
The name field of package.json.
If the name field of package.json is empty,
directory name of the package will be used.

___

###  parent

• **parent**: *[IPackageNode](ipackagenode.md) | undefined*

*Defined in [types.ts:55](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/types.ts#L55)*

An upper directory node of child nodes in a `node_modules` directory.
```
parent1/node_modules/child1
```

___

###  path

• **path**: *string*

*Defined in [types.ts:60](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/types.ts#L60)*

An absolute path of this node.

___

###  unresolvedDependencies

• **unresolvedDependencies**: *`IDependencyMap`*

*Defined in [types.ts:66](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/types.ts#L66)*

An array of dependencies which remain unresolved after dependency resolution try.

**`see`** [linkDependencies](ipackagenode.md#linkdependencies)

___

###  validated

• **validated**: *boolean*

*Defined in [types.ts:72](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/types.ts#L72)*

Indicates this node is validated.

**`see`** [validate](ipackagenode.md#validate)

## Methods

###  getDependency

▸ **getDependency**(`depName`: string): *[IPackageNode](ipackagenode.md) | void*

*Defined in [types.ts:78](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/types.ts#L78)*

Returns a node with the given name which this node depends on.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`depName` | string | The name of a dependency.  |

**Returns:** *[IPackageNode](ipackagenode.md) | void*

___

###  hasDependency

▸ **hasDependency**(`name`: string, `version?`: undefined | string): *boolean*

*Defined in [types.ts:86](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/types.ts#L86)*

Returns `true` if this node depends on the package
with the given name and optional version.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | The name of a dependency. |
`version?` | undefined \| string | The version of the dependency.  |

**Returns:** *boolean*

___

###  linkDependencies

▸ **linkDependencies**(): *void*

*Defined in [types.ts:97](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/types.ts#L97)*

For each unresolved dependencies, this method check if the dependency node exist,
and if it exists and satisfies version then add to [dependencies](ipackagenode.md#dependencies)
and remove from [unresolvedDependencies](ipackagenode.md#unresolveddependencies).

If the `package.json` has the `optionalDependencies` and some of it also
exists unresolved dependencies, this method will remove them from
the unresolved dependencies.

**Returns:** *void*

___

###  resolve

▸ **resolve**(`cb?`: undefined | function, `resolveDevDependency?`: undefined | false | true): *void*

*Defined in [types.ts:104](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/types.ts#L104)*

Calls [linkDependencies](ipackagenode.md#linkdependencies), then calls [validate](ipackagenode.md#validate)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb?` | undefined \| function | Called when the resolution process for this node has been ended. |
`resolveDevDependency?` | undefined \| false \| true | If this value is true this node will resolve `devDependencies` too.  |

**Returns:** *void*

___

###  validate

▸ **validate**(`cb?`: undefined | function): *boolean*

*Defined in [types.ts:110](https://github.com/ajaxlab/walk-package-graph/blob/9273b65/src/types.ts#L110)*

Validates all of this node's dependencies recursively.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb?` | undefined \| function |   |

**Returns:** *boolean*