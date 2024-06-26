import { defineStore } from 'pinia'
import { useUserLoginStore } from './userdata'

// 控制左侧siderbar
export const useSidebarStore = defineStore('sidebar', {
  state: () => {
    return {
      collapse: false,
    }
  },

  actions: {
    handleCollapse() {
      this.collapse = !this.collapse
    },
  },
})
