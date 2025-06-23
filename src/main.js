import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';

import './assets/fonts/fonts.css'    // fonts.css 등록 (경로 src/assets/fonts/fonts.css)
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
