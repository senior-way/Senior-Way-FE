import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/home/Home.vue';
import Login from '@/pages/login/Login.vue';
import Register from '@/pages/login/Register.vue';
import LoginHome from '@/pages/login/LoginHome.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/loginhome',
      name: 'loginhome',
      component: LoginHome,
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
