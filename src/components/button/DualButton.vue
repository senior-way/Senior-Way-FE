<!-- src/components/footer/BottomDualButtons.vue -->
<template>
  <div class="footer-stick">
    <div class="container">
      <button type="button" class="btn back" @click="$emit('left')">
        <svg class="icon left" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span class="label bodyMedium20px">{{ leftLabel }}</span>
      </button>

      <button
        type="button"
        class="btn primary"
        :disabled="rightDisabled"
        @click="$emit('right')"
      >
        <span class="label bodyMedium20px">{{ rightLabel }}</span>
        <svg class="icon right" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  leftLabel: { type: String, default: '뒤로가서 다시 선택하기' },
  rightLabel: { type: String, default: '선택 완료 - 일정 생성하기' },
  rightDisabled: { type: Boolean, default: false }
})
defineEmits(['left', 'right'])
</script>

<style scoped>
.footer-stick { position: sticky; bottom: 0; z-index: 10; }

.container {
  max-width: var(--app-max-width);
  margin: 0 auto;
  padding: 12px 1.25rem calc(12px + env(safe-area-inset-bottom, 0px));
  display: flex; gap: 12px;
  background: #f5f5f5; box-sizing: border-box;
}

.btn {
  --icon-size: 24px;
  --icon-gap: 12px;         
  --pad-left: 8px;
  --pad-right: 8px;

  flex: 1 1 0; min-width: 0; height: 80px;
  padding-left: var(--pad-left); padding-right: var(--pad-right);
  position: relative; border-radius: 12px;
  border: 1px solid var(--btn-color, transparent);
  box-sizing: border-box; cursor: pointer;
  transition: background-color .16s ease, box-shadow .16s ease;
}

.back {
  --btn-color: var(--color-mediumgray);
  --pad-left: calc(12px + var(--icon-size) + var(--icon-gap));
  --label-pad-left: var(--icon-gap);   
  background: #fff; color: #222;
}
.primary {
  --btn-color: var(--color-primary);
  --pad-right: calc(12px + var(--icon-size) + var(--icon-gap));
  --label-pad-right: var(--icon-gap);
  background: var(--color-primary); color: #fff;
}

.icon {
  position: absolute; top: 50%;
  width: var(--icon-size); height: var(--icon-size);
  transform: translateY(-50%);
}
.icon.left  { left: 12px; }
.icon.right { right: 12px; }

.label {
  position: absolute; left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - var(--pad-left) - var(--pad-right));
  padding-left: var(--label-pad-left, 0);
  padding-right: var(--label-pad-right, 0);
  box-sizing: border-box;
  text-align: center; line-height: 1.24;
  white-space: normal; word-break: keep-all;
}

.btn:disabled { --btn-color: var(--color-mediumgray); color: var(--color-mediumgray); opacity: .6; cursor: not-allowed; box-shadow: none; }
</style>
