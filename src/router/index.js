import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/home/Home.vue';
import Login from '@/pages/login/Login.vue';
import Register from '@/pages/login/Register.vue';
import LoginHome from '@/pages/login/LoginHome.vue';
import UserProfileSurvey from '@/pages/profile/UserProfileSurvey.vue';
import TripSchedule from '@/pages/home/TripSchedule.vue';
import PlaceList from '@/pages/place/PlaceList.vue';
import SearchPlace from '@/pages/place/SearchPlace.vue';
import Board from '@/pages/home/BoardPreview.vue';
import KakaoCallback from '@/pages/login/KakaoCallback.vue';
import MyPage from '@/mypage/MyPage.vue';

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
      path: '/login/callback',
      name: 'callback',
      component: KakaoCallback,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: MyPage,
    },
    {
      path: '/profilesurvey',
      name: 'profilesurvey',
      component: UserProfileSurvey,
    },
    {
      path: '/tripschedule',
      name: 'tripschedule',
      component: TripSchedule,
    },
    {
      path: '/place',
      name: 'place',
      component: PlaceList,
    },
    {
      path: '/place/:id',
      name: 'placedetail',
      component: () => import('@/pages/place/PlaceDetail.vue'),
    },
    {
      path: '/searchplace',
      name: 'searchplace',
      component: SearchPlace,
    },
    {
      path: '/board',
      name: 'board',
      component: Board,
    },
  ],
});

export default router;
