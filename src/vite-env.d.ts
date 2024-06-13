/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
import axios, { Axios, AxiosResponse, AxiosRequestConfig } from 'axios'
 
declare module 'axios' {
  interface AxiosResponse<T> {
     // 这个地方放属性
    msg: any,
    code: any,
  }
  export function create(config?: AxiosRequestConfig): AxiosInstance
}

declare module 'vue-schart';
declare module 'vue-cropperjs';