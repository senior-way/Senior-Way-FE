<!-- src/newpages/tourplace/TourplaceDetailPage.vue -->
<template>
  <div v-if="place" class="wrap">
    <SimpleHeader :title="place.name" :withBorder="false" />

    <div class="container">
      <div class="hero" @mouseenter="pause" @mouseleave="play">
        <transition name="fade" mode="out-in">
          <img
            :key="current"
            :src="slides[current]"
            :alt="`${place.name} 이미지 ${current+1}/${slides.length}`"
            class="spot-image"
          />
        </transition>

        <div v-if="slides.length > 1" class="dots" role="tablist" aria-label="이미지 인디케이터">
          <button
            v-for="(s, i) in slides"
            :key="i"
            class="dot-btn"
            :class="{ active: i === current }"
            :aria-label="`${i + 1}번째 이미지 보기`"
            :aria-selected="i === current"
            role="tab"
            @click="go(i)"
          />
        </div>
      </div>

      <!-- 배리어프리 안내 -->
      <img
        :src="place.isBarrierFree ? yes_barrier : no_barrier"
        alt="배리어프리 안내"
        class="isBarrierImg"
      />

      <!-- 공통 정보 -->
      <div class="graytag-list">
        <GrayTagRow label="주소" :text="addressFull" />
        <GrayTagRow label="전화번호" :text="place.phone || '정보 없음'" />
        <GrayTagRow v-if="place.description" label="설명" :text="place.description" />
      </div>

      <!-- 타입별 상세 -->
      <div class="graytag-list" v-if="typeRows.length">
        <GrayTagRow
          v-for="row in typeRows"
          :key="row.label"
          :label="row.label"
          :text="row.text"
        />
      </div>

      <div class="map_wrap">
        <KakaoMap :address="addressFull" />
      </div>

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

  <p v-else-if="!loading && loadError" class="empty bodyBold32px">
    데이터를 불러올 수 없음
  </p>

  <!-- 로딩 중에는 아무 것도 표시하지 않거나 스피너 표시 가능 -->
  <p v-else class="empty bodyBold32px">
    <!-- optional: 로딩 중 표시 -->
  </p>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
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
    const rawId = (route.params?.id ?? '').toString().trim()
    const id = Number(rawId)
    if (!Number.isFinite(id)) {
      place.value = null
      return
    }

    // 실제 백엔드 경로에 맞춰 GET 요청
    const { data } = await axios.get(`http://localhost:8080/api/tourist-spot/detail/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}` // 필요 시
      }
    })

    // normalizePlace로 매핑
    place.value = normalizePlace(data)
    resetCarousel()
  } catch (err) {
    console.error('장소 불러오기 실패:', err)
    place.value = null
  }
}


function normalizePlace(raw) {
  if (!raw) return null
  const spot = raw.spot ?? {}
  const detail = raw.detail ?? {}

  return {
    id: spot.touristSpotId,
    type_id: spot.contentTypeId,
    name: spot.title,
    phone: spot.tel,
    address: spot.addr1,
    addressDetail: spot.addr2,
    image: spot.firstimage,
    thumbnails: [spot.firstimage, spot.firstimage2].filter(Boolean),
    isBarrierFree: detail.chkBarrierFree === 'Y', // 예시, 실제 데이터 확인 필요
    openingHours: detail.useTime,
    holiday: detail.restDate,
    price: detail.price,
    description: spot.description,
    openDate: detail.openDate,
    experience: detail.expGuide,
    parkingInfo: detail.parkingAvailable,
    petAllowed: detail.chkPet === 'Y',
    discount: detail.discount,
    parking: detail.parking,
    operatingPeriod: detail.operatingPeriod,
    items: detail.items,
    signatureMenu: detail.signatureMenu,
    menus: detail.menus,
  }
}


const addressFull = computed(() => {
  const a = place.value?.address || ''
  const b = place.value?.addressDetail || ''
  return b ? `${a} ${b}`.trim() : a
})

