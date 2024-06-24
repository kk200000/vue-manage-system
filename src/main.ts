import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'

import 'element-plus/dist/index.css'
import './assets/css/icon.css'
import service from './utils/request'
import configureAxios from 'axios'
import lodash from 'lodash'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { usePermissStore } from './store/permiss'
import { AxiosRequestConfig } from 'axios'

const app = createApp(App)
const store = createPinia()

store.use(piniaPluginPersistedstate)
app.use(store)
app.use(router)
app.provide('$axios', service)
service.defaults.withCredentials = true
app.config.globalProperties.$axios = service //配置axios的全局引用
configureAxios(router as AxiosRequestConfig<any>) //  配置 Axios 实例并传递路由实例 初始化axios在pinia

// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

const permiss = usePermissStore()
const token = localStorage.getItem('token')

// 自定义权限指令v-permiss
app.directive('permiss', {
  mounted(el, binding) {
    if (!permiss.currentKeys && !!token) {
      console.error('权限配置未初始化')
      return
    }
    // 如果权限不在配置表里，就设置 该元素隐藏起来
    if (!lodash.includes(permiss.currentKeys, String(binding.value))) {
      el.hidden = true
    }
  },
})

app.mount('#app')
