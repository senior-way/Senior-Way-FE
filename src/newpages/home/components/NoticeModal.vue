<template>
  <teleport to="body">
    <div
      v-if="modelValue"
      class="nm-overlay"
      role="presentation"
      @click.self="close"
    >
      <div
        class="nm-card"
        role="dialog"
        aria-modal="true"
        :aria-label="ariaLabel || title || '알림'"
      >
        <!-- 좌상단 고정 타이틀 -->
        <p class="nm-title bodyMedium20px">{{ title }}</p>

        <!-- 본문(중앙 정렬) -->
        <div class="nm-body">
          <p class="nm-message bodyMedium20px">{{ message }}</p>
        </div>

        <!-- 확인 버튼 -->
        <button
          type="button"
          class="nm-btn bodyMedium18px"
          @click="onConfirm"
          ref="confirmRef"
        >
          {{ confirmText }}
        </button>

        <!-- X 버튼(옵션) -->
        <button
          class="nm-close"
          type="button"
          aria-label="닫기"
          @click="close"
        >×</button>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '알림' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: '확인' },
  ariaLabel: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'confirm', 'close'])

const confirmRef = ref(null)

function close() {
  emit('update:modelValue', false)
  emit('close')
}
function onConfirm() {
  emit('confirm')
  emit('update:modelValue', false)
}

function onKeydown(e) { if (e.key === 'Escape') close() }

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      document.addEventListener('keydown', onKeydown)
      document.body.style.overflow = 'hidden'
      setTimeout(() => confirmRef.value?.focus(), 40)
    } else {
      document.removeEventListener('keydown', onKeydown)
      document.body.style.overflow = ''
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.nm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
  display: grid;
  place-items: center;
  z-index: 999;
}
.nm-card {
  position: relative;
  width: 300px;
  min-height: 240px;
  box-sizing: border-box;
  background: var(--color-white, #fff);
  border-radius: 12px;
  padding: 20px 16px 16px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 12px;
}
/* 좌상단 타이틀 - 완전 상단 좌측 */
.nm-title {
  margin: 0;
  color: var(--color-black);
  text-align: left;
  /* 긴 한글 단어 줄바꿈 */
  white-space: normal;
  word-break: keep-all;
  overflow-wrap: anywhere;
  line-break: strict;
}
/* 본문은 중앙 배치 */
.nm-body {
  display: grid;
  place-items: center;
  text-align: center;
  padding: 0 6px;
}
.nm-message {
  margin: 0;
  color: var(--color-black);
  white-space: normal;
  word-break: keep-all;
  overflow-wrap: anywhere;
  line-break: strict;
}
/* 확인 버튼 */
.nm-btn {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  border: 1.5px solid var(--color-primary);
  background: #fff;
  color: var(--color-black);
  cursor: pointer;
}
/* X 버튼 */
.nm-close {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  color: var(--color-black);
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
}
</style>
