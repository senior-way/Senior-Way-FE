<!-- src/newpages/home/HomePage.vue -->
<template>
  <div>
  <VoiceHeader title="홈" />
  <main class="home-page">
    <button class="home-card home-card-hero" type="button" @click="goSurvey">
      <img class="home-card-icon home-card-icon-hero" :src="icons.survey" alt="설문 아이콘" />
      <div class="home-card-texts">
        <h2 class="home-card-title bodyMedium28px" v-fitline="{ max:28, min:18 }">
          추천 관광 일정 생성하기
        </h2>
        <p class="home-card-desc bodyLight16px" v-fitline="{ max:16, min:12 }">
          내가 원하는 여행 스타일을 입력하면<br />
          나에게 딱 맞는 추천 관광 일정이 생성돼요!
        </p>
      </div>
    </button>

    <button class="home-card home-card-slim" type="button" @click="goSaved">
      <img class="home-card-icon home-card-icon-slim" :src="icons.schedule" alt="일정 아이콘" />
      <div class="home-card-texts">
        <h3 class="home-card-title bodyMedium26px" v-fitline="{ max:26, min:16 }">
          저장된 일정 확인
        </h3>
        <p class="home-card-desc bodyLight16px" v-fitline="{ max:16, min:12 }">
          원하는 관광 일정을 저장하고<br />
          관광지 정보도 확인해보세요!
        </p>
      </div>
    </button>

    <button class="home-card home-card-slim home-card-right" type="button" @click="goBarrierFree">
      <div class="home-card-texts">
        <h3 class="home-card-title bodyMedium26px" v-fitline="{ max:26, min:16 }">
          무장애 관광지 찾기
        </h3>
        <p class="home-card-desc bodyLight16px" v-fitline="{ max:16, min:12 }">
          휠체어 이용이 가능한<br />
          무장애 관광지를 살펴보세요!
        </p>
      </div>
      <img class="home-card-icon home-card-icon-slim" :src="icons.bf" alt="무장애 아이콘" />
    </button>

    <div class="home-banner" aria-hidden="true"></div>

    <div class="home-footer-actions">
      <button class="home-footer-action-btn bodyMedium20px" type="button" @click="showGuide">
        이용 안내
      </button>
      <button class="home-footer-action-btn bodyMedium20px" type="button" @click="goMyPage">
        정보 관리
      </button>
    </div>
  </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import VoiceHeader from '@/components/layout/VoiceHeader.vue'
import surveyIcon from '@/assets/icons/home/home-survey.png'
import scheduleIcon from '@/assets/icons/home/home-schedule.png'
import barrierIcon from '@/assets/icons/home/home-barrier.png'

import fitline from '@/directives/fitline'
const vFitline = fitline

const icons = { survey: surveyIcon, schedule: scheduleIcon, bf: barrierIcon }

const router = useRouter()
function goSurvey () { router.push({ name: 'SurveyV2' }) }
function goSaved () { router.push({ name: 'SavedScheduleListV2' }) }
function goBarrierFree () { router.push({ name: 'BarrierFreePlacesV2' }) }
function goMyPage () { router.push({ name: 'MyPageV2' }) }
function showGuide () { alert('준비중입니다.') }
</script>

<style scoped>
.home-page {
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  letter-spacing: -0.05em;
}

.home-card {
  width: 100%;
  background: var(--color-white);
  border-radius: 12px;
  color: var(--color-black);
  text-align: left;
  cursor: pointer;
}
.home-card-title { margin: 0; white-space: nowrap; }
.home-card-desc { margin: 0; color: var(--color-black); line-height: 1; }
.home-card-texts { display: flex; flex-direction: column; }

.home-card-hero {
  min-height: 240px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
}
.home-card-icon { object-fit: contain; }
.home-card-icon-hero {
  width: 108px;
  height: 108px;
  align-self: center;
}
.home-card-hero .home-card-texts { text-align: center; gap: 8px; }

.home-card-slim {
  min-height: 110px;
  padding: 14px;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  column-gap: 12px;
}
.home-card-icon-slim {
  width: 78px;
  height: 78px;
}
.home-card-slim .home-card-texts { gap: 4px; min-width: 0; }

.home-card-right { grid-template-columns: 1fr auto; }
.home-card-right .home-card-icon-slim {
  width: 72px;
  height: 72px;
}

.home-banner {
  height: 100px;
  margin: 0 -16px;
  background: var(--color-primary-10);
  border-radius: 0;
}

.home-footer-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.home-footer-action-btn {
  height: 48px;
  border-radius: 12px;
  background: var(--color-white);
  color: var(--color-black);
}
</style>
