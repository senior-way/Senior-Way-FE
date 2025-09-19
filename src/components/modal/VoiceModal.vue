<template>
  <teleport to="body">
    <div
      v-if="modelValue"
      class="vhv-backdrop"
      role="presentation"
      @click.self="$emit('update:modelValue', false)"
    >
      <div class="vhv-card" role="dialog" aria-modal="true" aria-labelledby="vhv-title">
        <button
          class="vhv-close bodyMedium28px"
          type="button"
          aria-label="닫기"
          @click="$emit('update:modelValue', false)"
        >×</button>

        <h3 id="vhv-title" class="bodyBold28px vhv-title">
          {{ title }}
        </h3>

        <button
          class="vhv-cta"
          type="button"
          :aria-pressed="listening ? 'true' : 'false'"
          @click="$emit('start')"
        >
          <span class="vhv-cta-icon-wrap">
            <img class="vhv-cta-icon" :src="micIcon" alt="" />
          </span>
          <span class="vhv-cta-text bodyLight18px">
            {{ ctaText }}
          </span>
        </button>

        <p class="vhv-desc bodyLight18px">
          {{ hint }}
        </p>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  listening: { type: Boolean, default: false },
  micIcon: { type: String, required: true },
  title: { type: String, default: '음성 인식으로 이동' },
  ctaText: { type: String, default: '마이크를 눌러 음성 인식 시작하기' },
  hint: {
    type: String,
    default: `'일정 생성', '저장된 일정 확인', '무장애 관광지', '정보 관리', '뒤로 가기', '홈으로' 등을 말씀해 보세요.`
  }
})
defineEmits(['update:modelValue', 'start'])
</script>

<style scoped>
.vhv-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .45);
  display: grid;
  place-items: center;
  z-index: 1000;
}
.vhv-card {
  position: relative;
  box-sizing: border-box;
  width: min(92vw, 440px);
  margin: 0 16px;
  background: var(--color-white);
  border-radius: 20px;
  padding: 22px 18px 20px;
  text-align: center;
}
.vhv-close {
  position: absolute;
  top: 10px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: 0;
  background: transparent;
  line-height: 1;
  cursor: pointer;
  color: var(--color-black);
}
.vhv-title {
  margin: 16px 0 12px;
  color: var(--color-black);
}
.vhv-cta {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--color-lightgray);
  border-radius: 12px;
  background: var(--color-white);
  cursor: pointer;
  text-align: center;
  margin-bottom: 12px;
}
.vhv-cta-icon-wrap {
  position: relative;
  width: 72px;
  height: 72px;
  display: grid;
  place-items: center;
}
.vhv-cta-icon {
  width: 72px;
  height: 72px;
  object-fit: contain;
  display: block;
}
.vhv-cta[aria-pressed="true"] .vhv-cta-icon-wrap::after {
  content: "";
  position: absolute;
  inset: -8px;
  border-radius: 999px;
  background: radial-gradient(closest-side, var(--color-primary-10), transparent 70%);
  animation: vhv-pulse 1.6s ease-out infinite;
}
@keyframes vhv-pulse {
  0%   { transform: scale(.9);  opacity: .55; }
  70%  { transform: scale(1.08); opacity: .12; }
  100% { transform: scale(1.12); opacity: 0; }
}
.vhv-cta-text {
  color: var(--color-black);
  letter-spacing: -0.03em;
  word-break: keep-all;
}
.vhv-desc {
  margin: 6px 8px 4px;
  color: var(--color-primary);
  letter-spacing: -0.03em;
  line-height: 1;
  word-break: keep-all;
  text-align: center;
}
</style>
