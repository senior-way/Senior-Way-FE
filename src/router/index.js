import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/home/Home.vue';
import Login from '@/pages/login/Login.vue';
import Register from '@/pages/login/Register.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
  ],
});

export default router;
