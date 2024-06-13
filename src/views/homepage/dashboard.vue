<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" style="height: 252px">
          <div class="user-info">
            <el-avatar :size="120" :src="imgurl" />
            <div class="user-info-cont">
              <div class="user-info-name">{{ username }}</div>
              <div>{{ role }}</div>
            </div>
          </div>
          <div class="user-info-list">
            上次登录时间：
            <span>{{ userLoginInfo.LastLoginTime }}</span>
          </div>
          <div class="user-info-list">
            上次登录地点：
            <span>{{ userLoginInfo.LastLoginlocation }}</span>
          </div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card
          shadow="hover"
          :body-style="{ padding: '0' }"
          style="height: 252px"
        >
          <el-carousel :interval="3500" arrow="always">
            <el-carousel-item v-for="item in imageList" :key="item">
              <el-image
                style="width: 100%; height: 100%"
                :src="item"
                fit="fill"
              />
            </el-carousel-item>
          </el-carousel>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <!-- 条形图容器 -->
          <div ref="barChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <!-- 折线图容器 -->
          <div ref="lineChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="dashboard">
import Schart from 'vue-schart'
import { computed, onMounted, reactive, ref } from 'vue'
import imgurl from '@/assets/img/img.jpg'
import { useUserLoginStore } from '../../store/userdata'
import { storeToRefs } from 'pinia'
import * as echarts from 'echarts'

const userLoginData = useUserLoginStore()
const { userLoginInfo, personalInfo } = storeToRefs(userLoginData)
const username = localStorage.getItem('username')
const roleInLocal = localStorage.getItem('role')
const role = computed(() => {
  return roleInLocal === 'admin' ? '超级管理员' : '普通用户'
})

const lineChart = ref(null)
const barChart = ref(null)
const imageList = [
  '/assets/img/view1.jpg',
  '/assets/img/view2.jpg',
  '/assets/img/view3.jpg',
]
onMounted(() => {
  initBarChart()
  initLineChart()
})
function initBarChart() {
  // 基于准备好的dom，初始化echarts实例
  const barChart2 = echarts.init(barChart.value)
  // 指定图表的配置项和数据
  const option = {
    title: {
      text: 'AI管家访问量',
    },
    tooltip: {},
    legend: {
      data: ['销量'],
    },
    xAxis: {
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
    },
    yAxis: {},
    series: [
      {
        name: '人数',
        type: 'bar',
        data: [500, 220, 396, 190, 150, 206],
      },
    ],
  }
  // 使用刚指定的配置项和数据显示图表。
  barChart2.setOption(option)
}
function initLineChart() {
  const lineChart2 = echarts.init(lineChart.value)
  const option2 = {
    title: {
      text: '小区人流量',
    },
    tooltip: {},
    legend: {
      data: ['人数'],
    },
    xAxis: {
      data: ['一月', '二月', '三月', '四月', '五月', '六月'],
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'line',
        data: [510, 220, 360, 100, 150, 809],
      },
    ],
  }
  lineChart2.setOption(option2)
}
</script>

<style scoped>
@import url('./homepage.less');
</style>
