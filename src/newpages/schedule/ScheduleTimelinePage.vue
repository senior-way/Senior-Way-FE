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

        <div
          v-for="item in group.items"
          :key="`${group.date}-${item.id}`"
          class="entry"
        >
          <time
            class="time bodyMedium16px"
            :datetime="`${group.date}T${item.time}:00`"
          >
            {{ item.time }}
          </time>
          <span class="dot" aria-hidden="true"></span>
          <div class="card-col">
            <SpotCard
              :id="item.id"
              :name="item.name"
              :image="item.image"
              @detail="goDetail"
            />
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
          <button class="btn ghost bodyMedium16px" @click="closeSaveModal">
            취소
          </button>
          <button
            class="btn primary bodyMedium16px"
            :disabled="!canSave || saving"
            @click="confirmSave"
          >
            {{ saving ? '저장 중…' : '저장' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import SimpleHeader from '@/components/layout/SimpleHeader.vue';
import SpotCard from '@/newpages/schedule/components/ScheduleCard.vue';
import BottomDualButtons from '@/components/button/DualButton.vue';

const route = useRoute();
const router = useRouter();

/* 서버/세션 데이터 로드  */
const serverSchedule = ref(null); // { id,title,startDate,endDate,days:[{date,items:[{id,name,image,time}]}] }
const loading = ref(false);

onMounted(loadTimeline);

async function loadTimeline() {
  loading.value = true;
  try {
    const rid = route.query.rid;
    const source = route.query.source;
    if (rid && source === 'mock') {
      // 설문에서 넘어온 mock 데이터 사용
      const raw = localStorage.getItem(`mockSchedule:${rid}`);
      if (raw) {
        serverSchedule.value = normalizeMockSchedule(JSON.parse(raw));
        loading.value = false;
        return;
      }
    }

    if (rid) {
      /* 실제 백엔드 추천 결과 조회 */
      // const { data } = await axios.get(`/api/schedules/${encodeURIComponent(rid)}`, { withCredentials: true })
      // serverSchedule.value = normalizeSchedule(data)
    }

    if (!serverSchedule.value) {
      // 세션 미리보기 폴백
      const raw = sessionStorage.getItem('schedule:preview');
      if (raw) {
        serverSchedule.value = normalizeSchedule(JSON.parse(raw));
      } else {
        // 기존 하드코드(데모)
        serverSchedule.value = normalizeSchedule(buildHardcodedDemo());
      }
    }
  } catch (e) {
    console.error('타임라인 로드 실패:', e);
    // 폴백
    serverSchedule.value = normalizeSchedule(buildHardcodedDemo());
  } finally {
    loading.value = false;
  }
}

function normalizeSchedule(raw) {
  if (!raw) return null;
  // { days:[{date:'YYYY-MM-DD', items:[{id,name,image,time:'HH:mm'}]}], title? }
  return {
    id: raw.id ?? 'unknown',
    title: raw.title ?? '추천 일정',
    startDate: raw.startDate ?? '',
    endDate: raw.endDate ?? '',
    days: Array.isArray(raw.days)
      ? raw.days.map((d) => ({
          date: d.date,
          items: (d.items || []).map((it) => ({
            id: it.id,
            name: it.name,
            image: it.image,
            time: it.time || '09:00',
          })),
        }))
      : [],
  };
}

// mockSchedule 구조 변환
function normalizeMockSchedule(raw) {
  if (!raw) return null;
  // { title, start_date, days: { day1: [...], day2: [...] } }
  const daysArr = [];
  if (raw.days && typeof raw.days === 'object') {
    Object.entries(raw.days).forEach(([dayKey, items], idx) => {
      // 날짜 계산: start_date + idx
      const date = new Date(raw.start_date);
      date.setDate(date.getDate() + idx);
      daysArr.push({
        date: date.toISOString().slice(0, 10),
        items: items.map((it) => ({
          id: it.id,
          name: it.name,
          image: it.image,
          time: it.time,
        })),
      });
    });
  }
  return {
    id: raw.id ?? 'mock',
    title: raw.title ?? '추천 일정',
    startDate: raw.start_date ?? '',
    endDate: '', // 필요시 계산
    days: daysArr,
  };
}

/* 타임라인 표시용 계산 */
const timeline = computed(() => {
  const rows = [];
  const sched = serverSchedule.value;
  if (!sched || !Array.isArray(sched.days)) return rows;
  for (const day of sched.days) {
    for (const it of day.items || []) {
      rows.push({
        date: day.date,
        time: it.time,
        id: it.id,
        name: it.name,
        image: it.image,
      });
    }
  }
  return rows;
});

const grouped = computed(() => {
  const groups = timeline.value.reduce((acc, it) => {
    (acc[it.date] ||= []).push(it);
    return acc;
  }, {});
  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, arr]) => ({
      date,
      items: arr.sort((x, y) => x.time.localeCompare(y.time)),
    }));
});

