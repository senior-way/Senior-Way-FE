<!-- src/newpages/survey/SurveyFlow.vue -->
<template>
  <div class="page">
    <StepBreadcrumb
      v-if="currentKey !== 'duration'"
      v-model:current="currentKey"
      :steps="steps"
      :clickable="true"
      @step-click="onStepClick"
    />

    <!-- 1. 체험 (6구, 멀티) -->
    <section v-if="currentKey === 'exp'" class="sec">
      <SurveyQuestionHeading
        :title-html="`하고 싶은 <em>체험</em>을 <br/><em>모두</em> 선택해주세요.`"
        :icon-src="icons.evaluation"
        icon-alt="체험 아이콘"
      />
      <SurveyOptions6Up v-model="sel.exp" :items="items6" />
      <form class="cta-wrap" @submit.prevent="goNext">
        <SubmitButton
          label="다음 질문 넘어가기"
          variant="primary"
          :disabled="!canProceed.exp"
        />
      </form>
      <p class="note bodyMedium16px">
        현재 <a href="#">선호도 조사</a> 진행중입니다.
      </p>
    </section>

    <!-- 2. 이동수단 (4구, 멀티 가정 → 어댑터 사용) -->
    <section v-else-if="currentKey === 'move'" class="sec">
      <SurveyQuestionHeading
        :title-html="`이용할 <em>이동수단</em>을 <br/><em>모두</em> 선택해주세요.`"
        :icon-src="icons.publicTransport"
        icon-alt="이동수단 아이콘"
      />
      <SurveyOptions4Up v-model="moveModel" :items="items4" />
      <form class="cta-wrap" @submit.prevent="goNext">
        <SubmitButton
          label="다음 질문 넘어가기"
          variant="primary"
          :disabled="!canProceed.move"
        />
      </form>
      <p class="note bodyMedium16px">
        현재 <a href="#">선호도 조사</a> 진행중입니다.
      </p>
    </section>

    <!-- 3. 휠체어 (2구, 단일) -->
    <section v-else-if="currentKey === 'wheelchair'" class="sec">
      <SurveyQuestionHeading
        :title-html="`<em>휠체어</em> 사용 여부를 선택해주세요.`"
        :icon-src="icons.wheelchair"
        icon-alt="휠체어 아이콘"
      />
      <SurveyOptions2Up
        v-model="sel.wheelchair"
        :items="[
          `휠체어를 <span class='hl pos'>사용합니다.</span>`,
          `휠체어를 <span class='hl neg'>사용하지 않습니다.</span>`,
        ]"
      />
      <form class="cta-wrap" @submit.prevent="goNext">
        <SubmitButton
          label="다음 질문 넘어가기"
          variant="primary"
          :disabled="!canProceed.wheelchair"
        />
      </form>
      <p class="note bodyMedium16px">
        현재 <a href="#">선호도 조사</a> 진행중입니다.
      </p>
    </section>

    <!-- 4. 반려동물 (2구, 단일) -->
    <section v-else-if="currentKey === 'pets'" class="sec">
      <SurveyQuestionHeading
        :title-html="`<em>반려동물</em> 동반 여부를 선택해주세요.`"
        :icon-src="icons.pets"
        icon-alt="반려동물 아이콘"
      />
      <SurveyOptions2Up
        v-model="sel.pets"
        :items="[
          `반려동물을 <span class='hl pos'>동반합니다.</span>`,
          `반려동물을 <span class='hl neg'>동반하지 않습니다.</span>`,
        ]"
      />
      <form class="cta-wrap" @submit.prevent="goNext">
        <SubmitButton
          label="다음 질문 넘어가기"
          variant="primary"
          :disabled="!canProceed.pets"
        />
      </form>
      <p class="note bodyMedium16px">
        현재 <a href="#">선호도 조사</a> 진행중입니다.
      </p>
    </section>

    <!-- 5. 전자기기 활용능력 (3구, 단일 → 어댑터 사용) -->
    <section v-else-if="currentKey === 'device'" class="sec">
      <SurveyQuestionHeading
        :title-html="`<em>전자기기 활용 능력</em>을 선택해주세요.`"
        :icon-src="icons.smartphone"
        icon-alt="스마트폰 아이콘"
      />
      <SurveyOptions3Up v-model="deviceModel" :items="items3" />
      <form class="cta-wrap" @submit.prevent="goNext">
        <SubmitButton
          label="다음 질문 넘어가기"
          variant="primary"
          :disabled="!canProceed.device"
        />
      </form>
      <p class="note bodyMedium16px">
        현재 <a href="#">선호도 조사</a> 진행중입니다.
      </p>
    </section>

    <!-- 6. 여행기간 (breadcrumb 미표시, 6Up 단일선택) -->
    <section v-else-if="currentKey === 'duration'" class="sec sec-duration">
      <div class="last-step-badge bodyMedium14px" aria-label="마지막 단계">
        <svg class="badge-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M3 12l5 5L21 4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        마지막 단계
      </div>

      <div class="duration-head">
        <h2 class="duration-title bodyBold32px">
          <span class="nowrap primary">여행 일정</span>을<br />
          설정해주세요.
        </h2>
        <img class="duration-icon" :src="icons.schedule" alt="여행 아이콘" />
      </div>

      <SurveyOptions6Up v-model="durationModel" :items="durationItems" />
      <form class="cta-wrap" @submit.prevent="finish">
        <SubmitButton
          label="추천 일정 생성하기"
          variant="primary"
          :disabled="sel.duration === null || posting"
        />
      </form>
      <p class="note bodyMedium16px">
        현재 <a href="#">선호도 조사</a> 진행중입니다.
      </p>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

