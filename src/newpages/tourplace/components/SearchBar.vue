<template>
  <div class="bf-search-panel">
    <div class="searchbar">
      <svg class="icon search left" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/>
        <path d="M20 20l-3.5-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>

      <input
        class="input bodyMedium16px"
        type="text"
        :placeholder="placeholder"
        :value="inner"
        inputmode="search"
        enterkeyhint="search"
        @compositionstart="onCompStart"
        @compositionend="onCompEnd"
        @input="onInput"
        @keydown.enter.prevent="onEnter"
        aria-label="관광지 이름 검색"
      />

      <button
        v-if="enableClear && inner"
        class="clear-btn"
        type="button"
        aria-label="입력 지우기"
        @click="clearInput"
      >×</button>

      <button
        class="submit-btn right bodyMedium16px"
        type="button"
        :disabled="!inner.trim()"
        :aria-busy="listening ? 'true':'false'"
        aria-label="검색 실행"
        @click="emitSearch"
      >검색</button>

      <span class="sr" aria-live="polite">{{ listening ? '음성 인식 중' : '' }}</span>
    </div>

    <div class="quick-actions">
      <button type="button" class="qa-btn" @click="onMicClick">
        <span class="qa-icon">
          <img :src="micPng" alt="" class="qa-icon-img" />
        </span>
        <span class="qa-text bodyMedium20px">음성 인식</span>
      </button>

      <button type="button" class="qa-btn" @click="emit('openFilters')">
        <span class="qa-icon">
          <img :src="filterPng" alt="" class="qa-icon-img" />
        </span>
        <span class="qa-text bodyMedium20px">조건 검색</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import micPng from '@/assets/icons/mic-icon.png'
import filterPng from '@/assets/icons/filter-icon.png'

const props = defineProps({
  modelValue: { type: String, default: '' },
  items: { type: Array, default: () => [] },
  debounce: { type: Number, default: 200 },
  placeholder: { type: String, default: '관광지 이름으로 검색' },
  useWebSpeech: { type: Boolean, default: false },
  lang: { type: String, default: 'ko-KR' },
  enableClear: { type: Boolean, default: true },
})
const emit = defineEmits([
  'update:modelValue','filter','search','openFilters','voice',
  'stt-start','stt-end','stt-error'
])

const inner = ref(props.modelValue)
watch(() => props.modelValue, v => { if (v !== inner.value) inner.value = v })

let t = null
function onInput(e) {
  const v = (e.target.value || '').normalize('NFC')
  inner.value = v
  debouncedFilter()
  emit('update:modelValue', v)
}
function onEnter() { if (!composing.value) emitSearch() }
function emitSearch() { emit('search', inner.value.trim()) }

function doFilter() {
  const q = inner.value.trim().toLowerCase()
  if (!props.items?.length) return emit('filter', [])
  const filtered = q
    ? props.items.filter(it => String(it.name || '').toLowerCase().includes(q))
    : props.items.slice()
  emit('filter', filtered)
}
function debouncedFilter() {
  if (t) clearTimeout(t)
  t = setTimeout(doFilter, props.debounce)
}
function clearInput() {
  inner.value = ''
  emit('update:modelValue','')
  doFilter()
}

/*  STT */
const listening = ref(false)     // 인식 중 UI 표시
let recognition = null           // 브라우저 STT 인스턴스
let sttTimer = null              // 자동 종료 타이머
let lastStart = 0                // 연속 탭 레이스 방지
const COOL = 800                 // 최소 간격(ms)
const composing = ref(false)     // IME 조합 상태(한글)
function onCompStart(){ composing.value = true }
function onCompEnd(){ composing.value = false }

/** 브라우저 STT 인스턴스 생성 */
function setupRecognizer() {
  if (!props.useWebSpeech) return null
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) return null
  const rec = new SR()
  rec.lang = props.lang
  rec.interimResults = false
  rec.maxAlternatives = 1
  rec.onstart = () => {
    listening.value = true
    emit('stt-start')
    clearTimeout(sttTimer)
    sttTimer = setTimeout(() => { try { rec.stop() } catch {} }, 8000) // 무응답 자동 종료
  }
  rec.onend = () => {
    listening.value = false
    emit('stt-end')
    clearTimeout(sttTimer)
  }
  rec.onerror = (e) => {
    listening.value = false
    emit('stt-error', e?.error || 'unknown')
  }
  rec.onresult = (e) => {
    const text = e.results?.[0]?.[0]?.transcript ?? ''
    inner.value = text
    emit('update:modelValue', text)
    doFilter()
    emit('search', text)
  }
  return rec
}

/** 연속 클릭 start race 발생 방지 */
function safeStart(rec) {
  const now = Date.now()
  if (now - lastStart < COOL) return
  lastStart = now
  try { rec.abort?.() } catch {}
  try { rec.start() } catch {}
}

function onMicClick() {
  if (props.useWebSpeech) {
    if (!recognition) recognition = setupRecognizer()
    if (recognition) { safeStart(recognition) }
  }
}

onMounted(() => {})
onUnmounted(() => {
  if (t) clearTimeout(t)
  clearTimeout(sttTimer)
  try { recognition?.abort?.() } catch {}
})
</script>

<style scoped>
.searchbar {
  position: relative;
  background: var(--color-white);
  border: 1px solid var(--color-lightgray);
  border-radius: 12px;
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 104px 0 56px;
}

.icon.search.left {
  position: absolute;
  left: 12px;
  width: 24px;
  height: 24px;
  color: var(--color-black);
}

.input {
  flex: 1 1 0;
  width: 100%;
  height: 100%;
  border: 0; outline: 0; background: transparent;
  color: var(--color-black);
}
.input::placeholder { color: var(--color-mediumgray); font: inherit; }

.clear-btn {
  position: absolute;
  right: 56px;
  width: 24px; height: 24px;
  border: 0; background: transparent;
  font-size: 18px; line-height: 24px;
  color: var(--color-mediumgray);
  cursor: pointer;
}

.submit-btn.right {
  position: absolute;
  right: 6px;
  height: 28px;
  padding: 0 10px;
  border-radius: 8px;
  color: var(--color-black);
  background-color: var(--color-lightgray);
  line-height: 28px;
  cursor: pointer;
}
.submit-btn.right:disabled { opacity: .5; cursor: default; }

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 6px;
}
.qa-btn {
  display: flex; align-items: center; gap: 12px;
  background: var(--color-white);
  border: 1px solid var(--color-lightgray);
  border-radius: 12px;
  padding: 12px;
  width: 100%;
  text-align: center;
}
.qa-icon { width: 36px; height: 36px; border-radius: 999px; display: grid; place-items: center; flex: 0 0 auto; }
.qa-icon-img { width: 36px; height: 36px; display: block; }
.qa-text { color: var(--color-black); }

.sr{ position:absolute; width:1px; height:1px; margin:-1px; clip:rect(0,0,0,0); overflow:hidden; }
</style>
