import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios'
import router from '../router'

const service: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  timeout: 1000,
})
// 请求拦截
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const newConfig = config
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
    console.log(response)
    if (response?.data?.code == 2020) {
      // 如果响应状态码为 2020，跳转到注册页面
      // router.push('/register')
      return response.data
    } else if (response?.data?.code == 2023 || response?.data?.code == 2024) {
      router.push('/login')
      return response.data
    }
    if (response.status == 200) {
      return response.data
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

export default service
