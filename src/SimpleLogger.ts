export class SimpleLogger {
  private loggerID = Math.random()
  .toString(32)
  .slice(2, 6);

  constructor(private prefix: string, private debug: boolean) {}

  private getLogString() {
    return `🌟 react-admin-import-csv:: ${this.prefix} [${this.loggerID}] `;
  }
  
  public get log() {
    if (!this.debug) {
      return (...any) => {};
    }
    const boundLogFn: (...any) => void = console.log.bind(
      console,
      this.getLogString()
    );
    return boundLogFn;
  }

  public get warn() {
    if (!this.debug) {
      return (...any) => {};
    }
    const boundLogFn: (...any) => void = console.warn.bind(
      console,
      this.getLogString()
    );
    return boundLogFn;
  }

  public get error() {
    if (!this.debug) {
      return (...any) => {};
    }
    const boundLogFn: (...any) => void = console.error.bind(
      console,
      this.getLogString()
    );
    return boundLogFn;
  }

  setEnabled(logging: boolean) {
    this.debug = logging;
  }
}
