<!-- src/components/modal/TextInputModal.vue -->
<template>
  <div v-if="open" class="ti-modal-backdrop" @click.self="onCancel">
    <div class="ti-modal-card" role="dialog" aria-modal="true" :aria-label="title || '입력'">
      <h3 class="ti-modal-title bodyBold20px">{{ title }}</h3>
      <input
        ref="inputRef"
        class="ti-modal-input bodyMedium16px"
        type="text"
        :maxlength="Number(maxLength)"
        :placeholder="placeholder || ''"
        :value="text"
        @input="onInput"
        @keydown.enter.prevent="onConfirm"
        @keydown.esc.prevent="onCancel"
      />
      <div class="ti-modal-actions">
        <button class="ti-btn ti-btn--ghost bodyMedium16px" type="button" @click="onCancel">
          {{ cancelLabel }}
        </button>
        <button
          class="ti-btn ti-btn--primary bodyMedium16px"
          type="button"
          :disabled="!!confirmDisabled"
          @click="onConfirm"
        >
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  text: { type: String, default: '' },
  title: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  confirmLabel: { type: String, default: '확인' },
  cancelLabel: { type: String, default: '취소' },
  confirmDisabled: { type: Boolean, default: false },
  maxLength: { type: [Number, String], default: 40 },
})
const emit = defineEmits(['update:open', 'update:text', 'confirm', 'cancel'])

const inputRef = ref(null)

watch(
  () => props.open,
  async (val) => {
    if (val) {
      await nextTick()
      inputRef.value?.focus()
      inputRef.value?.select?.()
    }
  },
  { immediate: true }
)

function onInput(e) {
  emit('update:text', e.target.value)
}
function onConfirm() {
  if (props.confirmDisabled) return
  emit('confirm')
}
function onCancel() {
  emit('cancel')
  emit('update:open', false)
}
</script>

<style scoped>
.ti-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 0 16px;            
}

.ti-modal-card {
  width: 100%;                
  max-width: 360px;         
  max-height: 80vh;
  overflow-y: auto;
  background: var(--color-white);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
}
.ti-modal-title {
  margin: 0 0 10px 0;
  color: var(--color-black);
}

.ti-modal-input {
  width: 100%;
  height: 42px;
  border: 1px solid var(--color-mediumgray);
  border-radius: 8px;
  padding: 0 12px;
  outline: none;
  box-sizing: border-box;
}
.ti-modal-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.02);
}

.ti-modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
}

.ti-btn {
  height: 44px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-mediumgray);
  background: var(--color-white);
  color: var(--color-black);
  cursor: pointer;
}

.ti-btn--primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-white);
}

.ti-btn--ghost {
  background: var(--color-white);
  color: var(--color-black);
}
</style>
