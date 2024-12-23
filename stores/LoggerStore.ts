import { defineStore } from 'pinia'
import type { ILogObj, Logger } from 'tslog'

let ssrLogger: Logger<ILogObj> | undefined
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

if (import.meta.server && !ssrLogger) {
  import('tslog').then((mod) => {
    ssrLogger = new mod.Logger({ hideLogPositionForProduction: true })
  })
}
export interface Log {
  type?: LogLevel
  location?: string
  message?: unknown
  optionalParams?: unknown[]
}

export const useLoggerStore = defineStore('logger', {
  state: () => ({
    DEBUG: useNuxtApp().$config.public.debug,

    logToConsole: true, // TODO: make user option
    logs: [],
  }),

  actions: {
    $formatConsoleLog(log: Log): string[] {
      let color = [] as string[]

      switch (log.type) {
        case 'debug':
          color = [
            'color: #c792ea;',
            'color: white;',
            'color: #808080;',
            'color: white;',
          ]
          break
        case 'info':
          color = [
            'color: #c792ea;',
            'color: white;',
            'color: #82aaff;',
            'color: white;',
          ]
          break
        case 'warn':
          color = [
            'color: #c792ea;',
            'color: white;',
            'color: #ffcb6b;',
            'color: white;',
          ]
          break
        case 'error':
          color = [
            'color: #c792ea;',
            'color: white;',
            'color: #ff756b;',
            'color: white;',
          ]
          break
        default:
          color = [
            'color: #c792ea;',
            'color: white;',
            'color: #d1d0d0;',
            'color: white;',
          ]
          break
      }
      return color
    },

    $log(log: Log): void {
      if (import.meta.server && ssrLogger && this.DEBUG) {
        const message = `${log.location ?? 'No Location'} -> ${log.message ?? 'No Message'}`

        switch (log.type) {
          case 'debug':
            ssrLogger.debug(message, log.optionalParams ?? '')
            break
          case 'info':
            ssrLogger.info(message, log.optionalParams ?? '')
            break
          case 'warn':
            ssrLogger.warn(message, log.optionalParams ?? '')
            break
          case 'error':
            ssrLogger.error(message, log.optionalParams ?? '')
            break
        }

        return
      }
      const logFormatted = this.$formatConsoleLog(log)

      if (!this.logToConsole) return

      if (import.meta.dev) {
        console.trace(
          `%c[${log.location ?? 'Location Unspecified'}]:%c %c${log.message ?? 'No Message'}%c`,
          ...logFormatted,
          ...(log.optionalParams || ''),
        )
        return
      }

      console.log(
        `%c[${log.location ?? 'Location Unspecified'}]:%c %c${log.message ?? 'No Message'}%c`,
        ...logFormatted,
        ...(log.optionalParams || ''),
      )
    },
  },
})
