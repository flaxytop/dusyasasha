<template>
  <span>{{ visible }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{ text: string; speed?: number; loop?: boolean }>()
const visible = ref('')
let idx = 0
let timer: number | null = null

function tick() {
  visible.value = props.text.slice(0, idx)
  idx++
  if (idx <= props.text.length) {
    timer = window.setTimeout(tick, props.speed ?? 45)
  } else if (props.loop) {
    timer = window.setTimeout(() => { idx = 0; tick() }, 1400)
  }
}

onMounted(() => { idx = 0; tick() })
onBeforeUnmount(() => { if (timer) window.clearTimeout(timer) })
</script>


