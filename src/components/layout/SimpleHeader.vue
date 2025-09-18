<!-- src/components/layout/SimpleHeader.vue -->
<template>
  <header class="simple-header" :class="{ 'with-border': withBorder }">
    <h1 class="title titleLogo32px">
      <slot name="title">{{ title }}</slot>
    </h1>

    <!-- 우측 음성 인식 버튼 -->
    <button
      class="shv-voice-btn"
      type="button"
      :aria-pressed="listening ? 'true' : 'false'"
      :title="listening ? '음성 인식 중…' : '음성 인식'"
      @click="openVoiceModal"
    >
      <img class="shv-voice-icon" :src="micIcon" alt="음성 인식" />
    </button>

    <!-- 모달 -->
    <teleport to="body">
      <div v-if="modalOpen" class="shv-backdrop" @click.self="closeVoiceModal">
        <div class="shv-card" role="dialog" aria-modal="true" aria-labelledby="shv-title">
          <button class="shv-close bodyMedium28px" type="button" aria-label="닫기" @click="closeVoiceModal">×</button>

          <h3 id="shv-title" class="bodyBold28px shv-title">음성 인식으로 이동</h3>

          <!-- 아이콘 + 설명 텍스트 (카드형 버튼, 중앙 정렬) -->
          <button
            class="shv-cta"
            type="button"
            :aria-pressed="listening ? 'true' : 'false'"
            @click="onStartVoice"
          >
            <span class="shv-cta-icon-wrap">
              <img class="shv-cta-icon" :src="micIcon" alt="" />
            </span>
            <span class="shv-cta-text bodyLight18px">
              마이크를 눌러 음성 인식 시작하기
            </span>
          </button>

          <p class="shv-desc bodyMedium20px">
            '일정 생성', '저장된 일정 확인', '무장애 관광지', '정보 관리', '이용 안내'처럼 말씀해 보세요.
          </p>
        </div>
      </div>
    </teleport>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import micIcon from '@/assets/icons/mic-icon2.png'
import { createVoiceNavigator, defaultVoiceRules } from '@/utils/voiceNav'

const props = defineProps({
  title: { type: String, default: '' },
  withBorder: { type: Boolean, default: true },
})

const router = useRouter()
const { listening, start } = createVoiceNavigator(router, { rules: defaultVoiceRules(router) })

const modalOpen = ref(false)

function openVoiceModal () { modalOpen.value = true }
function closeVoiceModal () { modalOpen.value = false }
function onStartVoice () { start() }

// 라우팅이 실제 발생하면 모달 닫기(실패/중단 시에는 유지)
watch(() => router.currentRoute.value.fullPath, () => { modalOpen.value = false })
</script>

<style scoped>
.simple-header {
  position: relative;
  width: 100%;
  min-height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 12px;
  background: transparent;
}
/* 필요 시 보더 켜기 */
/* .with-border { border-bottom: 1px solid var(--color-lightgray); } */

.title {
  margin: 0;
  line-height: 1.2;
  text-align: center;
  word-break: keep-all;
}

/* 오른쪽 상단 음성 버튼(절대 배치로 중앙 제목과 독립) */
.shv-voice-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  padding: 4px;
  line-height: 0;
  cursor: pointer;
}
.shv-voice-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  display: block;
}

/* 모달 */
.shv-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
  display: grid;
  place-items: center;
  z-index: 1000;
}
.shv-card {
  position: relative;
  box-sizing: border-box;
  width: min(92vw, 440px);
  margin: 0 16px;
  background: var(--color-white);
  border-radius: 20px;
  padding: 22px 18px 20px;
  text-align: center;
}
.shv-close {
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
.shv-title {
  margin: 16px 0 16px;
  color: var(--color-black);
}

/* 아이콘+설명 CTA 카드 버튼 */
.shv-cta {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
  margin: 6px 8px 10px;
  border: 1px solid var(--color-lightgray);
  border-radius: 12px;
  background: var(--color-white);
  cursor: pointer;
  text-align: center;
}
.shv-cta-icon-wrap {
  position: relative;
  width: 72px;
  height: 72px;
  display: grid;
  place-items: center;
}
.shv-cta-icon {
  width: 72px;
  height: 72px;
  object-fit: contain;
  display: block;
}
/* 듣는 중 아이콘 펄스 */
.shv-cta[aria-pressed="true"] .shv-cta-icon-wrap::after {
  content: "";
  position: absolute;
  inset: -8px;
  border-radius: 999px;
  background: radial-gradient(closest-side, var(--color-primary-10), transparent 70%);
  animation: shv-pulse 1.6s ease-out infinite;
}
@keyframes shv-pulse {
  0%   { transform: scale(.9);  opacity: .55; }
  70%  { transform: scale(1.08); opacity: .12; }
  100% { transform: scale(1.12); opacity: 0; }
}
.shv-cta-text {
  color: var(--color-black);
  letter-spacing: -0.03em;
  word-break: keep-all;
}

/* 하단 설명 */
.shv-desc {
  margin: 6px 8px 4px;
  color: var(--color-black);
  letter-spacing: -0.03em;
  line-height: 1.22;
  word-break: keep-all;
  text-align: center;
}
</style>
