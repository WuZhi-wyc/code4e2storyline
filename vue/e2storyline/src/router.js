import Vue from 'vue'
import Router from 'vue-router'
import e2Storyline from './views/e2Storyline.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'e2Storyline',
      component: e2Storyline
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
