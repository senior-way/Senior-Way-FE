<template>
  <div class="wrap">
    <header>
      <img
        src="@/assets/img/seniorway_logo.png"
        alt="SENIORWAY Logo"
        class="header_logo"
      />
    </header>

    <div class="container">
      <div class="title-wrap">
        <p class="subtitle">
          마음에 드는 장소를 모두 선택하여<br/>나만의 여행 일정을 만들어보세요!
        </p>
      </div>

      <div class="recommendation-list">
        <div
          v-for="spot in recommendedSpots"
          :key="spot.id"
          class="spot-card"
          :class="{ selected: selectedSpots.includes(spot.id) }"
          @click="toggleSelection(spot.id)"
        >
          <img :src="spot.image" :alt="spot.name" class="spot-image" />
          <div class="card-content">
            <h3 class="spot-title">{{ spot.name }}</h3>
            <p class="spot-description">{{ spot.description }}</p>
            <div class="tag-container">
              <span v-for="tag in spot.tags" :key="tag" class="tag">
                #{{ tag }}
              </span>
            </div>
            <div class="card-footer">
              <a href="#" @click.stop="goToDetail(spot.id)">자세히 보기</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button class="btn-confirm" @click="confirmSelection">선택 완료</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // onMounted 추가
import { useRouter } from 'vue-router';
import axios from 'axios'; // axios import

const router = useRouter();

// 최종 선택된 관광지 ID 저장 배열
const selectedSpots = ref([]);

// 데이터 받아올 변수
const recommendedSpots = ref([]);

// 데이터를 불러오는 함수
const fetchRecommendations = async () => {
  try {
    // api연결 전/ testServer.json 파일에 GET 요청
    const response = await axios.get('/testServer.json');
    recommendedSpots.value = response.data.places;
  } catch (error) {
    console.error('추천 데이터를 불러오는 데 실패했습니다:', error);
  }
};

onMounted(() => {
  fetchRecommendations();
});

// 관광지 선택/해제 함수
const toggleSelection = (spotId) => {
  const index = selectedSpots.value.indexOf(spotId);
  if (index > -1) {
    selectedSpots.value.splice(index, 1);
  } else {
    selectedSpots.value.push(spotId);
  }
};

// 자세히 보기 페이지로 이동
const goToDetail = (spotId) => {
  router.push(`/place/${spotId}`);
};

// 선택 완료 버튼 클릭 함수
const confirmSelection = () => {
  if (selectedSpots.value.length === 0) {
    alert('1개 이상의 장소를 선택해주세요.');
    return;
  }
  console.log('최종 선택된 장소 ID:', selectedSpots.value);
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  line-height: 1.2;
  letter-spacing: -0.03rem;
  box-sizing: border-box;
}
.wrap {
  width: 360px;
  height: 740px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background-color: #f6f6f6;
  position: relative; /* 버튼 위치 기준점 */
}
.header_logo {
  padding-top: 2rem;
  width: 15rem;
  display: block;
  margin: 0 auto;
}
.container {
  flex-grow: 1;
  padding: 0 1.25rem;
  overflow-y: auto; /* 스크롤 */
  margin-bottom: 5rem; 
}
.highlight {
  color: #b71a86;
}

/* 페이지 제목 */
.title-wrap {
  text-align: center;
  margin: 1.5rem 0 2rem 0;
}
.main-title {
  font-family: 'Font-Bold';
  font-size: 1.5rem; 
}
.subtitle {
  font-family: 'Font-Medium';
  font-size: 1rem;
  color: #000000;
  margin-top: 0.5rem;
}

/* 추천 관광지 카드 리스트 */
.recommendation-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 개별 카드 */
.spot-card {
  background-color: #ffffff;
  border-radius: 0.75rem;
  border: 2px solid transparent; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s;
}
.spot-card.selected {
  border-color: #b71a86;
}
.spot-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block;
}
.card-content {
  padding: 1rem;
}
.spot-title {
  font-family: 'Font-Bold';
  font-size: 1.125rem; 
}
.spot-description {
  font-family: 'Font-Regular';
  font-size: 0.875rem; 
  color: #555;
  margin-top: 0.25rem;
}

/* 태그 */
.tag-container {
  margin-top: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem; 
}
.tag {
  font-family: 'Font-Medium';
  font-size: 0.75rem; 
  background-color: #f0f0f0;
  color: #555;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
}

/* 자세히 보기 */
.card-footer {
  text-align: right;
  margin-top: 1rem;
}
.card-footer a {
  font-family: 'Font-Medium';
  font-size: 0.875rem;
  color: #7d828d;
  text-decoration: underline;
}

/* 선택 완료 버튼 */
.btn-confirm {
  position: absolute; 
  bottom: 2rem;
  right: 1.5rem;
  width: 100px;
  height: 50px;
  border-radius: 25px; /* 타원형 */
  border: none;
  background-color: #b71a86;
  color: white;
  font-family: 'Font-Bold';
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s;
}
.btn-confirm:hover {
  background-color: #9c1571;
}
</style>

<!-- <template>
  <router-link :to="`/place/${place.id}`">
    <button>자세히 보기</button>
  </router-link>
</template>
<script setup></script>
<style scoped></style> -->
