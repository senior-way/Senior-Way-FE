<template>
  <button
    class="big-icon-btn"
    :class="`c-${variant}`"
    type="button"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <template v-if="icon">
      <img
        class="icon"
        :src="icon"
        :alt="iconAlt || label"
        loading="lazy"
        decoding="async"
      />
    </template>
    <template v-else>
      <!-- 기본 아이콘 -->
      <svg class="icon default" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 14a5 5 0 0 1 0-7l2-2a5 5 0 1 1 7 7l-1 1"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M14 10a5 5 0 0 1 0 7l-2 2a5 5 0 1 1-7-7l1-1"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </template>

    <span class="label bodyMedium20px">{{ label }}</span>
  </button>
</template>

<script setup>
defineProps({
  label: { type: String, default: '버튼' },
  icon: { type: String, default: '' },
  iconAlt: { type: String, default: '' },
  variant: {
    type: String,
    default: 'mediumgray',
    validator: v => ['primary','red','blue','mediumgray'].includes(v)
  },
  disabled: { type: Boolean, default: false }
})
defineEmits(['click'])
</script>

<style scoped>
.big-icon-btn{
  width: 300px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  background: #fff;
  border: 1.4px solid var(--btn-color);
  border-radius: 16px;
  cursor: pointer;
  transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
}

.icon{
  width: 64px;
  height: 64px;
  object-fit: contain;
  display: block;
}
.icon.default { color: var(--btn-color); }

.label{
  line-height: 1;
  text-align: center;
  white-space: nowrap;
}

.big-icon-btn:not(:disabled):hover{
  box-shadow: 0 8px 18px rgba(0,0,0,.06);
}
.big-icon-btn:active:not(:disabled){
  transform: scale(1.02);
}
.big-icon-btn:disabled{
  --btn-color: var(--color-mediumgray);
  color: var(--color-mediumgray);
  opacity: .6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.c-primary    { --btn-color: var(--color-primary); }
.c-red        { --btn-color: var(--color-red); }
.c-blue       { --btn-color: var(--color-blue); }
.c-mediumgray { --btn-color: var(--color-mediumgray); }
</style>
