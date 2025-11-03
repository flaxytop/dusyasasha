<template>
  <section class="section" style="padding:32px 0 60px">
    <div class="container">
      <h1 style="margin:0 0 12px;font-weight:900">Наша Галерея</h1>

      <div v-if="files.length === 0" class="card" style="padding:18px">
        <div>Пока здесь пусто. Помести ваши снимки в</div>
      </div>

      <div v-else class="masonry">
        <div v-for="(ph, i) in files" :key="i" class="masonry-item">
          <div style="position:relative;cursor:pointer" @click="open(i)" :title="formatDate(ph.mtime)">
            <img :src="ph.url" :alt="ph.name || `Фото ${i+1}`" loading="lazy" />
            <div class="overlay-date">{{ formatDate(ph.mtime) }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <div v-if="lightboxOpen" class="lb" @click.self="close">
    <button class="btn" @click="close">Закрыть ✕</button>
    <button class="nav prev" @click.stop="prev">‹</button>
    <img :src="files[current]?.url" :alt="files[current]?.name || ''" />
    <button class="nav next" @click.stop="next">›</button>
  </div>
</template>

<script setup lang="ts">
import { memories } from '@/content/memories'
import { galleryPhotos } from '@/content/photos'
type Photo = { url: string; name?: string; mtime?: string }
const files = ref<Photo[]>([])
const lightboxOpen = ref(false)
const current = ref(0)

onMounted(() => {
  const fromMemories = (memories || []).map((m) => ({ url: m.image || '', name: m.title })).filter(p => !!p.url)
  const fromPhotos = (galleryPhotos || []).map((u) => ({ url: u, name: u.split('/').pop() }))
  const seen = new Set<string>()
  const combined: Photo[] = []
  for (const p of [...fromPhotos, ...fromMemories]) {
    if (!p.url || seen.has(p.url)) continue
    seen.add(p.url)
    combined.push(p)
  }
  files.value = combined
})

function open(i:number) { current.value = i; lightboxOpen.value = true }
function close() { lightboxOpen.value = false }
function next() { current.value = (current.value + 1) % files.value.length }
function prev() { current.value = (current.value - 1 + files.value.length) % files.value.length }
function formatDate(iso?: string) { return iso ? new Date(iso).toLocaleDateString() : '' }
</script>

<style scoped>
.overlay-date {
  position: absolute; left: 8px; bottom: 8px; padding: 4px 8px;
  font-size: 12px; color: #fff; background: rgba(0,0,0,.45); border-radius: 8px;
  opacity: 0; transition: opacity .15s ease;
}
.masonry-item div:hover .overlay-date { opacity: 1; }
.lb {
  position: fixed; inset: 0; z-index: 50; background: rgba(0,0,0,.88);
  display: flex; align-items: center; justify-content: center;
}
.lb img { max-width: 92vw; max-height: 88vh; border-radius: 12px; }
.lb .btn {
  position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,.15); color: #fff;
  border: none; border-radius: 10px; padding: 8px 10px; cursor: pointer;
}
.lb .nav {
  position: absolute; top: 50%; transform: translateY(-50%);
  background: rgba(255,255,255,.15); color: #fff; border: none; border-radius: 10px; padding: 10px 12px; cursor: pointer;
}
.lb .nav.prev { left: 16px; }
.lb .nav.next { right: 16px; }
</style>




