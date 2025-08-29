<!-- src/components/layout/Header.vue -->
<script setup>
import { defineProps } from 'vue'
import logoUrl from '@/assets/img/seniorway_logo.png' 
// 만약 이미지가 다른 폴더면 예) '@/assets/images/senior-way-logo.png' 로 바꿔줘.

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
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-lightgray);
}

.logo {
  display: block;
  max-height: 2rem;  
  width: auto;
  height: auto;
  object-fit: contain;
}
</style>
