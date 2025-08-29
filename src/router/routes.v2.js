import ErrorPage from '@/newpages/home/ErrorPage.vue'

const routesV2 = [
  {
    path: '/v2/:pathMatch(.*)*',
    name: 'NotFoundV2',
    component: ErrorPage,
  },
]

export default routesV2
