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
        component: () => import('../views/form.vue'),
      },
      {
        path: '/notice',
        name: 'notice',
        meta: {
          title: '小区公告',
          permiss: '6',
        },
        component: () => import('../views/notice.vue'),
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
        component: () => import('../views/user.vue'),
      },
      {
        path: '/fees',
        name: 'fees',
        meta: {
          title: '生活费用',
          permiss: '4',
        },
        component: () => import('../views/fees.vue'),
      },
      {
        path: '/myhelp',
        name: 'myhelp',
        meta: {
          title: '我的维修',
          permiss: '8',
        },
        component: () => import('../views/myhelp.vue'),
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

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | 欢迎来到小区管理系统` // 浏览器 title 部分
  const token = localStorage.getItem('token')
  const permiss = usePermissStore()
  // 如果有token 就初始化权限

  if (!token && to.path !== '/login' && to.path !== '/register') {
    next('/login')
  } else if (
    to.meta.permiss &&
    !lodash.includes(permiss.currentKeys, to.meta.permiss)
  ) {
    // 如果没有权限，则跳转 403 页面
    next('/403')
  } else {
    if (!permiss.isBlock && to.path !== '/login' && to.path !== '/register') {
      permiss.getPermissionByID() // 存疑
    }

    next()
  }
})

export default router
