<template>
  <v-header />
  <v-sidebar v-if="!permiss.rendering" />
  <div class="content-box" :class="{ 'content-collapse': sidebar.collapse }">
    <v-tags></v-tags>
    <div class="content">
      <router-view v-slot="{ Component }">
        <transition name="move" mode="out-in">
          <keep-alive :include="tags.nameList">
            <component :is="Component"></component>
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

const permiss = usePermissStore()
const sidebar = useSidebarStore()
const tags = useTagsStore()
</script>
