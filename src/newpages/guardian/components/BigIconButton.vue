<!-- src/components/common/BigIconCardBtn.vue -->
<template>
  <button
    class="big-icon-card"
    :class="`c-${variant}`"
    type="button"
    :disabled="disabled"
    @click="$emit('click')"
    :aria-label="ariaLabel"
  >
    <!-- 아이콘 -->
    <img
      v-if="icon"
      class="icon"
      :src="icon"
      :alt="iconAlt || title"
      :style="{ opacity: actualIconOpacity }"
      loading="lazy"
      decoding="async"
    />
    <svg
      v-else
      class="icon default"
      viewBox="0 0 24 24"
      aria-hidden="true"
      :style="{ opacity: actualIconOpacity }"
    >
      <path d="M10 14a5 5 0 0 1 0-7l2-2a5 5 0 1 1 7 7l-1 1"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M14 10a5 5 0 0 1 0 7l-2 2a5 5 0 1 1-7-7l1-1"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>

    <!-- 텍스트 -->
    <div class="texts">
      <div class="title bodyMedium16px">{{ title }}</div>
      <div class="desc bodyLight12px">{{ desc }}</div>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: '제목' },
  desc: { type: String, default: '' },
  icon: { type: String, default: '' },
  iconAlt: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  /* 각 카드별 아이콘 투명도(0~1). 지정 안 하면 variant별 기본값 사용 */
  iconOpacity: { type: Number, default: null },
})
defineEmits(['click'])

const ariaLabel = computed(() =>
  props.desc ? `${props.title}. ${props.desc}` : props.title
)

const variantOpacity = {
  primary: 1.0,
  red: 0.95,
  blue: 0.9,
  mediumgray: 0.85,
}
const actualIconOpacity = computed(() =>
  typeof props.iconOpacity === 'number'
    ? Math.max(0, Math.min(1, props.iconOpacity))
    : variantOpacity[props.variant] ?? 1
)
</script>

<style scoped>
.big-icon-card {
  width: 300px;
  height: 132px;
  display: grid;
  grid-template-columns: 80px 1fr;
  align-items: center;
  gap: 16px;
  padding: 18px 12px 18px 20px;
  background: var(--color-white);
  border: none;
  border-radius: 12px;
  text-align: left;
  cursor: pointer;
  transition: transform 0.16s ease, box-shadow 0.16s ease, background-color 0.16s ease;
}

.big-icon-card:active:not(:disabled) {
  transform: translateY(1px);
}

.big-icon-card:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.icon {
  width: 80px;
  height: 80px;
  object-fit: contain;
  display: block;
}

.icon.default {
  color: var(--tone, var(--color-mediumgray));
}

.texts {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  margin: 0;
  line-height: 1.3;
  word-break: break-all;
  overflow-wrap: anywhere;
  color: var(--color-black);
}

.desc {
  margin: 0;
  line-height: 1.38;
  color: var(--color-darkgray);
  letter-spacing: -0.03em;

  word-break: keep-all;      
  overflow-wrap: break-word;  
  hyphens: auto;              
}
</style>
