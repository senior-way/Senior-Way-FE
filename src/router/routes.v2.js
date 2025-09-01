// router.v2.js
import ErrorPage from '@/newpages/home/ErrorPage.vue'

const routesV2 = [
  // /v2 로그인
  {
    path: '/v2',
    redirect: { name: 'LoginV2' },
  },

  // 로그인
  {
    path: '/v2/login',
    name: 'LoginV2',
    component: () => import('@/newpages/auth/LoginPage.vue'),
    meta: { title: '로그인' },
  },

  // Auth 홈
  {
    path: '/v2/auth',
    name: 'AuthHomeV2',
    component: () => import('@/newpages/auth/AuthHomePage.vue'),
    meta: { title: 'Auth' },
  },

  // 회원가입
  {
    path: '/v2/signin',
    name: 'SigninV2',
    component: () => import('@/newpages/auth/SigninPage.vue'),
    meta: { title: '회원가입' },
  },

  // 선호도조사
  {
    path: '/v2/survey',
    name: 'Survey',
    component: () => import('@/newpages/survey/SurveyPage.vue'),
    meta: { title: '회원가입' },
  },

  // 404
  {
    path: '/v2/:pathMatch(.*)*',
    name: 'NotFoundV2',
    component: ErrorPage,
  },
]

export default routesV2
