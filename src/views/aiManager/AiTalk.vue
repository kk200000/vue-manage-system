<template>
  <div>
    <el-input
      class="keys"
      v-model="userkey"
      type="text"
      placeholder="用户key"
      style="width: 400px"
    />
    <div class="container">
      <!-- 用户输入框 -->
      <el-input
        class="humanMessage"
        v-model="HumanMessage"
        show-word-limit
        type="textarea"
        placeholder="请输入你想说的..."
      />
      <!-- 发送按钮 -->
      <div class="group">
        <el-button @click="submitEvent">发送</el-button>
      </div>
      <!-- 聊天记录 -->
      <el-input
        placeholder="我将在这里回答您..."
        class="AIMeassage"
        :autosize="{ minRows: 6 }"
        readonly
        v-model="AIMeassage"
        rows="10"
        type="textarea"
      />
    </div>
  </div>
</template>

<script setup>
import service from '@/utils/request'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// 路由的引入
const router = useRouter()
const route = useRoute()
// AI信息
const HumanMessage = ref('')
const AIMeassage = ref('')
const userkey = ref('')
onMounted(() => {})

const submitEvent = async () => {
  const res = await service({
    url: `/getAnswer`,
    method: 'POST',
    data: { userMessage: HumanMessage.value, userkey: userkey.value },
  })

  if (res.code == 200) {
    ElMessage.success(res.msg)
    AIMeassage.value = res.data
  } else {
    ElMessage.error(res.msg || '网络连接超时，请检查Key或者重试')
  }
}
</script>

<style scoped>
.container {
  width: 60%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
.keys {
  float: right;
}
.humanMessage {
  margin-bottom: 15px;
}
.AIMeassage {
  margin-top: 50px;
}
.group {
  display: flex;
  justify-content: flex-end;
}
</style>
