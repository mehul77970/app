import { getCurrentScope, onScopeDispose } from 'vue'

export function addComponentEventListener(
  target: HTMLElement | Document | Window,
  name: string,
  fn: (...params: unknown[]) => void,
) {
  target.addEventListener(name, fn)
  if (getCurrentScope()) {
    onScopeDispose(() => target.removeEventListener(name, fn))
  }
}
