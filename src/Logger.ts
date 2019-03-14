/* tslint:disable: no-console */

import { LogLevel } from './types';

class Logger {

  level: LogLevel;

  constructor(level?: LogLevel) {
    this.level = typeof level === 'undefined'
      ? LogLevel.info : level;
  }

  debug(...args: any) {
    if (this.level >= LogLevel.debug) {
      console.debug(...args);
    }
  }

  error(...args: any) {
    if (this.level >= LogLevel.error) {
      console.error(...args);
    }
  }

  info(...args: any) {
    if (this.level >= LogLevel.info) {
      console.info(...args);
    }
  }

  trace(...args: any) {
    if (this.level >= LogLevel.trace) {
      console.trace(...args);
    }
  }

  warn(...args: any) {
    if (this.level >= LogLevel.warn) {
      console.warn(...args);
    }
  }
}

export default Logger;
