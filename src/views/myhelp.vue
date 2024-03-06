<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-upload
          action="#"
          :limit="1"
          accept=".xlsx, .xls"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :http-request="handleMany"
        >
          <el-button class="mr10" type="primary">批量导入</el-button>
        </el-upload>
        <el-link href="/template.xlsx" target="_blank">下载模板</el-link>
      </div>

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
              v-permiss="17"
            >
              完成
            </el-button>

            <el-button
              text
              :icon="Edit"
              @click="handleEdit(scope.$index, scope.row)"
              v-permiss="15"
            >
              编辑
            </el-button>
            <el-button
              text
              :icon="Delete"
              class="red"
              @click="handleDelete(scope.row, scope.$index)"
              v-permiss="17"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

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
import {
  Delete,
  Edit,
  Search,
  Plus,
  VideoPlay,
  UploadProps,
} from '@element-plus/icons-vue'
import service from '@/utils/request'
import { ref, reactive, onMounted } from 'vue'
import * as XLSX from 'xlsx'
import { useUserLoginStore } from '@/store/userdata'
import { formatDateForList } from '@/utils/day'
import { ElMessage, ElMessageBox } from 'element-plus'

const userInfo = useUserLoginStore()

const tableData = ref([])
// 管理员获取表格数据
const getData = async () => {
  const res = await service({ url: '/help/getList', method: 'GET' })

  tableData.value = res.data || []
  // 格式化时间
  formatDateForList(tableData.value, 'SelectedDateTime')
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
  // 格式化时间
  formatDateForList(tableData.value, 'SelectedDateTime')
}

const getDataByRole = () => {
  if (userInfo.personalInfo.role == 'admin') getData()
  else {
    getDataByID()
  }
}
// 初始根据角色获取列表
onMounted(() => {
  getDataByRole()
})

// 表格编辑时弹窗和保存
const editVisible = ref(false)
let form: any = reactive({
  title: '',
  desc: '',
  urgency: '',
  location: '',
  type: '',
  SelectedDateTime:''
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

const handleMany = async () => {
  // 把数据传给服务器后获取最新列表，这里只是示例，不做请求
  const list = importList.value.map((item: any, index: number) => {
    return {
      id: index,
      name: item['姓名'],
      sno: item['学号'],
      class: item['班级'],
      age: item['年龄'],
      sex: item['性别'],
    }
  })
  tableData.value.push(...list)
}
</script>

<style scoped>
.handle-box {
  display: flex;
  margin-bottom: 20px;
}

.table {
  width: 100%;
  font-size: 14px;
}
.mr10 {
  margin-right: 10px;
}
</style>
