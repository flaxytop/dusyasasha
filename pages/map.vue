<template>
  <section class="section" style="padding:32px 0 60px">
    <div class="container">
      <h1 style="margin:0 0 12px;font-weight:900">Карта воспоминаний</h1>
      <p class="muted" style="margin:0 0 16px">Точки, где были наши моменты. Нажимай на метки</p>

      <div class="card" style="padding:14px">
        <MemoriesMap :center="omskCenter" :points="points" :zoom="13" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import MemoriesMap from '@/components/MemoriesMap.client.vue'
import { omskCenter, memories as points } from '@/content/memories'
</script>