import StepBreadcrumb from '@/components/layout/StepBreadcrumb.vue';
import SurveyQuestionHeading from '@/newpages/survey/components/SurveyQuestion.vue';
import SurveyOptions6Up from '@/newpages/survey/components/SurveyOptions6Up.vue';
import SurveyOptions4Up from '@/newpages/survey/components/SurveyOptions4Up.vue';
import SurveyOptions2Up from '@/newpages/survey/components/SurveyOptions2Up.vue';
import SurveyOptions3Up from '@/newpages/survey/components/SurveyOptions3Up.vue';
import SubmitButton from '@/components/button/SubmitButton.vue';

import iconEvaluation from '@/assets/icons/evaluation.png';
import iconPublicTransport from '@/assets/icons/public-transport.png';
import iconSmartphone from '@/assets/icons/smartphone.png';
import iconPets from '@/assets/icons/pets.png';
import iconWheelchair from '@/assets/icons/wheelchair.png';
import selectPublicTransport from '@/assets/icons/select_transport.png';
import selectCar from '@/assets/icons/select_car.png';
import selectBike from '@/assets/icons/select_bike.png';
import selectWalk from '@/assets/icons/select_walk.png';
import selectNature from '@/assets/icons/select_nature.png';
import selectCulture from '@/assets/icons/select_culture.png';
import selectFood from '@/assets/icons/select_food.png';
import selectShopping from '@/assets/icons/select_shopping.png';
import selectActivity from '@/assets/icons/select_activity.png';
import selectAny from '@/assets/icons/select_any.png';
import schedule from '@/assets/icons/schedule2.png';

const router = useRouter();
const baseUrl = import.meta.env.VITE_API_BASE_URL

const icons = {
  evaluation: iconEvaluation,
  publicTransport: iconPublicTransport,
  smartphone: iconSmartphone,
  pets: iconPets,
  wheelchair: iconWheelchair,
  schedule,
};

/* breadcrumb에는 duration을 추가하지 않음 */
const steps = [
  { key: 'exp', label: '체험' },
  { key: 'move', label: '이동수단' },
  { key: 'wheelchair', label: '휠체어' },
  { key: 'pets', label: '반려동물' },
  { key: 'device', label: '전자기기\n활용능력' },
];
const currentKey = ref(steps[0].key);

const sel = ref({
  exp: [],
  move: [],
  wheelchair: '',
  pets: '',
  device: '',
  duration: null,
});

const canProceed = computed(() => ({
  exp: Array.isArray(sel.value.exp) && sel.value.exp.length > 0,
  move: Array.isArray(sel.value.move)
    ? sel.value.move.length > 0
    : !!sel.value.move,
  wheelchair: !!sel.value.wheelchair,
  pets: !!sel.value.pets,
  device: !!(typeof sel.value.device === 'object'
    ? sel.value.device?.key
    : sel.value.device),
}));

function indexOfKey(key) {
  return steps.findIndex((s) => s.key === key);
}

