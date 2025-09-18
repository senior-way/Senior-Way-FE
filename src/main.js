import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import { DatePicker, Popup } from 'vant';
import 'vant/lib/index.css';

import '@/assets/main.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// 환경변수 Kakao 앱키
const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY;
console.log('Kakao Key:', KAKAO_APP_KEY);

if (!KAKAO_APP_KEY) {
  console.error('VITE_KAKAO_APP_KEY is undefined!');
}

// Kakao SDK 동적 로드
const script = document.createElement('script');
script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${KAKAO_APP_KEY}&libraries=services,clusterer,drawing`;
script.onload = () => {
  console.log('Kakao SDK loaded');
  kakao.maps.load(initApp);
};
script.onerror = () => {
  console.error('Kakao SDK failed to load');
};
document.head.appendChild(script);

function initApp() {
  const app = createApp(App);
  app.use(createPinia());
  app.use(router);
  app.use(DatePicker);
  app.use(Popup);
  app.mount('#app');
}
