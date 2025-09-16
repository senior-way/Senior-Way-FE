<!-- src/newpages/guardian/components/SignupEmailInput.vue -->
<template>
  <div class="input-field">
    <label class="input-label bodyMedium18px">{{ label }}</label>

    <div class="input-row">
      <input
        class="input-box bodyMedium14px"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :disabled="disabled"
      />
      <button
        type="button"
        class="check-btn bodyMedium12px"
        :disabled="disabled || checkDisabled || checking"
        :aria-busy="checking ? 'true' : 'false'"
        @click="$emit('check')"
      >
        {{ checking ? '…' : '확인' }}
      </button>
    </div>

    <div class="input-desc bodyLight12px" v-if="desc">{{ desc }}</div>

    <div
      class="status-line bodyMedium12px"
      :class="{
        'ok': status === 'success',
        'err': status === 'error',
        'info': status === 'info'
      }"
      aria-live="polite"
    >
      {{ statusText || '\u00A0' }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  placeholder: String,
  modelValue: String,
  type: { type: String, default: 'email' },
  desc: String,
  disabled: Boolean,
  checking: { type: Boolean, default: false },
  checkDisabled: { type: Boolean, default: false },
  status: { type: String, default: '' },     
  statusText: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'check'])
</script>

<style scoped>
.input-field { width: 100%; }

.input-label {
  margin-bottom: 2px;
  display: block;
  color: var(--color-black);
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 50px;
  gap: 8px;
  align-items: center;
}

.input-box {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  border: 1px solid var(--color-lightgray);
  padding: 0 16px;
  box-sizing: border-box;
  background: var(--color-white);
  color: var(--color-black);
  transition: border-color .2s;
}
.input-box:focus { border-color: var(--color-primary); }
.input-box::placeholder { color: var(--color-mediumgray); }

.check-btn {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: var(--color-primary-10);
  color: var(--color-black);
  cursor: pointer;
  transition: background .15s, border-color .15s, opacity .15s;
}
.check-btn:focus-visible { outline: 0; border-color: var(--color-primary); }

.input-desc {
  letter-spacing: -0.03em;
  color: var(--color-mediumgray);
  margin: 4px 0;
}

.status-line {
  min-height: 18px;
  line-height: 1.5;
  margin-top: 2px;
  opacity: 1;
  color: var(--color-mediumgray);
}
.status-line.ok  { color: var(--color-blue) }     
.status-line.err { color: var(--color-error); }
.status-line.info { color: var(--color-mediumgray); }
</style>
