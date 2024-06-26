import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios'
import router from '../router'
import { ElMessage } from 'element-plus'

const baseURL = import.meta.env.VITE_BASE_URL

const service: any = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
  xsrfCookieName: 'session',
})
service.defaults.protocol = 'https'
// 请求拦截
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const newConfig = config
    newConfig.withCredentials = true
    // 添加 token
    newConfig.headers['token'] = localStorage.getItem('token') || ''
    return newConfig
  },
  (error: AxiosError) => {
    return Promise.reject()
  }
)

// 响应拦截
service.interceptors.response.use(
  (response) => {
    if (response?.data?.code == 2020) {
      // 如果响应状态码为 2020，跳转到注册页面
      // router.push('/register')
      return response.data
    } else if (response?.data?.code == 2023 || response?.data?.code == 2024) {
      console.log('11', router.currentRoute.value)
      ElMessage.error('Token过期请重新登陆~')
      router.push('/login')
      return response.data
    }
    if (response.status == 200) {
      return response.data
    }
  },
  (error: AxiosError) => {
    if (error.code === 'ECONNABORTED' || error.message.includes('超时')) {
      // 处理超时的逻辑
      ElMessage.error('请求超时,请检查key或稍后再试!')
    }

    // 可以在这里添加更多的错误处理逻辑

    return Promise.reject(error)
  }
)

export default service
