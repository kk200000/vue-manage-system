<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input
          v-model="query.carNumber"
          placeholder="车牌号"
          class="handle-input mr10"
          clearable
          @clear="getParkingData()"
        ></el-input>
        <el-button type="primary" :icon="Search" @click="handleSearch"
          >搜索</el-button
        >
        <el-button
          type="primary"
          :icon="Plus"
          @click="AddVisible = true"
          v-permiss="20"
          >新增</el-button
        >

        <span class="tips">TIPS:每小时停车费: ￥{{ perHourFee }}</span>
        <el-select
          v-model="perHourFee"
          placeholder="Select"
          size="large"
          style="width: 240px"
          v-permiss="17"
        >
          <el-option
            v-for="item in [13.5, 14.5, 15.5]"
            :key="item"
            :value="item"
          />
        </el-select>
      </div>

      <el-table
        :data="tableData"
        border
        stripe
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column
          prop="ownerID"
          label="ID"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column prop="carNumber" label="车牌号"></el-table-column>
        <el-table-column prop="carName" label="型号"></el-table-column>
        <el-table-column label="停放位置" prop="parkingNumber">
        </el-table-column>

        <el-table-column
          prop="parkingDuration"
          label="时长(小时)"
        ></el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status == '1' ? 'success' : 'danger'">
              {{ scope.row.status == '1' ? '正在使用' : '已出库' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="停车消费" align="center">
          <template #default="scope"
            >￥{{
              (scope.row.parkingDuration * perHourFee).toFixed(2)
            }}</template
          >
        </el-table-column>
        <el-table-column prop="lastTime" label="入/出库时间"></el-table-column>

        <el-table-column label="操作" width="260" align="center">
          <template #default="scope">
            <el-button
              text
              :icon="VideoPlay"
              @click="handleInAndOut(scope.row)"
              :disabled="!(scope.row.ownerID === userInfo.personalInfo.id)"
              v-permiss="20"
            >
              {{ scope.row.status == 1 ? '出库' : '入库' }}
            </el-button>

            <el-button
              text
              :icon="Edit"
              @click="handleEdit(scope.$index, scope.row)"
              :disabled="!(scope.row.ownerID === userInfo.personalInfo.id)"
              v-permiss="20"
            >
              编辑
            </el-button>
            <el-button
              text
              :icon="Delete"
              class="red"
              @click="handleDelete(scope.row, scope.$index)"
              :disabled="!(scope.row.ownerID === userInfo.personalInfo.id)"
              v-permiss="20"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          hide-on-single-page
          background
          layout="total, prev, pager, next"
          :current-page="query.currnetPage"
          :page-size="query.pageSize"
          :total="totalSize"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="车牌号">
          <el-input v-model="form.carNumber"></el-input>
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="form.carName"></el-input>
        </el-form-item>
        <el-form-item label="时长">
          <el-input disabled v-model="form.parkingDuration">
            <template #append>
              <el-tooltip content="如有异议,请向工作人员咨询" placement="top">
                <el-button
                  type="success"
                  @click="ElMessage.success('更新时间成功!')"
                  >更新时间</el-button
                >
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新增弹出框 -->
    <el-dialog title="新增" v-model="AddVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="车牌号" required>
          <el-input v-model="Addform.carNumber"></el-input>
        </el-form-item>
        <el-form-item label="型号" required>
          <el-input v-model="Addform.carName"></el-input>
        </el-form-item>
        <el-form-item label="车位" required>
          <el-input v-model="Addform.parkingNumber"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="Addform.flag"
            active-text="已入库"
            inactive-text="未入库"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="AddVisible = false">取 消</el-button>
          <el-button type="primary" @click="HandleAdd">新 增</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit, Search, Plus, VideoPlay } from '@element-plus/icons-vue'
import service from '@/utils/request'
import { formatDate } from '@/utils/day'
import { useUserLoginStore } from '@/store/userdata'

import { useRouter } from 'vue-router'
const router = useRouter()
const userInfo = useUserLoginStore()
const perHourFee = ref(13.5)
let allList = reactive<any>([])
let tableData: any = ref([])

const query = reactive({
  carNumber: '',
  carName: '',
  currnetPage: 1, // 当前页数
  pageSize: 2, // 每页多少个
})
const totalSize = ref(0) // 总共多少个数据
// 前端分页-切割数据
const paging = () => {
  // 起始位置 = (当前页 - 1) x 每页的大小
  const start = (query.currnetPage - 1) * query.pageSize
  // 结束位置 = 当前页 x 每页的大小
  const end = query.currnetPage * query.pageSize
  tableData.value = allList.value.slice(start, end)
}

// 获取表格数据
const getParkingData = () => {
  service({
    url: '/parking/getCurrentParkingList',
    method: 'GET',
  }).then((res) => {
    totalSize.value = res.data.totalSize
    allList.value = res.data.list
    paging()
    // 格式化时间
    tableData.value.forEach((element) => {
      const lastTime = formatDate(element.lastTime, 'YYYY-MM-DD HH:mm:ss')
      element.lastTime = lastTime
    })
  })
}
getParkingData()
let Addform = reactive({
  carName: '',
  carNumber: '',
  parkingNumber: '',
  flag: 1,
})
const AddVisible = ref(false)

// 新增车位
const HandleAdd = async () => {
  const AddData = await service({
    url: '/parking/AddCar',
    method: 'POST',
    data: {
      carName: Addform.carName,
      flag: Addform.flag,
      carNumber: Addform.carNumber,
      parkingNumber: Addform.parkingNumber,
      ownerID: userInfo.personalInfo.id,
      role: userInfo.personalInfo.role,
    },
  })
  if (AddData.code == 200) {
    ElMessage.success(AddData.msg)
    AddVisible.value = false
    getParkingData()
  }
}

// 查询操作
const handleSearch = () => {
  // 如果提供了搜索关键词，则在客户端进行过滤
  let list = []
  if (query.carNumber) {
    list = tableData.value.filter(
      (item) => item.carNumber.includes(query.carNumber) // 假设车牌号字段是 carNumber
    )
    tableData.value = list
    query.currnetPage = 1
  } else {
    getParkingData()
  }
}
// 分页导航
const handlePageChange = (val: number) => {
  query.currnetPage = val
  getParkingData()
}

// 删除操作
const handleDelete = (item: any, index: number) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning',
  })
    .then(async () => {
      const res = await service({
        url: 'parking/removeCarByCarNum',
        method: 'DELETE',
        data: { carNumber: item.carNumber },
      })
      if (res.code == 200) {
        ElMessage.success('删除成功')
        tableData.value.splice(index, 1)
      } else {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {})
}

// 出库入库操作
const handleInAndOut = async (item) => {
  const flag = item.status == 0 ? 1 : 0 // 即将转换的状态
  const NeedOut = flag == 0 ? true : false // 是否需要离场，若离场，费用交清
  if (NeedOut) {
    // 缴费
    ElMessageBox.confirm(
      `请缴费${(item.parkingDuration * perHourFee.value).toFixed(2)}元`,
      '谢谢光临~',
      {
        confirmButtonText: '去支付',
        cancelButtonText: '取消',
        type: 'success',
      }
    ).then(async () => {
      ElMessage.success(`欢迎${item.carNumber} 下次光临~`)
      const res = await service({
        url: '/parking/UpdateCurrentParkingList',
        method: 'POST',
        data: {
          carNumber: item.carNumber,
          flag,
          parkingNumber: item?.parkingNumber,
        },
      })
      router.go(0)
    })
  } else {
    ElMessage.success(`欢迎${item.carNumber} 进场~`)
    const res = await service({
      url: '/parking/UpdateCurrentParkingList',
      method: 'POST',
      data: {
        carNumber: item.carNumber,
        flag,
        parkingNumber: item?.parkingNumber,
      },
    })
  }

  getParkingData()
}

// 表格编辑时弹窗和保存
const editVisible = ref(false)
let form = reactive({
  carName: '',
  carNumber: '',
  parkingDuration: '',
})
let idx: number = -1
const handleEdit = (index: number, row: any) => {
  idx = index
  form.carName = row.carName
  form.carNumber = row.carNumber
  form.parkingDuration = row.parkingDuration
  editVisible.value = true
}
const saveEdit = async () => {
  editVisible.value = false

  tableData.value[idx].carName = form.carName
  tableData.value[idx].carNumber = form.carNumber
  tableData.value[idx].parkingDuration = form.parkingDuration
  const saveEditData = await service({
    url: '/parking/UpdateCurrentParkingList',
    method: 'POST',
    data: {
      carName: form.carName,
      flag: tableData.value[idx].flag,
      carNumber: form.carNumber,
      parkingDuration: form.parkingDuration,
      parkingNumber: tableData.value[idx].parkingNumber,
      isEdit: true,
      ownerID: tableData.value[idx].ownerID,
      role: userInfo.personalInfo.role,
    },
  })
  ElMessage.info(`${saveEditData.msg}`)
  getParkingData()
}
</script>

<style scoped>
.handle-box {
  display: flex;
  margin-bottom: 20px;
}
.tips {
  color: grey;
  flex: 1;
  text-align: right;
  align-self: center;
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
