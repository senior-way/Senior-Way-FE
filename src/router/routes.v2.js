const routesV2 = [
  {
    path: '/',
    redirect: { name: 'AuthHomeV2' },
  },

  // 로그인
  {
    path: '/login',
    name: 'LoginV2',
    component: () => import('@/newpages/auth/LoginPage.vue'),
    meta: { title: '로그인' },
  },

  // Auth 홈
  {
    path: '/auth',
    name: 'AuthHomeV2',
    component: () => import('@/newpages/auth/AuthHomePage.vue'),
    meta: { title: 'Auth' },
  },

  // 홈
  {
    path: '/home',
    name: 'HomeV2',
    component: () => import('@/newpages/home/HomePage.vue'),
    meta: { title: '홈', noHeader: true },
  },

  // 사용자 마이페이지
  {
    path: '/mypage',
    name: 'MyPageV2',
    component: () => import('@/newpages/home/MyPage.vue'),
    meta: { title: '마이페이지', noHeader: true },
  },

  // 보호자 마이페이지
  {
    path: '/guardian/mypage',
    name: 'GuardianMyPageV2',
    component: () => import('@/newpages/guardian/GuardianMyPage.vue'),
    meta: { title: '마이페이지', noHeader: true },
  },

  // 보호자 홈
  {
    path: '/guardian',
    name: 'GuardianHomeV2',
    component: () => import('@/newpages/guardian/GuardianHome.vue'),
    meta: { title: 'Guardian' },
  },

  // 회원가입 유형 선택
  {
    path: '/signin/select',
    name: 'SignupSelectV2',
    component: () => import('@/newpages/auth/SignupSelectPage.vue'),
    meta: { title: '회원가입 유형 선택' },
  },

  // 일반 회원가입
  {
    path: '/signin',
    name: 'SigninV2',
    component: () => import('@/newpages/auth/SigninPage.vue'),
    meta: { title: '회원가입' },
  },

  // 보호자 회원가입
  {
    path: '/guardian/signup',
    name: 'GuardianSignupV2',
    component: () => import('@/newpages/guardian/GuardianSignup.vue'),
    meta: { title: '보호자 회원가입' },
  },

  // 피보호자 초대 수락
  {
    path: '/guardian/invite/accept',
    name: 'InviteAcceptV2',
    component: () => import('@/newpages/auth/InviteAcceptPage.vue'),
    meta: { title: '초대 수락' },
  },

  // 선호도 조사
  {
    path: '/survey',
    name: 'SurveyV2',
    component: () => import('@/newpages/survey/SurveyPage.vue'),
    meta: { title: '선호도 조사' },
  },

  // 임시/목데이터 추천 페이지
  {
    path: '/recommend/mock',
    name: 'RecommendMockV2',
    component: () => import('@/newpages/tourplace/RecommendPlacesPage.vue'),
    meta: { title: '추천 관광지', noHeader: true },
  },

  // 선택한 관광지 확인 (쿼리 ids 기반)
  {
    path: '/plan/selected',
    name: 'SelectedPlacesV2',
    component: () => import('@/newpages/tourplace/SelectedPlacesPage.vue'),
    meta: { title: '선택한 관광지', noHeader: true },
  },

  // 관광지 상세
  {
    path: '/tourplace/:id',
    name: 'TourplaceDetailV2',
    component: () => import('@/newpages/tourplace/TourplaceDetailPage.vue'),
    meta: { title: '관광지 상세', noHeader: true },
  },

  // 무장애 관광지 검색
  {
    path: '/barrierfree',
    name: 'BarrierFreePlacesV2',
    component: () => import('@/newpages/tourplace/BarrierFreeSearchPage.vue'),
    meta: { title: '무장애 관광지', noHeader: true },
  },

  // 일정 상세 (추천 결과 타임라인)
  {
    path: '/schedule/timeline',
    name: 'ScheduleTimelineV2',
    component: () => import('@/newpages/schedule/ScheduleTimelinePage.vue'),
    meta: { title: '일정 타임라인', noHeader: true },
  },

  // 저장된 일정 목록
  {
    path: '/schedule/saved',
    name: 'SavedScheduleListV2',
    component: () => import('@/newpages/schedule/SavedScheduleListPage.vue'),
    meta: { title: '저장된 일정', noHeader: true },
  },

  // 저장된 일정 상세
  {
    path: '/schedule/saved/:id',
    name: 'SavedScheduleDetail',
    component: () => import('@/newpages/schedule/SavedScheduleDetailPage.vue'),
    meta: { title: '저장된 일정 상세', noHeader: true },
  },

  // 보호자 위치
  {
    path: '/location',
    name: 'LocationV2',
    component: () => import('@/newpages/guardian/Location.vue'),
  },

  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFoundV2',
    component: () => import('@/newpages/home/ErrorPage.vue'),
    meta: { title: '페이지를 찾을 수 없음' },
  },
];

export default routesV2;
