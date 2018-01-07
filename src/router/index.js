// import Vue from 'vue'
import Router from 'vue-router'
import Homepage from '@/components/Homepage'
import Student from './Student'
import Classroom from './Classroom'
import PageNotFound from '@/components/PageNotFound'

// Vue.use(Router)

let Routes = [
  {
    path: '/',
    name: 'Homepage',
    component: Homepage
  },
  Student,
  Classroom,
  {
    path: '*',
    name: 'pageNotFound',
    component: PageNotFound
  }
]

const router = new Router({
  mode: 'history',
  routes: Routes
})

export default router
