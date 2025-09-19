<template>
  <div
    class="spot-card"
    role="button"
    tabindex="0"
    @click="emit('detail', id)"
    @keydown.enter.prevent="emit('detail', id)"
    @keydown.space.prevent="emit('detail', id)"
    :aria-label="`${name} 자세히 보기`"
  >
    <!-- 타이틀 -->
    <h3 class="spot-title bodyBold20px">
      {{ name }}
    </h3>

    <div class="content-grid">
      <div class="thumb">
        <img :src="thumbSrc" :alt="name" class="thumb-img" />
      </div>

      <button
        type="button"
        class="detail-btn bodyMedium16px"
        @click.stop="emit('detail', id)"
        aria-label="상세보기"
      >
        상세<br/>보기
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import fallBackImage from '@/assets/images/fall-back.png'

const props = defineProps({
  id:    { type: [String, Number], required: true },
  name:  { type: String, required: true },
  image: { type: String, required: true },
})
const emit = defineEmits(['detail'])

const thumbSrc = computed(() => props.image || fallBackImage)
</script>

<style scoped>
.spot-card {
  --side: 56px;
  background: var(--color-white);
  border: 1px solid var(--color-lightgray);
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  padding: 12px;
  cursor: pointer;
  transition: var(--transition);
}
.spot-card:active { transform: translateY(1px); }

.spot-title {
  margin: 0 0 8px 0; 
  color: var(--color-black);
  text-align: center;
  line-height: 1.25;
  letter-spacing: -0.02em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
}

.thumb {
  width: 100%;
  height: var(--side);
  border-radius: 12px;
  overflow: hidden;
}
.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.detail-btn {
  width: var(--side);
  height: var(--side);
  border: 1px solid var(--color-mediumgray);
  border-radius: 10px;
  background: var(--color-white);
  color: var(--color-mediumgray);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1;
  padding: 0;
  transition: var(--transition);
  white-space: normal; 
  padding-top: 2px;
}
.detail-btn:active { transform: translateY(1px); }
</style>
