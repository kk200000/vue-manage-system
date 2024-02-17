<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="login"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="用户名">
            <template #prepend>
              <el-button :icon="User"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="param.password"
            @keyup.enter="submitForm(login)"
          >
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm(login)">登录</el-button>
        </div>
        <p class="login-tips">Tips :若未注册则跳转到注册页面!</p>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useTagsStore } from '../../store/tags'
import { usePermissStore } from '../../store/permiss'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import service from '../../utils/request'
import { getLoginFormRules } from '../../utils/rules'
import { useUserLoginStore } from '@/store/userdata'

interface LoginInfo {
  username: string
  password: string
}

const router = useRouter()
// 初始账号密码
const param = reactive<LoginInfo>({
  username: 'admin1',
  password: '123',
})

const rules: FormRules = getLoginFormRules(param)
const user = useUserLoginStore()
const permiss = usePermissStore() // 权限列表
const login = ref<FormInstance>()
const submitForm = (formEl: FormInstance) => {
  if (!formEl) return
  formEl.validate(async (valid: boolean) => {
    const loginResult = await service({
      url: '/login',
      method: 'POST',
      data: param,
    })
    if (valid) {
      if (loginResult?.code == '200') {
        ElMessage.success(loginResult?.msg || '登录成功')
        localStorage.setItem('username', param.username)
        localStorage.setItem('token', loginResult?.data?.access_token)

        user.saveUserData(loginResult.data.userInfo) // 拿到之后存一份
        
        permiss.getPermissionList()
        permiss.updatekey() // 更新权限

        router.push('/')
      } else {
        ElMessage.error(loginResult?.msg || '登录失败,请联系管理员')

        return false
      }
    }
  })
}

const tags = useTagsStore()
tags.clearTags()
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(@/assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
