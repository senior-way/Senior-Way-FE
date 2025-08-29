<template>
  <button
    class="submit-btn"
    :class="`c-${variant}`"
    type="submit"
    :disabled="disabled"
  >
    <span class="label bodyMedium20px">{{ label }}</span>
  </button>
</template>

<script setup>
const props = defineProps({
  label: { type: String, default: '제출' },
  variant: {                   // 기본 primary, 필요시 orange/blue/mediumgray
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'red', 'blue', 'mediumgray'].includes(v)
  },
  disabled: { type: Boolean, default: false }
})
</script>

<style scoped>
.submit-btn {
  width: 300px;
  height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-align: center;
  background: #ffffff;
  border: 1.3px solid var(--btn-color);
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.16s ease, box-shadow 0.16s ease, background-color 0.16s ease;
  transform: scale(1);
  transform-origin: center;
}

.submit-btn:active:not(:disabled) {
  transform: scale(1.03);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.03);
}

.submit-btn:disabled {
  --btn-color: var(--color-mediumgray); 
  color: var(--color-mediumgray);      
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.c-primary     { --btn-color: var(--color-primary); }
.c-red         { --btn-color: var(--color-red); }
.c-blue        { --btn-color: var(--color-blue); }
.c-mediumgray  { --btn-color: var(--color-mediumgray); }
</style>
