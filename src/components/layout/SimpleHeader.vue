<!-- src/components/layout/SimpleHeader.vue -->
<template>
  <header class="simple-header" :class="{ 'with-border': withBorder }">
    <h1 class="title titleLogo32px">
      <slot name="title">{{ title }}</slot>
    </h1>
  </header>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '' },
  withBorder: { type: Boolean, default: true }
})
</script>

<style scoped>
.simple-header{
  width: 100%;
  min-height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 12px;
  background: transparent;
}
/* .with-border{ border-bottom: 1px solid var(--color-lightgray); } */

.title{
  margin: 0;
  line-height: 1.2;
  text-align: center;
  word-break: keep-all;
}
</style>
