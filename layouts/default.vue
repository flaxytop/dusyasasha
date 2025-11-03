<template>
  <div>
    <header class="header-bar">
      <div class="container header-inner">
        <div class="brand">
          <NuxtLink to="/" class="link title">Dysya & Sasha</NuxtLink>
          <span class="muted sub">Годовщина</span>
        </div>
        <button class="menu-btn" @click="menuOpen = !menuOpen" aria-label="Меню">
          <span v-if="!menuOpen">☰</span>
          <span v-else>✕</span>
        </button>
        <nav class="nav-links" :class="{ open: menuOpen }">
          <NuxtLink to="/" class="link">Главная</NuxtLink>
          <NuxtLink to="/gallery" class="link">Галерея</NuxtLink>
          <NuxtLink to="/coupons" class="link">Купоны</NuxtLink>

          <NuxtLink to="/map" class="link">Карта</NuxtLink>
        </nav>
      </div>
    </header>
    <slot />
  </div>
  
</template>

<script setup lang="ts">
const menuOpen = ref(false)
</script>

<style scoped>
.header-bar {
  position: sticky; top: 0; z-index: 10;
  background: rgba(15,15,19,.6);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255,255,255,.06);
}
.header-inner {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 0;
}
.brand { display: flex; gap: 10px; align-items: baseline; }
.title { font-weight: 900; font-size: 18px; letter-spacing: .5px; }
.sub { font-size: 13px; }
.nav-links { display: flex; gap: 14px; }
.link { text-decoration: none; color: var(--muted); }
.link.router-link-active { color: #fff; }
.menu-btn { display: none; background: transparent; border: none; color: #fff; font-size: 20px; }

@media (max-width: 780px) {
  .menu-btn { display: inline-flex; align-items: center; justify-content: center; }
  .nav-links { display: none; position: absolute; left: 0; right: 0; top: 100%;
    background: rgba(15,15,19,.9); border-bottom: 1px solid rgba(255,255,255,.06);
    padding: 10px 4%; gap: 10px; flex-direction: column; }
  .nav-links.open { display: flex; }
  .header-inner { align-items: center; }
}
</style>


