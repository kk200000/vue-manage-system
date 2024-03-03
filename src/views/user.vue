<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>基础信息</span>
            </div>
          </template>
          <div class="info">
            <div class="info-image" @click="showDialog">
              <el-avatar :size="100" :src="avatarImg" />
              <span class="info-edit">
                <i class="el-icon-lx-camerafill"></i>
              </span>
            </div>
            <div class="info-name">{{ name }}</div>
            <div class="info-desc">{{ address }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>账户编辑</span>
            </div>
          </template>

          <!-- 更改密码显示 -->
          <el-dialog
            title="更改密码"
            v-model="ChangePwddialogVisible"
            width="30%"
          >
            <el-form label-width="90px">
              <el-form-item label="旧密码：">
                <el-input type="password" v-model="pwdform.oldPwd"></el-input>
              </el-form-item>
              <el-form-item label="新密码：">
                <el-input type="password" v-model="pwdform.newPwd"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="changePassword"
                  >确认更改</el-button
                >
                <el-button @click="ChangePwddialogVisible = false"
                  >取消</el-button
                >
              </el-form-item>
            </el-form>
          </el-dialog>
          <!-- 用户信息表单 -->
          <el-form label-width="90px">
            <el-form-item label="用户名："> {{ name }} </el-form-item>

            <el-form-item label="性别">
              <el-radio-group v-model="form.gender">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="哪个单元">
              <el-input v-model="form.unitNumber"></el-input>
            </el-form-item>
            <el-form-item label="哪一栋">
              <el-input v-model="form.buildingNumber"></el-input>
            </el-form-item>
            <el-form-item label="房间号">
              <el-input v-model="form.doorNumber"></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input v-model="form.phoneNumber"></el-input>
            </el-form-item>
            <el-form-item label="真实姓名">
              <el-input v-model="form.realname"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="ChangePwddialogVisible = true"
                >更改密码</el-button
              >
              <el-button type="success" @click="updateProfile"
                >更新个人信息</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="裁剪图片" v-model="dialogVisible" width="600px">
      <vue-cropper
        ref="cropper"
        :src="imgSrc"
        :ready="cropImage"
        :zoom="cropImage"
        :cropmove="cropImage"
        style="width: 100%; height: 400px"
      ></vue-cropper>

      <template #footer>
        <span class="dialog-footer">
          <el-button class="crop-demo-btn" type="primary"
            >选择图片
            <input
              class="crop-input"
              type="file"
              name="image"
              accept="image/*"
              @change="setImage"
            />
          </el-button>
          <el-button type="primary" @click="saveAvatar">上传并保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="user">
import { reactive, ref } from 'vue'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import avatar from '../assets/img/img.jpg'
import { useUserLoginStore } from '@/store/userdata'
import service from '@/utils/request'
import { ElMessage } from 'element-plus'

const userInfo = useUserLoginStore()
const address = ` ${userInfo.personalInfo.buildingNumber} - ${userInfo.personalInfo.unitNumber} - ${userInfo.personalInfo.doorNumber}`
const name = localStorage.getItem('username')

const pwdform = reactive({
  oldPwd: '',
  newPwd: '',
})
const form = reactive({
  gender: '男',
  unitNumber: '',
  buildingNumber: '',
  doorNumber: '',
  phoneNumber: '',
  realname: '',
  email: '',
})
const updateProfile = async () => {
  const res = await service({
    url: '/user/updateProfile',
    method: 'POST',
    data: {
      gender: form.gender,
      unitNumber: form.unitNumber,
      buildingNumber: form.buildingNumber,
      doorNumber: form.doorNumber,
      phoneNumber: form.phoneNumber,
      realname: form.realname,
      email: form.email,
    },
  })

  if (res.code == 200) {
    ChangePwddialogVisible.value = false
    ElMessage.success(res.msg)
  } else {
    ElMessage.info(res.msg)
  }
}

// 更改密码
const ChangePwddialogVisible = ref(false)
const changePassword = async () => {
  const res = await service({
    url: '/user/changePwd',
    method: 'POST',
    data: {
      old_password: pwdform.oldPwd,
      new_password: pwdform.newPwd,
      user_id: userInfo.personalInfo.id,
    },
  })

  if (res.code == 200) {
    ChangePwddialogVisible.value = false
    ElMessage.success(res.msg)
  } else {
    ElMessage.info(res.msg)
  }
}

const avatarImg = ref(avatar)
const imgSrc = ref('')
const cropImg = ref('')
const dialogVisible = ref(false)
const cropper: any = ref()

const showDialog = () => {
  dialogVisible.value = true
  imgSrc.value = avatarImg.value
}

const setImage = (e: any) => {
  const file = e.target.files[0]
  if (!file.type.includes('image/')) {
    return
  }
  const reader = new FileReader()
  reader.onload = (event: any) => {
    dialogVisible.value = true
    imgSrc.value = event.target.result
    cropper.value && cropper.value.replace(event.target.result)
  }
  reader.readAsDataURL(file)
}

const cropImage = () => {
  cropImg.value = cropper.value.getCroppedCanvas().toDataURL()
}

const saveAvatar = () => {
  avatarImg.value = cropImg.value
  dialogVisible.value = false
}
</script>

<style scoped>
.info {
  text-align: center;
  padding: 35px 0;
}
.info-image {
  position: relative;
  margin: auto;
  width: 100px;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 50px;
  overflow: hidden;
}

.info-edit {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.info-edit i {
  color: #eee;
  font-size: 25px;
}
.info-image:hover .info-edit {
  opacity: 1;
}
.info-name {
  margin: 15px 0 10px;
  font-size: 24px;
  font-weight: 500;
  color: #262626;
}
.crop-demo-btn {
  position: relative;
}
.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
</style>
