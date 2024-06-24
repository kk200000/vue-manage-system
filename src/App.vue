<template>
  <!-- 国际化配置 -->
  <el-config-provider
    :locale="zhCn"
    :button="buttonConfig"
    :message="messageCOnfig"
    :value-on-clear="valueOnClear"
    :empty-values="emptyValues"
  >
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import { ref, reactive } from 'vue'

const valueOnClear = ref(null) // 配置组件的默认空值
const emptyValues = reactive([undefined, null]) // 设置清空选项的值
// 按钮配置
const buttonConfig = reactive({
  autoInsertSpace: true, // 自动在两个中文字符之间插入空格
})

// 消息配置
const messageCOnfig = reactive({
  max: 3, // 	可同时显示的消息最大数量
})
</script>
<style>
@import './assets/css/main.css';
@import './assets/css/color-dark.css';
</style>
