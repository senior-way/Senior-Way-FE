<template>
  <div v-if="place">
    <div class="wrap">
      <header>
        <p class="title">{{ place.name }}</p>
      </header>
      <div class="container">
        <div class="content">
          <!-- <img :src="spot.image" :alt="spot.name" class="spot-image" /> -->
          <img
            :src="place.image"
            alt="장소 이미지"
            style="border-radius: 0.75rem"
            class="spot-image"
          />
          <div class="infoItem_wrap" style="margin-top: 0.375rem">
            <div v-if="place.isBarrierFree == true">
              <img :src="yes_barrier" alt="" class="isBarrierImg" />
            </div>
            <div v-else>
              <img :src="no_barrier" alt="" class="isBarrierImg" />
            </div>
          </div>
          <div class="description_wrap">
            <div class="infoItem_wrap">
              <div class="border"><p>장소</p></div>
              <div class="place_name">{{ place.address }}</div>
            </div>
            <div class="infoItem_wrap">
              <div class="border"><p>운영시간</p></div>
              <div class="place_name">{{ place.openingHours }}</div>
            </div>
            <div class="infoItem_wrap">
              <div class="border"><p>휴무일</p></div>
              <div class="place_name">{{ place.holiday }}</div>
            </div>
            <div class="infoItem_wrap" style="margin-bottom: 0.8125rem">
              <div class="border"><p>요금</p></div>
              <div class="place_name">{{ place.price }}</div>
            </div>
            <div class="infoItem_wrap" style="align-items: flex-start">
              <div class="border"><p>설명</p></div>
              <div class="place_name">{{ place.description }}</div>
            </div>
          </div>
          <div class="btn_wrap">
            <button class="sound_btn">음성 해설</button>
            <button class="add_btn">일정에 추가</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p style="font-size: 50px">데이터를 불러올 수 없음</p>
  </div>
</template>


<script setup>
  import axios from 'axios';
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router'; 
  import no_barrier from '@/assets/img/no_barrier_free.png';
  import yes_barrier from '@/assets/img/yes_barrier_free.png';

  const route = useRoute(); 
  const place = ref(null);

  // 현재 장소 ID 가져오기
  const placeId = parseInt(route.params.id);

  onMounted(async () => {
    try {
    // api연결 전/ testServer.json 파일에 GET 요청
      const response = await axios.get('/testServer.json'); 
      const allPlaces = response.data.places;

      // ID가 일치하는 장소 찾기
      place.value = allPlaces.find(p => p.id === placeId);

      // 만약 일치하는 장소 없을시 콘솔에 오류 메시지
      if (!place.value) {
        console.error(`ID '${placeId}'에 해당하는 장소를 찾을 수 없습니다.`);
      }

    } catch (error) {
      console.error('데이터를 불러오는 중 에러 발생:', error);
    }
  });
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  font-weight: bold;
  line-height: 1;
  letter-spacing: -0.03rem;
}

header {
  font-size: 2rem;
  padding-top: 2.03125rem;
  padding-bottom: 1.03125rem;
}

button {
  width: 160px;
  height: 50px;
  border: 0.0625rem solid #7d828d;
  border-radius: 0.75rem;
  background-color: #ffffff;
  font-size: 1.25rem;
  font-weight: bold;
}

/* class */
.wrap {
  width: 360px;
  height: 740px;
  margin: 0 auto;
  flex-direction: column;
  align-items: center;
  display: flex;
  background-color: #f6f6f6;
}

.container {
  width: 330px;
  height: 582px;
  border-radius: 0.625rem;
  background-color: #ffffff;
  padding-top: 0.625rem;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.infoItem_wrap {
  display: flex;
  padding: 0 0.9375rem;
  width: 330px;
  height: 35px;
  align-items: center;
  margin-bottom: 0.3125rem;
}

.border {
  display: flex;
  width: 70px;
  height: 20px;
  margin-right: 0.75rem;
  border-radius: 0.75rem;
  background-color: #d9d9d9;
  font-size: 1rem;
  font-weight: bold;
  justify-content: center;
  align-items: center;
}

.isBarrierImg {
  width: 290px;
  height: 35px;
}

/* 스크롤바 */
.description_wrap {
  height: 220px;
  overflow-y: auto;
}

.description_wrap::-webkit-scrollbar {
  display: none;
}

.place_name {
  flex: 1;
  font-size: 0.875rem;
}

.spot-image {
  width: 95%;
  max-width: 330px;
  object-fit: cover;
  display: block;
}

.btn_wrap {
  display: flex;
  width: 330px;
  height: 50px;
  margin-top: 1rem;
  justify-content: space-between;
}
</style>
