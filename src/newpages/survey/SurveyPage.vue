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
        <SubmitButton label="다음 질문 넘어가기" variant="primary" :disabled="!canProceed.exp" />
      </form>
      <p class="note bodyMedium16px">현재 <a href="#">선호도 조사</a> 진행중입니다.</p>
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
        <SubmitButton label="다음 질문 넘어가기" variant="primary" :disabled="!canProceed.move" />
      </form>
      <p class="note bodyMedium16px">현재 <a href="#">선호도 조사</a> 진행중입니다.</p>
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
          `휠체어를 <span class='hl neg'>사용하지 않습니다.</span>`
        ]"
      />
      <form class="cta-wrap" @submit.prevent="goNext">
        <SubmitButton label="다음 질문 넘어가기" variant="primary" :disabled="!canProceed.wheelchair" />
      </form>
      <p class="note bodyMedium16px">현재 <a href="#">선호도 조사</a> 진행중입니다.</p>
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
          `반려동물을 <span class='hl neg'>동반하지 않습니다.</span>`
        ]"
      />
      <form class="cta-wrap" @submit.prevent="goNext">
        <SubmitButton label="다음 질문 넘어가기" variant="primary" :disabled="!canProceed.pets" />
      </form>
      <p class="note bodyMedium16px">현재 <a href="#">선호도 조사</a> 진행중입니다.</p>
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
        <SubmitButton label="다음 질문 넘어가기" variant="primary" :disabled="!canProceed.device" />
      </form>
      <p class="note bodyMedium16px">현재 <a href="#">선호도 조사</a> 진행중입니다.</p>
    </section>

    <!-- 6. 여행기간 (breadcrumb 미표시, 6Up 단일선택) -->
    <section v-else-if="currentKey === 'duration' " class="sec sec-duration">
      <!-- 마지막 단계 배지 -->
      <div class="last-step-badge bodyMedium14px" aria-label="마지막 단계">
        <svg class="badge-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 12l5 5L21 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        마지막 단계
      </div>

      <div class="duration-head">
        <h2 class="duration-title bodyBold32px">
          <span class="nowrap primary">여행 일정</span>을<br/> 설정해주세요.
        </h2>
        <img class="duration-icon" :src="icons.schedule" alt="여행 아이콘" />
      </div>

      <SurveyOptions6Up v-model="durationModel" :items="durationItems" />
      <form class="cta-wrap" @submit.prevent="finish">
        <SubmitButton label="설문 끝내기" variant="primary" :disabled="sel.duration === null" />
      </form>
      <p class="note bodyMedium16px">현재 <a href="#">선호도 조사</a> 진행중입니다.</p>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import StepBreadcrumb from '@/components/layout/StepBreadcrumb.vue'
import SurveyQuestionHeading from '@/newpages/survey/components/SurveyQuestion.vue'
import SurveyOptions6Up from '@/newpages/survey/components/SurveyOptions6Up.vue'
import SurveyOptions4Up from '@/newpages/survey/components/SurveyOptions4Up.vue'
import SurveyOptions2Up from '@/newpages/survey/components/SurveyOptions2Up.vue'
import SurveyOptions3Up from '@/newpages/survey/components/SurveyOptions3Up.vue'
import SubmitButton from '@/components/button/SubmitButton.vue'

/* 아이콘 */
import iconEvaluation from '@/assets/icons/evaluation.png'
import iconPublicTransport from '@/assets/icons/public-transport.png'
import iconSmartphone from '@/assets/icons/smartphone.png'
import iconPets from '@/assets/icons/pets.png'
import iconWheelchair from '@/assets/icons/wheelchair.png'

/* 4구 아이콘 */
import selectPublicTransport from '@/assets/icons/select_transport.png'
import selectCar from '@/assets/icons/select_car.png'
import selectBike from '@/assets/icons/select_bike.png'
import selectWalk from '@/assets/icons/select_walk.png'

/* 6구 아이콘 (재사용) */
import selectNature from '@/assets/icons/select_nature.png'
import selectCulture from '@/assets/icons/select_culture.png'
import selectFood from '@/assets/icons/select_food.png'
import selectShopping from '@/assets/icons/select_shopping.png'
import selectActivity from '@/assets/icons/select_activity.png'
import selectAny from '@/assets/icons/select_any.png'

import schedule from '@/assets/icons/schedule2.png'

const icons = {
  evaluation: iconEvaluation,
  publicTransport: iconPublicTransport,
  smartphone: iconSmartphone,
  pets: iconPets,
  wheelchair: iconWheelchair,
  schedule: schedule
}

/* breadcrumb에는 duration을 추가하지 않음 */
const steps = [
  { key: 'exp',        label: '체험' },
  { key: 'move',       label: '이동수단' },
  { key: 'wheelchair', label: '휠체어' },
  { key: 'pets',       label: '반려동물' },
  { key: 'device',     label: '전자기기\n활용능력' }
]
const currentKey = ref(steps[0].key)

const sel = ref({
  exp: [],
  move: [],         // 구현에 따라 문자열이 들어올 수도 → 어댑터로 정규화
  wheelchair: '',
  pets: '',
  device: '',       // 객체/문자열 혼용 → 어댑터로 정규화
  duration: null    // 0~5 중 하나
})

