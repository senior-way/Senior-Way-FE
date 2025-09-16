<template>
  <div class="input-field">
    <label class="input-label bodyMedium18px">{{ label }}</label>
    <slot>
      <input
        class="input-box bodyMedium14px"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :disabled="disabled"
      />
    </slot>
    <div class="input-desc bodyLight12px" v-if="desc">{{ desc }}</div>

    <div
      class="input-error bodyLight12px"
      :class="{ 'input-error--active': error }"
      aria-live="polite"
    >
      {{ error || '\u00A0' }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  placeholder: String,
  modelValue: String,
  type: { type: String, default: 'text' },
  desc: String,
  error: String,
  disabled: Boolean,
});
const emit = defineEmits(['update:modelValue']);
</script>

<style scoped>
.input-field { width: 100%; }

.input-label {
  margin-bottom: 5px;
  display: block;
  color: var(--color-black);
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

.input-desc {
  letter-spacing: -0.03em;
  color: var(--color-mediumgray);
  margin: 4px 0;
}

.input-error {
  color: var(--color-red);
  margin-bottom: 4px;
  min-height: 18px;
  line-height: 1.5;
  opacity: 0;
  transition: opacity .2s;
}
.input-error--active { opacity: 1; }
</style>
