import { defineStore } from 'pinia'
import { LeftSiderBarUser, LeftSiderBarAdmin } from '@/components/siderbarTitle'
// 控制左侧siderbar
export const useSidebarStore = defineStore('sidebar', {
  state: () => {
    return {
      collapse: false,
    }
  },
  getters: {
    LeftSiderBar: (state) => {
      const role = localStorage.getItem('role')
      console.log('当前角色：', role)
      return role == 'admin' ? LeftSiderBarAdmin : LeftSiderBarUser
    },
  },
  actions: {
    handleCollapse() {
      this.collapse = !this.collapse
    },
  },
})
