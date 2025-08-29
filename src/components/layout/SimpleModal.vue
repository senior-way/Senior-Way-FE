<template>
  <teleport to="body">
    <transition name="sw-fade">
      <div
        v-if="modelValue"
        class="sw-modal-overlay"
        role="presentation"
        @click.self="close"
      >
        <div
          class="sw-modal-card"
          role="dialog"
          aria-modal="true"
          :aria-label="ariaLabel"
          ref="cardRef"
        >

          <button
            type="button"
            class="sw-close-btn titleLogo32px"
            aria-label="닫기"
            @click="close"
          >
            ×
          </button>

          <!-- 본문 - 기본 내용은 message prop, 필요시 기본 슬롯으로 교체 -->
          <div class="sw-modal-body">
            <p class="sw-message bodyMedium24px">
              <slot>
                {{ message }}
              </slot>
            </p>
          </div>

          <!-- 확인 - 기본은 confirmText prop, 필요시 confirm 슬롯으로 교체 -->
          <button
            type="button"
            class="sw-confirm-btn bodyMedium20px"
            @click="confirm"
            ref="confirmRef"
          >
            <slot name="confirm">
              {{ confirmText }}
            </slot>
          </button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },          
  message: { type: String, default: '회원가입이 정상적으로 완료되었습니다!' },
  confirmText: { type: String, default: '확인' },  
  ariaLabel: { type: String, default: '확인 모달' }
})
const emit = defineEmits(['update:modelValue', 'confirm', 'close'])

const confirmRef = ref(null)
const cardRef = ref(null)

function close() {
  emit('update:modelValue', false)
  emit('close')
}
function confirm() {
  emit('confirm')
  emit('update:modelValue', false)
}

// ESC로 닫기 + 바디 스크롤 락
function onKeydown(e) { if (e.key === 'Escape') close() }
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      document.addEventListener('keydown', onKeydown)
      document.body.style.overflow = 'hidden'
      setTimeout(() => confirmRef.value?.focus(), 50)
    } else {
      document.removeEventListener('keydown', onKeydown)
      document.body.style.overflow = ''
    }
  },
  { immediate: true }
)
onMounted(() => { if (props.modelValue) document.addEventListener('keydown', onKeydown) })
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.sw-modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: grid; place-items: center;
  z-index: 999;
}

.sw-modal-card {
  width: 300px;
  height: 280px;
  box-sizing: border-box;
  background: var(--color-white);
  border-radius: 12px;
  box-shadow: 0 12px 36px rgba(0,0,0,.22);
  padding: 20px 18px 16px;
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

/* 닫기 버튼 */
.sw-close-btn {
  position: absolute;
  top: 6px; right: 12px;
  width: 28px; height: 28px;
  border: 0; background: transparent;
  color: var(--color-black);
  cursor: pointer;
}

.sw-modal-body {
  margin-top: 18px;
  padding: 0 6px;
  text-align: center;
}

.sw-message {
  color: var(--color-black);
  letter-spacing: -0.03em;
  line-height: 1.3;
  margin-top: 48px;
}

.sw-confirm-btn {
  width: 250px;
  height: 50px;
  border: 1.5px solid var(--color-primary);
  background: transparent;
  color: var(--color-black);
  border-radius: 12px;
  cursor: pointer;
  transition: background .15s ease, transform .02s ease;
}
.sw-confirm-btn:active { transform: translateY(1px); }
</style>