const typeRows = computed(() => {
  const p = place.value
  if (!p) return []
  const rowsByType = {
    12: [
      { label: '개방일', text: p.openDate },
      { label: '휴무일', text: p.holiday },
      { label: '체험 안내', text: p.experience },
      { label: '주차 정보', text: p.parkingInfo },
      { label: '반려동물', text: ynToText(p.petAllowed) },
    ],
    14: [
      { label: '휴무일', text: p.holiday },
      { label: '이용 요금', text: p.price },
      { label: '할인 정보', text: p.discount },
      { label: '주차 여부', text: ynToAvail(p.parking) },
      { label: '반려동물', text: ynToText(p.petAllowed) },
    ],
    28: [
      { label: '운영 기간', text: p.operatingPeriod },
      { label: '휴무일', text: p.holiday },
      { label: '이용 요금', text: p.price },
      { label: '주차 여부', text: ynToAvail(p.parking) },
      { label: '반려동물', text: ynToText(p.petAllowed) },
    ],
    38: [
      { label: '판매 품목', text: p.items },
      { label: '영업 시간', text: p.openingHours },
      { label: '휴무일', text: p.holiday },
      { label: '주차 여부', text: ynToAvail(p.parking) },
      { label: '반려동물', text: ynToText(p.petAllowed) },
    ],
    39: [
      { label: '대표 메뉴', text: p.signatureMenu },
      { label: '취급 메뉴', text: p.menus },
      { label: '주차 여부', text: ynToAvail(p.parking) },
    ],
  }
  const list = rowsByType[p.type_id] ?? []
  return list.filter(row => !!String(row.text ?? '').trim())
})

function ynToText(v) {
  if (v === true || v === 'Y' || v === 'y') return '가능'
  if (v === false || v === 'N' || v === 'n') return '불가'
  return v ?? ''
}
function ynToAvail(v) {
  if (v === true || v === 'Y' || v === 'y') return '주차 가능'
  if (v === false || v === 'N' || v === 'n') return '주차 불가'
  return v ?? ''
}

/* ---------- 캐러셀 ---------- */
const current = ref(0)
const INTERVAL = 3500
let timer = null

const slides = computed(() => {
  const base = []
  if (place.value?.image) base.push(place.value.image)
  if (Array.isArray(place.value?.thumbnails) && place.value.thumbnails.length) {
    base.push(...place.value.thumbnails)
  }
  return base
})

function next() { current.value = (current.value + 1) % slides.value.length }
function play() {
  stop()
  if (slides.value.length > 1) {
    timer = setInterval(next, INTERVAL)
  }
}
function pause() { stop() }
function stop() {
  if (timer) { clearInterval(timer); timer = null }
}
function go(i) {
  current.value = i
  play()
}
function resetCarousel() {
  current.value = 0
  play()
}

watch(slides, resetCarousel)
onMounted(() => { loadPlace(); })
onBeforeUnmount(stop)
watch(() => route.params?.id, async () => { await loadPlace() })
/* ---------- 액션 ---------- */
function onAddSchedule() {
  console.log('add schedule for place:', place.value?.id)
}
function onVoiceGuide() {
  console.log('open voice guide for place:', place.value?.id)
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

.hero {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}
.spot-image {
  width: 100%;
  aspect-ratio: 1 / 0.75;
  display: block;
  object-fit: cover;
  border-radius: 12px;
}

.fade-enter-active, .fade-leave-active { transition: opacity .35s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.dots {
  position: absolute;
  left: 0; right: 0; bottom: 8px;
  display: flex; gap: 6px; justify-content: center;
}
.dot-btn {
  width: 8px; height: 8px; border-radius: 50%;
  border: 0; background: rgba(255,255,255,0.5); padding: 0; cursor: pointer;
}
.dot-btn.active { background: var(--color-primary); }

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
  row-gap: 2px;
  margin-top: 4px;
}

.graytag-list + .graytag-list { 
  margin-top: 18px;      /* 두 리스트 사이 간격 */
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
