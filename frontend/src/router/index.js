import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: "/Message",
    name: 'Message',
    component: () => import('../views/Message.vue')
  },
  {
    path: "/",
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/login.vue')
  },
  {
  path: "/Signup",
  name: 'Signup',
  component: () => import('../views/Signup.vue')
  
  },

  {
    name: "/profil",
    path: '/profil',
    component: () => import('../views/profil.vue'),
   
  },
  {
    name: "/AllProfil",
    path: '/AllProfil',
    component: () => import('../views/AllProfil.vue'),
    
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router;
