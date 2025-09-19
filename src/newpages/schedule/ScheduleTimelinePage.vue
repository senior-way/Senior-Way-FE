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
        <h2 class="day-label bodyMedium24px">『 {{ idx + 1 }}일차 일정 』</h2>

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

    <TextInputModal
      v-model:open="saveOpen"
      v-model:text="saveTitle"
      :title="'일정 이름 저장'"
      :placeholder="defaultTitlePlaceholder"
      :confirm-label="saving ? '저장 중…' : '저장'"
      :cancel-label="'취소'"
      :confirm-disabled="!canSave || saving"
      @confirm="confirmSave"
      @cancel="closeSaveModal"
    />

    <!-- 커스텀 알림 모달 -->
    <SimpleModal
      v-model="noticeOpen"
      :message="noticeMsg"
      :confirmText="'확인'"
      :ariaLabel="'알림'"
      @confirm="onNoticeConfirm"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import SimpleHeader from '@/components/layout/SimpleHeader.vue';
import SpotCard from '@/newpages/schedule/components/ScheduleCard.vue';
import BottomDualButtons from '@/components/button/DualButton.vue';
import TextInputModal from '@/components/modal/TextInputModal.vue';
import SimpleModal from '@/components/modal/SimpleModal.vue';

const route = useRoute();
const router = useRouter();
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const serverSchedule = ref(null);
const loading = ref(false);

const noticeOpen = ref(false);
const noticeMsg = ref('');
const savedOk = ref(false);
function openNotice(msg, ok = false) {
  noticeMsg.value = msg;
  savedOk.value = !!ok;
  noticeOpen.value = true;
}
function onNoticeConfirm() {
  // 저장 성공 시에만 홈으로 이동
  if (savedOk.value) router.replace({ name: 'HomeV2' });
}

onMounted(loadTimeline);

async function loadTimeline() {
  loading.value = true;
  try {
    const rid = route.query.rid;
    const source = route.query.source;
    if (rid && source === 'mock') {
      const raw = localStorage.getItem(`mockSchedule:${rid}`);
      if (raw) {
        serverSchedule.value = normalizeMockSchedule(JSON.parse(raw));
        loading.value = false;
        return;
      }
    }

    if (rid) {
      // const { data } = await axios.get(`/api/schedules/${encodeURIComponent(rid)}`, { withCredentials: true })
      // serverSchedule.value = normalizeSchedule(data)
    }

    if (!serverSchedule.value) {
      const raw = sessionStorage.getItem('schedule:preview');
      if (raw) {
        serverSchedule.value = normalizeSchedule(JSON.parse(raw));
      } else {
        serverSchedule.value = normalizeSchedule(buildHardcodedDemo());
      }
    }
  } catch (e) {
    console.error('타임라인 로드 실패:', e);
    serverSchedule.value = normalizeSchedule(buildHardcodedDemo());
  } finally {
    loading.value = false;
  }
}

function normalizeSchedule(raw) {
  if (!raw) return null;
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
            image: it.image || '',
            time: it.time || '09:00',
          })),
        }))
      : [],
  };
}

function normalizeMockSchedule(raw) {
  if (!raw) return null;
  const daysArr = [];
  if (raw.days && typeof raw.days === 'object') {
    Object.entries(raw.days).forEach(([dayKey, items], idx) => {
      const date = new Date(raw.start_date);
      date.setDate(date.getDate() + idx);
      daysArr.push({
        date: date.toISOString().slice(0, 10),
        items: (items || []).map((it) => ({
          id: it.id,
          name: it.name,
          image: it.image || '',
          time: it.time,
        })),
      });
    });
  }
  return {
    id: raw.id ?? 'mock',
    title: raw.title ?? '추천 일정',
    startDate: raw.start_date ?? '',
    endDate: '',
    days: daysArr,
  };
}

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
        image: it.image || '',
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
      items: arr.sort((x, y) => (x.time || '').localeCompare(y.time || '')),
    }));
});

function goDetail(id) {
  if (!id) return;
  router.push({ name: 'TourplaceDetailV2', params: { id: String(id) } });
}
function onRestartSurvey() {
  router.replace({ name: 'SurveyV2' });
}

const saveOpen = ref(false);
const saveTitle = ref('');
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
          payload = {};
          Object.entries(parsed.days).forEach(([dayKey, items]) => {
            payload[dayKey] = (items || []).map((item) => {
              const { name, id, image, ...rest } = item;
              return {
                ...rest,
                place: name,
                contentId: id,
                firstImage: image,
              };
            });
          });
        }
      }
    }
    if (!payload) payload = {};

    const token = localStorage.getItem('accessToken');

    await axios.post(
      `${baseUrl}/schedules/save?title=${encodeURIComponent(
        saveTitle.value.trim()
      )}`,
      JSON.stringify(payload),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    openNotice('저장되었습니다.', true);
  } catch (e) {
    openNotice('저장에 실패했습니다. 다시 시도해 주세요.');
  } finally {
    saving.value = false;
    saveOpen.value = false;
  }
}

/* 데모 폴백 */
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
</style>
