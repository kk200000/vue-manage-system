<template>
  <div class="container">
    <div class="form-box">
      <el-form ref="formRef" :rules="rules" :model="form" label-width="120px">
        <el-form-item label="表单标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="紧急程度" prop="urgency" required>
          <el-select v-model="form.urgency">
            <el-option key="小明" label="严重" value="critical"></el-option>
            <el-option key="小红" label="紧急" value="high"></el-option>
            <el-option key="小白" label="一般" value="medium"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" required>
          <el-col :span="11">
            <el-form-item prop="date">
              <el-date-picker
                type="datetime"
                placeholder="选择日期时间"
                v-model="form.date"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="地点是您家吗" prop="location" required>
          <el-switch v-model="IsMyHome" @change="autoCompleteLocation" />
        </el-form-item>

        <el-form-item
          label="详细地点"
          prop="location"
          required
          v-if="IsMyHome == false"
        >
          <el-input v-model="form.location"></el-input>
        </el-form-item>

        <el-form-item label="分类" prop="type" required>
          <el-radio-group v-model="form.type">
            <el-radio label="事故" value="shigu"></el-radio>
            <el-radio label="家具维修" value="jiaju"></el-radio>
            <el-radio label="物品需求" value="wupin"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="信息补充" prop="desc">
          <el-input type="textarea" rows="5" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(formRef)"
            >申请提交</el-button
          >
          <el-button @click="onReset(formRef)">重置表单</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts" name="baseform">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserLoginStore } from '@/store/userdata'
import service from '@/utils/request'

const rules: FormRules = {
  //   name: [{ required: true, message: '请输入表单名称', trigger: 'blur' }],
}

const userInfo = useUserLoginStore()
const getUserHome = computed(() => {
  return [
    userInfo.personalInfo.unitNumber,
    userInfo.personalInfo.buildingNumber,
    userInfo.personalInfo.doorNumber,
  ].join('-')
})

const autoCompleteLocation = (val) => {
  if (val) form.location = getUserHome.value
}
const IsMyHome = ref(false)
const formRef = ref<FormInstance>()
const form: any = reactive({
  title: '我是title',
  urgency: 'critical',
  date: '',
  time: '',
  location: '',
  type: 'jiaju',
  desc: '',
  creator: '',
})
// 提交
const onSubmit = (formEl: FormInstance | undefined) => {
  // 表单校验
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      const res = service({
        url: '/help/new',
        method: 'POST',
        data: {
          ...form,
          CreatorID: userInfo.personalInfo.id,
        },
      })
      console.log(res)
      ElMessage.success('提交成功！')
    } else {
      return false
    }
  })
}
// 重置
const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
