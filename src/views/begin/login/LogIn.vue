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
                    <SelectMenu @gradeSelected="handleGradeSelected" @majorSelected="handleMajorSelected" @classSelected="handleClassSelected"/>
                    <a-form
                      ref="formRef"
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
import { reactive,watchEffect,onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue';
import { message } from 'ant-design-vue'
import SelectMenu from '@/components/mains-components/mainpage/SelectMenu.vue'
import { JWHLoginRequest } from '@/service/begin/login/login'
import { JWHemailRequest,JWHsigninRequest } from '@/service/begin/signin/signin'
const router = useRouter()
const formRef = ref<any>(null)
//按钮失效和倒计时
const buttonDisabled = ref(false);
const countdown = ref(60);

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

const state = reactive({
  checked: true,
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

const onFinish = (values: any) => {
  console.log('Success:', values)
}
const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

// 登录接口
async function logIn() {
  // console.log(formState.useraccount)
  // console.log(formState.password)
  const loginResult = await JWHLoginRequest(formState.useraccount, formState.password)
  // console.log(loginResult)
  if (loginResult.code == 200) {
     console.log(loginResult.data)
    localStorage.setItem('LOGIN_TOKEN', loginResult.data.access_Token)
    router.push('/HomePage')
    message.success(`${loginResult.msg}`)
  } else {
    message.warning(`${loginResult.msg}`)
  }
}
//获取选择的年级专业班级
const selectedGrade = ref('');
const selectedMajor = ref('');
const selectedClass = ref('');
const handleGradeSelected = (value) => {
  selectedGrade.value = value;
  // console.log(selectedGrade.value)
};
const handleMajorSelected = (value) => {
  selectedMajor.value = value;
  // console.log(selectedMajor.value)
};
const handleClassSelected = (value) => {
  selectedClass.value = value;
  // console.log(selectedClass.value)
};
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
//注册接口
async function signIn() {
  const form = await formRef.value?.validate() // 表单验证
  if (form) {
  // 取出验证码token
  const emailToken = localStorage.getItem('EMAIL_TOKEN');
  // console.log(emailToken)
  const signInResult = await JWHsigninRequest(selectedGrade.value,selectedMajor.value,selectedClass.value, formState.username,formState.useraccount,formState.password,formState.email,formState.code,emailToken)
  // console.log(emailToken)
  if (signInResult.code == 200) {
    router.push('/Login')
    message.success(`${signInResult.msg}`)
  } else {
    message.warning(`${signInResult.msg}`)
  }
  }
}
// 跳转忘记密码
function forgotPassword() {
  router.push('/ForgotPassword')
}


//监听状态,状态改变时清空表单数据
watchEffect(() => {
  if (state.checked) {
    formState.useraccount = ''; // 清空学号/账号
    formState.username = ''; // 清空姓名（如果有）
    formState.password = ''; // 清空密码
    formState.email = ''; // 清空邮箱
    formState.code = ''; // 清空验证码
  } else if (!state.checked) {
    formState.useraccount = ''; // 清空学号/账号
    formState.password = ''; // 清空密码


  }
});


</script>

<style scoped>
@import url('@/assets/css/login.css');
</style>
@/service/begin/login/login
