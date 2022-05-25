import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/page-login',
    name: 'page-login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/page-login.vue')
  },
  {
  path: '/page-inscription',
  name: 'page-inscription',
  component: () => import('../views/page-inscription.vue')
  
  },

  {
    name: 'page-profile',
    path: '/page-profile',
    component: () => import('../views/page-profile.vue'),
    props:true
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
