

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
  const checkPhone = (rule, value, callback) => {
    if (!value) {
            return callback(new Error("手机号不能为空"));
    } else {
        const reg = /^1[3-9][0-9]\d{8}$/;
        // 这里定义的reg变量没有加引号，所以是一种特殊的数据类型，即正则，可以直接用test()方法
        if (reg.test(value)) {
                callback();
        } else {
                // 具体错误信息没有提示
                return callback(new Error("请输入正确的手机号"));
        }
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
    phone: [
      { min: 11, message: "手机号不足11位", trigger: "blur" },
      { validator: checkPhone, trigger: "blur" }],

  }
}
