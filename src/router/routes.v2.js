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

  // 실제사용 예정(쿼리 기반) - 보류
  // {
  //   path: '/v2/recommend',
  //   name: 'RecommendV2',
  //   component: () => import('@/newpages/recommend/RecommendPage.vue'),
  //   props: route => ({
  //     exp: route.query.exp ?? 'any',
  //     move: route.query.move ?? 'walk',
  //     wc: route.query.wc ?? 'no',
  //     pets: route.query.pets ?? 'no',
  //     dev: route.query.dev ?? 'mid'
  //   }),
  //   meta: { title: '추천 결과' }
  // },

  // 임시/목데이터 추천 페이지
  {
    path: '/v2/recommend/mock',
    name: 'RecommendMockV2',
    component: () => import('@/newpages/tourplace/RecommendPlacesPage.vue'),
    meta: { title: '추천 관광지', noHeader: true },
  },

  // 선택한 관광지 확인 (쿼리 ids 기반)
  {
    path: '/v2/plan/selected',
    name: 'SelectedPlacesV2',
    component: () => import('@/newpages/tourplace/SelectedPlacesPage.vue'),
    meta: { title: '선택한 관광지', noHeader: true },
  },

  // 생성된 일정 확인
  // {
  //   path: '/v2/plan/:id',
  //   name: 'PlanResultV2',
  //   component: () => import('@/newpages/plan/PlanResultPage.vue'),
  //   meta: { title: '생성된 일정', noHeader: true },
  // },

  // 관광지 상세 (헤더 숨김)
  {
    path: '/v2/tourplace/:id',
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
