<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="sidebar.collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="(item, index) in LeftSiderBar" :key="item.index">
        <template v-if="item.subs">
          <el-sub-menu :index="index" :key="index" v-permiss="item.permiss">
            <template #title>
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template
              v-for="(subItem, index) in item.subs"
              :key="subItem.index"
            >
              <el-sub-menu
                v-if="subItem.subs"
                :index="index"
                v-permiss="item.permiss"
              >
                <template #title>{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >
                  {{ threeItem.title }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item
                v-else
                :index="subItem.index"
                v-permiss="item.permiss"
              >
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>

        <template v-else>
          <el-menu-item
            :index="item.index"
            :key="item.index"
            v-permiss="item.permiss"
          >
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSidebarStore } from '../store/sidebar'
import { useRoute } from 'vue-router'
import { useUserLoginStore } from '../store/userdata'
import { LeftSiderBarAdmin, LeftSiderBarUser } from './siderbarTitle'
import { usePermissStore } from '@/store/permiss'

const permiss = usePermissStore()
const sidebar = useSidebarStore()
const userInfo = useUserLoginStore()
const role = localStorage.getItem('role')

const LeftSiderBar = computed(() => {
  return role === 'admin' ? LeftSiderBarAdmin : LeftSiderBarUser
})

const route = useRoute()
const onRoutes = computed(() => {
  return route.path
})
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
