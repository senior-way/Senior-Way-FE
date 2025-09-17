<!-- src/newpages/tourplace/components/SearchBar.vue -->
<template>
  <div class="bf-search-panel" ref="rootEl">
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

      <button type="button" class="qa-btn" @click="openFilters">
        <span class="qa-icon">
          <img :src="filterPng" alt="" class="qa-icon-img" />
        </span>
        <span class="qa-text bodyMedium20px">조건 검색</span>
      </button>
    </div>

    <teleport to="body">
      <div v-if="showSheet" class="sheet-backdrop" @click="showSheet=false" />
      <div
        v-if="showSheet"
        class="sheet"
        role="dialog"
        aria-modal="true"
        :style="sheetBox"
      >
        <div class="sheet-header">
          <strong>카테고리 필터</strong>
          <button class="sheet-close" @click="showSheet=false" aria-label="닫기">×</button>
        </div>

        <div class="sheet-body">
          <div class="cat-grid">
            <button
              v-for="c in categories" :key="c.id"
              type="button"
              class="tile bodyMedium16px"
              :class="{ on: selectedCats.includes(c.id) }"
              :aria-pressed="selectedCats.includes(c.id)"
              @click="toggleCat(c.id)"
            >
              <img v-if="c.icon" :src="c.icon" alt="" class="icon" />
              <span class="label">{{ c.label }}</span>
            </button>
          </div>

          <div class="sheet-actions">
            <button type="button" class="reset-btn bodyMedium16px" @click="clearCats">전체 해제</button>
            <button type="button" class="apply-btn bodyMedium16px" @click="applyCats">적용</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import micPng from '@/assets/icons/mic-icon.png'
import filterPng from '@/assets/icons/filter-icon.png'
import selectNature from '@/assets/icons/select_nature.png'
import selectCulture from '@/assets/icons/select_culture.png'
import selectActivity from '@/assets/icons/select_activity.png'
import selectShopping from '@/assets/icons/select_shopping.png'
import selectFood from '@/assets/icons/select_food.png'

const props = defineProps({
  modelValue: { type: String, default: '' },
  items: { type: Array, default: () => [] },
  debounce: { type: Number, default: 200 },
  placeholder: { type: String, default: '관광지 이름으로 검색' },
  useWebSpeech: { type: Boolean, default: false },
  lang: { type: String, default: 'ko-KR' },
  enableClear: { type: Boolean, default: true },
  categories: {
    type: Array,
    default: () => [
      { id: '12', label: '관광지',   icon: selectNature   },
      { id: '14', label: '문화시설', icon: selectCulture  },
      { id: '28', label: '레포츠',   icon: selectActivity },
      { id: '38', label: '쇼핑',     icon: selectShopping },
      { id: '39', label: '음식점',   icon: selectFood     },
    ]
  },
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

const selectedCats = ref([])

function doFilter() {
  const q = inner.value.trim().toLowerCase()
  if (!props.items?.length) return emit('filter', [])
  const ids = selectedCats.value
  const filtered = props.items.filter(it => {
    const nameMatch = !q || String(it.name || '').toLowerCase().includes(q)
    const raw = it.content_type_id ?? it.contentTypeId ?? it.category ?? ''
    const type = typeof raw === 'number' ? String(raw) : String(raw)
    const catMatch = !ids.length || ids.includes(type)
    return nameMatch && catMatch
  })
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

/* STT */
const listening = ref(false)
let recognition = null
let sttTimer = null
let lastStart = 0
const COOL = 800
const composing = ref(false)
function onCompStart(){ composing.value = true }
function onCompEnd(){ composing.value = false }

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
    sttTimer = setTimeout(() => { try { rec.stop() } catch {} }, 8000)
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

/* BottomSheet */
const showSheet = ref(false)
const rootEl = ref(null)
const sheetBox = ref({ left: '0px', width: '100vw' })

function updateSheetBox () {
  const r = rootEl.value?.getBoundingClientRect()
  if (!r) return
  sheetBox.value = {
    left: `${Math.round(r.left)}px`,
    width: `${Math.round(r.width)}px`,
  }
}
function openFilters(){
  showSheet.value = true
  emit('openFilters')
  nextTick(updateSheetBox)
}
function toggleCat(id){
  const i = selectedCats.value.indexOf(id)
  if (i >= 0) selectedCats.value.splice(i,1)
  else selectedCats.value.push(id)
}
function clearCats(){ selectedCats.value = [] }
function applyCats(){
  doFilter()
  showSheet.value = false
}
function onResize(){ if (showSheet.value) updateSheetBox() }

onMounted(() => { window.addEventListener('resize', onResize) })
onUnmounted(() => {
  if (t) clearTimeout(t)
  clearTimeout(sttTimer)
  try { recognition?.abort?.() } catch {}
  window.removeEventListener('resize', onResize)
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

/* BottomSheet */
.sheet-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 999; }
.sheet {
  position: fixed;
  bottom: 0;
  left: 0;         /* inline style로 덮어씀 */
  width: 100vw;     /* inline style로 덮어씀 */
  background: #fff;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -8px 24px rgba(0,0,0,.12);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 1000;
}
.sheet-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px; border-bottom: 1px solid #eee;
}
.sheet-close { border: 0; background: transparent; font-size: 20px; line-height: 1; cursor: pointer; }
.sheet-body { padding: 16px; }

/* 아이콘 타일 */
.cat-grid{
  display: grid;
  grid-template-columns: repeat(2, 145px);
  grid-auto-rows: 100px;
  gap: 10px;
  justify-content: center;
}
.tile{
  box-sizing: border-box;
  width: 145px;
  height: 100px;
  border: 1px solid var(--color-mediumgray);
  border-radius: 12px;
  background: var(--color-white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
  white-space: pre-line;
  cursor: pointer;
  user-select: none;
}
.tile.on{
  border: 1.5px solid var(--color-primary);
  background: var(--color-primary-10);
}
.icon{
  width: 2.5rem;
  height: 2.5rem;
  object-fit: contain;
  display: block;
}
.label{ line-height: 1.3; }

.sheet-actions {
  display: flex; justify-content: space-between; gap: 10px; margin-top: 12px;
}
.reset-btn {
  flex: 1 1 0; height: 40px;
  border-radius: 10px;
  border: 1px solid var(--color-lightgray);
  background: #fff;
  color: var(--color-black);
  cursor: pointer;
}
.apply-btn {
  flex: 1 1 0; height: 40px;
  border-radius: 10px;
  border: 0;
  background: var(--color-primary);
  color: #fff;
  cursor: pointer;
}
</style>
