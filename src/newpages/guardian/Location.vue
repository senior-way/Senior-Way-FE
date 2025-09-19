<template>
  <div class="loc-page">
    <BigIconCardBtn
      class="as-plain"               
      :icon="iconLocation"
      title="실시간 사용자 위치 확인"
      desc="연동된 사용자 위치 확인을 통해 일정에 따른 이동 경로 체크가 가능합니다."
      variant="blue"
      :icon-opacity="0.9"
      aria-disabled="true"             
      tabindex="-1"              
    />

    <!-- <div v-if="position">
      <p>위도: {{ position.latitude }}</p>
      <p>경도: {{ position.longitude }}</p>
    </div> -->

    <div id="map" style="width: 100%; height: 400px;"></div>


    <button class="loc-btn bodyMedium16px" @click="getProtectedUserLocation">
      사용자 현재 위치 가져오기
    </button>
    <p class="loc-desc bodyLight12px">
      버튼을 눌러 현재 사용자의 위치를 확인할 수 있습니다. 네트워크/기기 환경에 따라 실제 위치와 정확히 일치하지 않을 수 있습니다.
    </p>
  </div>
</template>

<script>
import axios from "axios"

import BigIconCardBtn from '@/newpages/guardian/components/BigIconButton.vue'
import iconLocation from '@/assets/icons/home/guardian-location.png'

const baseUrl = import.meta.env.VITE_API_BASE_URL

export default {
  components: { BigIconCardBtn },
  data() {
    return {
      iconLocation,
      position: null, // { latitude, longitude, timestamp }
      map: null,
      marker: null,
    }
  },
  mounted() {
    this.loadDefaultMap()
  },
  methods: {
    async getProtectedUserLocation() {
      try {
        // 1. localStorage에서 accessToken 가져오기
        const token = localStorage.getItem('accessToken');
        if (!token) {
          alert("로그인이 필요합니다.");
          return;
        }

        // 2. axios GET 요청에 Authorization 헤더 추가
        const res = await axios.get(`${baseUrl}/location/protected`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log(res);

        if (!res.data) {
          alert("저장된 위치가 없습니다.");
          return;
        }

        // 3. 위치 데이터 저장
        this.position = {
          latitude: res.data.latitude,
          longitude: res.data.longitude,
          timestamp: res.data.timestamp,
        };

        // 4. 지도 표시
        this.showMap();

      } catch (err) {
        console.error(err)
        alert("피보호자의 위치를 가져오는데 실패했습니다.");
      }
    },

    loadDefaultMap() {
      const appKey = import.meta.env.VITE_KAKAO_APP_KEY
      const load = () => {
        window.kakao.maps.load(() => {
          const seoulCityHall = new window.kakao.maps.LatLng(37.5662952, 126.9779451)
          const container = document.getElementById("map")
          if (!container) return

          if (!this.map) {
            this.map = new window.kakao.maps.Map(container, { center: seoulCityHall, level: 4 })
            this.marker = new window.kakao.maps.Marker({ position: seoulCityHall })
            this.marker.setMap(this.map)
          }
        })
      }

      if (!window.kakao) {
        const script = document.createElement("script")
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`
        script.async = true
        script.defer = true
        script.onload = load
        document.head.appendChild(script)
      } else {
        load()
      }
    },

    showMap() {
      if (!this.position) return;

      const appKey = import.meta.env.VITE_KAKAO_APP_KEY;

      // Kakao Maps SDK 로드
      if (!window.kakao) {
        const script = document.createElement("script");
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
        script.onload = () => {
          window.kakao.maps.load(this.initMap);
        };
        document.head.appendChild(script);
      } else {
        window.kakao.maps.load(this.initMap);
      }
    },

    initMap() {
      if (!this.position) return;

      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(
          this.position.latitude,
          this.position.longitude
        ),
        level: 3,
      };

      this.map = new window.kakao.maps.Map(container, options);

      this.marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(
          this.position.latitude,
          this.position.longitude
        ),
      });

      this.marker.setMap(this.map);
    },
  },
};
</script>

<style scoped>
.loc-page {
  margin: 0.5rem 1.5rem;
  display: grid;
  gap: 12px;
}

:deep(.big-icon-card.as-plain) {
  pointer-events: none;  
  cursor: default;
  transition: none;
}
:deep(.big-icon-card.as-plain:active) {
  transform: none;
}

.loc-btn {
  height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid var(--color-primary);
  background: var(--color-white);
  margin-top: 0.25rem;
  cursor: pointer;
  transition: background .12s ease, transform .06s ease;
}

.loc-desc {
  color: var(--color-mediumgray);
  line-height: 1.2;
}

.map-wrap {
  border: 1px solid var(--color-lightgray);
  border-radius: 12px;
  overflow: hidden;
}

.map {
  width: 100%;
  height: 400px;
  background: #f6f7f9;
}

/* 이 페이지에서만 BigIconCardBtn 사이즈 오버라이드 */
:deep(.big-icon-card.as-plain){
  width: 100% !important;  
  max-width: none !important;
  height: 104px;   
}
:deep(.big-icon-card.as-plain .icon){
  width: 72px;
  height: 72px;
}
:deep(.big-icon-card.as-plain .desc){
  line-height: 1.35;
}
</style>
