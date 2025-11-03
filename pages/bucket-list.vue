<template>
  <section class="section" style="padding:32px 0 60px">
    <div class="container">
      <h1 style="margin:0 0 12px;font-weight:900">Наш список желаний</h1>
      <p class="muted" style="margin:0 0 20px">Идеи для свиданий и маленьких приключений. Отмечай выполненные — они сохранятся на этом устройстве.</p>

      <div class="card" style="padding:16px">
        <div v-for="item in items" :key="item.key" style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06)">
          <input type="checkbox" :checked="item.done" @change="toggle(item)" />
          <div :style="{opacity: item.done ? .6 : 1, textDecoration: item.done ? 'line-through' : 'none'}">{{ item.text }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const defaultItems = [
  'Закат на берегу/видовой точке',
  'Пикник с твоими любимыми вкусняшками',
  'Фото-день — делаем 20 снимков',
  'Вечер прогулки без телефонов',
  'Совместный кулинарный эксперимент',
  'Письма друг другу и чай',
  'Повторить наше первое свидание',
]

type Item = { key: string; text: string; done: boolean }
const items = ref<Item[]>([])

function load() {
  const saved = typeof window !== 'undefined' ? localStorage.getItem('bucket-list') : null
  const states: Record<string, boolean> = saved ? JSON.parse(saved) : {}
  items.value = defaultItems.map((t, i) => ({ key: `b-${i}`, text: t, done: !!states[`b-${i}`] }))
}

function save() {
  const states: Record<string, boolean> = {}
  for (const it of items.value) states[it.key] = it.done
  localStorage.setItem('bucket-list', JSON.stringify(states))
}

function toggle(item: Item) {
  item.done = !item.done
  save()
}

onMounted(load)
</script>

<style scoped>
input[type="checkbox"] {
  width: 18px; height: 18px;
  accent-color: #ff4d6d;
}
</style>


