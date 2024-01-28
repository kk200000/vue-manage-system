import { defineStore } from 'pinia'

export const useUserLoginStore = defineStore('User', {
  state: () => {
    return {
      UserLoginData: {
        LastLoginlocation: '广东广州',
        LastLoginTime: '2023/12/23 12:00:00',
      },
      UserBasicInfo:{
        userName:'',
        role:'chac',
      }
    }
  },
  getters: {},
  actions: {
    getUserData: () => {},
    uploadUserData: (payload: any) => {},
  },
})
