<template>
  <section class="section" style="padding:32px 0 60px">
    <div class="container">
      <h1 style="margin:0 0 12px;font-weight:900">Наши годы и подарки</h1>
      <p class="muted" style="margin:0 0 20px">Выбирай кружок с номером года. Внутри — наши купоны на каждый месяц этого года.</p>

      <div class="timeline">
        <div class="timeline__line"></div>
        <button v-for="y in years" :key="y.index" class="timeline__dot"
                :class="{ active: y.index === activeYear, locked: lockedYears.includes(y.index) }"
                @click="activeYear = y.index">
          <span v-if="lockedYears.includes(y.index)" aria-label="locked">🔒</span>
          <span v-else>{{ y.index + 1 }}</span>
        </button>
      </div>

      <div class="card" style="padding:16px;margin-top:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <div style="font-weight:700">Год #{{ activeYear + 1 }}</div>
          <div class="muted" style="font-size:13px">{{ years[activeYear]?.label }}</div>
        </div>
        <div class="card" style="padding:14px;margin-bottom:12px">
          <div style="font-weight:600;margin-bottom:6px">Письмо в этот год</div>
          <div class="muted" style="white-space:pre-wrap">{{ yearLetter }}</div>
        </div>
        <div v-if="isLockedActive" class="card" style="padding:14px">
          <div>Этот год пока закрыт 🔒. Любовь растёт — откроется, когда придёт время.</div>
        </div>
        <div v-else style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
          <div v-for="c in yearCoupons" :key="c.key" class="card" style="padding:12px;display:flex;flex-direction:column;gap:8px">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div style="font-weight:700">Месяц #{{ c.monthInYear }}</div>
              <div class="muted" style="font-size:12px">{{ c.label }}</div>
            </div>
            <div>{{ c.text }}</div>
            <button class="btn-primary" :style="{opacity: c.claimed ? .6 : 1}" @click="toggleClaim(c)">
              {{ c.claimed ? 'Получен ✔' : 'Получить' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { anniversaryConfig as config } from '@/content/config'
import { getRelationshipMetrics, diffInDays } from '@/utils/time'

type YearInfo = { index: number; label: string }
type Coupon = { key: string; monthIndex: number; monthInYear: number; yearIndex: number; label: string; text: string; claimed: boolean }
const years = ref<YearInfo[]>([])
const activeYear = ref(0)
const yearCoupons = ref<Coupon[]>([])
const lockedYears = ref<number[]>([1, 2])
const isLockedActive = computed(() => lockedYears.value.includes(activeYear.value))
const yearLetter = computed(() => {
  const idx = Math.min((config.lettersByYear?.length ?? 1) - 1, activeYear.value)
  return (config.lettersByYear && config.lettersByYear[idx])
    || 'Этот год — ещё одна глава нашей истории. Спасибо, что ты — мой дом.'
})

function storageKey(yearIndex:number, monthInYear:number) {
  return `coupon-claimed-${config.startDate}-y${yearIndex}-m${monthInYear}`
}

function buildYears() {
  const metrics = getRelationshipMetrics(config.startDate)
  const totalYears = metrics.yearsCompleted + 1 // включаем текущий незавершённый год
  const start = new Date(config.startDate)
  years.value = Array.from({ length: totalYears }, (_, i) => {
    const labelDate = new Date(start)
    labelDate.setFullYear(start.getFullYear() + i)
    return { index: i, label: labelDate.getFullYear().toString() }
  })
  activeYear.value = years.value.length - 1
}

function buildYearCoupons() {
  const start = new Date(config.startDate)
  const now = new Date()
  const y = activeYear.value
  const yearStart = new Date(start)
  yearStart.setFullYear(start.getFullYear() + y)
  const monthsInThisYear = y === years.value.length - 1
    ? (new Date(now.getFullYear(), now.getMonth(), 1).getMonth() - new Date(yearStart.getFullYear(), yearStart.getMonth(), 1).getMonth() + 1)
    : 12
  const list: Coupon[] = []
  const months = Math.max(1, Math.min(12, monthsInThisYear))
  for (let m = 0; m < months; m++) {
    const globalMonthIndex = (y * 12) + m
    const text = config.coupons[globalMonthIndex % config.coupons.length]
    const dt = new Date(yearStart.getFullYear(), yearStart.getMonth() + m, 1)
    const label = dt.toLocaleDateString(undefined, { month: 'long' })
    const key = storageKey(y, m + 1)
    const claimed = typeof window !== 'undefined' ? localStorage.getItem(key) === '1' : false
    list.push({ key, monthIndex: globalMonthIndex, monthInYear: m + 1, yearIndex: y, label, text, claimed })
  }
  yearCoupons.value = list.reverse()
}

function toggleClaim(c: Coupon) {
  c.claimed = !c.claimed
  if (c.claimed) localStorage.setItem(c.key, '1')
  else localStorage.removeItem(c.key)
}

onMounted(() => { buildYears(); buildYearCoupons() })
watch(activeYear, buildYearCoupons)
</script>

<style scoped>
.timeline {
  position: relative;
  display: flex;
  gap: 22px;
  align-items: center;
  overflow-x: auto;
  padding: 12px 6px;
}
.timeline__line {
  position: absolute;
  left: 0; right: 0; top: 50%;
  height: 2px;
  background: rgba(255,255,255,.18);
  transform: translateY(-50%);
}
.timeline__dot {
  position: relative;
  z-index: 1;
  width: 44px; height: 44px;
  border-radius: 999px;
  border: 2px solid rgba(255,255,255,.25);
  background: #1a1a22;
  color: #fff;
  display: inline-flex;
  align-items: center; justify-content: center;
  cursor: pointer;
}
.timeline__dot.active {
  border-color: var(--rose);
  box-shadow: 0 0 0 4px rgba(255,77,109,.15);
}
.timeline__dot.locked {
  border-color: rgba(255,255,255,.18);
  background: #101016;
  color: #bbb;
}

@media (max-width: 900px) {
  div[style*="grid-template-columns:repeat(3,1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
}
@media (max-width: 620px) {
  div[style*="grid-template-columns:repeat(3,1fr)"] { grid-template-columns: 1fr !important; }
}
</style>


