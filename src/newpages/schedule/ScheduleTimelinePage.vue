<!-- src/pages/ScheduleTimelinePage.vue -->
<template>
  <div class="timeline-page">
    <SimpleHeader title="추천 일정" />

    <main class="timeline" role="list">
      <div class="rail" aria-hidden="true"></div>

      <section
        v-for="(group, idx) in grouped"
        :key="group.date"
        class="day"
        role="listitem"
        :aria-label="`${idx + 1}일차`"
      >
      
        <h2 class="day-label bodyMedium24px">일정 {{ idx + 1 }}일차</h2>

        <div v-for="item in group.items" :key="`${group.date}-${item.id}`" class="entry">
          <time class="time bodyMedium16px" :datetime="`${group.date}T${item.time}:00`">
            {{ item.time }}
          </time>
          <span class="dot" aria-hidden="true"></span>
          <div class="card-col">
            <SpotCard :id="item.id" :name="item.name" :image="item.image" @detail="goDetail" />
          </div>
        </div>
      </section>
    </main>

    <BottomDualButtons
      leftLabel="처음부터 다시하기"
      rightLabel="추천일정 저장하기"
      :rightDisabled="rightDisabled"
      @left="onRestartSurvey"
      @right="openSaveModal"
    />

    <div v-if="saveOpen" class="modal-backdrop" @click.self="closeSaveModal">
      <div class="modal-card">
        <h3 class="modal-title bodyBold20px">일정 이름 저장</h3>
        <input
          ref="titleInput"
          v-model.trim="saveTitle"
          class="modal-input bodyMedium16px"
          type="text"
          maxlength="40"
          placeholder="예: 부산 1박 2일 (가을)"
        />
        <div class="modal-actions">
          <button class="btn ghost bodyMedium16px" @click="closeSaveModal">취소</button>
          <button class="btn primary bodyMedium16px" :disabled="!canSave || saving" @click="confirmSave">
            {{ saving ? '저장 중…' : '저장' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import SpotCard from '@/newpages/schedule/components/ScheduleCard.vue'
import BottomDualButtons from '@/components/button/DualButton.vue'

const router = useRouter()

const schedule = {
  schedule_id: 1001,
  user_id: 1,
  title: '부산 1박 2일',
  start_date: '2025-09-20T09:00:00',
  end_date: '2025-09-21T18:00:00',
}

const scheduleTouristSpots = [
  { id: 1, schedule_id: 1001, tourist_spot_id: 501, sequence_order: 1, stay_time: 120 },
  { id: 2, schedule_id: 1001, tourist_spot_id: 502, sequence_order: 2, stay_time: 90  },
  { id: 3, schedule_id: 1001, tourist_spot_id: 503, sequence_order: 3, stay_time: 60  },
  { id: 4, schedule_id: 1001, tourist_spot_id: 504, sequence_order: 4, stay_time: 90  },
  { id: 5, schedule_id: 1001, tourist_spot_id: 505, sequence_order: 5, stay_time: 120 },
]

const spotsById = {
  501: { id: 501, name: '광안리 해수욕장',    image: 'https://picsum.photos/id/1011/400/250' },
  502: { id: 502, name: '송도 해상 케이블카', image: 'https://picsum.photos/id/1012/400/250' },
  503: { id: 503, name: '부산시립미술관',      image: 'https://picsum.photos/id/1014/400/250' },
  504: { id: 504, name: '부산타워',            image: 'https://picsum.photos/id/1020/400/250' },
  505: { id: 505, name: '해운대 해수욕장',     image: 'https://picsum.photos/id/1016/400/250' },
}

const GAP_MIN = 20
const timeline = computed(() => {
  const rows = []
  let cursor = new Date(schedule.start_date)
  const rowsOfThisSchedule = scheduleTouristSpots
    .filter(r => r.schedule_id === schedule.schedule_id)
    .sort((a, b) => a.sequence_order - b.sequence_order)
  for (const r of rowsOfThisSchedule) {
    const spot = spotsById[r.tourist_spot_id]
    if (!spot) continue
    const dateStr = cursor.toISOString().slice(0, 10)
    const timeStr = toHHMM(cursor)
    rows.push({ id: spot.id, date: dateStr, time: timeStr, name: spot.name, image: spot.image })
    cursor = addMinutes(cursor, r.stay_time + GAP_MIN)
  }
  return rows
})

const grouped = computed(() => {
  const groups = timeline.value.reduce((acc, it) => {
    (acc[it.date] ||= []).push(it)
    return acc
  }, {})
  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, arr]) => ({ date, items: arr.sort((x, y) => x.time.localeCompare(y.time)) }))
})

