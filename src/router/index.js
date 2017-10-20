import Vue from 'vue'
import Router from 'vue-router'
import Single from '@/pages/Single'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    component: Single
  }]
})