async function saveSurveyStep() {
  const resultPayload = {
    preferredCategory: Array.isArray(sel.value.exp)
      ? sel.value.exp.join(',')
      : '',
    preferredTransportation: Array.isArray(moveModel.value)
      ? moveModel.value.join(',')
      : '',
    wheelchairUsage: String(sel.value.wheelchair).includes('사용합니다')
      ? 1
      : 0,
    petCompanion: String(sel.value.pets).includes('동반합니다') ? 1 : 0,
    digitalLiteracy: (() => {
      const key = deviceModel.value;
      if (key === 'high') return '상';
      if (key === 'mid') return '중';
      if (key === 'low') return '하';
      return '';
    })(),
  };

  const jwt =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('jwt') ||
    localStorage.getItem('token') ||
    '';

  try {
    // 기존 데이터 조회
    const meRes = await axios.get(
      `${baseUrl}/user-profiles/me`,
      {
        headers: {
          Authorization: jwt ? `Bearer ${jwt}` : undefined,
        },
      }
    );
    if (meRes.data && meRes.data.id) {
      // 기존 데이터가 있으면 삭제
      await axios.delete(`${baseUrl}/user-profiles/me`, {
        headers: {
          Authorization: jwt ? `Bearer ${jwt}` : undefined,
        },
      });
    }
  } catch (e) {
    // 조회 실패시 무시(없을 수도 있음)
  }

  // 새로 저장
  axios
    .post(`${baseUrl}/user-profiles`, resultPayload, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : undefined,
      },
    })
    .catch(() => {
      // 실패해도 무시
    });
}

function goNext() {
  if (currentKey.value === 'device') {
    saveSurveyStep(); // 전자기기 활용능력 단계에서만 저장
    if (sel.value.duration === 1) {
      finish();
    }
    currentKey.value = 'duration';
    return;
  }
  const i = indexOfKey(currentKey.value);
  if (i > -1 && i < steps.length - 1) currentKey.value = steps[i + 1].key;
}

function onStepClick() {}

const items6 = [
  { value: '자연', label: '자연', icon: selectNature },
  { value: '역사·문화·예술', label: '역사·문화', icon: selectCulture },
  { value: '먹거리', label: '먹거리', icon: selectFood },
  { value: '쇼핑', label: '쇼핑', icon: selectShopping },
  { value: '체험 활동', label: '체험 활동', icon: selectActivity },
  { value: '상관 없음', label: '상관 없음', icon: selectAny },
];

const items4 = [
  { value: '대중교통', label: '대중교통', icon: selectPublicTransport },
  { value: '자차', label: '자차', icon: selectCar },
  { value: '자전거', label: '자전거', icon: selectBike },
  { value: '도보', label: '도보', icon: selectWalk },
];

const items3 = [
  {
    key: 'high',
    level: 'high',
    title: '상',
    desc: '스마트폰을 능숙하게 사용할 수 있습니다.<br/>앱 설치 및 설정이 가능합니다. 카카오톡, 유튜브, 인터넷 뱅킹 사용이 가능합니다.',
  },
  {
    key: 'mid',
    level: 'mid',
    title: '중',
    desc: '전화/문자/사진 사용이 가능합니다.<br/>카카오톡, 유튜브 등은 익숙하지만 새로운 기능은 약간의 도움이 필요합니다.',
  },
  {
    key: 'low',
    level: 'low',
    title: '하',
    desc: '스마트폰 사용이 서툽니다.<br/>전화/문자/사진 사용이 어렵습니다. 대부분 상황에서 도움이 필요합니다.',
  },
];

const moveModel = computed({
  get() {
    return Array.isArray(sel.value.move)
      ? sel.value.move
      : sel.value.move
      ? [sel.value.move]
      : [];
  },
  set(next) {
    sel.value.move = Array.isArray(next) ? next : next ? [next] : [];
  },
});

const deviceModel = computed({
  get() {
    return typeof sel.value.device === 'object' && sel.value.device !== null
      ? sel.value.device.key ?? ''
      : sel.value.device ?? '';
  },
  set(next) {
    sel.value.device =
      typeof next === 'object' && next !== null ? next.key ?? '' : next ?? '';
  },
});

const durationItems = [
  { value: 0, label: '당일치기', icon: '' },
  { value: 1, label: '1박 2일', icon: '' },
  { value: 2, label: '2박 3일', icon: '' },
  { value: 3, label: '3박 4일', icon: '' },
  { value: 4, label: '4박 5일', icon: '' },
  { value: 5, label: '5박 6일', icon: '' },
];
const durationModel = computed({
  get() {
    return sel.value.duration === null ? [] : [sel.value.duration];
  },
  set(arr) {
    sel.value.duration =
      Array.isArray(arr) && arr.length ? Number(arr[arr.length - 1]) : null;
  },
});

