<template>
  <v-header />
  <v-sidebar v-if="!rendering" />
  <div class="content-box" :class="{ 'content-collapse': sidebar.collapse }">
    <v-tags></v-tags>
    <div class="content">
      <router-view v-slot="{ Component }">
        <transition name="move" mode="out-in">
          <keep-alive :include="tags.nameList">
            <component :is="Component" :key="Component.key"></component>
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useSidebarStore } from '../../store/sidebar'
import { useTagsStore } from '../../store/tags'
import { usePermissStore } from '@/store/permiss'
import vHeader from '../../components/header.vue'
import vSidebar from '../../components/sidebar.vue'
import vTags from '../../components/tags.vue'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { ElLoading } from 'element-plus'
const permiss = usePermissStore()
const sidebar = useSidebarStore()
const tags = useTagsStore()

const { rendering } = storeToRefs(permiss)
let loadingInstance = null
watch(
  rendering,
  (newVal, oldVal) => {
    console.log(`rendering changed from ${oldVal} to ${newVal}`)
    if (newVal === 1) {
      loadingInstance = ElLoading.service({
        fullscreen: true,
        text: '正在加载中...',
      })
    } else {
      loadingInstance.close()
    }
  },
  { immediate: true }
)
</script>
