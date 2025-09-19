<!-- src/newpages/schedule/SavedScheduleDetail.vue -->
<template>
  <div class="page" v-if="loaded">
    <SimpleHeader :title="title || '저장된 일정'" />
    <main ref="timelineRef" class="timeline" role="list" v-if="groups.length">
      <div class="rail" aria-hidden="true"></div>

      <section
        v-for="(group, idx) in groups"
        :key="group.date"
        class="day"
        role="listitem"
        :aria-label="`${idx + 1}일차`"
      >
        <h2 class="day-label bodyMedium24px">일정 {{ idx + 1 }}일차</h2>

        <div
          v-for="item in group.items"
          :key="`${group.date}-${item.id}-${item.time}`"
          class="entry"
        >
          <time
            class="time bodyMedium16px"
            :datetime="`${group.date}T${item.time}:00`"
            >{{ item.time }}</time
          >
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

    <div v-else class="empty bodyMedium16px">항목이 없습니다.</div>

    <div class="bottom">
      <button
        class="bar-btn primary bodyMedium16px"
        :disabled="saving"
        @click="saveBoth"
      >
        {{ saving ? '저장 중…' : 'PDF&이미지로 저장' }}
      </button>
      <button class="bar-btn danger bodyMedium16px" @click="askDelete">
        삭제하기
      </button>
    </div>

    <NoticeModal
      v-model="confirmOpen"
      title="삭제"
      message="이 일정을 삭제할까요?"
      confirmText="삭제하기"
      @confirm="doDelete"
    />
    <NoticeModal
      v-model="notFoundOpen"
      title="알림"
      message="존재하지 않는 일정입니다."
      confirmText="목록으로"
      @confirm="goList"
    />

    <!-- 저장 성공/실패 알림 모달 추가 -->
    <SimpleModal
      v-model="saveNoticeOpen"
      :message="saveNoticeMsg"
      :confirmText="'확인'"
      :ariaLabel="'알림'"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SimpleHeader from '@/components/layout/SimpleHeader.vue';
import SpotCard from '@/newpages/schedule/components/ScheduleCard.vue';
import NoticeModal from '@/newpages/home/components/NoticeModal.vue';
import SimpleModal from '@/components/modal/SimpleModal.vue'; 
import axios from 'axios';
import { saveElementAsImageAndPdf } from '@/utils/exportCapture';

const route = useRoute();
const router = useRouter();

const title = ref('');
const items = ref([]); // [{id,name,image,date,time}]
const loaded = ref(false);
const confirmOpen = ref(false);
const notFoundOpen = ref(false);
const timelineRef = ref(null);
const saving = ref(false);

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// 저장 알림 모달 상태
const saveNoticeOpen = ref(false);
const saveNoticeMsg = ref('');
function openSaveNotice(msg) {
  saveNoticeMsg.value = msg;
  saveNoticeOpen.value = true;
}

onMounted(async () => {
  const id = route.params.id;
  try {
    const token = localStorage.getItem('accessToken');
    const res = await axios.get(`${baseUrl}/schedules/${id}/json`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = res.data;
    title.value = data.title || '저장된 일정';
    // days: { day1: [...], day2: [...] }
    // TimeLine과 동일하게 매핑
    const arr = [];
    // API 응답이 data.days에 중첩되지 않고 최상위 객체일 수 있음을 처리
    const daysObject =
      data.days &&
      typeof data.days === 'object' &&
      Object.keys(data.days).length
        ? data.days
        : data;

    if (daysObject && typeof daysObject === 'object') {
      Object.entries(daysObject).forEach(([dayKey, spots], idx) => {
        // day1, day2 같은 키가 아니면 건너뜀 (예: title, start_date)
        if (!dayKey.startsWith('day')) return;

        // 날짜 계산: start_date + idx
        let date = '';
        if (data.start_date) {
          const d = new Date(data.start_date);
          d.setDate(d.getDate() + idx);
          date = d.toISOString().slice(0, 10);
        } else {
          date = `day${idx + 1}`;
        }
        (spots || []).forEach((spot) => {
          if (!spot) return; // spot이 null이나 undefined인 경우 방지
          arr.push({
            date,
            time: spot.time,
            id: spot.contentId,
            name: spot.place,
            image: spot.firstImage || spot.image, // firstImage 우선, 없으면 image 사용
          });
        });
      });
    }
    items.value = arr;
  } catch (e) {
    notFoundOpen.value = true;
  } finally {
    loaded.value = true;
  }
});

const groups = computed(() => {
  const acc = {};
  for (const it of items.value) {
    const d = it.date || '0000-00-00';
    (acc[d] ||= []).push(it);
  }
  return Object.entries(acc)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, arr]) => ({
      date,
      items: arr.sort((x, y) => (x.time || '').localeCompare(y.time || '')),
    }));
});

function goDetail(id) {
  if (!id) return;
  router.push({ name: 'TourplaceDetailV2', params: { id } });
}

function goList() {
  router.replace({ name: 'SavedScheduleListV2' });
}
function askDelete() {
  confirmOpen.value = true;
}
async function doDelete() {
  const id = route.params.id;
  try {
    await axios.delete(`${baseUrl}/schedules/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {}
  goList();
}

function fileBaseName() {
  const base =
    (title.value || '일정').replace(/[\\/:*?"<>|]/g, '').trim() || '일정';
  return base;
}

async function saveBoth() {
  if (saving.value) return;
  saving.value = true;
  try {
    await document.fonts?.ready;
    await saveElementAsImageAndPdf(timelineRef.value, {
      baseName: fileBaseName(),
      scale: 3,
      marginMM: 10,
      gutterMM: 6,
    });
    openSaveNotice('파일로 저장이 완료되었습니다.');
  } catch (e) {
    console.error('저장 실패:', e);
    openSaveNotice('파일 저장 중 오류가 발생했습니다.');
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.page {
  width: 100%;
  max-width: var(--app-max-width);
  margin: 0 auto;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.timeline {
  position: relative;
  z-index: 0;
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
  z-index: 1;
  align-self: start;
  justify-self: center;
}

.card-col {
  min-width: 0;
  margin-left: 6px;
}

.empty {
  padding: 24px;
  text-align: center;
  color: var(--color-mediumgray);
}

.bottom {
  position: sticky;
  bottom: 0;
  background: #f6f6f6;
  padding: 12px 1rem calc(12px + env(safe-area-inset-bottom, 0px));
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  z-index: 10;
}

.bar-btn {
  height: 48px;
  border-radius: 12px;
  border: 1px solid var(--color-mediumgray);
  background: #fff;
  color: var(--color-black);
}
.bar-btn.primary {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.bar-btn.danger {
  border-color: var(--color-red);
  color: var(--color-red);
}
</style>
