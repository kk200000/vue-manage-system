<template>
  <div class="register-wrap">
    <div class="ms-register">
      <div class="ms-title">用户注册</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="register"
        label-width="120px"
        class="ms-content"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="param.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="param.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            type="password"
            v-model="param.confirmPassword"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
        <!-- 其他需要用户填写的信息 -->

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="param.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="param.gender">
            <el-radio label="男" />
            <el-radio label="女" />
          </el-radio-group>
        </el-form-item>

        <div class="register-btn">
          <el-button type="primary" @click="submitForm(register)"
            >注册</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import service from '../../utils/request'
import { getRegisterFormRules } from '../../utils/rules'
import lodash from 'lodash'
import { useRouter } from 'vue-router'

interface RegisterInfo {
  username: string
  password: string
  confirmPassword: string
  // 添加其他需要用户填写的信息
  gender: string
  phone: string
  communityName: string
  role: string
  // avatar_path: string
  // faceInfo_path: string
}

const router = useRouter()
const param = reactive<RegisterInfo>({
  username: 'admin',
  password: '123',
  confirmPassword: '123',
  gender: '',
  phone: '13450209670',
  role: '',
  communityName: '默认1',
})
const getRoleByName = (username: any) => {
  return lodash.includes(['admin'], username) ? 'admin' : 'user'
}
// 监听 username 字段的变化，当 username 变化时更新 role 字段的值
watch(
  () => param.username,
  (newValue, oldValue) => {
    const newRole = getRoleByName(newValue)
    // 更新 param 对象中的 role 字段
    param.role = newRole
  }
)

const rules = getRegisterFormRules(param)
const register = ref<FormInstance>()
const submitForm = (formEl: FormInstance) => {
  if (!formEl) return
  formEl.validate(async (valid: boolean) => {
    if (valid) {
      const registerResult = await service({
        url: '/register',
        method: 'POST',
        data: { registerInfo: param },
      })

      if (registerResult?.code == '200') {
        ElMessage.success(registerResult?.msg || '注册成功')
        localStorage.setItem('username', param.username)
        localStorage.setItem('token', registerResult?.data?.access_token)

        router.push('/')
      } else {
        ElMessage.error(registerResult?.msg || '注册失败，请联系管理员')
        return false
      }
    }
  })
}
</script>

<style scoped>
.register-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
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
  text-align: center;
}
.register-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
</style>
