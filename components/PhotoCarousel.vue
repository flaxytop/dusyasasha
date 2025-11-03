<template>
  <div class="card shine" :style="wrapperStyle">
    <div :style="frameStyle">
      <div :style="trackStyle" style="display:flex;transition:transform .6s ease">
        <img v-for="(img, i) in images" :key="i" :src="img" :alt="`Фото ${i+1}`"
             :style="imageStyle" />
      </div>
    </div>
    <div style="display:flex;gap:6px;justify-content:center;margin-top:10px">
      <button v-for="(img, i) in images" :key="`dot-${i}`" @click="go(i)"
              :style="{width:'8px',height:'8px',borderRadius:'999px',border:'none',cursor:'pointer',background: i===index ? 'var(--rose)' : 'rgba(255,255,255,.25)'}" />
    </div>
  </div>
  
  
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{ images: string[]; auto?: boolean; intervalMs?: number; fullScreenMobile?: boolean }>()
const index = ref(0)
const timer = ref<number | null>(null)

function go(i:number) { index.value = i }

const trackStyle = computed(() => ({ transform: `translateX(-${index.value * 100}%)` }))

const isMobile = computed(() => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 720px)').matches)
const wrapperStyle = computed(() => ({ position:'relative', padding: props.fullScreenMobile && isMobile.value ? '0' : '14px' }))
const frameStyle = computed(() => ({ overflow:'hidden', borderRadius: props.fullScreenMobile && isMobile.value ? '0' : '12px', height: props.fullScreenMobile && isMobile.value ? '100vh' : 'auto' }))
const imageStyle = computed(() => ({ width:'100%', flex:'0 0 100%', objectFit:'cover', maxHeight: props.fullScreenMobile && isMobile.value ? 'none' : '520px', height: props.fullScreenMobile && isMobile.value ? '100vh' : 'auto', display:'block' }))

onMounted(() => {
  if (props.auto !== false) {
    timer.value = window.setInterval(() => {
      index.value = (index.value + 1) % (props.images?.length || 1)
    }, props.intervalMs ?? 3000)
  }
})

onBeforeUnmount(() => {
  if (timer.value) window.clearInterval(timer.value)
})

watch(() => props.images, () => { index.value = 0 })
</script>


