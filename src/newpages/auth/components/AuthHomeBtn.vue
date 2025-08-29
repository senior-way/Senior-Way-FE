<!-- src/components/button/AuthCardButton.vue -->
<template>
  <button
    class="auth-card"
    type="button"
    @click="onClick"
    :disabled="disabled"
  >
    <div class="title bodyBold32px">{{ title }}</div>
    <div class="subtitle bodyMedium16px" v-if="subtitle">{{ subtitle }}</div>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  to: { type: [String, Object], required: true }, 
  replace: { type: Boolean, default: false },    
  disabled: { type: Boolean, default: false }
})

const router = useRouter()

function onClick () {
  if (props.disabled) return
  props.replace ? router.replace(props.to) : router.push(props.to)
}
</script>

<style scoped>
.auth-card {
  width: 250px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-align: center;
  padding: 1rem;
  background: var(--color-white);
  border-radius: 16px;
  border: 1px solid var(--color-lightgray);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.03);
  transition: transform 0.16s ease, box-shadow 0.16s ease;
  transform: scale(1);
  transform-origin: center;
  will-change: transform, box-shadow;
  cursor: pointer;
}

/* hover */
.auth-card:hover:not(:disabled) {
  transform: scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}

/* click */
.auth-card:active:not(:disabled) {
  transform: scale(1.03);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

/* 비활성일 땐 효과 끔 */
.auth-card:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.03);
}

.title {
  line-height: 1.1;
}

.subtitle {
  color: var(--color-mediumgray);
  line-height: 1.4;
}
</style>
