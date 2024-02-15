import { defineStore } from 'pinia'

// 控制左侧siderbar
export const useSidebarStore = defineStore('sidebar', {
  state: () => {
    return {
      collapse: false,
    }
  },
  getters: {},
  actions: {
    handleCollapse() {
      this.collapse = !this.collapse
    },
  },
})
