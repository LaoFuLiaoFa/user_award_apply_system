<!--
    * @FileDescription: 忘记密码页面。
    * @Author: 蒋雯绘
    * @Date: 2024年1月23日
    * @LastEditors: 李思佳
    * @LastEditTime: 2024年3月8日
-->
<template>
  <a-config-provider :theme="{ token: { colorPrimary: '#02509b' } }">
    <div>
      <a-spin tip="加载中，请稍候..." :spinning="spinning" size="large">
        <a-layout>
          <div class="login-wrapper">
            <div class="paper-wrapper">
              <div class="paper" index="0"></div>
              <div class="paper" index="1"></div>
              <div class="paper" index="2"></div>
              <div class="paper" index="3"></div>
              <div class="paper" index="4">
                <div class="login-paper">
                  <a-row>
                    <a-col :flex="2">
                      <a-button shape="circle" size="large" @click="backButton">
                        <template #icon>
                          <LeftOutlined />
                        </template> </a-button
                    ></a-col>
                    <a-col :flex="3">
                      <a-typography-title :level="2" style="margin: 0"
                        >忘 记 密 码</a-typography-title
                      ></a-col
                    >
                  </a-row>
                  <a-divider />
                  <a-form :model="formState" autocomplete="off" ref="formRef">
                    <a-form-item name="useraccount" :rules="getAccountValidationRules('学号')">
                      <a-input
                        placeholder="请输入学号"
                        size="large"
                        v-model:value="formState.useraccount"
                      />
                    </a-form-item>

                    <a-form-item name="email" :rules="getEmeilValidationRules('邮箱')">
                      <a-space>
                        <a-input
                          :style="{ width: '150%' }"
                          size="large"
                          v-model:value="formState.email"
                          placeholder="请输入邮箱"
                        />
                        <a-button
                          :disabled="buttonDisabled"
                          :style="{ width: '100%', marginLeft: '90%' }"
                          @click="sendcode"
                          type="primary"
                          size="large"
                          shape="round"
                          class="sendCodeButton"
                        >
                          {{ buttonDisabled ? `${countdown} 秒后可用` : '发送验证码' }}
                        </a-button>
                      </a-space>
                    </a-form-item>
                    <a-form-item name="code" :rules="getCodeValidationRules('验证码')">
                      <a-input
                        size="large"
                        placeholder="请输入邮箱验证码"
                        v-model:value="formState.code"
                      />
                    </a-form-item>
                    <a-form-item name="password" :rules="getPasswordValidationRules('密码')">
                      <a-input-password
                        size="large"
                        placeholder="请输入密码"
                        v-model:value="formState.password"
                      />
                    </a-form-item>
                  </a-form>
                </div>
                <div style="text-align: center">
                  <a-button
                    style="width: 90%; margin-bottom: 5%"
                    size="large"
                    type="primary"
                    ghost
                    shape="round"
                    @click="regest"
                    >完 成</a-button
                  >
                </div>
              </div>
            </div>
          </div>
        </a-layout>
      </a-spin>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { JWHemailRequest } from '@/service/begin/signin/signin'
import { LeftOutlined } from '@ant-design/icons-vue'
import { JWHforgetRequest } from '@/service/begin/forgot-password/forgot-password'

const router = useRouter()
const formRef = ref<any>(null)
//按钮失效和倒计时
const buttonDisabled = ref(false)
const countdown = ref(60)
const spinning = ref<boolean>(false)

interface FormState {
  username: string
  useraccount: string
  email: string
  password: string
  code: string
}

const formState = reactive<FormState>({
  username: '',
  useraccount: '',
  email: '',
  code: '',
  password: ''
})

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
  }
]

//修改密码接口
async function regest() {
  spinning.value = true
  // 取出验证码token
  const emailToken = localStorage.getItem('EMAIL_TOKEN')
  // console.log(emailToken)
  const forgetResult = await JWHforgetRequest(
    formState.useraccount,
    formState.email,
    formState.code,
    emailToken,
    formState.password
  )
  // console.log(emailToken)
  if (forgetResult.code == 200) {
    spinning.value = false
    router.push('/Login')
    message.success(`${forgetResult.msg}`)
  } else {
    spinning.value = false
    message.warning(`${forgetResult.msg}`)
  }
}

// 返回登录
function backButton() {
  router.push('/Login')
}

//发送邮箱验证码接口
async function sendcode() {
  if (!formState.email) {
    message.warning('请输入邮箱！')
    return
  }

  buttonDisabled.value = true
  const emailResult = await JWHemailRequest(formState.email)
  // console.log(emailResult)
  if (emailResult.code == 200) {
    // console.log(emailResult.data)
    localStorage.setItem('EMAIL_TOKEN', emailResult.data.code)
    //console.log(emailResult.data.code)
    message.success(`${emailResult.msg}`)
    let timer = setInterval(() => {
      countdown.value--
      if (countdown.value === 0) {
        clearInterval(timer)
        buttonDisabled.value = false // 解锁按钮
        countdown.value = 60 // 重置倒计时
      }
    }, 1000) // 每秒更新倒计时
  } else {
    message.warning(`${emailResult.msg}`)
  }
}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: flex-end;
  background-position: center;
  height: 100vh;
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
  height: 450px; /* 调整纸张的高度 */
  border-radius: 20px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3); /* 阴影效果 */
  transition: transform 0.3s ease-in-out; /* 添加过渡效果 */
}

.login-paper {
  margin: 5%;
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

.sendCodeButton {
}
</style>
