<!-- src/components/layout/VoiceHeader.vue -->
<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import logoUrl from '@/assets/img/seniorway_logo.png'
import micIcon from '@/assets/icons/mic-icon.png'
import { createVoiceNavigator, defaultVoiceRules } from '@/utils/voiceNav'

defineProps({ title: { type: String, default: 'SeniorWay' } })

const router = useRouter()
const { listening, start } = createVoiceNavigator(router, { rules: defaultVoiceRules(router) })

const modalOpen = ref(false)

function goHome () { router.push({ name: 'HomeV2' }) }
function openVoiceModal () { modalOpen.value = true }
function closeVoiceModal () { modalOpen.value = false }
function onStartVoice () { start() }

watch(() => router.currentRoute.value.fullPath, () => { modalOpen.value = false })
</script>

<template>
  <header class="vh-header" :aria-label="title">
    <div class="vh-left" @click="goHome" role="button" tabindex="0" aria-label="홈으로 이동">
      <img class="vh-logo" :src="logoUrl" alt="Senior Way" />
    </div>

    <div class="vh-spacer" />

    <div class="vh-right">
      <button
        class="vh-voice-plainbtn"
        type="button"
        :aria-pressed="listening ? 'true' : 'false'"
        :title="listening ? '음성 인식 중…' : '음성 인식'"
        @click="openVoiceModal"
      >
        <img class="vh-voice-icon" :src="micIcon" alt="음성 인식" />
      </button>
    </div>

    <teleport to="body">
      <div v-if="modalOpen" class="vhv-backdrop" @click.self="closeVoiceModal">
        <div class="vhv-card" role="dialog" aria-modal="true" aria-labelledby="vhv-title">
          <button class="vhv-close bodyMedium28px" type="button" aria-label="닫기" @click="closeVoiceModal">×</button>

          <h3 id="vhv-title" class="bodyBold28px vhv-title">음성 인식으로 이동</h3>

          <button
            class="vhv-cta"
            type="button"
            :aria-pressed="listening ? 'true' : 'false'"
            @click="onStartVoice"
          >
            <span class="vhv-cta-icon-wrap">
              <img class="vhv-cta-icon" :src="micIcon" alt="" />
            </span>
            <span class="vhv-cta-text bodyLight18px">
              마이크를 눌러 음성 인식 시작하기
            </span>
          </button>

          <p class="vhv-desc bodyMedium20px">
            '일정 생성', '저장된 일정 확인', '무장애 관광지', '정보 관리', '이용 안내'처럼 말씀해 보세요.
          </p>
        </div>
      </div>
    </teleport>
  </header>
</template>

<style scoped>
.vh-header {
  width: 100%;
  height: 4rem;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
}

.vh-left {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.vh-logo {
  display: block;
  max-height: 1.25rem;
  width: auto;
  height: auto;
  object-fit: contain;
}

.vh-spacer {
  flex: 1 1 auto;
}

.vh-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vh-voice-plainbtn {
  border: 0;
  background: transparent;
  padding: 4px;
  line-height: 0;
  cursor: pointer;
}

.vh-voice-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  display: block;
}

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
  margin: 16px 0 16px;
  color: var(--color-black);
}

.vhv-cta {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
  /* margin: 6px 8px 10px; */
  border: 1px solid var(--color-lightgray);
  border-radius: 12px;
  background: var(--color-white);
  cursor: pointer;
  text-align: center;
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
  0% {
    transform: scale(.9);
    opacity: .55;
  }
  70% {
    transform: scale(1.08);
    opacity: .12;
  }
  100% {
    transform: scale(1.12);
    opacity: 0;
  }
}

.vhv-cta-text {
  color: var(--color-black);
  letter-spacing: -0.03em;
  word-break: keep-all;
}

.vhv-desc {
  margin: 6px 8px 4px;
  color: var(--color-black);
  letter-spacing: -0.03em;
  line-height: 1.22;
  word-break: keep-all;
  text-align: center;
}
</style>
