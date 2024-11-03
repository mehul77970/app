<script setup lang="ts">
import { PgsRenderer } from 'libpgs'
import { getSubtitleStream } from '~/lib/player'

const serverStore = useServerStore()
const playerStore = usePlayerStore()

onMounted(async () => {
  if (!playerStore.subtitle || !playerStore.item?.Id) return

  const subtitleTrack = getSubtitleStream(
    playerStore.subtitle,
    playerStore.item.Id,
  )

  const pgsRenderer = new PgsRenderer({
    workerUrl: '/_nuxt/node_modules/libpgs/dist/libpgs.worker.js',
    video: document.getElementById('video')! as HTMLVideoElement,
    subUrl: `${serverStore.url}${subtitleTrack}`,
  })

  console.log('Created pgsrenderer', pgsRenderer)

  playerStore.subtitleLoading = null
})
</script>
