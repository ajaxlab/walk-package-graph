import { PackageJson } from 'package-json';

export interface IBooleanRecord {
  [key: string]: boolean;
}

export interface IDepsToResolveMap {
  [key: string]: IBooleanRecord;
}

export interface IPackageNode {
  dependencies: IPackageNode[];
  dependencyResolved: boolean;  // TODO
  id: string;
  manifest: PackageJson;
  path: string;
}

export interface IPackageNodeMap {
  [name: string]: IPackageNode[];
}

export interface IReverseDependency {
  [name: string]: {
    [versionRange: string]: IPackageNode[]
  };
}

export interface IWalkHandlers {
  onEnd?: (error?: NodeJS.ErrnoException, rootNode?: IPackageNode) => void;
  onResolve?: (error?: NodeJS.ErrnoException, node?: IPackageNode) => void;
  onVisit?: (error?: NodeJS.ErrnoException, manifest?: PackageJson, path?: string) => void;
}

export interface IWalkOptions {
  logLevel?: LogLevel;
  stopOnError?: boolean;  // TODO
  visitDuplicateNode?: boolean; // TODO
}

export type IPackageResolveHandler = (error?: NodeJS.ErrnoException, node?: IPackageNode) => void;

export type IPackageVisitHandler = (error?: NodeJS.ErrnoException, manifest?: PackageJson, path?: string) => void;

export type IWalkEndHandler = (error?: NodeJS.ErrnoException, rootNode?: IPackageNode) => void;

export enum LogLevel {
  error = 0,  // to user
  warn = 1,   // to user
  info = 2,   // to user
  debug = 3,  // to dev
  trace = 3   // to dev
}
