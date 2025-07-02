<template>
  <div ref="container" class="map-container"></div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  address: {
    type: String,
    required: true,
  },
});

const container = ref(null); // 지도를 담을 ref

const loadMap = (address) => {
  if (window.kakao && window.kakao.maps) {
    window.kakao.maps.load(() => {
      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK && container.value) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          const options = {
            center: coords,
            level: 3,
          };
          const map = new window.kakao.maps.Map(container.value, options);
          new window.kakao.maps.Marker({
            map: map,
            position: coords,
          });
        }
      });
    });
  } else {
    console.error("카카오맵 API 스크립트가 로드되지 않았습니다.");
    const apiKey = import.meta.env.VITE_API_KEY;
    console.log('로드된 API 키:', apiKey);
  }
};


watch(
  () => props.address,
  (newAddress) => {
    if (newAddress) {
      loadMap(newAddress);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 200px;
  border-radius: 0.75rem;
  position: static;
  z-index: 0;
  overflow: hidden;
}
</style>