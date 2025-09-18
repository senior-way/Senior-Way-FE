<!-- src/newpages/guardian/components/SmallIconButton.vue -->
<template>
  <button
    class="mini-btn"
    :class="{
      'is-block': block,
      'is-bordered': bordered,
      'is-disabled': disabled
    }"
    type="button"
    :disabled="disabled"
    @click="$emit('click')"
    :aria-label="ariaLabel || label"
  >
    <img class="mini-icon" :src="icon" :alt="iconAlt || ''" />
    <span class="mini-label bodyMedium14px">{{ label }}</span>
  </button>
</template>

<script setup>
const props = defineProps({
  label: { type: String, required: true },
  icon: { type: String, required: true },
  iconAlt: { type: String, default: '' },
  ariaLabel: { type: String, default: '' },

  /* 동작 프롭들 */
  block: { type: Boolean, default: false },     // 가로 100%로 확장
  bordered: { type: Boolean, default: false },  // 테두리 표시
  disabled: { type: Boolean, default: false }   // 비활성화
})
defineEmits(['click'])
</script>

<style scoped>
/* 기본값을 CSS 변수로 정의: 부모에서 style로 덮어쓰기 가능
   예) <SmallIconButton style="--sib-width:120px; --sib-height:72px; --sib-padding:10px; --sib-border-color:#ddd" />
*/
.mini-btn {
  width: var(--sib-width, 145px);
  height: var(--sib-height, 88px);
  padding: var(--sib-padding, 12px);

  background: var(--sib-bg, var(--color-white));
  border-radius: var(--sib-radius, 12px);
  border: var(--sib-border, 0);

  display: grid;
  place-items: center;
  gap: var(--sib-gap, 8px);
  cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease, background-color .12s ease;
}

.mini-btn:is(:hover, :focus-visible):not(:disabled) {
  box-shadow: var(--sib-shadow-hover, 0 4px 12px rgba(0,0,0,.06));
}

.mini-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.mini-btn.is-disabled,
.mini-btn:disabled {
  opacity: .6;
  cursor: not-allowed;
}

/* 부모 셀 가로폭 100% 채우기 */
.mini-btn.is-block {
  width: 100%;
}

/* 공통 테두리 스타일 (변수로 색상 조절 가능) */
.mini-btn.is-bordered {
  border: 1px solid var(--sib-border-color, var(--color-mediumgray));
}

.mini-icon {
  width: var(--sib-icon-size, 44px);
  height: var(--sib-icon-size, 44px);
  object-fit: contain;
  display: block;
}

.mini-label {
  color: var(--sib-text-color, var(--color-black));
  line-height: 1;
}
</style>
