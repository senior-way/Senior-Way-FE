<template>
  <SimpleModal
    v-model="openProxy"
    :message="''"
    :confirmText="confirmText"
    :ariaLabel="title || '알림'"
    @confirm="$emit('confirm')"
    @close="$emit('update:modelValue', false)"
  >
    <template #default>
      <div class="nm-wrap">
        <p v-if="title" class="nm-title bodyMedium20px">{{ title }}</p>
        <p class="nm-msg bodyMedium16px">{{ message }}</p>
      </div>
    </template>
  </SimpleModal>
</template>

<script setup>
import { computed } from 'vue'
import SimpleModal from '@/components/modal/SimpleModal.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '알림' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: '확인' },
})
const emit = defineEmits(['update:modelValue', 'confirm'])

const openProxy = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})
</script>

<style scoped>
.nm-wrap{ text-align: center; padding: 0 6px; }
.nm-title{ margin: 8px 0 6px; color: var(--color-black); }
.nm-msg{ margin: 6px 0 0; color: var(--color-black); }
</style>
