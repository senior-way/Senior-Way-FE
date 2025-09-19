<!-- src/components/layout/SimpleHeader.vue -->
<template>
  <header class="simple-header" :class="{ 'with-border': withBorder }">
    <h1 class="title titleLogo32px">
      <slot name="title">{{ title }}</slot>
    </h1>

    <!-- 우측 음성 인식 버튼 (기본 표시) -->
    <button
      v-if="enableVoice"
      class="shv-voice-btn"
      type="button"
      :aria-pressed="listening ? 'true' : 'false'"
      :title="listening ? '음성 인식 중…' : '음성 인식'"
      @click="openVoiceModal"
    >
      <img class="shv-voice-icon" :src="micIcon" alt="음성 인식" />
    </button>

    <!-- 분리된 모달 컴포넌트 사용 -->
    <VoiceModal
      v-if="enableVoice"
      v-model="modalOpen"
      :listening="listening"
      :mic-icon="micIcon"
      @start="onStartVoice"
    />
  </header>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import micIcon from '@/assets/icons/mic-icon2.png'
import { createVoiceNavigator, defaultVoiceRules } from '@/utils/voiceNav'
import VoiceModal from '@/components/modal/VoiceModal.vue'

const props = defineProps({
  title: { type: String, default: '' },
  withBorder: { type: Boolean, default: true },
  enableVoice: { type: Boolean, default: true }, // 기본 표시
})

const router = useRouter()
const { listening, start } = createVoiceNavigator(router, { rules: defaultVoiceRules(router) })

const modalOpen = ref(false)

function openVoiceModal () {
  if (!props.enableVoice) return
  modalOpen.value = true
}
function onStartVoice () { start() }

// 라우팅 발생 시 모달 닫기
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

.title {
  margin: 0;
  line-height: 1.2;
  text-align: center;
  word-break: keep-all;
}

/* 오른쪽 상단 음성 버튼 */
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
</style>
