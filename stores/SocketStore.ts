import EventEmitter from 'eventemitter3'
import type {
  WebSocketMessage,
  ScheduledTasksInfoMessage,
} from '@jellyfin/sdk/lib/generated-client'

enum SocketStates {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}

export const useSocketStore = defineStore('socket', {
  state: () => ({
    socket: null as WebSocket | null,
    status: SocketStates.CLOSED as SocketStates,
    bus: new EventEmitter(),
  }),

  actions: {
    async connectToSocket() {
      const server = useServerStore()
      const auth = useAuthenticationStore()

      this.socket = new WebSocket(
        `${server.url}/socket?api_key=${auth._header.authorization}&deviceId=${auth._header.deviceID}`,
      )

      this.status = SocketStates.CONNECTING

      this.socket.onopen = () => {
        console.log(`[SocketStore] Socket connected at ${new Date()}`)

        this.status = SocketStates.OPEN
        this.sendCapabilites()
      }

      this.socket.onclose = (ev) => {
        console.log(`[SocketStore] Socket disconnected`, ev)
      }

      this.socket.onerror = (ev) => {
        console.error('[SocketStore] Socket experienced an error', ev)
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
      if (this.status != SocketStates.OPEN) return
      this.sendSocket({
        MessageType: 'ScheduledTasksInfoStart',
        Data: '1000,1000',
      })
    },
    startKeepAlive(seconds: number = 30) {
      console.log(`[SocketStore] Starting KeepAlive to ping every ${seconds}s`)
      const keepAlive = setInterval(() => {
        if (this.status != SocketStates.OPEN) {
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
      if (this.status != SocketStates.OPEN) return

      console.log('[SocketStore] Sending Socket', t)
      this.socket?.send(JSON.stringify(t))
    },
  },
})
