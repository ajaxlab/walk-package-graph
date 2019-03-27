import { PackageJson } from 'package-json';

export interface IBooleanRecord {
  [key: string]: boolean;
}

export interface IDepsToResolveMap {
  [key: string]: IBooleanRecord;
}

export interface IPackageNode {
  children: {
    [name: string]: IPackageNode
  };
  dependencies: IPackageNode[];
  dependencyResolved: boolean;  // TODO
  id: string;
  manifest: PackageJson;
  parent: IPackageNode | undefined;
  path: string;
  validate: (cb?: (node: IPackageNode, unresolved?: string[]) => void) => void;
}

export interface IPackageNodeMap {
  [name: string]: IPackageNode[];
}

export interface IReverseDependency {
  [name: string]: {
    [versionRange: string]: IPackageNode[]
  };
}

export interface IStringRecord {
  [key: string]: string;
}

export interface IWalkHandlers {
  onEnd?: (rootNode?: IPackageNode) => void;
  onError?: (error: NodeJS.ErrnoException, path: string) => void;
  onResolve?: (node: IPackageNode) => void;
  onVisit?: (node: IPackageNode) => void;
}

export interface IWalkOptions {
  logLevel?: LogLevel;
  stopOnError?: boolean;  // TODO
  visitDuplicateNode?: boolean; // TODO
}

export type IPackageResolveHandler = (node: IPackageNode) => void;

export type IPackageVisitHandler = (node: IPackageNode) => void;

export type IWalkEndHandler = (rootNode?: IPackageNode) => void;

export type IWalkErrorHandler = (error: NodeJS.ErrnoException, path: string) => void;

export enum LogLevel {
  error = 0,  // to user
  warn = 1,   // to user
  info = 2,   // to user
  debug = 3,  // to dev
  trace = 3   // to dev
}
