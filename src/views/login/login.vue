<template>
  <div class="login-wrap">
    <canvas id="login-background"></canvas>
    <!-- 开启动画 -->

    <div class="ms-login">
      <div class="ms-title">小区智能管理系统</div>
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
            v-model="param.password"
            show-password
            :maxlength="20"
            placeholder="请输入密码"
            @keyup.enter="submitForm(login)"
          >
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <el-input
            type="text"
            v-model="param.captcha"
            :maxlength="4"
            placeholder="请输入验证码"
          >
            <template #append>
              <el-button type="text" @click="refreshCaptcha"
                >刷新验证码</el-button
              >
            </template>
          </el-input>
          <img style="margin: 10px auto; margin-bottom: 0" :src="captchaUrl" />
        </el-form-item>

        <!-- 按钮组 -->
        <div class="login-btn">
          <el-button type="primary" @click="submitForm(login)">登录</el-button>
          <el-button type="primary" @click="navToRegister">注册</el-button>
        </div>
        <p class="login-tips">Tips :若未注册请点击注册!</p>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'

import { useTagsStore } from '../../store/tags'
import { usePermissStore } from '../../store/permiss'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import lodash from 'lodash'
import service from '../../utils/request'
import { getLoginFormRules } from '../../utils/rules'
import { useUserLoginStore } from '@/store/userdata'

// 调整 canvas 尺寸的函数
function resizeCanvas() {
  if (canvas.value) {
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
    // 在这里重新绘制 Canvas 的内容，因为尺寸变化会清除 Canvas
  }
}
interface LoginInfo {
  username: string
  password: string
  captcha: string
}

const router = useRouter()
// 初始账号密码
const param = reactive<LoginInfo>({
  username: 'admin1',
  password: '123',
  captcha: '',
})
const navToRegister = () => {
  router.push('/register')
}

const AnimationValue = 'reflectRain'
let animationInstance: any = null
const canvas = ref(null)

const captchaUrl = ref(null) // 登录验证码
// 请求验证码
const requestCaptcha = async () => {
  const response: any = await service({
    url: '/captcha',
    method: 'POST',
  })
  captchaUrl.value = response
}

// 刷新验证码
const refreshCaptcha = () => {
  requestCaptcha()
}
onMounted(() => {
  requestCaptcha() // 请求验证码
  canvas.value = document.getElementById('login-background')
  import(`../../utils/Animation/canvasAnimation/sparkRain/index`).then(
    (_) => (animationInstance = new _.default(canvas.value))
  )
  // 初始化 canvas 尺寸
  resizeCanvas()
  // 监听窗口尺寸变化
  window.addEventListener('resize', resizeCanvas)
})

const rules: FormRules = getLoginFormRules(param)
const user = useUserLoginStore()
const permiss = usePermissStore() // 权限列表
const login = ref<FormInstance>()
const submitForm = (formEl: FormInstance) => {
  if (!formEl) return
  formEl.validate(async (valid: boolean) => {
    const loginResult: any = await service({
      url: '/login',
      method: 'POST',
      data: param,
    })
    if (valid) {
      if (loginResult?.code == '200') {
        user.saveUserData(loginResult.data.userInfo) // 拿到之后存一份

        localStorage.setItem('username', param.username)
        localStorage.setItem('token', loginResult?.data?.token)

        permiss.getPermissionByID() // 获取用户权限
        ElMessage.success(loginResult?.msg || '登录成功')
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
@import url('./index.less');
</style>
