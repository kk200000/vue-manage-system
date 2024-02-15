import { defineStore } from 'pinia'
import service from '../utils/request'

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
        realname: '',
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
      },
    }
  },
  getters: {},
  actions: {
    getUserData: async (state: any) => {
      const personalInfo = await { url: '/getPersonalInfo' }
      state.personalInfo = { ...state.personalInfo, ...personalInfo }
    },
    uploadUserData: (payload: any) => {},
  },
})
