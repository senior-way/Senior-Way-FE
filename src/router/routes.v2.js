// src/router/routes.v2.js
import ErrorPage from '@/newpages/home/ErrorPage.vue'

const routesV2 = [
  {
    path: '/v2',
    redirect: { name: 'AuthHomeV2' },
  },

  // 로그인 (헤더 숨김)
  {
    path: '/v2/login',
    name: 'LoginV2',
    component: () => import('@/newpages/auth/LoginPage.vue'),
    meta: { title: '로그인', noHeader: true },
  },

  // Auth 홈
  {
    path: '/v2/auth',
    name: 'AuthHomeV2',
    component: () => import('@/newpages/auth/AuthHomePage.vue'),
    meta: { title: 'Auth' },
  },

  // 회원가입 (헤더 숨김)
  {
    path: '/v2/signin',
    name: 'SigninV2',
    component: () => import('@/newpages/auth/SigninPage.vue'),
    meta: { title: '회원가입', noHeader: true },
  },

  // 선호도 조사
  {
    path: '/v2/survey',
    name: 'SurveyV2',
    component: () => import('@/newpages/survey/SurveyPage.vue'),
    meta: { title: '선호도 조사' },
  },

  // 관광지 상세 (헤더 숨김) — db.json 연동 시 /v2/tourplace/1 등으로 진입
  {
    path: '/v2/tourplaces/:id',
    name: 'TourplaceDetailV2',
    component: () => import('@/newpages/tourplace/TourplaceDetailPage.vue'),
    meta: { title: '관광지 상세', noHeader: true },
  },

  // 404
  {
    path: '/v2/:pathMatch(.*)*',
    name: 'NotFoundV2',
    component: ErrorPage,
    meta: { title: '페이지를 찾을 수 없음' },
  },
]

export default routesV2
