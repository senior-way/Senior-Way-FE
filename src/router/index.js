import { createRouter, createWebHistory } from 'vue-router'
import routesV1 from './routes.v1'
import routesV2 from './routes.v2'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...routesV1,
    ...routesV2,
  ],
})

export default router
