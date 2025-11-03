<template>
  <div ref="el" style="width:100%;height:60vh;border-radius:12px;overflow:hidden" />
</template>

<script setup lang="ts">
import type { MemoryPoint } from '@/content/memories'

const props = defineProps<{ center: { lat:number; lng:number }, zoom?: number, points: MemoryPoint[] }>()
const el = ref<HTMLDivElement|null>(null)
let map: any = null

onMounted(async () => {
  if (!el.value) return
  const Lmod = await import('leaflet')
  const L = (Lmod as any).default || Lmod

  map = L.map(el.value).setView([props.center.lat, props.center.lng], props.zoom ?? 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map)

  const markerIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
  })

  for (const p of props.points) {
    const m = L.marker([p.lat, p.lng], { icon: markerIcon })
    const date = p.date ? new Date(p.date).toLocaleDateString() : ''
    const chosen = p.image
    const img = chosen ? `<div style="margin-top:8px"><img src="${chosen}" alt="${p.title}" style="max-width:220px;max-height:160px;border-radius:8px;display:block" /></div>` : ''
    const dateHtml = date ? `<div class="muted" style="font-size:12px">${date}</div>` : ''
    const html = `<div style="min-width:200px"><div style="font-weight:700;margin-bottom:4px">${p.title}</div>${dateHtml}<div style="margin-top:6px">${p.text ?? ''}</div>${img}</div>`
    m.bindPopup(html)
    m.addTo(map)
  }
})

onBeforeUnmount(() => { if (map) map.remove() })
</script>


