<template>
  <div class="container">
    <!-- <div class="plugins-tips">
      通过 v-permiss 自定义指令实现权限管理,分为管理员和一般居民两种角色
    </div> -->
    <div class="mgb20">
      <span class="label">角色：</span>
      <el-select v-model="role" @change="handleChange">
        <el-option
          v-for="(item, index) in RoleList.value"
          :value="item"
          :key="index"
        ></el-option>
      </el-select>
    </div>
    <div class="mgb20 tree-wrapper">
      <el-tree
        ref="tree"
        :data="data"
        node-key="permiss"
        default-expand-all
        auto-expand-parent
        show-checkbox
        :default-checked-keys="checkedKeys"
      />
    </div>
    <el-button type="primary" @click="onSubmit">保存权限</el-button>
  </div>
</template>

<script setup lang="ts" name="permission">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElTree } from 'element-plus'
import { usePermissStore } from '@/store/permiss'
import service from '@/utils/request'
import { useUserLoginStore } from '@/store/userdata'
import { LeftSiderBarAdmin, LeftSiderBarUser } from '@/components/siderbarTitle'

onMounted(() => {
  getPremission()
})

const role = ref<string>('admin')
const permissionRoleList = reactive([])

let data: any = [
  // 左边侧边栏
  {
    label: '系统首页',
    permiss: '1',
  },

  {
    label: '停车场',
    permiss: '3',
  },
  {
    label: '求助管理',
    permiss: '8',
  },
  {
    label: '生活费用',
    permiss: '4',
  },
  {
    label: 'AI管家',
    permiss: '5',
  },
  {
    label: '小区公告',
    permiss: '6',
  },

  {
    label: '用户中心',
    permiss: '2',
  },
  {
    label: '权限管理',
    permiss: '18',
  },
  
]
const userInfo = useUserLoginStore()
const permiss = usePermissStore()
const RoleList: any = reactive([])
// 获取当前权限
const checkedKeys = ref([])
const getPremission = async () => {
  // call 接口返回权

  await permiss.getAllpermission()
  checkedKeys.value = permiss.permissList[role.value] // 拿到本来就选的
  RoleList.value = Object.keys(permiss.permissList) // 拿到本来的角色列表
}

const tree = ref<InstanceType<typeof ElTree>>()

const onSubmit = async () => {
  const newList: any = tree.value!.getCheckedKeys(false)

  const PermissTree = await service({
    url: '/permission/UpdatePermissionByID',
    method: 'POST',
    data: {
      role: role.value,
      newList,
    },
  })
  // 获取用户选中的权限
  tree.value = PermissTree.data.split(',')
  if (PermissTree.code == 200) {
    ElMessage.success(PermissTree.msg)
    setTimeout(() => {
      history.go(0)
    }, 800)
  } else {
    ElMessage.error(PermissTree.msg)
  }
}

const handleChange = () => {
  // if (role.value == 'admin') {
  //   // tree.value!.updateKeyChildren('admin', LeftSiderBarAdmin)
  //   data = LeftSiderBarAdmin
  // } else if (role.value == 'user') {
  //   // tree.value!.updateKeyChildren('user', LeftSiderBarUser)
  //   data = LeftSiderBarUser
  // }

  tree.value!.setCheckedKeys(permiss.permissList[role.value])
}
</script>

<style scoped>
.tree-wrapper {
  max-width: 500px;
}
.label {
  font-size: 14px;
}
</style>
