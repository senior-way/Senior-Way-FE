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
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import KakaoMap from '@/components/KakaoMap.vue'
import GrayTagRow from '@/components/layout/GrayTagRow.vue'
import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import SquareButton from '@/components/button/SquareButton.vue'

import no_barrier from '@/assets/img/no_barrier_free.png'
import yes_barrier from '@/assets/img/yes_barrier_free.png'
import calendarIcon from '@/assets/icons/schedule.png'
import micIcon from '@/assets/icons/microphone.png'

const route = useRoute()
const place = ref(null)

async function loadPlace() {
  try {
    const idParam = route.params?.id
    if (idParam) {
      // /tourplace/:id
      const { data } = await axios.get(`/api/tourplace/${idParam}`)
      place.value = data
    } else {
      // /tourplace (첫 항목만 사용)
      const { data } = await axios.get('/api/tourplace', { params: { _limit: 1 } })
      place.value = Array.isArray(data) ? data[0] ?? null : null
    // 백엔드 연결 시, 하단 코드 사용.
    //   const { data } = await axios.get('/api/tourplace', { params: { page: 0, size: 1, sort: 'id,asc' } })
    //   place.value = Array.isArray(data) ? data[0] ?? null : (data?.content?.[0] ?? null)
    }
  } catch (err) {
    console.error('장소 불러오기 실패:', err)
    place.value = null
  }
}

onMounted(loadPlace)
// 상세 페이지에서 다른 id로 전환될 수 있으므로 감시
watch(() => route.params?.id, () => loadPlace())

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
