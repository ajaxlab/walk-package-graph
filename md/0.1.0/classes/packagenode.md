> # Class: PackageNode

Represents a package as a graph node.

## Hierarchy

* **PackageNode**

## Implements

* [IPackageNode](../interfaces/ipackagenode.md)

## Index

### Constructors

* [constructor](packagenode.md#constructor)

### Properties

* [children](packagenode.md#children)
* [dependencies](packagenode.md#dependencies)
* [dependencyResolved](packagenode.md#dependencyresolved)
* [id](packagenode.md#id)
* [linked](packagenode.md#linked)
* [manifest](packagenode.md#manifest)
* [name](packagenode.md#name)
* [parent](packagenode.md#parent)
* [path](packagenode.md#path)
* [unresolvedDependencies](packagenode.md#unresolveddependencies)
* [validated](packagenode.md#validated)

### Methods

* [_mergeDevDependency](packagenode.md#private-_mergedevdependency)
* [getDependency](packagenode.md#getdependency)
* [hasDependency](packagenode.md#hasdependency)
* [linkDependencies](packagenode.md#linkdependencies)
* [resolve](packagenode.md#resolve)
* [toString](packagenode.md#tostring)
* [validate](packagenode.md#validate)

## Constructors

###  constructor

\+ **new PackageNode**(`manifest`: `IPackageJson`, `path`: string): *[PackageNode](packagenode.md)*

*Defined in [PackageNode.ts:80](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/PackageNode.ts#L80)*

**Parameters:**

Name | Type |
------ | ------ |
`manifest` | `IPackageJson` |
`path` | string |

**Returns:** *[PackageNode](packagenode.md)*

## Properties

###  children

• **children**: *object* =  Object.create(null)

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[children](../interfaces/ipackagenode.md#children)*

*Defined in [PackageNode.ts:14](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/PackageNode.ts#L14)*

Child nodes inside of a `node_modules` path under this package.

#### Type declaration:

* \[ **packageName**: *string*\]: [IPackageNode](../interfaces/ipackagenode.md)

___

###  dependencies

• **dependencies**: *[IPackageNode](../interfaces/ipackagenode.md)[]* =  []

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[dependencies](../interfaces/ipackagenode.md#dependencies)*

*Defined in [PackageNode.ts:21](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/PackageNode.ts#L21)*

An array of resolved dependencies of this package.

___

###  dependencyResolved

• **dependencyResolved**: *boolean* = false

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[dependencyResolved](../interfaces/ipackagenode.md#dependencyresolved)*

*Defined in [PackageNode.ts:27](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/PackageNode.ts#L27)*

Indicates all dependencies are resolved or not.

**`see`** [validate](packagenode.md#validate)

___

###  id

• **id**: *string*

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[id](../interfaces/ipackagenode.md#id)*

*Defined in [PackageNode.ts:32](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/PackageNode.ts#L32)*

A package's unique id as `{package name}/{package version}` format.

___

###  linked

• **linked**: *boolean* = false

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[linked](../interfaces/ipackagenode.md#linked)*

*Defined in [PackageNode.ts:39](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/PackageNode.ts#L39)*

Indicates this node and it's dependencies are linked or not.
This value is changed as `true` after [linkDependencies](packagenode.md#linkdependencies) call.

**`see`** [linkDependencies](packagenode.md#linkdependencies)

___

###  manifest

• **manifest**: *`IPackageJson`*

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[manifest](../interfaces/ipackagenode.md#manifest)*

*Defined in [PackageNode.ts:45](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/PackageNode.ts#L45)*

Contents of the package.json file of this package.

**`see`** https://ajaxlab.github.io/package-json-type/interfaces/ipackagejson.html 

___

###  name

• **name**: *string*

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[name](../interfaces/ipackagenode.md#name)*

*Defined in [PackageNode.ts:53](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/PackageNode.ts#L53)*

Name of the package.
The name field of package.json.
If the name field of package.json is empty,
directory name of the package will be used.

___

###  parent

• **parent**: *[IPackageNode](../interfaces/ipackagenode.md) | undefined* =  void 0

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[parent](../interfaces/ipackagenode.md#parent)*

*Defined in [PackageNode.ts:61](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/PackageNode.ts#L61)*

An upper directory node of child nodes in a `node_modules` directory.
```
parent1/node_modules/child1
```

___

###  path

• **path**: *string*

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[path](../interfaces/ipackagenode.md#path)*

*Defined in [PackageNode.ts:66](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/PackageNode.ts#L66)*

An absolute path of this node.

___

###  unresolvedDependencies

• **unresolvedDependencies**: *object*

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[unresolvedDependencies](../interfaces/ipackagenode.md#unresolveddependencies)*

*Defined in [PackageNode.ts:72](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/PackageNode.ts#L72)*

An array of dependencies which remain unresolved after dependency resolution try.

**`see`** [linkDependencies](packagenode.md#linkdependencies)

#### Type declaration:

* \[ **packageName**: *string*\]: string

___

###  validated

• **validated**: *boolean* = false

*Implementation of [IPackageNode](../interfaces/ipackagenode.md).[validated](../interfaces/ipackagenode.md#validated)*

*Defined in [PackageNode.ts:80](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/PackageNode.ts#L80)*

Indicates this node is validated.

**`see`** [validate](packagenode.md#validate)

## Methods

### `Private` _mergeDevDependency

▸ **_mergeDevDependency**(): *void*

*Defined in [PackageNode.ts:233](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/PackageNode.ts#L233)*

**Returns:** *void*

___

###  getDependency

▸ **getDependency**(`depName`: string): *[IPackageNode](../interfaces/ipackagenode.md) | void*

*Implementation of [IPackageNode](../interfaces/ipackagenode.md)*

*Defined in [PackageNode.ts:101](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/PackageNode.ts#L101)*

Returns a node with the given name which this node depends on.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`depName` | string | The name of a dependency.  |

**Returns:** *[IPackageNode](../interfaces/ipackagenode.md) | void*

___

###  hasDependency

▸ **hasDependency**(`name`: string, `version?`: undefined | string): *boolean*

*Implementation of [IPackageNode](../interfaces/ipackagenode.md)*

*Defined in [PackageNode.ts:117](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/PackageNode.ts#L117)*

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

*Implementation of [IPackageNode](../interfaces/ipackagenode.md)*

*Defined in [PackageNode.ts:143](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/PackageNode.ts#L143)*

For each unresolved dependencies, this method check if the dependency node exist,
and if it exists and satisfies version then add to [dependencies](packagenode.md#dependencies)
and remove from [unresolvedDependencies](packagenode.md#unresolveddependencies).

If the `package.json` has the `optionalDependencies` and some of it also
exists unresolved dependencies, this method will remove them from
the unresolved dependencies.

**Returns:** *void*

___

###  resolve

▸ **resolve**(`cb`: function, `resolveDevDependency?`: undefined | false | true): *void*

*Defined in [PackageNode.ts:192](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/PackageNode.ts#L192)*

Calls [linkDependencies](packagenode.md#linkdependencies), then calls [validate](packagenode.md#validate)

**Parameters:**

▪ **cb**: *function*

Called when the resolution process for this node has been ended.

▸ (`node`: [IPackageNode](../interfaces/ipackagenode.md), `unresolvedNodeNames?`: string[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [IPackageNode](../interfaces/ipackagenode.md) |
`unresolvedNodeNames?` | string[] |

▪`Optional`  **resolveDevDependency**: *undefined | false | true*

If this value is true this node will resolve `devDependencies` too.

**Returns:** *void*

___

###  toString

▸ **toString**(): *string*

*Defined in [PackageNode.ts:201](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/PackageNode.ts#L201)*

**Returns:** *string*

___

###  validate

▸ **validate**(`cb`: function): *boolean*

*Defined in [PackageNode.ts:209](https://github.com/ajaxlab/walk-package-graph/blob/7dcbf7e/src/PackageNode.ts#L209)*

Validates all of this node's dependencies recursively.

**Parameters:**

▪ **cb**: *function*

▸ (`node`: [IPackageNode](../interfaces/ipackagenode.md), `unresolved?`: string[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [IPackageNode](../interfaces/ipackagenode.md) |
`unresolved?` | string[] |

**Returns:** *boolean*