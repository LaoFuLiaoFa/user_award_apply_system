<!--
    * @FileDescription: 登录页面。
    * @Author: 蒋雯绘
    * @Date: 2024年1月23日
    * @LastEditors: 李思佳
    * @LastEditTime: 2024年3月8日
-->
<template>
  <a-config-provider :theme="{ token: { colorPrimary: '#02509b' } }">
    <a-spin tip="加载中，请稍候..." :spinning="spinning" size="large">
      <a-layout>
        <div class="logo-div">
          <img src="@/assets/images/logo-font.png" alt="成都东软学院logo图片" class="logo" />
        </div>
        <div class="login-wrapper">
          <div class="paper-wrapper">
            <div class="paper" index="0"></div>
            <div class="paper" index="1"></div>
            <div class="paper" index="2"></div>
            <div class="paper" index="3"></div>
            <div class="paper" index="4">
              <div class="login-paper">
                <a-typography-title :level="2" style="text-align: center">登 录</a-typography-title>
                <a-divider />
                <a-form :model="formState" autocomplete="off">
                  <a-form-item name="useraccount" :rules="getRules('学号')">
                    <a-input
                      placeholder="请输入学号"
                      size="large"
                      v-model:value="formState.useraccount"
                    />
                  </a-form-item>

                  <a-form-item name="password" :rules="getRules('密码')">
                    <a-input-password
                      size="large"
                      placeholder="请输入密码"
                      v-model:value="formState.password"
                    />
                  </a-form-item>
                </a-form>
                <div style="float: right; margin-bottom: 3%">
                  <a-button type="link" @click="forgotPassword">忘记密码</a-button>
                </div>
                <div style="float: left; margin-bottom: 3%">
                  <a-button type="link" @click="signIn">没有账号？点击注册</a-button>
                </div>
              </div>
              <div style="text-align: center">
                <a-button
                  type="primary"
                  style="width: 90%; border-radius: 20px"
                  size="large"
                  @click="logIn"
                  >进 入</a-button
                >
              </div>
            </div>
          </div>
        </div>
      </a-layout>
    </a-spin>
  </a-config-provider>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { JWHLoginRequest } from '@/service/begin/login/login'

const router = useRouter()
const spinning = ref<boolean>(false)

interface FormState {
  useraccount: string
  password: string
}

const formState = reactive<FormState>({
  useraccount: '',
  password: ''
})

// 登录表单验证
const getRules = (fieldName: string) => [{ required: true, message: `${fieldName}不能为空!` }]

// 登录接口
async function logIn() {
  // console.log(formState.useraccount)
  // console.log(formState.password)
  spinning.value = true
  const loginResult = await JWHLoginRequest(formState.useraccount, formState.password)
  // console.log(loginResult)
  if (loginResult.code == 200) {
    // console.log(loginResult.data.access_Token)
    localStorage.setItem('access_Token', loginResult.data.access_Token)
    router.push('/HomePage')
    spinning.value = false
    message.success(`${loginResult.msg}`)
  } else {
    spinning.value = false
    message.warning(`${loginResult.msg}`)
  }
}

// 跳转忘记密码
function forgotPassword() {
  router.push('/ForgotPassword')
}

// 跳转注册
function signIn() {
  router.push('/SignIn')
}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: flex-end;
  background-position: center;
  height: 90vh;
  background: url(@/assets/images/bg.jpg) center/cover no-repeat;
  background-size: 100% 100%;
}

.paper-wrapper {
  width: 100%; /* 纸堆的宽度 */
  height: 100%; /* 纸堆的高度 */
  display: flex;
  justify-content: flex-end; /* 水平居右 */
  align-items: center; /* 垂直居中 */
  margin-right: 5%;
}

.paper {
  position: absolute;
  background-color: aliceblue;
  width: 500px; /* 每张纸的宽度 */
  height: 400px; /* 调整纸张的高度 */
  border-radius: 20px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3); /* 阴影效果 */
  transition: transform 0.3s ease-in-out; /* 添加过渡效果 */
}

.paper:nth-child(1) {
  transform: rotate(5deg);
}

.paper:nth-child(2) {
  transform: rotate(-10deg);
}

.paper:nth-child(3) {
  transform: rotate(-15deg);
}

.paper:nth-child(4) {
  transform: rotate(-20deg);
}

.paper:nth-child(1) {
  transform: rotate(-5deg);
}

.paper:nth-child(2) {
  transform: rotate(10deg);
}

.paper:nth-child(3) {
  transform: rotate(-15deg);
}

.paper:nth-child(4) {
  transform: rotate(20deg);
}

.login-paper {
  margin: 5%;
}

.logo {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  float: left;
  margin: 3%;
}

.logo-div {
  background-color: #02509b; /* 设置背景颜色为蓝色 */
  height: 10vh; /* 设置高度为30px */
  width: 100%; /* 设置宽度为100% */
  display: flex; /* 设置为弹性容器 */
  justify-content: space-between; /* 设置内容之间的空白空间 */
  align-items: center; /* 在纵轴上居中对齐 */
}
</style>
