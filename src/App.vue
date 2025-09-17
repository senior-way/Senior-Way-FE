<!-- src/App.vue -->
<script setup>
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

import Header from '@/components/layout/Header.vue'

const route = useRoute()

// 타이틀/헤더 표시 여부
const headerTitle = computed(() => route.meta.title ?? 'SeniorWay')
const showHeader = computed(() => route.meta.noHeader !== true)
</script>

<template>
  <div class="app-root">
    <Header
      v-if="showHeader"
      :title="headerTitle"
    />

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* 360 기준 유동 레이아웃 컨테이너 */
.app-root {
  width: 100%;
  max-width: 360px;                           /* 가로 상한: 디자인 기준 */
  min-height: 100dvh;                         /* 세로: 주소창 변동 대응 */
  margin: 0 auto;                             /* 큰 화면에서 중앙 정렬 */
  background: #f6f6f6;
  display: flex;
  flex-direction: column;
  /* padding-top: max(12px, env(safe-area-inset-top, 0px));       */
  padding-bottom: max(12px, env(safe-area-inset-bottom, 0px));
}

.app-main {
  flex: 1;             /* 헤더 제외 영역 채우기 */
  min-height: 0;       /* 내부 스크롤 정상화 */
  display: block;
}
</style>
