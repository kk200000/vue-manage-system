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
    console.log(error)
    return Promise.reject()
  }
)

// 响应拦截
service.interceptors.response.use(
  (response) => {
    console.log(response)
    if (response?.data?.code == 2020) {
      // 如果响应状态码为 2020，跳转到注册页面
      router.push('/register')
      return response.data
    } else if (response.status == 200) {
      return response.data
    }
  },
  (error: AxiosError) => {
    console.log(error)
    return Promise.reject(error)
  }
)

export default service
