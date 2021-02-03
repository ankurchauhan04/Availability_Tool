import Vue from 'vue'
import VueRouter from 'vue-router'
import Output from '../Pages/Output.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Output',
    component: Output
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
