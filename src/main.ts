import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import { usePermissStore } from './store/permiss'
import 'element-plus/dist/index.css'
import './assets/css/icon.css'
import service from './utils/request'
import configureAxios from './utils/request'
import lodash from 'lodash'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.provide('$axios', service)
app.config.globalProperties.$axios = service //配置axios的全局引用
configureAxios(router) //  配置 Axios 实例并传递路由实例 初始化axios在pinia

// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 自定义权限指令
const permiss = usePermissStore()
const token = localStorage.getItem('token')

// 如果有token 就初始化权限
if (token) {
  permiss.getPermissionList()
  permiss.updatekey() // 更新权限
}
app.directive('permiss', {
  mounted(el, binding) {
    // 如果权限不在配置表里，就设置 该元素隐藏起来
    if (!lodash.includes(permiss.key, String(binding.value))) {
      el.hidden = true
    }
  },
})

app.mount('#app')
