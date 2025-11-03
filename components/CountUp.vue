<template>
  <span>{{ display }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{ to: number; durationMs?: number }>()
const display = ref(0)

onMounted(() => {
  const start = performance.now()
  const from = 0
  const duration = props.durationMs ?? 900
  function step(t: number) {
    const p = Math.min(1, (t - start) / duration)
    const eased = 1 - Math.pow(1 - p, 3)
    display.value = Math.round(from + (props.to - from) * eased)
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
})
</script>


