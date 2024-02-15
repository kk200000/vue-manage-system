import { FormRules } from 'element-plus/es/tokens/form'

export function getLoginFormRules(formData: any) {
  return {
    username: [
      {
        required: true,
        message: '请输入用户名',
        trigger: 'blur',
      },
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  }
}

export function getRegisterFormRules(formData: any) {
  // 验证表单里的两次密码是否一致
  const validatePasswordConfirm = (rule: any, value: string, callback) => {
    if (value !== formData.password) {
      callback(new Error('两次输入的密码不一致'))
    } else {
      callback()
    }
  }
  return {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    confirmPassword: [
      { required: true, message: '请再次输入密码', trigger: 'blur' },
      { validator: validatePasswordConfirm, trigger: 'blur' },
    ],
    // 其他字段规则
    gender: [{ required: true, message: '请输入性别', trigger: 'blur' }],
    phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  }
}
