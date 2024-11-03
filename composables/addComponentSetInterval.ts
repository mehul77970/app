import { getCurrentScope, onScopeDispose } from 'vue'

export function addComponentSetInterval(fn: () => void, time: number) {
  const interval = setInterval(fn, time)

  if (getCurrentScope()) {
    onScopeDispose(() => clearInterval(interval))
  }
}
