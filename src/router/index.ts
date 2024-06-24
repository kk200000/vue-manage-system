import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { usePermissStore } from '../store/permiss'
import Home from '@/views/homepage/home.vue'
import lodash from 'lodash'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
          title: '系统首页',
        },
        component: () => import('../views/homepage/dashboard.vue'),
      },
      {
        path: '/parking',
        name: 'parking',
        meta: {
          title: '停车场',
          permiss: '3',
        },
        component: () => import('../views/parking/parking.vue'),
      },
      {
        path: '/AITalk',
        name: 'AITalk',
        meta: {
          title: 'AI管家',
          permiss: '5',
        },
        component: () => import('../views/aiManager/AiTalk.vue'),
      },
      {
        path: '/form',
        name: 'baseform',
        meta: {
          title: '新增表单',
          permiss: '5',
        },
        component: () => import('../views/reparing/form.vue'),
      },
      {
        path: '/notice',
        name: 'notice',
        meta: {
          title: '小区公告',
          permiss: '6',
        },
        component: () => import('../views/notice/notice.vue'),
      },
      {
        path: '/permission',
        name: 'permission',
        meta: {
          title: '权限管理',
          permiss: '18',
        },
        component: () => import('../views/adminOnly/permission.vue'),
      },
      {
        path: '/user',
        name: 'user',
        meta: {
          title: '个人中心',
        },
        component: () => import('../views/usreInfo/user.vue'),
      },
      {
        path: '/fees',
        name: 'fees',
        meta: {
          title: '生活费用',
          permiss: '4',
        },
        component: () => import('../views/fee/index.vue'),
      },
      {
        path: '/myhelp',
        name: 'myhelp',
        meta: {
          title: '我的维修',
          permiss: '8',
        },
        component: () => import('../views/reparing/myhelp.vue'),
      },
      {
        path: '/weatherMap',
        name: 'weatherMap',
        meta: {
          title: '地区天气',
          permiss: '55',
        },
        component: () => import('../views/weatherMap/index.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
    },
    component: () => import('../views/login/login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    meta: {
      title: '注册',
    },
    component: () => import('../views/login/register.vue'),
  },
  {
    path: '/403',
    name: '403',
    meta: {
      title: '没有权限',
    },
    component: () => import('../views/errorPage/403.vue'),
  },
  {
    path: '/404',
    name: '404',
    meta: {
      title: '网页不存在',
    },
    component: () => import('../views/errorPage/404.vue'),
  },
]
// 不访问权限接口名单，因为这些页面是没有权限这个概念的
const blackList = ['/login', '/register', '/403', '/404']

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | 欢迎来到小区管理系统` // 浏览器 title 部分
  const token = localStorage.getItem('token')
  const permiss = usePermissStore()

  // 如果没有token 就跳转登录
  if (!token && to.path !== '/login' && to.path !== '/register') {
    next('/login')
  } else if (
    // 如果该role没有这功能的权限跳转403页面
    to.meta.permiss &&
    !lodash.includes(permiss.currentKeys, to.meta.permiss)
  ) {
    next('/403')
  } else {
    // 进入每一个路由前验证权限，显示左边的sidebar
    if (!permiss.isBlock && !lodash.includes(blackList, to.path)) {
      permiss.getPermissionByID()
    }
    next()
  }
})

export default router
