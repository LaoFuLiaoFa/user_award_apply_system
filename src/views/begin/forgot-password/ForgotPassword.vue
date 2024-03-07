<!--
    * @FileDescription: 忘记密码页面。
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
                    <p class="recompose">修改密码</p>
                  </div>
                  <a-divider style="height: 1px; background-color: #005746" soild />

                  <div>
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
                      <a-form-item name="password" :rules="getPasswordValidationRules('密码')">
                        <a-row>
                          <a-input-password
                            class="input1"
                            v-model:value="formState.password"
                            placeholder="请输入新密码"
                          />
                        </a-row>
                      </a-form-item>
                      <a-form-item
                        name="repassword"
                        :rules="getRepasswordValidationRules('再次输入密码', formState.password)"
                      >
                        <a-row>
                          <a-input-password
                            class="input1"
                            v-model:value="formState.repassword"
                            placeholder="请再次输入密码"
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
                              :disabled="buttonDisabled" @click="sendcode">{{ buttonDisabled ? `${countdown} 秒后可用` : '发送验证码' }}</a-radio-button
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
                  <a-button type="primary" class="submit" @click="regest">确认</a-button>
                  <a-button type="primary" class="submit" @click="reback">返回登录</a-button>
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
import { reactive,ref } from 'vue'
import SelectMenu from '@/components/mains-components/mainpage/SelectMenu.vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { JWHemailRequest,JWHforgetRequest } from '@/service/begin/forgot-password/forgot-password'

//按钮失效和倒计时
const buttonDisabled = ref(false);
const countdown = ref(60);

const router = useRouter()
const state = reactive({
  checked: true
})
interface FormState {
  useraccount: string
  repassword: string
  password: string
  email: string
  code: string
}

const formState = reactive<FormState>({
  useraccount: '',
  repassword: '',
  password: '',
  email: '',
  code: ''
})

//表单验证
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
const getRepasswordValidationRules = (fieldName: string, originalPassword: string) => [
  {
    required: true,
    message: `${fieldName}不能为空!`
  },
  {
    validator: (_: any, value: string) => {
      if (value && value !== originalPassword) {
        return Promise.reject(new Error('两次输入的密码不一致'))
      }
      return Promise.resolve()
    }
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
  }
]
const onFinish = (values: any) => {
  console.log('Success:', values)
}
const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
//发送邮箱验证码接口
async function sendcode() {
    // console.log(formState.email)
  const emailResult = await JWHemailRequest(formState.email)
    // console.log(emailResult)
  if (emailResult.code == 200) {
    // console.log(emailResult.data)
    localStorage.setItem('EMAIL_TOKEN', emailResult.data.code)
    //console.log(emailResult.data.code)
    message.success(`${emailResult.msg}`)
    buttonDisabled.value = true;
    let timer = setInterval(() => {
                countdown.value--;
                if (countdown.value === 0) {
                    clearInterval(timer);
                    buttonDisabled.value = false; // 解锁按钮
                    countdown.value = 60; // 重置倒计时
                }
            }, 1000); // 每秒更新倒计时
  } else {
    message.warning(`${emailResult.msg}`)
  }
}
//修改密码接口
async function regest() {
  // 取出验证码token
  const emailToken = localStorage.getItem('EMAIL_TOKEN');
  // console.log(emailToken)
  const forgetResult = await JWHforgetRequest( formState.useraccount,formState.email,formState.code,emailToken,formState.password)
  // console.log(emailToken)
  if (forgetResult.code == 200) {
    login()
    message.success(`${forgetResult .msg}`)
  } else {
    message.warning(`${forgetResult .msg}`)
  }
}
const login = () => {
  router.push('/Login')
}
//返回登录
async function reback() {
    router.push('/Login')
}
</script>

<style scoped>
@import url('@/assets/css/forgetpassword.css');
</style>
