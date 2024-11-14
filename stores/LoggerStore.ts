import { defineStore } from "pinia";

type LogLevel = "debug" | "info" | "warn" | "error";

export interface Log {
  type?: LogLevel;
  location?: string;
  message?: unknown;
  optionalParams?: unknown[];
}

export const useLoggerStore = defineStore("logger", {
  state: () => ({
    logToConsole: import.meta.env.DEV,
    logs: [],
  }),

  actions: {
    $formatConsoleLog(log: Log): string[] {
      let color = [] as string[];

      switch (log.type) {
        case "debug":
          color = [
            "color: #c792ea;",
            "color: white;",
            "color: #808080;",
            "color: white;",
          ];
          break;
        case "info":
          color = [
            "color: #c792ea;",
            "color: white;",
            "color: #82aaff;",
            "color: white;",
          ];
          break;
        case "warn":
          color = [
            "color: #c792ea;",
            "color: white;",
            "color: #ffcb6b;",
            "color: white;",
          ];
          break;
        case "error":
          color = [
            "color: #c792ea;",
            "color: white;",
            "color: #ff756b;",
            "color: white;",
          ];
          break;
        default:
          color = [
            "color: #c792ea;",
            "color: white;",
            "color: #d1d0d0;",
            "color: white;",
          ];
          break;
      }
      return color;
    },

    $log(log: Log): void {
      const logFormatted = this.$formatConsoleLog(log);

      if (this.logToConsole) {
        console.trace(
          `%c[${log.location}]:%c %c${log.message}%c`,
          ...logFormatted,
          ...(log.optionalParams || ""),
        );
      }
    },
  },
});
