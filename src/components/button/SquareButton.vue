<template>
  <button
    class="square-btn"
    :class="`c-${variant}`"
    type="button"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <img
      v-if="icon"
      class="icon"
      :src="icon"
      :alt="iconAlt || label"
      loading="lazy"
      decoding="async"
    />
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
    default: 'mediumgray', // 테두리 연한 느낌 기본
    validator: v => ['primary','red','blue','mediumgray'].includes(v)
  },
  disabled: { type: Boolean, default: false }
})
defineEmits(['click'])
</script>

<style scoped>
.square-btn{
  width:144px;
  height:120px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:10px;

  background:#fff;
  border:1.2px solid var(--btn-color);
  border-radius:14px;
  cursor:pointer;

  transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
}
.square-btn .icon{
  width:48px;
  height:48px;
  object-fit:contain;
  display:block;
  margin-bottom: 4px;
}
.square-btn .label{
  line-height:1;
  text-align:center;
  white-space:nowrap;
}
.square-btn:not(:disabled):hover{
  box-shadow:0 6px 16px rgba(0,0,0,.06);
}
.square-btn:active:not(:disabled){
  transform:scale(1.03);
}
.square-btn:disabled{
  --btn-color: var(--color-mediumgray);
  color: var(--color-mediumgray);
  opacity:.6;
  cursor:not-allowed;
  transform:none;
  box-shadow:none;
}

/* 팔레트 (SubmitButton과 동일 변수명) */
.c-primary    { --btn-color: var(--color-primary); }
.c-red        { --btn-color: var(--color-red); }
.c-blue       { --btn-color: var(--color-blue); }
.c-mediumgray { --btn-color: var(--color-mediumgray); }
</style>
