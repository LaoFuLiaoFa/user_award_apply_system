<!--
    * @FileDescription: 注册页面选择部分。
    * @Author: 作者信息
    * @Date: 2024年1月22日
    * @LastEditors: 蒋雯绘
    * @LastEditTime: 2024年1月22日
-->
<template>
  <div class="demo-dropdown-wrap">
    <a-dropdown-button>
      {{ Selectgrade }}
      <template #overlay>
        <a-menu @click="handlegradeMenuClick">
          <a-menu-item key="选项01">选项01</a-menu-item>
          <a-menu-item key="选项02">选项02</a-menu-item>
          <a-menu-item key="选项03">选项03</a-menu-item>
          <a-menu-item key="选项04"> 选项04 </a-menu-item>
        </a-menu>
      </template>
      <template #icon><DownOutlined /></template>
    </a-dropdown-button>
    <a-dropdown-button>
      {{ Selectmajor }}
      <template #overlay>
        <a-menu @click="handlemajorMenuClick">
          <a-menu-item key="选项01">选项01</a-menu-item>
          <a-menu-item key="选项02">选项02</a-menu-item>
          <a-menu-item key="选项03">选项03</a-menu-item>
          <a-menu-item key="选项04"> 选项04 </a-menu-item>
        </a-menu>
      </template>
      <template #icon><DownOutlined /></template>
    </a-dropdown-button>
    <a-dropdown-button>
      {{ Selectclass }}
      <template #overlay>
        <a-menu @click="handleclassMenuClick">
          <a-menu-item key="选项01">选项01</a-menu-item>
          <a-menu-item key="选项02">选项02</a-menu-item>
          <a-menu-item key="选项03">选项03</a-menu-item>
          <a-menu-item key="选项04"> 选项04 </a-menu-item>
        </a-menu>
      </template>
      <template #icon><DownOutlined /></template>
    </a-dropdown-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'
// const handleMenuClick: MenuProps['onClick'] = e => {
//   console.log('click', e);
// };
const Selectgrade = ref('请选择年级')
const Selectmajor = ref('请选择专业')
const Selectclass = ref('请选择班级')
const handlegradeMenuClick = (info: any) => {
  const selectedOption = info.key
  Selectgrade.value = `${selectedOption}`
}
const handlemajorMenuClick = (info: any) => {
  const selectedOption = info.key
  Selectmajor.value = `${selectedOption}`
}
const handleclassMenuClick = (info: any) => {
  const selectedOption = info.key
  Selectclass.value = `${selectedOption}`
}
</script>

<style scoped>
.demo-dropdown-wrap :deep(.ant-dropdown-button) {
  margin-right: 8px;
  margin-left: 9px;
  margin-bottom: 20px;
}
</style>
