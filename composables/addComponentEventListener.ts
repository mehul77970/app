import { getCurrentScope, onScopeDispose } from 'vue'

export function addComponentEventListener(
  target: HTMLElement | Document | Window,
  name: string,
  fn: (...params: unknown[]) => void,
  { once } = { once: false },
) {
  const rmListener = () => target.removeEventListener(name, fn)
  target.addEventListener(name, fn)

  if (once) target.addEventListener(name, rmListener)

  if (getCurrentScope()) {
    onScopeDispose(() => target.removeEventListener(name, fn))
  }
}
