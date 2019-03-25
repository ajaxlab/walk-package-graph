import { PackageJson } from 'package-json';

export interface IBooleanRecord {
  [key: string]: boolean;
}

export interface IPackageNode {
  dependencies: IPackageNode[];
  dependencyResolved: boolean;  // TODO
  id: string;
  manifest: PackageJson;
  path: string;
  toBeResolved: IBooleanRecord;
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
  onEnd?: IPackageNodeHandler;
  onResolve?: IPackageNodeHandler;
  onVisit?: IPackageNodeHandler;  // TODO
}

export interface IWalkOptions {
  logLevel?: LogLevel;
  stopOnError?: boolean;  // TODO
  visitDuplicateNode?: boolean; // TODO
}

export type IPackageNodeHandler = (packageNode: IPackageNode) => void;

export enum LogLevel {
  error = 0,  // to user
  warn = 1,   // to user
  info = 2,   // to user
  debug = 3,  // to dev
  trace = 3   // to dev
}
