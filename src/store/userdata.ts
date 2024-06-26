import { defineStore } from 'pinia'
import service from '../utils/request'
import lodash from 'lodash'
export const useUserLoginStore = defineStore('User', {
  state: () => {
    return {
      userLoginInfo: {
        LastLoginlocation: '广东广州',
        LastLoginTime: '2023/12/23 12:00:00',
      },

      personalInfo: {
        id: '',
        idCard: '',
        userName: '',
        gender: '',
        phone: '',
        address: '',
        email: '',
        communityName: '',
        buildingNumber: '',
        unitNumber: '',
        doorNumber: '',
        parkingNumber: '',
        securityCardNumber: '',
        emergencyContact: '',
        emergencyContactPhone: '',
        avatar_path: '',
        faceInfo_path: '',
        role: '',
      },
    }
  },

  actions: {
    saveUserData(data: any) {
      this.personalInfo = { ...this.personalInfo, ...data }
      localStorage.setItem('role', this.personalInfo.role)
    },

    async getUserData() {
      // 不能使用箭头函数，否则this为undefined
      if (lodash.isEmpty(this.personalInfo.id)) {
      }
      const personalInfo = await service({
        url: '/user/getPersonalInfo',
        method: 'POST',
        data: { userID: this.personalInfo.id },
      })
      this.personalInfo = { ...this.personalInfo, ...personalInfo }
      localStorage.setItem('role', this.personalInfo.role)
    },
    updateUserData: (payload: any) => {},
  },
  persist: {
    key: 'userInfo',
    storage: sessionStorage,
  },
})
