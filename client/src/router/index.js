import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    template: 'Index'
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import(/* webpackChunkName: "about" */ '../views/Projects.vue'),
    template: 'App'
  },
  {
    path: '/projects/newproject',
    name: 'NewProject',
    component: () => import(/* webpackChunkName: "about" */ '../views/NewProject.vue'),
    template: 'App'
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    template: 'App'
  },
  // Catch all 404
  {
    path: "*",
    name: 'NotFound',
    template: 'App',
    component: () => import(/* webpackChunkName: "about" */ '../views/404NotFound.vue'),
  }
]

export const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export const newVue = Vue

export default {router, newVue}