/* 진행 가능 여부(타입 안전) */
const canProceed = computed(() => ({
  exp:        Array.isArray(sel.value.exp) && sel.value.exp.length > 0,
  move:       Array.isArray(sel.value.move) ? sel.value.move.length > 0 : !!sel.value.move,
  wheelchair: !!sel.value.wheelchair,
  pets:       !!sel.value.pets,
  device:     !!(typeof sel.value.device === 'object'
                  ? sel.value.device?.key
                  : sel.value.device)
  // duration은 마지막 스텝에서만 검사
}))

function indexOfKey (key) { return steps.findIndex(s => s.key === key) }

/* 마지막(디바이스) 다음은 강제로 duration으로 이동 */
function goNext () {
  if (currentKey.value === 'device') {
    currentKey.value = 'duration'
    return
  }
  const i = indexOfKey(currentKey.value)
  if (i > -1 && i < steps.length - 1) currentKey.value = steps[i + 1].key
}

function onStepClick () {}

/* 6Up(체험) */
const items6 = [
  { value: '자연',           label: '자연',     icon: selectNature },
  { value: '역사·문화·예술', label: '역사·문화', icon: selectCulture },
  { value: '먹거리',         label: '먹거리',   icon: selectFood },
  { value: '쇼핑',           label: '쇼핑',     icon: selectShopping },
  { value: '체험 활동',      label: '체험 활동', icon: selectActivity },
  { value: '상관 없음',      label: '상관 없음', icon: selectAny }
]

/* 4Up(이동수단) */
const items4 = [
  { value: '대중교통', label: '대중교통', icon: selectPublicTransport },
  { value: '자차',     label: '자차',     icon: selectCar },
  { value: '자전거',   label: '자전거',   icon: selectBike },
  { value: '도보',     label: '도보',     icon: selectWalk }
]

/* 3Up(디바이스) */
const items3 = [
  { key: 'high', level: 'high', title: '상', desc: '스마트폰을 능숙하게 사용할 수 있습니다.<br/>앱 설치 및 설정이 가능합니다. 카카오톡, 유튜브, 인터넷 뱅킹 사용이 가능합니다.' },
  { key: 'mid',  level: 'mid',  title: '중', desc: '전화/문자/사진 사용이 가능합니다.<br/>카카오톡, 유튜브 등은 익숙하지만 새로운 기능은 약간의 도움이 필요합니다.' },
  { key: 'low',  level: 'low',  title: '하', desc: '스마트폰 사용이 서툽니다.<br/>전화/문자/사진 사용이 어렵습니다. 대부분 상황에서 도움이 필요합니다.' }
]

/* --- 어댑터들 --- */
const moveModel = computed({
  get() {
    const v = sel.value.move
    return Array.isArray(v) ? v : (v ? [v] : [])
  },
  set(next) {
    sel.value.move = Array.isArray(next) ? next : (next ? [next] : [])
  }
})

const deviceModel = computed({
  get() {
    const v = sel.value.device
    return typeof v === 'object' && v !== null ? (v.key ?? '') : (v ?? '')
  },
  set(next) {
    sel.value.device = typeof next === 'object' && next !== null ? (next.key ?? '') : (next ?? '')
  }
})

/* 여행기간: 6Up은 배열 기반이라 단일값을 마지막 선택으로 매핑 */
const durationItems = [
  { value: 0, label: '당일치기', icon: '' },
  { value: 1, label: '1박 2일',  icon: '' },
  { value: 2, label: '2박 3일',  icon: '' },
  { value: 3, label: '3박 4일',  icon: '' },
  { value: 4, label: '4박 5일',  icon: '' },
  { value: 5, label: '5박 6일',  icon: '' }
]
const durationModel = computed({
  get() {
    return sel.value.duration === null ? [] : [sel.value.duration]
  },
  set(arr) {
    sel.value.duration = Array.isArray(arr) && arr.length ? Number(arr[arr.length - 1]) : null
  }
})

function finish () {
  const nights = sel.value.duration ?? 0
  const days = nights + 1
  console.log('[설문 결과]', { ...sel.value, nights, days })
  alert(`설문이 완료되었습니다!\n여행 일정: ${nights === 0 ? '당일치기' : `${nights}박 ${days}일`}`)
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
:deep(.q-head) { width: 100%; margin-bottom: var(--q-gap); }

.cta-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: var(--btn-gap);
}

.note { margin-top: 16px; color: var(--color-mediumgray); }
.note a { color: var(--color-primary); text-decoration: underline; }
:deep(.hl.pos) { color: var(--color-blue); }
:deep(.hl.neg) { color: var(--color-red); }
:deep(.q-title em), :deep(.q-title .accent) {
  color: var(--color-primary);
  font-style: normal;
}

.last-step-badge{
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
.badge-icon{ width: 16px; height: 16px; }

.sec-duration{
  margin-top: 0;
}

/* step6 헤더 스타일 */
.duration-head{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  /* margin-bottom: 12px; */
}
.duration-title{
  margin: 0 0 1rem 0;
  letter-spacing: -0.03em;
  line-height: 1.15;
}
.duration-title .nowrap{ white-space: nowrap; }
.duration-title .primary{ color: var(--color-primary); }
.duration-icon{
  width: 56px;
  height: 56px;
  object-fit: contain;
  flex: 0 0 auto;
}

.sec-duration { gap: 16px; }
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
