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
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "about" */ '../views/register.vue'),
    template: 'App'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/login.vue'),
    template: 'App'
  },
  {
    path: '/modules',
    name: 'Modules',
    component: () => import(/* webpackChunkName: "about" */ '../views/Modules.vue'),
    template: 'App'
  },
  {
    path: '/modules/:module/tasks',
    name: 'Tasks',
    component: () => import(/* webpackChunkName: "about" */ '../views/Tasks.vue'),
    template: 'App'
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
    path: '/projects/:slug',
    name: 'SavedProject',
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
