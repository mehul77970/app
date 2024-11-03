export class Logger {
  name: string;

  constructor(name: string | undefined = "Logger") {
    this.name = name;
  }

  /**
   * Logs a message to the console, formatted as a styled string.
   *
   * @param {LogMessages} logs - The log message to be formatted and logged.
   * @return {void} This function does not return anything.
   * @example
   * Logger.log({
   *   "[Test]": "color: red",
   *   "Hello from console": "color: white",
   * })
   */
  log(...logs: unknown[]): void {
    console.log(this.name + " ->", ...logs);
  }
}
