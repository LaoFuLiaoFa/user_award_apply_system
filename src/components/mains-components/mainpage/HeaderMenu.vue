<!--
    * @FileDescription: 页面的头部组件。
    * @Author: 李思佳
    * @Date: 2024年1月22日
    * @LastEditors: 李思佳
    * @LastEditTime: 2024年1月22日
-->
<template>
  <a-row justify="space-around" align="middle">
    <a-col :span="6">
      <div class="logo-div">
        <img src="@/assets/images/logo-font.png" alt="成都东软学院logo图片" class="logo" />
      </div>
    </a-col>
    <a-col :span="10">
      <a-menu
        mode="horizontal"
        :style="{ lineHeight: '64px', backgroundColor: '#02509b', color: '#fff' }"
        v-model:selectedKeys="current"
        :items="items"
        @click="examine"
      >
      </a-menu>
    </a-col>
    <a-col :span="8" style="text-align: right">
      <a-tooltip title="退出登录">
        <a-button
          @click="handleExitClick"
          :icon="h(PoweroffOutlined)"
          size="large"
          style="border-radius: 20px"
          >退出登录</a-button
        >
      </a-tooltip>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import { PoweroffOutlined, BellOutlined } from '@ant-design/icons-vue'
import { message, type MenuProps } from 'ant-design-vue'
import router from '@/routers'

const current = ref<string[]>([''])
const items = ref<MenuProps['items']>([
  {
    key: '1',
    icon: () => h(BellOutlined),
    label: '奖项通知说明',
    title: '查看奖项通知说明'
  }
])
const examine = (info: { key: string }) => {
  if (info.key === '1') {
    window.open(
      '../../../../public/院发〔2023〕013号 关于设立信息与商务管理学院学生学院奖项的通知.pdf',
      '_blank'
    )
  }
}
function handleExitClick() {
  message.success('退出系统成功,欢迎您下次登录!')
  router.push('/LogIn')
}
</script>

<style scoped>
.logo-div {
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  float: left;
}
.logo {
  height: 50px;
}
</style>
