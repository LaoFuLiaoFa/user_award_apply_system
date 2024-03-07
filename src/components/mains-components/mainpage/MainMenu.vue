<!--
    * @FileDescription: 页面左侧的导航栏菜单。
    * @Author: 李思佳
    * @Date: 2024年1月22日
    * @LastEditors: 李思佳
    * @LastEditTime: 2024年1月22日
-->
<template>
  <div>
    <a-menu
      :selectedKeys="[$route.path]"
      mode="inline"
      v-model:openKeys="openKeys"
      style="height: 100%"
      class="main-menu"
    >
      <a-menu-item :key="'/HomePage'">
        <router-link to="HomePage"> <HomeOutlined /><span>首页</span></router-link>
      </a-menu-item>
      <a-menu-item :key="'/ContestStar'">
        <router-link to="ContestStar"><HighlightOutlined /><span>竞赛之星报名</span></router-link>
      </a-menu-item>
      <a-sub-menu>
        <template #title> <FormOutlined /><span>科研之星报名</span> </template>
        <a-menu-item :key="'/ResearchProject'">
          <router-link to="ResearchProject"> 科研项目</router-link>
        </a-menu-item>
        <a-menu-item :key="'/SoftwareCopyright'">
          <router-link to="SoftwareCopyright"> 软件著作权</router-link>
        </a-menu-item>
        <a-menu-item :key="'/PublishPaper'">
          <router-link to="PublishPaper"> 发表论文</router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item :key="'/DoubleStar'">
        <router-link to="DoubleStar"> <EditOutlined /> <span>双创之星报名</span></router-link>
      </a-menu-item>
      <a-sub-menu>
        <template #title> <SolutionOutlined /><span>报名表单管理</span> </template>
        <a-menu-item :key="'/MatchStar'">
          <router-link to="MatchStar"> 竞赛之星报名管理</router-link>
        </a-menu-item>
        <a-menu-item :key="'/ResearchStar'">
          <router-link to="ResearchStar"> 科研之星报名管理</router-link>
        </a-menu-item>
        <a-menu-item :key="'/MDoubleStar'">
          <router-link to="MDoubleStar"> 双创之星报名管理</router-link>
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  HomeOutlined,
  EditOutlined,
  FormOutlined,
  HighlightOutlined,
  SolutionOutlined
} from '@ant-design/icons-vue'

const openKeys = ref<string[]>(['HomePage'])
</script>

<style scoped>
.main-menu {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
