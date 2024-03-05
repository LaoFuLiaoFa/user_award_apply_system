<!--
    * @FileDescription: 登录以及注册页面。
    * @Author: 蒋雯绘
    * @Date: 2024年1月23日
    * @LastEditors: 蒋雯绘
    * @LastEditTime: 2024年1月23日
-->
<template>
  <a-config-provider :theme="{ token: { colorPrimary: '#02509b' } }">
    <div>
      <a-layout class="main">
        <a-layout-header class="header">
          <div class="logo-div">
            <img src="@/assets/images/logo-font.png" alt="成都东软学院logo图片" class="logo" />
          </div>
        </a-layout-header>
        <a-layout class="all-content">
          <a-row>
            <a-col :span="12">
              <div class="left-content">
                <div class="left-box">
                  <p class="h1">成都东软学院</p>
                  <p class="h2">学生学院奖项信息填报系统</p>
                  <p class="h3">建议使用谷歌浏览器</p>
                </div>
              </div>
            </a-col>
            <a-col :span="12">
              <div class="right-content">
                <div class="right-box">
                  <div class="change">
                    <a-switch
                      v-model:checked="state.checked"
                      checked-children="登录"
                      un-checked-children="注册"
                    />
                  </div>
                  <a-divider style="height: 1px; background-color: #005746" soild />
                  <!-- 登录 -->
                  <div v-if="state.checked">
                    <a-form
                      :model="formState"
                      name="basic"
                      :wrapper-col="{ span: 19, offset: 3 }"
                      autocomplete="off"
                      @finish="onFinish"
                      @finishFailed="onFinishFailed"
                    >
                      <a-form-item name="useraccount" :rules="getRules('账号')">
                        <a-row>
                          <a-input
                            class="input"
                            v-model:value="formState.useraccount"
                            placeholder="请输入学号"
                          />
                        </a-row>
                      </a-form-item>

                      <a-form-item name="password" :rules="getRules('密码')">
                        <a-row>
                          <a-input-password
                            class="input"
                            v-model:value="formState.password"
                            placeholder="请输入密码"
                          />
                        </a-row>
                      </a-form-item>
                      <a-form-item>
                        <a-button type="link" @click="forgotPassword" class="forget"
                          >忘记密码 ? 点击此处</a-button
                        >
                      </a-form-item>
                    </a-form>
                  </div>
                  <!-- 注册 -->
                  <div v-else>
                    <SelectMenu />
                    <a-form
                      :model="formState"
                      name="basic"
                      :wrapper-col="{ span: 19, offset: 3 }"
                      autocomplete="off"
                      @finish="onFinish"
                      @finishFailed="onFinishFailed"
                    >
                      <a-form-item name="useraccount" :rules="getAccountValidationRules('学号')">
                        <a-row>
                          <a-input
                            class="input1"
                            v-model:value="formState.useraccount"
                            placeholder="请输入学号"
                          />
                        </a-row>
                      </a-form-item>
                      <a-form-item name="username" :rules="getUserValidationRules('姓名')">
                        <a-row>
                          <a-input
                            class="input1"
                            v-model:value="formState.username"
                            placeholder="请输入姓名"
                          />
                        </a-row>
                      </a-form-item>
                      <a-form-item name="password" :rules="getPasswordValidationRules('密码')">
                        <a-row>
                          <a-input-password
                            class="input1"
                            v-model:value="formState.password"
                            placeholder="请输入密码"
                          />
                        </a-row>
                      </a-form-item>
                      <a-form-item name="email" :rules="getEmeilValidationRules('邮箱')">
                        <a-row>
                          <a-input
                            class="input1"
                            v-model:value="formState.email"
                            placeholder="请输入邮箱"
                          >
                            <template #addonAfter>
                              <a-radio-button style="background-color: white"
                                >发送验证码</a-radio-button
                              >
                            </template>
                          </a-input>
                        </a-row>
                      </a-form-item>
                      <a-form-item name="code" :rules="getCodeValidationRules('验证码')">
                        <a-row>
                          <a-input
                            class="input1"
                            v-model:value="formState.code"
                            placeholder="请输入邮箱验证码"
                          />
                        </a-row>
                      </a-form-item>
                    </a-form>
                  </div>
                  <a-button type="primary" v-if="state.checked" class="submit" @click="logIn"
                    >登录</a-button
                  >
                  <a-button type="primary" v-else class="submit other" @click="signIn"
                    >注册</a-button
                  >
                </div>
              </div>
            </a-col>
          </a-row>
        </a-layout>
      </a-layout>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

import { message } from 'ant-design-vue'

import SelectMenu from '@/components/mains-components/mainpage/SelectMenu.vue'
import { JWHLoginRequest } from '@/service/begin/login/login'

const router = useRouter()
const state = reactive({
  checked: true
})
interface FormState {
  useraccount: string
  username: string
  password: string
  email: string
  code: string
}

const formState = reactive<FormState>({
  useraccount: '',
  username: '',
  password: '',
  email: '',
  code: ''
})

// 登录表单验证
const getRules = (fieldName: string) => [{ required: true, message: `${fieldName}不能为空!` }]
//注册表单验证
const getAccountValidationRules = (fieldName: string) => [
  {
    required: true,
    message: `${fieldName}不能为空!`
  },
  {
    pattern: /^\d{11}$/,
    message: '请输入有效学号'
  }
]
const getUserValidationRules = (fieldName: string) => [
  {
    required: true,
    message: `${fieldName}不能为空!`
  },
  {
    pattern: /^[a-zA-Z]+\s*(,\s*[a-zA-Z]+\s*)*$/,
    message: '请输入正确的名字'
  }
]
const getPasswordValidationRules = (fieldName: string) => [
  {
    required: true,
    message: `${fieldName}不能为空!`
  },
  {
    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    message: '必须是8位以上包含字母和数字的密码'
  }
]
const getEmeilValidationRules = (fieldName: string) => [
  {
    required: true,
    message: `${fieldName}不能为空!`
  },
  {
    pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: '请输入正确的邮箱地址'
  }
]
const getCodeValidationRules = (fieldName: string) => [
  {
    required: true,
    message: `${fieldName}不能为空!`
  },
  {
    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    message: '请输入正确的验证码'
  }
]

const onFinish = (values: any) => {
  console.log('Success:', values)
}
const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

function signIn() {
  router.push('/SignIn')
}

async function logIn() {
  // console.log(formState.useraccount)
  // console.log(formState.password)
  const loginResult = await JWHLoginRequest(formState.useraccount, formState.password)
  // console.log(loginResult)
  if (loginResult.code == 200) {
    // console.log(loginResult.data)
    localStorage.setItem('LOGIN_TOKEN', loginResult.data)
    router.push('/HomePage')
    message.success(`${loginResult.msg}`)
  } else {
    message.warning(`${loginResult.msg}`)
  }
}

function forgotPassword() {
  router.push('/ForgotPassword')
}
</script>

<style scoped>
@import url('@/assets/css/login.css');
</style>
@/service/begin/login/login
