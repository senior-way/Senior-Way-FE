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

    <!-- 분리된 모달 컴포넌트 -->
    <VoiceModal
      v-model="modalOpen"
      :listening="listening"
      :mic-icon="micIcon"
      @start="onStartVoice"
      @update:modelValue="val => { if (!val) closeVoiceModal() }"
    />
  </header>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import logoUrl from '@/assets/img/seniorway_logo.png'
import micIcon from '@/assets/icons/mic-icon.png'
import { createVoiceNavigator, defaultVoiceRules } from '@/utils/voiceNav'
import VoiceModal from '@/components/modal/VoiceModal.vue'

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


<style scoped>
.vh-header {
  width: 100%;
  height: 4rem;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
}
.vh-left { display: flex; align-items: center; cursor: pointer; }
.vh-logo { display: block; max-height: 1.25rem; width: auto; height: auto; object-fit: contain; }
.vh-spacer { flex: 1 1 auto; }
.vh-right { display: flex; align-items: center; gap: 8px; }
.vh-voice-plainbtn { border: 0; background: transparent; padding: 4px; line-height: 0; cursor: pointer; }
.vh-voice-icon { width: 32px; height: 32px; object-fit: contain; display: block; }
</style>