const posting = ref(false);

async function finish() {
  if (sel.value.duration === null || posting.value) return;
  posting.value = true;

  const jwt =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('jwt') ||
    localStorage.getItem('token') ||
    '';

  const nights = sel.value.duration;
  const days = nights === 0 ? 1 : nights + 1;

  let scheduleData = null;
  try {
    const res = await axios.post(
      `${baseUrl}/schedules/prompt`,
      { days },
      {
        headers: {
          Authorization: jwt ? `Bearer ${jwt}` : undefined,
        },
      }
    );
    scheduleData = res.data;
  } catch (e) {
    // 실패시 scheduleData는 null, 아래 목데이터 사용
  }

  let itemsByDay = {};
  if (scheduleData && typeof scheduleData === 'object') {
    Object.keys(scheduleData).forEach((dayKey) => {
      itemsByDay[dayKey] = (scheduleData[dayKey] || []).map((item) => ({
        time: item.time,
        name: item.place,
        image: item.firstImage,
        id: item.contentId,
      }));
    });
  } else {
    // 기존 목데이터
    const spotPool = [
      {
        id: 501,
        name: '광안리 해수욕장',
        image: 'https://picsum.photos/id/1011/400/250',
      },
      {
        id: 502,
        name: '송도 해상 케이블카',
        image: 'https://picsum.photos/id/1012/400/250',
      },
      {
        id: 503,
        name: '부산시립미술관',
        image: 'https://picsum.photos/id/1014/400/250',
      },
      {
        id: 504,
        name: '부산타워',
        image: 'https://picsum.photos/id/1020/400/250',
      },
      {
        id: 505,
        name: '해운대 해수욕장',
        image: 'https://picsum.photos/id/1016/400/250',
      },
    ];
    itemsByDay['day1'] = spotPool.map((s, idx) => ({
      time: `${9 + idx * 2}:00`,
      name: s.name,
      image: s.image,
      id: s.id,
    }));
  }

  const rid = String(Date.now());
  const start = new Date();
  start.setHours(9, 0, 0, 0);

  const title =
    nights === 0 ? '당일치기 추천 일정' : `${nights}박 ${days}일 추천 일정`;

  // ScheduleTimelinePage에서 읽을 수 있도록 저장
  localStorage.setItem(
    `mockSchedule:${rid}`,
    JSON.stringify({
      title,
      start_date: start.toISOString(),
      days: itemsByDay,
    })
  );

  posting.value = false;
  // 결과 페이지로 이동, rid 전달
  router.push({ name: 'ScheduleTimelineV2', query: { rid, source: 'mock' } });
}
</script>

<style scoped>
.page {
  --q-gap: 20px;
  --btn-gap: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 24px 30px;
}

.sec {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  margin-top: 32px;
}
:deep(.q-head) {
  width: 100%;
  margin-bottom: var(--q-gap);
}

.cta-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: var(--btn-gap);
}

.note {
  margin-top: 16px;
  color: var(--color-mediumgray);
}
.note a {
  color: var(--color-primary);
  text-decoration: underline;
}
:deep(.hl.pos) {
  color: var(--color-blue);
}
:deep(.hl.neg) {
  color: var(--color-red);
}
:deep(.q-title em),
:deep(.q-title .accent) {
  color: var(--color-primary);
  font-style: normal;
}

.last-step-badge {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--color-primary-10);
  color: var(--color-primary);
  margin-bottom: 6px;
}
.badge-icon {
  width: 16px;
  height: 16px;
}

.sec-duration {
  margin-top: 0;
}

/* step6 헤더 스타일 */
.duration-head {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.duration-title {
  margin: 0 0 1rem 0;
  letter-spacing: -0.03em;
  line-height: 1.15;
}
.duration-title .nowrap {
  white-space: nowrap;
}
.duration-title .primary {
  color: var(--color-primary);
}
.duration-icon {
  width: 56px;
  height: 56px;
  object-fit: contain;
  flex: 0 0 auto;
}

.sec-duration {
  gap: 16px;
}
.duration-grid {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 8px;
  list-style: none;
  padding: 0;
}

.duration-btn {
  width: 100%;
  height: 100px;
  border-radius: 12px;
  border: 1.3px solid var(--color-lightgray);
  background: #fff;
  color: var(--color-black);
  transition: var(--transition);
}

.duration-btn.active {
  border-color: var(--color-primary);
  background: var(--color-primary-10);
  color: var(--color-primary);
}
</style>
