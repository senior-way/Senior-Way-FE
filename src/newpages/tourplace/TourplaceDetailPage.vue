<template>
  <div v-if="place" class="wrap">
    <SimpleHeader :title="place.name" :withBorder="false" />

    <div class="container">
      <img :src="place.image" alt="장소 이미지" class="spot-image" />

      <img
        :src="place.isBarrierFree ? yes_barrier : no_barrier"
        alt="배리어프리 안내"
        class="isBarrierImg"
      />

      <div class="graytag-list">
        <GrayTagRow label="운영시간" :text="place.openingHours" />
        <GrayTagRow label="휴무일" :text="place.holiday" />
        <GrayTagRow label="요금" :text="place.price" />
        <GrayTagRow label="설명" :text="place.description" />
        <GrayTagRow label="주소" :text="place.address" />
      </div>

      <div class="map_wrap">
        <KakaoMap :address="place.address" />
      </div>

      <!-- 컨테이너 가장 하단 버튼 2개 -->
      <div class="cta-grid">
        <SquareButton
          label="일정 추가"
          :icon="calendarIcon"
          iconAlt="일정 추가 아이콘"
          variant="mediumgray"
          :disabled="!place"
          @click="onAddSchedule"
        />
        <SquareButton
          label="음성해설"
          :icon="micIcon"
          iconAlt="음성 해설 아이콘"
          variant="mediumgray"
          :disabled="!place"
          @click="onVoiceGuide"
        />
      </div>
    </div>
  </div>

  <p v-else class="empty bodyBold32px">데이터를 불러올 수 없음</p>
</template>

<script setup>
import { ref } from 'vue'
import KakaoMap from '@/components/KakaoMap.vue'
import GrayTagRow from '@/components/layout/GrayTagRow.vue'
import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import SquareButton from '@/components/button/SquareButton.vue'

import no_barrier from '@/assets/img/no_barrier_free.png'
import yes_barrier from '@/assets/img/yes_barrier_free.png'
import calendarIcon from '@/assets/icons/schedule.png'
import micIcon from '@/assets/icons/microphone.png'

// 목업 데이터
const places = [
  {
    id: 2,
    name: '송도 해상 케이블카',
    image:
      'https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop',
    isBarrierFree: false,
    address: '부산광역시 서구 송도해변로 171',
    openingHours: '오전 9:00 ~ 오후 9:00',
    holiday: '없음',
    price: '17,000원',
    description:
      '유리 바닥으로 된 케이블카를 타고 바다와 산 경관을 감상할 수 있는 케이블카 관광 명소입니다.',
  },
]

const place = ref(places[0])

function onAddSchedule() {
  console.log('add schedule for place:', place.value?.id)
  // 추후 일정 페이지 구현 후, 기존 사용자 일정에 추가하는 로직 필요함.(leeday)
}

function onVoiceGuide() {
  console.log('open voice guide for place:', place.value?.id)
  // 추후 음성 해설 페이지 디자인 후, 해당하는 아이디 페이지로의 연결 로직 필요함.(leeday)
}
</script>

<style scoped>
.wrap {
  max-width: 420px;
  margin: 0 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container {
  width: 100%;
  background: var(--color-white);
  border-radius: 12px;
  padding: 15px;
}

.spot-image {
  width: 100%;
  aspect-ratio: 1 / 0.75;
  display: block;
  border-radius: 12px;
  object-fit: cover;
}

.isBarrierImg {
  width: 100%;
  height: auto;
  display: block;
  padding: 1rem 0;
}

.graytag-list {
  display: grid;
  place-items: center;
  width: 100%;
}

.map_wrap {
  width: 100%;
  margin-top: 12px;
  overflow: hidden;
}

.cta-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  justify-items: center; 
}

.empty {
  padding: 24px;
  text-align: center;
}
</style>
