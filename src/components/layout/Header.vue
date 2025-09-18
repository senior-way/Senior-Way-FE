<!-- src/components/layout/Header.vue -->
 <!-- height 64px -->
<script setup>
import { defineProps } from 'vue'
import logoUrl from '@/assets/img/seniorway_logo.png' 

defineProps({
  title: { type: String, default: 'SeniorWay' } // App.vue에서 전달해도 호환되게 둠
})
</script>

<template>
  <header
    class="app-header"
    :aria-label="title"
  >
    <img
      class="logo"
      :src="logoUrl"
      alt="Senior Way"
    />
  </header>
</template>

<style scoped>
.app-header {
  width: 100%;
  height: 4rem;  
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: var(--color-white); */
}

.logo {
  display: block;
  max-height: 2rem;  
  width: auto;
  height: auto;
  object-fit: contain;
}
</style>
