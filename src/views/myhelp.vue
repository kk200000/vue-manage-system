<template>
  <div>
    <div class="container">
      <!-- 维修展示 -->
      <el-table
        :data="tableData"
        border
        stripe
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column
          prop="helpID"
          label="单号"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="urgency" label="紧急程度"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>

        <el-table-column prop="location" label="地点"></el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status == '1' ? 'success' : 'danger'">
              {{ scope.row.status == '1' ? '已完成' : '正在分配' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="SelectedDateTime"
          label="日期时间"
        ></el-table-column>
        <el-table-column prop="creator" label="发起人"></el-table-column>
        <el-table-column label="操作" width="260" align="center">
          <template #default="scope">
            <el-button
              v-if="scope.row.status == '0'"
              text
              :icon="VideoPlay"
              @click="handleFinish(scope.row)"
              v-permiss="61"
            >
              完成
            </el-button>

            <el-button
              text
              :icon="Edit"
              @click="handleEdit(scope.$index, scope.row)"
              v-permiss="61"
            >
              编辑
            </el-button>
            <el-button
              text
              :icon="Delete"
              class="red"
              @click="handleDelete(scope.row, scope.$index)"
              v-permiss="61"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          :total="totalSize"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
      <el-button style="margin-top: 5vh" v-permiss="60" @click="NewHelp">
        我要求助
      </el-button>

      <!-- 编辑弹出框 -->
      <el-dialog title="编辑" v-model="editVisible" width="40%">
        <el-form label-width="115px">
          <el-form-item label="表单标题" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="紧急程度" prop="urgency" required>
            <el-select v-model="form.urgency">
              <el-option key="严重" label="严重" value="critical"></el-option>
              <el-option key="紧急" label="紧急" value="high"></el-option>
              <el-option key="一般" label="一般" value="medium"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间" required>
            <el-col :span="11">
              <el-form-item prop="SelectedDateTime">
                <el-date-picker
                  type="datetime"
                  placeholder="选择日期时间"
                  v-model="form.SelectedDateTime"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item label="详细地点" prop="location" required>
            <el-input v-model="form.location"></el-input>
          </el-form-item>

          <el-form-item label="分类" prop="type" required>
            <el-radio-group v-model="form.type">
              <el-radio label="事故" value="shigu"></el-radio>
              <el-radio label="家具维修" value="jiaju"></el-radio>
              <el-radio label="物品需求" value="wupin"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="信息补充" prop="descrition">
            <el-input
              type="textarea"
              rows="5"
              v-model="form.descrition"
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveEdit">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts" name="import">
import { Delete, Edit, Search, Plus, VideoPlay } from '@element-plus/icons-vue'
import service from '@/utils/request'
import { ref, reactive, onMounted } from 'vue'
import * as XLSX from 'xlsx'
import { useUserLoginStore } from '@/store/userdata'
import { formatDateForList } from '@/utils/day'
import { ElMessage, ElMessageBox } from 'element-plus'
import lodash from 'lodash'
import { useRouter } from 'vue-router'

const userInfo = useUserLoginStore()
const router = useRouter()
const allList = reactive<any>([])
const tableData = ref([])
const totalSize = ref(0)
const pagination = reactive<any>({
  currnetPage: 1, // 当前页数
  pageSize: 7, // 每页多少个
})

// 前端分页-切割数据
const paging = () => {
  // 起始位置 = (当前页 - 1) x 每页的大小
  const start = (pagination.currnetPage - 1) * pagination.pageSize
  // 结束位置 = 当前页 x 每页的大小
  const end = pagination.currnetPage * pagination.pageSize
  tableData.value = allList.value.slice(start, end)
}

// 管理员获取表格数据
const getData = async () => {
  const res = await service({ url: '/help/getList', method: 'GET' })
  allList.value = res.data || []
  totalSize.value = res.data.length || allList.value.length
  formatDateForList(allList.value, 'SelectedDateTime') // 格式化时间
  paging()
}

const handlePageChange = (val: number) => {
  pagination.currnetPage = val
  getData()
}

// 管理员点完成
const handleFinish = async (item) => {
  const res = await service({
    url: '/help/changeStatus',
    method: 'POST',
    data: { helpID: item.helpID, new_status: 1 },
  })

  getData()
}

// 删除对应helpID
const handleDelete = async (item, index) => {
  // 确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning',
  }).then(async () => {
    const res = await service({
      url: 'help/deleteTask/' + item.helpID,
      method: 'DELETE',
    })
    if (res.code == 200) {
      ElMessage.success('删除成功')
      tableData.value.splice(index, 1)
    } else {
      ElMessage.error('删除失败')
    }
  })
}

// 求助发起
const NewHelp = () => {
  router.push('form')
}

// 用户获取数据
const getDataByID = async () => {
  const res = await service({
    url: '/help/getListByUserID',
    method: 'POST',
    data: {
      id: userInfo.personalInfo.id,
    },
  })
  tableData.value = res.data || []
  totalSize.value = res.data.length || allList.value.length
  // 格式化时间
  formatDateForList(tableData.value, 'SelectedDateTime')
}

const getDataByRole = async () => {
  if (userInfo.personalInfo.role == 'admin') await getData()
  else {
    await getDataByID()
  }
}
// 初始根据角色获取列表
onMounted(async () => {
  await getDataByRole()
  tableData.value.forEach((item) => {
    if (lodash.isEmpty(item.title)) {
      item.title = '-'
    }
  })
  console.log(tableData.value)
})

// 表格编辑时弹窗和保存
const editVisible = ref(false)
let form: any = reactive({
  title: '',
  desc: '',
  urgency: '',
  location: '',
  type: '',
  SelectedDateTime: '',
})
let idx: number = -1
const handleEdit = (index: number, row: any) => {
  idx = index
  form.urgency = row.urgency
  form.location = row.location
  form.type = row.type
  form.title = row.title
  form.SelectedDateTime = row.SelectedDateTime
  form.descrition = row.descrition
  editVisible.value = true
}
const saveEdit = async () => {
  editVisible.value = false

  tableData.value[idx].urgency = form.urgency
  tableData.value[idx].location = form.location
  tableData.value[idx].type = form.type
  tableData.value[idx].title = form.title
  tableData.value[idx].descrition = form.descrition
  tableData.value[idx].SelectedDateTime = form.SelectedDateTime

  const newdata = tableData.value[idx]
  const saveEditData = await service({
    url: '/help/EditTask/' + tableData.value[idx].helpID,
    method: 'POST',
    data: {
      ...newdata,
    },
  })
  ElMessage.info(`${saveEditData.msg}`)
  getDataByRole()
}
</script>

<style scoped>
.table {
  width: 100%;
  font-size: 14px;
}
.mr10 {
  margin-right: 10px;
}
</style>
