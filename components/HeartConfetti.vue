<template>
  <canvas ref="canvas" class="floating-hearts" aria-hidden="true"></canvas>
  
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let raf = 0
const hearts: Array<{x:number;y:number;size:number;speed:number;phase:number;color:string}> = []

function resize() {
  if (!canvas.value) return
  const dpr = Math.max(1, window.devicePixelRatio || 1)
  const { clientWidth: w, clientHeight: h } = canvas.value
  canvas.value.width = Math.floor(w * dpr)
  canvas.value.height = Math.floor(h * dpr)
  ctx = canvas.value.getContext('2d')
  if (ctx) ctx.scale(dpr, dpr)
}

function drawHeart(x:number, y:number, size:number, color:string) {
  if (!ctx) return
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(size, size)
  ctx.beginPath()
  // simple bezier heart
  ctx.moveTo(0, -2)
  ctx.bezierCurveTo(2, -4, 6, -1, 0, 4)
  ctx.bezierCurveTo(-6, -1, -2, -4, 0, -2)
  ctx.closePath()
  const grad = ctx.createLinearGradient(-3,-4,3,4)
  grad.addColorStop(0, color)
  grad.addColorStop(1, '#ffffff20')
  ctx.fillStyle = grad
  ctx.fill()
  ctx.restore()
}

function loop() {
  if (!ctx || !canvas.value) return
  const w = canvas.value.clientWidth
  const h = canvas.value.clientHeight
  ctx.clearRect(0,0,w,h)
  if (hearts.length < 40) {
    hearts.push({
      x: Math.random()*w,
      y: h + Math.random()*100,
      size: 0.6 + Math.random()*0.8,
      speed: 0.3 + Math.random()*0.8,
      phase: Math.random()*Math.PI*2,
      color: Math.random() > 0.5 ? '#ff4d6d' : '#ff6b81'
    })
  }
  for (const heart of hearts) {
    heart.phase += 0.02
    heart.y -= heart.speed
    heart.x += Math.sin(heart.phase) * 0.6
    drawHeart(heart.x, heart.y, heart.size, heart.color)
  }
  for (let i = hearts.length - 1; i >= 0; i--) {
    if (hearts[i].y < -20) hearts.splice(i,1)
  }
  raf = requestAnimationFrame(loop)
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
  raf = requestAnimationFrame(loop)
  window.addEventListener('click', (e) => {
    const w = window.innerWidth
    const h = window.innerHeight
    const count = 14
    for (let i = 0; i < count; i++) {
      hearts.push({
        x: e.clientX + (Math.random()*30-15),
        y: e.clientY + (Math.random()*30-15),
        size: 0.5 + Math.random()*0.7,
        speed: 0.8 + Math.random()*1.2,
        phase: Math.random()*Math.PI*2,
        color: Math.random() > 0.5 ? '#ff4d6d' : '#ff6b81'
      })
    }
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  cancelAnimationFrame(raf)
  window.removeEventListener('click', () => {})
})
</script>


