export function waitUntil(ref: Ref<boolean>, cb: () => void) {
    if (ref.value) return cb()

    watch(ref, (r) => {
        if (r) cb()
    })
}