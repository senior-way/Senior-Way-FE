<template>
  <div>
    <button @click="getProtectedUserLocation">피보호자 위치 가져오기</button>

    <div v-if="position">
      <p>위도: {{ position.latitude }}</p>
      <p>경도: {{ position.longitude }}</p>
    </div>

    <div id="map" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      position: null, // { latitude, longitude, timestamp }
      map: null,
      marker: null,
    };
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
        const res = await axios.get("http://localhost:8080/api/location/protected", {
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
        console.error(err);
        alert("피보호자의 위치를 가져오는데 실패했습니다.");
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
#map {
  margin-top: 1rem;
}
</style>
