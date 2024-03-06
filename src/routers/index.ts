import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  // 配置映射关系
  routes: [
    {
      path: '/',
      redirect: '/LogIn'
    },
    {
      path: '/:pathMatch(.*)',
      component: () => import('@/views/not-found/NotFound.vue')
    },
    {
      path: '/LogIn',
      component: () => import('@/views/begin/login/LogIn.vue')
    },
    {
      path: '/SignIn',
      component: () => import('@/views/begin/signin/SignIn.vue')
    },
    {
      path: '/ForgotPassword',
      component: () => import('@/views/begin/forgot-password/ForgotPassword.vue')
    },
    {
      path: '/MainPage',
      component: () => import('@/views/mains/MainPage.vue'),
      redirect: '/HomePage',
      children: [
        {
          path: '/HomePage',
          component: () => import('@/views/mains/home-page/HomePage.vue')
        },
        {
          path: '/ContestStar',
          component: () => import('@/views/mains/contest-star/ContestStar.vue')
        },
        {
          path: '/ResearchProject',
          name: 'ResearchProject',
          component: () => import('@/views/mains/science-star/ResearchProject.vue'),
          meta: {
            title: '科研之星' // 设置默认标题
          }
        },
        {
          path: '/SoftwareCopyright',
          name: 'SoftwareCopyright',
          component: () => import('@/views/mains/science-star/SoftwareCopyright.vue'),
          meta: {
            title: '软件著作权' // 设置默认标题
          }
        },
        {
          path: '/PublishPaper',
          name: 'PublishPaper',
          component: () => import('@/views/mains/science-star/PublishPaper.vue'),
          meta: {
            title: '发表论文' // 设置默认标题
          }
        },
        {
          path: '/DoubleStar',
          component: () => import('@/views/mains/double-star/DoubleStar.vue')
        },
        {
          path: '/MatchStar',
          component: () => import('@/views/mains/apply-manage/MatchStar.vue')
        },
        {
          path: '/ResearchStar',
          component: () => import('@/views/mains/apply-manage/ResearchStar.vue')
        },
        {
          path: '/MDoubleStar',
          component: () => import('@/views/mains/apply-manage/DoubleStar.vue')
        }
      ]
    }
  ]
})

export default router
