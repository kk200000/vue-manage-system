<script setup>
// 表格编辑时弹窗和保存
const AddVisible = ref(false)
let form: any = reactive({
  title: '',
  desc: '',
  urgency: '',
  location: '',
  type: '',
  SelectedDateTime: '',
})
let idx: number = -1
const HandleAdd = (index: number, row: any) => {
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


// 新增公告
const NewNotice = () => {}
</script>
<template>
  <div>
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
</template>

