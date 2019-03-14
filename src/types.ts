import { PackageJson } from 'package-json';

export interface IBooleanRecord {
  [key: string]: boolean;
}

export interface IPackageNode {
  dependencies: IPackageNode[];
  dependencyResolved: boolean;
  id: string;
  manifest: PackageJson;
}

export interface IPackageNodeMap {
  [path: string]: IPackageNode;
}

export interface IWalkHandlers {
  onComplete?: IPackageNodeHandler;
  onVisit?: IPackageNodeHandler;
}

export interface IWalkOptions {
  logLevel?: LogLevel;
  stopOnError?: boolean;
}

export type IPackageNodeHandler = (packageNode: IPackageNode) => void;

export enum LogLevel {
  error = 0,  // to user
  warn = 1,   // to user
  info = 2,   // to user
  debug = 3,  // to dev
  trace = 3   // to dev
}
