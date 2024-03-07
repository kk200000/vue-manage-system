import { defineStore } from 'pinia'
import { useUserLoginStore } from './userdata'
import service from '../utils/request'
import lodash from 'lodash'

export const usePermissStore = defineStore('permiss', {
  state: () => {
    return {
      rendering: true,
      cureentKeys: [],
      permissList: {
        //权限表控制
        admin: [],
        user: [],
      },
    }
  },

  actions: {
    // 获取当前角色权限信息
    async getPermissionByID() {
      this.rendering = true // 通过redering动态渲染侧边栏
      const userInfo = useUserLoginStore()
      const permissions: any = await service({
        url: '/permission/getpermissionByID',
        method: 'POST',
        data: { id: userInfo.personalInfo.id },
      })

      this.cureentKeys = permissions.data[0].permission.split(',')
      console.log('当前用户权限', this.cureentKeys)
      userInfo.personalInfo.role = permissions.data[0]?.role
      this.rendering = false
    },

    // 管理员获取所有角色权限
    async getAllpermission() {
      const permissions: any = await service({
        url: '/permission/getAllpermission',
        method: 'GET',
      })

      // 遍历 permissions.data，并更新 permissList
      permissions.data.forEach((item) => {
        if (this.permissList.hasOwnProperty(item.role)) {
          this.permissList[item.role] = item.permission.split(',')
        }
      })
    },
  },
  persist: {
        key: 'permiss',
        storage: sessionStorage,
  },
})
