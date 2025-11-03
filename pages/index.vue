<template>
  <div>
    <HeartConfetti />
    <section class="section" style="padding:60px 0 30px">
      <div class="container hero-grid" style="display:grid;gap:28px;align-items:center;grid-template-columns:1.2fr .8fr">
        <div>
          <h1 v-reveal style="font-size:44px;line-height:1.05;margin:0 0 10px;font-weight:900">
            <span style="background:linear-gradient(90deg,var(--rose),var(--accent));-webkit-background-clip:text;background-clip:text;color:transparent">
              <TypewriterText text="С Годовщиной, любимая!" />
            </span>
          </h1>
          <p v-reveal class="muted" style="font-size:18px;margin:0 0 16px">
            Сегодня наш особенный день. Спасибо за каждый взгляд, смех и объятие.
            Мы вместе уже <strong><CountUp :to="together" /></strong> дней 
          </p>
          <p style="opacity:.9;margin:0 0 18px">“{{ config.quote }}”</p>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <NuxtLink to="/gallery" class="btn-primary">Наша Галерея</NuxtLink>
            <a href="#letter" class="muted" style="text-decoration:none;padding:14px 12px">Письмо для тебя</a>
            <NuxtLink to="/coupons" class="muted" style="text-decoration:none;padding:14px 12px">Купоны</NuxtLink>
            <NuxtLink to="/map" class="muted" style="text-decoration:none;padding:14px 12px">Карта</NuxtLink>
          </div>
        </div>
        <div v-reveal>
          <PhotoCarousel :images="heroImages" :fullScreenMobile="true" />
        </div>
      </div>
    </section>

    <section class="section" style="padding:0 0 30px">
      <div class="container">
        <div v-reveal class="card" style="padding:22px">
          <h2 style="margin:0 0 10px">Наш путь</h2>
          <div class="muted" style="margin:0 0 10px">
            Вместе: <strong>{{ metrics.yearsCompleted }}</strong> лет, <strong>{{ metrics.monthsSinceStart }}</strong> месяцев, <strong>{{ metrics.daysSinceStart }}</strong> дней
          </div>
          <div class="progress" aria-label="Прогресс до следующей годовщины">
            <div class="progress__bar" :style="{ width: metrics.percentYearProgress + '%' }"></div>
          </div>
          <div class="muted" style="margin-top:8px;font-size:13px">
            До следующей годовщины: {{ metrics.daysToNextAnniversary }} дн. ({{ metrics.percentYearProgress }}%)
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="letter" style="padding:20px 0 50px">
      <div class="container">
        <div v-reveal class="card" style="padding:22px">
          <h2 style="margin:0 0 8px">Письмо на наш {{ metrics.yearsCompleted + 1 }}-й год</h2>
          <p class="muted" style="margin:0 0 16px">От сердца к сердцу ❤️</p>
          <div style="font-size:17px;line-height:1.6;opacity:.95">
            <p>{{ currentLetter }}</p>
            <p>Спасибо за нас. С годовщиной! Твой {{ config.yourName }}.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section" style="padding:0 0 70px">
      <div class="container">
        <div class="card" style="padding:22px">
          <h2 style="margin:0 0 16px">Хронология чувств</h2>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
            <div class="card" style="padding:16px">
              <div class="muted" style="font-size:13px">Где</div>
              <div style="font-weight:700">{{ config.city }}</div>
            </div>
            <div class="card" style="padding:16px">
              <div class="muted" style="font-size:13px">Вместе</div>
              <div style="font-weight:700">{{ together }} дней</div>
            </div>
            <div class="card" style="padding:16px">
              <div class="muted" style="font-size:13px">С</div>
              <div style="font-weight:700">{{ new Date(config.startDate).toLocaleDateString() }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import HeartConfetti from '@/components/HeartConfetti.vue'
import PhotoCarousel from '@/components/PhotoCarousel.vue'
import TypewriterText from '@/components/TypewriterText.vue'
import CountUp from '@/components/CountUp.vue'
import { anniversaryConfig as config, daysTogether } from '@/content/config'
import { getRelationshipMetrics } from '@/utils/time'
import { memories } from '@/content/memories'

const together = daysTogether()
const metrics = getRelationshipMetrics(config.startDate)
const currentLetterIndex = Math.min((config.lettersByYear?.length ?? 1) - 1, metrics.yearsCompleted)
const currentLetter = (config.lettersByYear && config.lettersByYear[currentLetterIndex])
  || 'Любимая, каждый день с тобой — это маленькое чудо. Ты делаешь мир ярче, тише и ближе.'

// Блок героевских фото — берём первые 5 файлов из /api/photos (если есть)
const heroImages = ref<string[]>([])
onMounted(() => {
  const list = (memories || []).map(m => m.image).filter(Boolean) as string[]
  heroImages.value = list.slice(0, 5)
})

</script>

<style scoped>
@media (max-width: 980px) {
  .hero-grid { grid-template-columns: 1fr !important; gap: 18px !important; }
}
@media (max-width: 720px) {
  h1 { font-size: 32px !important; }
  .hero-grid { padding-top: 6px; }
  .hero-grid .btn-primary { width: 100%; text-align: center; }
}
@media (max-width: 480px) {
  h1 { font-size: 28px !important; }
}
</style>


