<template>
  <div>
    <div class="container">
      <div class="quarter">第 {{ quarter }} 季度小区生活费</div>
      <div class="handle-box">
        <el-upload
          action="#"
          :limit="1"
          accept=".xlsx, .xls"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :http-request="handleMany"
        >
          <el-button class="mr10" type="success" v-permiss="70"
            >批量导入</el-button
          >
        </el-upload>
        <el-button type="primary" @click="exportXlsx" v-permiss="71"
          >导出Excel</el-button
        >
        <el-button type="danger" @click="clearData" v-permiss="72"
          >删除数据</el-button
        >

        <el-select
          style="margin-left: 55vw"
          placeholder="选择季度"
          v-model="quarter"
          @change="changeQuarter"
        >
          <template #prefix>
            <span>季度：</span>
          </template>
          <el-option
            v-for="item in [1, 2, 3, 4]"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        header-cell-class-name="table-header"
      >
        <el-table-column prop="caseNo" label="单号"></el-table-column>
        <el-table-column prop="departmentName" label="户名"></el-table-column>
        <el-table-column prop="waterFee" label="水费"></el-table-column>
        <el-table-column prop="electricFee" label="电费"></el-table-column>
        <el-table-column prop="total" label="总计"></el-table-column>
        <el-table-column prop="feeStatus" label="缴费状态">
          <template #default="scope">
            {{ scope.row.feeStatus == '0' ? '未缴费' : '已缴费' }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts" name="export">
import { ElMessage, ElMessageBox, UploadProps } from 'element-plus'
import service from '@/utils/request'
import { onMounted, ref } from 'vue'
import * as XLSX from 'xlsx'
import { useUserLoginStore } from '@/store/userdata'

// 加载Excel
const importList = ref<any>([])
const beforeUpload: UploadProps['beforeUpload'] = async (rawFile) => {
  importList.value = await analysisExcel(rawFile)
  return true
}
const analysisExcel = (file: any) => {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader()
    reader.onload = function (e: any) {
      const data = e.target.result
      let datajson = XLSX.read(data, {
        type: 'binary',
      })

      const sheetName = datajson.SheetNames[0]
      const result = XLSX.utils.sheet_to_json(datajson.Sheets[sheetName])
      resolve(result)
    }
    reader.readAsBinaryString(file)
  })
}
onMounted(() => {
  getDataByRole()
})

const handleMany = async () => {
  const list = importList.value.map((item: any, index: number) => {
    return {
      id: item['序号'],
      caseNo: item['单号'],
      departmentName: item['户名'],
      waterFee: item['水费'],
      electricFee: item['电费'],
      total: item['总计'],
      feeStatus: item['缴费状态'],
    }
  })
  const res = await service({
    url: '/fee/addList?quarter=' + quarter.value,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(list),
  })
  if (res?.code == 200) {
    tableData.value.push(...list)
    ElMessage.success(res.msg)
    getDataByRole()
  } else {
    ElMessage.error(res.msg)
  }
}

const quarter = ref(1) // 第几季度
const tableData = ref([])
const userInfo = useUserLoginStore()
const getDataByRole = () => {
  if (userInfo.personalInfo.role == 'admin') getData()
  else {
    getDataByID()
  }
}
// 管理员获取表格数据
const getData = async () => {
  const res = await service({
    url: '/fee/getlist?quarter=' + quarter.value,
    method: 'GET',
  })
  tableData.value = res.data || []
}
const role = userInfo.personalInfo.role
const changeQuarter = () => {
  getDataByRole()
}
// 用户获取数据
const getDataByID = async () => {
  const res = await service({
    url: '/fee/getCurrentUserFee',
    method: 'POST',
    data: {
      id: userInfo.personalInfo.id,
      quarter: quarter.value,
    },
  })
  tableData.value = res.data || []
}

const clearData = async () => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning',
  }).then(async () => {
    const res = await service({
      url: '/fee/removeAll',
      method: 'DELETE',
      data: {
        quarter: quarter.value,
      },
    })
    if (res.code == 200) {
      ElMessage.success(res.msg)
      tableData.value = []
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const list = [['序号', '单号', '户名', '水费', '电费', '总计', '缴费状态']]
const exportXlsx = () => {
  tableData.value.map((item: any, i: number) => {
    const arr: any[] = [i + 1]
    const feeStatus2 = item.feeStatus == '0' ? '未缴费' : '已缴费'
    arr.push(
      ...[
        item.caseNo,
        item.departmentName,
        item.waterFee,
        item.electricFee,
        item.total,
        feeStatus2,
      ]
    )
    list.push(arr)
  })
  let WorkSheet = XLSX.utils.aoa_to_sheet(list)
  let new_workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(new_workbook, WorkSheet, '第一页')
  XLSX.writeFile(new_workbook, `第${quarter.value}季度小区生活费.xlsx`)
}
</script>

<style scoped>
.quarter {
  text-align: center;
  font-size: 22pt;
  margin-bottom: 5vh;
}
.handle-box {
  display: flex;
  /* justify-content: flex-end; */
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #f56c6c;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
