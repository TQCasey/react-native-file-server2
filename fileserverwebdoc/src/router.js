import Vue from 'vue';
import Router from 'vue-router';
import UploadPanel from './views/UploadPanel';
import Manage from './views/Manage';
import Settings from './views/Settings';
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'uploadpanel',
      component: UploadPanel,
      meta: {
        title: 'Upload'
      }
    },
    {
      path: '/manage',
      name: 'manage',
      component: Manage,//component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
      meta: {
        title: 'Manage'
      }
    },
    {
      path: '/settings',
      name:'settings',
      component:Settings,
      meta:{
        title:'Settings'
      }
    }
  ]
})
