import Vue from 'vue'
import Router from 'vue-router'
// @会自动找到src文件夹下文件
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import User from '@/components/account/user.vue'
import FileUp from '@/components/file/upload.vue'
import FileMulUp from '@/components/file/multiUpload.vue'
import FileManagement from '@/components/file/fileManagement.vue'
import FileReview from '@/components/file/fileReview.vue'
import FileOpts from '@/components/file/fileOpts.vue'
import Comment from '@/components/comment/comment.vue'
import Feedback from '@/components/comment/feedback.vue'
import Welcome from '@/components/home/welcome.vue'


Vue.use(Router)

export default  new Router({
  routes: [
    {
      name: 'login',
      path: '/',
      component: Login
    },
    {
      name: 'feedback',
      path: '/feedback',
      component: Feedback
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      children: [
        {
          name: 'user',
          path: 'user',
          component: User
        },
        {
          name: 'fileup',
          path: 'fileup',
          component: FileUp
        },
        {
          name: 'file_mul_up',
          path: 'file_mul_up',
          component: FileMulUp
        },
        {
          name: 'file_management',
          path: 'file_management',
          component: FileManagement
        },
        {
          name: 'file_opts',
          path: 'file_opts',
          component: FileOpts
        },
        {
          name: 'file_review',
          path: 'file_review',
          component: FileReview
        },
        {
          name: 'comment',
          path: 'comment',
          component: Comment
        },
        {
          name: 'welcome',
          path: 'welcome',
          component: Welcome
        },
      ]
    },
  ]
})



// router.beforeEach(function(to, from, next) {

//   if (!sessionStorage.getItem('admin_name')) {
//       if (to.path !== '/login') {
//           return next('/login')
//       }
//   }
//   next()
// })