function goDetail(id) {
  console.log('detail:', id);
}
function onRestartSurvey() {
  router.replace({ name: 'SurveyV2' });
}

/* 저장 모달 */
const saveOpen = ref(false);
const saveTitle = ref('');
const titleInput = ref(null);
const saving = ref(false);
const canSave = computed(() => saveTitle.value.trim().length >= 2);
const rightDisabled = computed(
  () => saving.value || timeline.value.length === 0
);
const defaultTitlePlaceholder = computed(
  () => serverSchedule.value?.title || '예: 부산 1박 2일 (가을)'
);

function openSaveModal() {
  saveTitle.value = serverSchedule.value?.title || '';
  saveOpen.value = true;
  nextTick(() => titleInput.value?.focus());
}
function closeSaveModal() {
  saveOpen.value = false;
}

async function confirmSave() {
  if (!canSave.value || saving.value) return;
  saving.value = true;
  try {
    const rid = route.query.rid;
    const source = route.query.source;
    let payload = null;
    if (rid && source === 'mock') {
      const raw = localStorage.getItem(`mockSchedule:${rid}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.days && typeof parsed.days === 'object') {
          // 변환: name→place, id→contentId, image→firstImage
          payload = {};
          Object.entries(parsed.days).forEach(([dayKey, items]) => {
            payload[dayKey] = (items || []).map((item) => ({
              ...item,
              place: item.name,
              contentId: item.id,
              firstImage: item.image,
              // 기존 필드 제거
              name: undefined,
              id: undefined,
              image: undefined,
            }));
            // 불필요한 필드(undefined) 제거
            payload[dayKey] = payload[dayKey].map(
              ({ name, id, image, ...rest }) => rest
            );
          });
        }
      }
    }
    if (!payload) {
      payload = {};
    }

    const jwt =
      localStorage.getItem('accessToken') ||
      localStorage.getItem('jwt') ||
      localStorage.getItem('token') ||
      '';

    await axios.post(
      `http://localhost:8080/api/schedules/save?title=${encodeURIComponent(
        saveTitle.value.trim()
      )}`,
      JSON.stringify(payload),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: jwt ? `Bearer ${jwt}` : undefined,
        },
      }
    );
    alert('저장되었습니다.');
  } catch (e) {
    alert('저장 실패');
  } finally {
    saving.value = false;
    saveOpen.value = false;
  }
}

/* ---------------- 데모 하드코드 폴백 ---------------- */
function buildHardcodedDemo() {
  const start = new Date();
  start.setHours(9, 0, 0, 0);
  const days = [];
  const spots = [
    {
      id: 501,
      name: '광안리 해수욕장',
      image: 'https://picsum.photos/id/1011/400/250',
      time: '09:00',
    },
    {
      id: 502,
      name: '송도 해상 케이블카',
      image: 'https://picsum.photos/id/1012/400/250',
      time: '11:00',
    },
    {
      id: 503,
      name: '부산시립미술관',
      image: 'https://picsum.photos/id/1014/400/250',
      time: '14:00',
    },
  ];
  const day1 = start.toISOString().slice(0, 10);
  const day2 = new Date(start);
  day2.setDate(day2.getDate() + 1);
  const day2Str = day2.toISOString().slice(0, 10);
  days.push({ date: day1, items: spots });
  days.push({
    date: day2Str,
    items: spots.map((s, i) => ({
      ...s,
      id: s.id + 10,
      time: i === 0 ? '09:30' : i === 1 ? '12:00' : '15:00',
    })),
  });
  return {
    id: 'demo',
    title: '부산 1박 2일',
    startDate: start.toISOString(),
    endDate: day2.toISOString(),
    days,
  };
}
</script>

<style scoped>
.timeline {
  position: relative;
  padding: 0 1rem 100px;
  overflow-x: hidden;
}

.rail {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 98px;
  width: 2px;
  background: var(--color-lightgray);
  z-index: 0;
}

.day {
  position: relative;
  padding-top: 8px;
}

.day-label {
  padding: 6px 32px;
  color: var(--color-black);
  background: var(--color-white);
  /* text-align: center;  */
  margin: 0 -1rem;
}

.entry {
  display: grid;
  grid-template-columns: 76px 16px minmax(0, 1fr);
  align-items: start;
  padding: 10px 0;
}

.time {
  text-align: right;
  color: var(--color-mediumgray);
  padding-right: 8px;
  line-height: 1;
  align-self: start;
}

.dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  z-index: 2;
  align-self: start;
  justify-self: center;
}

.card-col {
  min-width: 0;
  margin-left: 6px;
}

/* 모달 */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
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
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
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
.modal-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.02);
}
.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
}
.btn {
  height: 44px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-mediumgray);
  background: var(--color-white);
  color: var(--color-black);
}
.btn.primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}
.btn.ghost {
  background: #fff;
  color: var(--color-black);
}
</style>
