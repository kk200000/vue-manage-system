<template>
  <div class="register-wrap">
    <canvas id="login-background"></canvas>
    <!-- 开启动画 -->
    <div class="ms-register">
      <div class="ms-title">用户注册</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="register"
        label-width="120px"
        class="ms-content"
      >
        <el-form-item prop="username">
          <template #label>
            <span class="FormItemLabel">用户名</span>
          </template>
          <el-input
            v-model="param.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <template #label>
            <span class="FormItemLabel">密码</span>
          </template>
          <el-input
            type="password"
            v-model="param.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <template #label>
            <span class="FormItemLabel">确认密码</span>
          </template>
          <el-input
            type="password"
            v-model="param.confirmPassword"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
        <!-- 其他需要用户填写的信息 -->

        <el-form-item label="手机号" prop="phone">
          <template #label>
            <span class="FormItemLabel">手机号</span>
          </template>
          <el-input v-model="param.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <template #label>
            <span class="FormItemLabel">性别</span>
          </template>
          <el-radio-group v-model="param.gender">
            <el-radio label="男" style="color: #fff" />
            <el-radio label="女" style="color: #fff" />
          </el-radio-group>
        </el-form-item>

        <el-form-item label="验证码" prop="captcha" required>
          <template #label>
            <span class="FormItemLabel">验证码</span>
          </template>
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

        <div class="register-btn">
          <el-button type="primary" @click="submitForm(register)"
            >注册</el-button
          >
          <el-button
            type="primary"
            @click="
              () => {
                router.go(-1)
              }
            "
            >返回上一层</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import service from '../../utils/request'
import { getRegisterFormRules } from '../../utils/rules'
import lodash from 'lodash'
import { useRouter } from 'vue-router'
import { usePermissStore } from '@/store/permiss'
import { useUserLoginStore } from '@/store/userdata'

interface RegisterInfo {
  username: string
  password: string
  confirmPassword: string
  // 添加其他需要用户填写的信息
  gender: string
  phone: string
  communityName: string
  role: string
  captcha: string
  // avatar_path: string
  // faceInfo_path: string
}
const user = useUserLoginStore()
const router = useRouter()
const param = reactive<RegisterInfo>({
  username: '',
  password: '123',
  confirmPassword: '123',
  gender: '',
  phone: '13450209670',
  role: 'user',
  communityName: '默认1',
  captcha: '',
})
const getRoleByName = (username: any) => {
  return lodash.includes(username, 'admin') ? 'admin' : 'user'
}
// 调整 canvas 尺寸的函数
function resizeCanvas() {
  if (canvas.value) {
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
    // 在这里重新绘制 Canvas 的内容，因为尺寸变化会清除 Canvas
  }
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

// 监听 username 字段的变化，当 username 变化时更新 role 字段的值
watch(
  () => param.username,
  (newValue) => {
    const newRole = getRoleByName(newValue)
    param.role = newRole
  }
)
const permiss = usePermissStore()
const rules = getRegisterFormRules(param)
const register = ref<FormInstance>()
const submitForm = (formEl: FormInstance) => {
  if (!formEl) return
  formEl.validate(async (valid: boolean) => {
    if (valid) {
      const registerResult: any = await service({
        url: '/register',
        method: 'POST',
        data: { registerInfo: param },
      })

      if (registerResult?.code == '200') {
        ElMessage.success(registerResult?.msg || '注册成功')
        localStorage.setItem('username', param.username)
        localStorage.setItem('token', registerResult?.data?.token)

        user.saveUserData(registerResult.data.userInfo) // 拿到之后存一份

        permiss.getPermissionByID()

        router.replace('/')
      } else {
        ElMessage.error(registerResult?.msg || '注册失败，请联系管理员')
        return false
      }
    }
  })
}
</script>

<style>
.FormItemLabel {
  color: #fff;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-register {
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
.register-btn {
  display: flex;
  text-align: center;
}
.register-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
</style>
