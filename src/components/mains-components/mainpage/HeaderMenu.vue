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
      <a-tooltip title="查看奖项通知说明">
        <a-button type="dashed" ghost :icon="h(BellOutlined)" @click="examine" size="large"
          >查看奖项通知说明</a-button
        >
      </a-tooltip>
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
import { h } from 'vue'
import { PoweroffOutlined, BellOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import router from '@/routers'

const examine = () => {
  window.open(
    'http://wenzhuhaonew.oss-cn-beijing.aliyuncs.com/files/65eaafd0d3e9f/院通知〔2024〕12号 信息与商务管理学院关于2023年秋季学期学生学院奖表彰的通知.pdf',
    '_blank'
  )
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
