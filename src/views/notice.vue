<template>
  <div class="container">
    <el-tabs v-model="message">
      <el-tab-pane :label="`公告消息(${state.unread.length})`" name="first">
        <el-table :data="state.unread" :show-header="false" style="width: 100%">
          <el-table-column>
            <template #default="scope">
              <span class="message-title">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="date" width="180"></el-table-column>
          <el-table-column width="120">
            <template #default="scope">
              <el-button
                size="small"
                @click="handleRead(scope.$index)"
                v-permiss="16"
                >设为过期</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="handle-row">
          <el-button type="primary" @click="markAll" v-permiss="16"
            >全部标为过期</el-button
          >
          <el-button type="success" v-permiss="31" @click="NewNotice">
            去发布公告
          </el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane :label="`过期公告(${state.read.length})`" name="second">
        <template v-if="message === 'second'">
          <el-table :data="state.read" :show-header="false" style="width: 100%">
            <el-table-column>
              <template #default="scope">
                <span class="message-title">{{ scope.row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" width="180"></el-table-column>
            <el-table-column width="120">
              <template #default="scope">
                <el-button
                  type="danger"
                  @click="handleDel(scope.$index)"
                  v-permiss="16"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-tab-pane>
      <el-tab-pane
        :label="`回收站(${state.recycle.length})`"
        name="third"
        v-permiss="16"
      >
        <template v-if="message === 'third'">
          <el-table
            :data="state.recycle"
            :show-header="false"
            style="width: 100%"
          >
            <el-table-column>
              <template #default="scope">
                <span class="message-title">{{ scope.row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" width="180"></el-table-column>
            <el-table-column width="120">
              <template #default="scope">
                <el-button @click="handleRestore(scope.$index)">还原</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="handle-row">
            <el-button type="danger" @click="clearBin" v-permiss="16"
              >清空回收站</el-button
            >
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
    <!-- 新增公告弹出框 -->
    <el-dialog title="新增公告" v-model="AddVisible" width="40%">
      <el-form label-width="115px">
        <el-form-item label="表单标题" prop="title" required>
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item label="发布时间" required>
          <el-col :span="11">
            <el-form-item prop="publishDate">
              <el-date-picker
                type="datetime"
                placeholder="选择日期时间"
                v-model="form.publishDate"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="状态" prop="status" required>
          <el-radio-group v-model="form.status">
            <el-radio label="已发布" value="已发布"></el-radio>
            <el-radio label="已过期" value="已过期"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="详细" prop="descrition">
          <el-input
            type="textarea"
            rows="5"
            v-model="form.descrition"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="AddVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="tabs">
import { ElMessage, ElMessageBox } from 'element-plus'
import service from '@/utils/request'
import { ref, reactive, onMounted } from 'vue'
import { formatDateForList } from '@/utils/day'
import { useUserLoginStore } from '@/store/userdata'

const userInfo = useUserLoginStore()
const message = ref('first')
const state = reactive({
  unread: [],
  read: [],
  recycle: [],
})
const getData = async () => {
  const res = await service({
    url: 'notice/get_announcements',
    method: 'GET',
  })

  state.unread = res.data.filter((item) => {
    formatDateForList(item, 'date')
    return item.status == '已发布'
  })
  state.read = res.data.filter((item) => {
    formatDateForList(item, 'date')
    return item.status == '已过期'
  })
  state.recycle = res.data.filter((item) => {
    formatDateForList(item, 'date')
    return item.status == '回收站'
  })
}
getData()
onMounted(() => {
  getData()
})

// 新增公告
const AddVisible = ref(false)
let form: any = reactive({
  title: '',
  descrition: '',
  status: '',
  publishDate: '',
})

const NewNotice = () => {
  AddVisible.value = true
}
const saveEdit = async () => {
  AddVisible.value = false

  const AddData = await service({
    url: '/notice/newNotice',
    method: 'POST',
    data: {
      ...form,
      author: userInfo.personalInfo.userName,
      author_id: userInfo.personalInfo.id,
    },
  })
  ElMessage.success(`${AddData.msg}`)
  getData()
}

const updateStatus = async (item, newStatus) => {
  const res = await service({
    url: '/notice/update_announcement_status',
    method: 'POST',
    data: {
      id: item.id,
      status: newStatus,
    },
  })
  if ((res.code = 200)) {
    ElMessage.success(res.msg)
  }
}

// 全部标为过期
const markAll = async () => {
  const res = await service({
    url: '/notice/expire_all_published',
    method: 'POST',
    data: {},
  })
  if ((res.code = 200)) {
    ElMessage.success(res.msg)
    state.read = [...state.unread, ...state.read]
    // 清空消息列表
    state.unread = []
  }
}

// 清空回收站
const clearBin = async () => {
  const res = await service({
    url: '/notice/delete_all_deleted',
    method: 'POST',
    data: {},
  })
  if ((res.code = 200)) {
    state.recycle = []
    ElMessage.success('清空回收站成功~')
  }
}

const handleRead = (index: number) => {
  const item = state.unread.splice(index, 1)
  updateStatus(item[0], '已过期')
  state.read = item.concat(state.read)
}
const handleDel = (index: number) => {
  const item = state.read.splice(index, 1)
  updateStatus(item[0], '回收站')
  state.recycle = item.concat(state.recycle)
}
const handleRestore = (index: number) => {
  const item = state.recycle.splice(index, 1)
  updateStatus(item[0], '已发布')
  state.unread = item.concat(state.unread)
}
</script>

<style>
.message-title {
  cursor: pointer;
}
.handle-row {
  margin-top: 30px;
}
</style>
