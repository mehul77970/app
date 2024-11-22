<script setup lang="ts">
import {
  inject,
  onMounted,
  onUpdated,
  provide,
  ref,
} from 'vue'
import { createMotionState, createStyles, style } from '@motionone/dom'

import type { PresenceState, Options } from './context'
import { contextId, presenceId } from './context'

const props = withDefaults(defineProps<Options>(), {})

let unmount: undefined | (() => void)
const root = ref<Element | null>(null)
const parentState = inject(contextId, undefined)
const presenceState = inject(presenceId, undefined) as
  | PresenceState
  | undefined

const state = createMotionState(
  presenceState?.initial === false
    ? {
        ...props, initial: false,
      }
    : props,
  parentState,
)

function updateState() {
  state.update(props)
}

provide(contextId, state)

onMounted(() => {
  unmount = state.mount(root.value!)
  updateState()
})

let manuallyAppliedMotionStyles = false
onUpdated(() => {
  /**
   * Vue reapplies all styles every render, rather than diffing and
   * only reapplying the ones that change. This means that initially
   * calculated motion styles also get reapplied every render, leading
   * to incorrect animation origins.
   *
   * To prevent this, once an element is mounted we hand over these
   * styles to Motion. This will currently still lead to a jump if interrupting
   * transforms in browsers where the number polyfill is used.
   */
  if (!manuallyAppliedMotionStyles && root.value) {
    manuallyAppliedMotionStyles = true

    const styles = createStyles(state.getTarget())
    for (const key in styles)
      style.set(root.value, key, styles[key])
  }

  updateState()
})

onBeforeUnmount(() => {
  if (state && props.exit && root.value) {
    state.setActive('exit', true)
    // @ts-expect-error This technically doesn't exist
    root.value?.addEventListener('motioncomplete', unmount)
  }
})
const initialStyles = createStyles(state.getTarget())
</script>

<template>
  <div
    ref="root"
    :style="state.isMounted()
      ? style
      : { ...style, ...initialStyles }"
  >
    <slot />
  </div>
</template>
