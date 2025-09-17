<template>
  <SimpleModal
    v-model="openProxy"
    :message="''"
    :confirmText="loading ? '확인 중…' : '확인'"
    ariaLabel="비밀번호 확인"
    @confirm="onConfirm"
    @close="$emit('update:modelValue', false)"
  >
    <template #default>
      <div class="sw-modal-body-inner">
        <p class="bodyMedium20px">현재 비밀번호를 입력해주세요.</p>
        <input
          v-model.trim="pwd"
          class="sw-input bodyMedium16px"
          type="password"
          :disabled="loading"
          placeholder="현재 비밀번호"
          @keyup.enter="onConfirm"
        />
        <p v-if="errorText" class="sw-error bodyMedium14px">{{ errorText }}</p>
      </div>
    </template>
  </SimpleModal>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import SimpleModal from '@/components/modal/SimpleModal.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'submit'])

const pwd = ref('')
const errorText = ref('')

const openProxy = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

watch(() => props.modelValue, v => {
  if (v) {
    pwd.value = ''
    errorText.value = ''
    nextTick(() => {
      const el = document.querySelector('.sw-input')
      el && el.focus()
    })
  }
})

watch(() => props.error, v => { errorText.value = v || '' })

function onConfirm() {
  if (!pwd.value) {
    errorText.value = '비밀번호를 입력해주세요.'
    return
  }
  emit('submit', pwd.value)
}
</script>

<style scoped>
:deep(.sw-modal-body) {
  width: 100%;
}

.sw-modal-body-inner {
  display: grid;
  gap: 10px;
  justify-items: center;
}

/* 한글 단어 단위 줄바꿈(본문/에러 공통) */
.sw-modal-body-inner p,
.sw-error {
  white-space: normal;
  word-break: keep-all;      /* 띄어쓰기 기준 줄바꿈 */
  overflow-wrap: break-word; 
  line-break: strict;   
}

.sw-input{
  width: 100%;
  max-width: 250px;
  height: 42px;
  border: 1px solid var(--color-mediumgray);
  border-radius: 8px;
  padding: 0 12px;
  outline: none;
  box-sizing: border-box;
}
.sw-input:focus{
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0,0,0,0.02);
}

.sw-error{
  color: var(--color-red);
  margin-top: -2px;
}
</style>
