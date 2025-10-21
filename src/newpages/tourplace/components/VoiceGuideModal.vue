<!-- src/components/modal/VoiceGuideModal.vue -->
<template>
  <teleport to="body">
    <transition name="sw-fade">
      <div v-if="isOpen" class="sw-modal-overlay" role="presentation" @click.self="close">
        <div class="sw-modal-card sw-voice-card" role="dialog" aria-modal="true" :aria-label="ariaLabel">
          <!-- 닫기 -->
          <button type="button" class="sw-close-btn titleLogo32px" aria-label="닫기" @click="close">×</button>

          <!-- 본문 -->
          <div class="sw-modal-body">
            <h2 class="sw-title bodyMedium24px">음성 해설</h2>

            <!-- 로딩 -->
            <div v-if="loading" class="sw-state bodyMedium20px">음성 해설 목록을 불러오고 있습니다.</div>

            <!-- 에러 -->
            <div v-else-if="error" class="sw-state sw-error bodyMedium20px">
              음성 해설 목록을 불러오지 못했습니다. 다시 시도해주세요.
              <button type="button" class="sw-retry-btn bodyMedium16px" @click="$emit('retry')">재시도</button>
            </div>

            <!-- 빈 상태 -->
            <div v-else-if="!guides.length" class="sw-state bodyMedium20px">음성 해설이 없습니다.</div>

            <!-- 목록 -->
            <ul v-else class="sw-list" role="listbox" :aria-label="ariaLabel" ref="listRef">
              <li v-for="g in guides" :key="g.id" class="sw-item" role="option">
                <button type="button" class="sw-row" @click="$emit('select', g)">
                  <div class="sw-meta">
                    <strong class="sw-name bodyMedium18px">{{ g.title || '제목 없음' }}</strong>
                    <span v-if="g.lengthSec" class="sw-time bodyRegular12px">{{ formatTime(g.lengthSec) }}</span>
                  </div>
                  <span class="sw-chev" aria-hidden="true">›</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: undefined },
  open:       { type: Boolean, default: undefined },
  guides:     { type: Array, default: () => [] },
  loading:    { type: Boolean, default: false },
  error:      { type: [String, Object, Boolean], default: null },
  ariaLabel:  { type: String, default: '음성 해설 선택 모달' },
})

const emit = defineEmits(['update:modelValue', 'update:open', 'close', 'select', 'retry'])

const isOpen = computed({
  get: () => (props.modelValue ?? props.open ?? false),
  set: (v) => { emit('update:modelValue', v); emit('update:open', v) }
})

const listRef = ref(null)

function close() {
  isOpen.value = false
  emit('close')
}

function onKeydown(e) {
  if (e.key === 'Escape') close()
}

async function focusFirstInteractive() {
  await nextTick()
  const firstRow = listRef.value?.querySelector('.sw-row')
  firstRow?.focus()
}

watch(() => isOpen.value, (open) => {
  if (open) {
    document.addEventListener('keydown', onKeydown)
    document.body.style.overflow = 'hidden'
    focusFirstInteractive()
  } else {
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
  }
}, { immediate: true })

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

function formatTime(sec) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
</script>

<style scoped>
.sw-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: grid;
  place-items: center;
  z-index: 999;
}

/* 카드 */
.sw-modal-card {
  width: 320px;
  max-width: calc(100vw - 32px);
  background: var(--color-white);
  border-radius: 12px;
  box-shadow: 0 12px 36px rgba(0,0,0,.22);
  padding: 18px 14px 14px;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* 고정 높이 + 내부 스크롤 */
.sw-voice-card { height: 420px; }

/* 닫기 버튼 */
.sw-close-btn {
  position: absolute;
  top: 6px;
  right: 10px;
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  color: var(--color-black);
  cursor: pointer;
}

/* 본문 */
.sw-modal-body {
  margin-top: 6px;
  padding: 0 4px 6px;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 제목 */
.sw-title {
  text-align: center;
  margin: 6px 0 10px;
  word-break: keep-all;
  overflow-wrap: break-word;
  hyphens: auto;
}

/* 상태 뷰 */
.sw-state {
  flex: 1;
  display: grid;
  place-items: center;
  overflow: auto;
  text-align: center;
  padding: 18px 4px 8px;
  color: var(--color-black);
  word-break: keep-all;
  overflow-wrap: break-word;
  hyphens: auto;
}
.sw-error { color: var(--color-red); }

/* 재시도 버튼 */
.sw-retry-btn {
  display: inline-block;
  margin-top: 10px;
  padding: 8px 12px;
  border: 1px solid var(--color-primary);
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
  color: var(--color-black);
}

.sw-list {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  flex: 1;
  overflow: auto;
  border-top: 1px solid var(--color-lightgray);
}
.sw-item + .sw-item { border-top: 1px solid var(--color-lightgray); }

.sw-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 6px;
  border: 0;
  background: transparent;
  cursor: pointer;
  text-align: left;

  -webkit-tap-highlight-color: transparent; 
  outline: none;
}

.sw-row .sw-meta { flex: 1; min-width: 0; }

.sw-meta { display: flex; align-items: center; gap: 8px; }

/* 제목: 단어 단위 줄바꿈 + 예외 안전분리 */
.sw-name {
  display: block;
  letter-spacing: -0.02em;
  white-space: normal;
  word-break: keep-all;
  overflow-wrap: break-word;
  hyphens: auto;
}

.sw-time { color: var(--color-darkgray); }

/* 아이콘은 고정폭으로 텍스트만 줄바꿈 */
.sw-chev { flex: 0 0 auto; font-size: 22px; line-height: 1; opacity: .55; }

/* 페이드 트랜지션 */
.sw-fade-enter-active, .sw-fade-leave-active { transition: opacity .15s ease; }
.sw-fade-enter-from, .sw-fade-leave-to { opacity: 0; }
</style>
