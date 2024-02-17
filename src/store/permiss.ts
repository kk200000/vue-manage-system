import { defineStore } from 'pinia'
import { useUserLoginStore } from './userdata'
import service from '../utils/request'
import lodash from 'lodash'

export const usePermissStore = defineStore('permiss', {
  state: () => {
    return {
      key: [],
      permissList: {
        //权限表控制
        admin: [],
        user: [],
      },
    }
  },

  actions: {
    updatekey() {
      const userInfo = useUserLoginStore()
      const role = userInfo.personalInfo.role || localStorage.getItem('role')
      console.log('权限初始化', role)
      this.key = lodash.values(this.permissList[role]) || []
    },
    async getPermissionList() {
      const permissions = await service({
        url: '/GetpermissionsList',
        method: 'GET',
      })

      permissions.forEach((item: any) => {
        this.permissList[item.role] = item.permission.split(',')
      })
      this.updatekey()
    },
  },
})