function goDetail(id) { console.log('detail:', id) }
function addMinutes(d, min) { const nd = new Date(d); nd.setMinutes(nd.getMinutes() + Number(min || 0)); return nd }
function toHHMM(d) { const h = String(d.getHours()).padStart(2, '0'); const m = String(d.getMinutes()).padStart(2, '0'); return `${h}:${m}` }

const saveOpen = ref(false)
const saveTitle = ref('')
const titleInput = ref(null)
const saving = ref(false)
const canSave = computed(() => saveTitle.value.trim().length >= 2)
const rightDisabled = computed(() => saving.value || timeline.value.length === 0)

function openSaveModal() {
  saveTitle.value = schedule.title || ''
  saveOpen.value = true
  nextTick(() => titleInput.value?.focus())
}
function closeSaveModal() { saveOpen.value = false }

async function confirmSave() {
  if (!canSave.value || saving.value) return
  saving.value = true
  try {
    const payload = {
      title: saveTitle.value.trim(),
      start_date: schedule.start_date,
      end_date: schedule.end_date,
      items: timeline.value,
    }
    const newId = await saveSchedule(payload)
    saveOpen.value = false
    router.push({ name: 'SavedScheduleDetail', params: { id: newId } })
  } finally {
    saving.value = false
  }
}

async function saveSchedule(payload) {
  const tmpId = Math.floor(Math.random() * 1e9)
  localStorage.setItem(`savedSchedule:${tmpId}`, JSON.stringify(payload))
  return tmpId
}

function onRestartSurvey() {
  router.replace({ name: 'SurveyV2' })
}
</script>

<style scoped>
.timeline {
  position: relative;
  padding: 0 1rem 100px; /* 버튼 높이 고려해 하단 여백 확보 */
  overflow-x: hidden;
}

.rail {
  position: absolute;
  top: 0; bottom: 0; left: 98px;
  width: 2px; background: var(--color-lightgray); z-index: 0;
}

.day { position: relative; padding-top: 8px; }

.day-label {
  padding: 6px 32px; 
  color: var(--color-black); 
  background: var(--color-white);
  /* text-align: center;  */
  margin: 0 -1rem;
}

.entry {
  display: grid; grid-template-columns: 76px 16px minmax(0, 1fr);
  align-items: start; padding: 10px 0;
}

.time {
  text-align: right; color: var(--color-mediumgray);
  padding-right: 8px; line-height: 1; align-self: start;
}

.dot {
  width: 16px; height: 16px; border-radius: 50%; background: var(--color-primary);
  z-index: 2; align-self: start; justify-self: center;
}

.card-col { min-width: 0; margin-left: 6px; }

/* 모달 */
.modal-backdrop {
  position: fixed; inset: 0; 
  background: rgba(0,0,0,0.4);
  display: flex; 
  align-items: center; 
  justify-content: center; 
  z-index: 50;
}

.modal-card {
  width: calc(100% - 2rem); 
  max-width: 480px; 
  background: #fff; 
  border-radius: 12px; 
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
.modal-title { 
  margin: 0 0 10px 0; 
  color: var(--color-black); 
}
.modal-input {
  width: 100%; 
  height: 42px; 
  border: 1px solid var(--color-mediumgray); 
  border-radius: 8px;
  padding: 0 12px; 
  outline: none;
}
.modal-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(0,0,0,0.02); }
.modal-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
.btn { height: 44px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid var(--color-mediumgray); background: var(--color-white); color: var(--color-black);
}
.btn.primary { background: var(--color-primary); border-color: var(--color-primary); color: #fff; }
.btn.ghost { background: #fff; color: var(--color-black); }
</style>