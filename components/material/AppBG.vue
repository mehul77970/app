<script setup lang="ts">
import type { Scheme } from '~/lib/material'
import { hexFromArgb } from '~/lib/material'

const s = inject('scheme') as Scheme | undefined

const { color } = defineProps<{
  color: string
}>()

watch(toRef(s), (scheme) => {
  if (!window || !scheme) return

  // @ts-expect-error Unknown key
  document.body.style.backgroundColor = hexFromArgb(scheme[color])
})

onUnmounted(() => {
  document.body.style.backgroundColor = ''
})
</script>
