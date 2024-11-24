import type { VariantDefinition, Options as PropOptions } from '@motionone/dom'

export const contextId = 'motion-state'
export const presenceId = 'motion-presence'
export const prefix = 'oku-motion'

export interface PresenceState {
  initial?: boolean | undefined
}

export interface Options extends PropOptions {
  exit?: VariantDefinition
}
