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
        >
          <!-- 닫기(X) -->
          <button
            type="button"
            class="sw-close-btn titleLogo32px"
            aria-label="닫기"
            @click="close"
          >
            ×
          </button>

          <!-- 메시지(슬롯/prop 둘다 지원) -->
          <div class="sw-modal-body">
            <p class="sw-message bodyMedium24px">
              <slot>
                {{ message }}
              </slot>
            </p>
          </div>

          <!-- 버튼 영역 -->
          <div class="sw-actions">
            <!-- 확인 버튼 -->
            <button
              type="button"
              class="sw-btn bodyMedium20px"
              :style="{ '--btn-color': confirmColor }"
              @click="onConfirm"
              ref="confirmRef"
            >
              <slot name="confirm">{{ confirmText }}</slot>
            </button>

            <!-- 보조 버튼 (옵션) -->
            <button
              v-if="showSecondary"
              type="button"
              class="sw-btn bodyMedium20px is-secondary"
              :style="{ '--btn-color': secondaryColor }"
              @click="onSecondary"
            >
              <slot name="secondary">{{ secondaryText }}</slot>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  message: { type: String, default: '저장된 일정을 확인하실 수 있습니다.' },
  confirmText: { type: String, default: '확인했습니다.' },
  secondaryText: { type: String, default: '어디서 확인할 수 있나요?' },
  showSecondary: { type: Boolean, default: true },

  // 색상 커스텀: CSS 변수/HEX 모두 허용
  confirmColor: { type: String, default: 'var(--color-primary)' },
  secondaryColor: { type: String, default: 'var(--color-orange, #F2994A)' },

  ariaLabel: { type: String, default: '안내 모달' }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'secondary', 'close'])

const confirmRef = ref(null)

function close() {
  emit('update:modelValue', false)
  emit('close')
}
function onConfirm() {
  emit('confirm')
  emit('update:modelValue', false)
}
function onSecondary() {
  emit('secondary')
  // 필요하면 닫지 않고 유지하려면 위 줄만 두고 아래는 지워도 됨
  // emit('update:modelValue', false)
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
.sw-modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.45);
  display: grid; place-items: center;
  z-index: 999;
}

.sw-modal-card {
  width: 300px;
  height: 330px;
  box-sizing: border-box;
  background: var(--color-white, #fff);
  border-radius: 12px;
  box-shadow: 0 12px 36px rgba(0,0,0,.22);
  padding: 20px 18px 16px;
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Close button */
.sw-close-btn {
  position: absolute;
  top: 8px; 
  right: 12px;
  width: 28px; 
  height: 28px;
  border: 0; background: transparent;
  color: var(--color-black);
  cursor: pointer;
}

/* Body */
.sw-modal-body {
  margin-top: 18px;
  padding: 0 8px;
  text-align: center;
  flex: 1 0 auto;
  display: grid; place-items: center;
}
.sw-message {
  color: var(--color-black, #111);
  letter-spacing: -0.03em;
  line-height: 1.2;
}

/* Actions */
.sw-actions {
  display: grid;
  grid-auto-rows: 50px;  /* 각 버튼 높이 고정 */
  gap: 10px;
  padding-bottom: 6px;
}

/* Button: 250 x 50, 1px solid color */
.sw-btn {
  width: 250px;
  height: 50px;
  border-radius: 12px;
  border: 1px solid var(--btn-color, var(--color-primary));
  background: #fff;
  color: var(--color-black);
  letter-spacing: -0.02em;
  cursor: pointer;
  transition: background .15s ease, transform .02s ease, box-shadow .15s ease;
}
.sw-btn:active { transform: translateY(1px); }

</style>
