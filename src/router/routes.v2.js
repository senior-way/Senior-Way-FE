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

    // 실제사용예정/ 기본 추천 결과 - 쿼리 기반
  // {
  //   path: '/v2/recommend',
  //   name: 'RecommendV2',
  //   component: () => import('@/newpages/recommend/RecommendMockPage.vue'), 
  //   props: route => ({
  //     // 쿼리 기본값 세팅(설문이 비어도 안전)
  //     exp: route.query.exp ?? 'any',
  //     move: route.query.move ?? 'walk',
  //     wc: route.query.wc ?? 'no',
  //     pets: route.query.pets ?? 'no',
  //     dev: route.query.dev ?? 'mid'
  //   }),
  //   meta: { title: '추천 결과' }
  // },

  // 임시사용/ 목 데이터 테스트 전용 경로 (나중에 삭제함)
  {
    path: '/v2/recommend/mock',
    name: 'RecommendMockV2',
    component: () => import('@/newpages/tourplace/RecommendPlacesPage.vue'),
    meta: { title: '추천 관광지', noHeader: true }
  },

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
