<!--
    * @FileDescription: 注册页面。
    * @Author: 作者信息
    * @Date: 2024年1月22日
    * @LastEditors: 李思佳
    * @LastEditTime: 2024年1月22日
-->
<!--
    * @FileDescription: 注册页面。
    * @Author: 作者信息
    * @Date: 2024年1月23日
    * @LastEditors: 蒋雯绘
    * @LastEditTime: 2024年1月23日
-->
<template>
  <div class="demo-dropdown-wrap">
    <a-dropdown-button @click="handleMenuClick">
      请选择年级
      <template #overlay>
        <a-menu>
          <a-menu-item key="1"> 选项01 </a-menu-item>
          <a-menu-item key="2"> 选项02 </a-menu-item>
          <a-menu-item key="3"> 选项03 </a-menu-item>
          <a-menu-item key="4"> 选项04 </a-menu-item>
        </a-menu>
      </template>
      <template #icon><DownOutlined /></template>
    </a-dropdown-button>
    <a-dropdown-button @click="handleMenuClick">
      请选择专业
      <template #overlay>
        <a-menu>
          <a-menu-item key="1"> 选项01 </a-menu-item>
          <a-menu-item key="2"> 选项02 </a-menu-item>
          <a-menu-item key="3"> 选项03 </a-menu-item>
          <a-menu-item key="4"> 选项04 </a-menu-item>
        </a-menu>
      </template>
      <template #icon><DownOutlined /></template>
    </a-dropdown-button>
    <a-dropdown-button @click="handleMenuClick">
      请选择班级
      <template #overlay>
        <a-menu>
          <a-menu-item key="1"> 选项01 </a-menu-item>
          <a-menu-item key="2"> 选项02 </a-menu-item>
          <a-menu-item key="3"> 选项03 </a-menu-item>
          <a-menu-item key="4"> 选项04 </a-menu-item>
        </a-menu>
      </template>
      <template #icon><DownOutlined /></template>
    </a-dropdown-button>
  </div>
</template>

<script setup lang="ts">
import { DownOutlined } from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'
const handleMenuClick: MenuProps['onClick'] = (e) => {
  console.log('click', e)
}
</script>

<style scoped>
.demo-dropdown-wrap :deep(.ant-dropdown-button) {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
