import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import './assets/fonts/fonts.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// .env 파일에서 카카오 앱 키 가져오기
const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY;

// 카카오맵 SDK 동적 로드 스크립트
const script = document.createElement('script');
/* global kakao */
script.onload = () => {
  // SDK 로드가 완료되면 kakao.maps.load를 통해 init 함수 실행
  kakao.maps.load(init);
};
script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${KAKAO_APP_KEY}&libraries=services,clusterer,drawing`;
document.head.appendChild(script);

function init() {
  const app = createApp(App);

  app.use(createPinia());
  app.use(router);
  app.mount('#app');
}
