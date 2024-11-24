import type {
  ScheduledTasksInfoMessage,
  WebSocketMessage,
} from '@jellyfin/sdk/lib/generated-client'
import EventEmitter from 'eventemitter3'

enum SocketStates {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}

const _bus = new EventEmitter()
export const useSocketStore = defineStore('socket', {
  state: () => ({
    socket: null as WebSocket | null,
    status: SocketStates.CLOSED as SocketStates,
  }),
  getters: {
    bus: () => _bus,
    _log: () => useLoggerStore(),
  },
  actions: {
    async connectToSocket() {
      const server = useServerStore()
      const auth = useAuthenticationStore()

      this.socket = new WebSocket(
        `${server.url}/socket?api_key=${auth._header.authorization}&deviceId=${auth._header.deviceID}`,
      )

      this.status = SocketStates.CONNECTING

      this.socket.onopen = () => {
        this._log.$log({
          location: 'SocketStore',
          message: `Socket connected at ${new Date()}`,
        })

        this.status = SocketStates.OPEN
        this.sendCapabilites()
      }

      this.socket.onclose = (ev) => {
        this._log.$log({
          type: 'warn',
          location: 'SocketStore',
          message: `Socket disconnected`,
          optionalParams: [ev],
        })
      }

      this.socket.onerror = (ev) => {
        this._log.$log({
          type: 'error',
          location: 'SocketStore',
          message: `Socket experienced an error`,
          optionalParams: [ev],
        })
      }

      this.socket.onmessage = (ev: MessageEvent) => {
        const messageRaw = ev.data as string
        const message = JSON.parse(messageRaw) as WebSocketMessage

        switch (message.MessageType) {
          case 'ForceKeepAlive':
            this.startKeepAlive(message.Data)
            break
          case 'ScheduledTasksInfo':
            this.bus.emit(
              'ScheduledTasksInfo',
              message as ScheduledTasksInfoMessage,
            )
            break
        }
      }
    },

    disconnectSocket() {
      this.socket?.close()
    },
    sendCapabilites() {
      if (this.status !== SocketStates.OPEN) return
      this.sendSocket({
        MessageType: 'ScheduledTasksInfoStart',
        Data: '1000,1000',
      })
    },
    startKeepAlive(seconds: number = 30) {
      this._log.$log({
        location: 'SocketStore',
        message: `Starting KeepAlive to ping every ${seconds}s`,
      })

      const keepAlive = setInterval(() => {
        if (this.status !== SocketStates.OPEN) {
          console.warn(
            `[SocketStore] Keep Alive will be stopped because there is no active connection`,
          )
          return clearInterval(keepAlive)
        }

        this.sendSocket({
          MessageType: 'KeepAlive',
        })
      }, seconds * 1000)
    },

    sendSocket(t: unknown) {
      if (this.status !== SocketStates.OPEN) return

      this._log.$log({
        location: 'SocketStore',
        message: `Sending socket data`,
        optionalParams: [t],
      })
      this.socket?.send(JSON.stringify(t))
    },
  },
  persist: false,
})
