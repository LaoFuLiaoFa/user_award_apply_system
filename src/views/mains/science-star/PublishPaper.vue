<!--
    * @FileDescription: 科研之星报名 —— 发表论文。
    * @Author: 钟胡琴
    * @Date: 2024年1月22日
    * @LastEditors: 李思佳
    * @LastEditTime: 2024年1月22日
-->
<template>
  <div class="contest_main">
    <div class="describe">
      <span class="describe_content">评选说明:</span><br />
      <span class="describe_content"
        >1.作为项目主要成员(排名前八)获得院级及以上科研项目或教研课题立项(含教师科研项目)1项及以上;
        2.作为主申请人(排名第三)获得软件著作权1项及以上;
        3.作为主要作者(排名前三)在正规专业期刊公开发表论文1篇及以上。</span
      >
    </div>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      hideRequiredMark
      class="form"
    >
      <a-form-item ref="name" label="期刊名称" class="custom-label" name="name">
        <a-input v-model:value="formState.name" placeholder="请输入内容" />
      </a-form-item>
      <a-form-item ref="name" label="论文名称" class="custom-label" name="papername">
        <a-input v-model:value="formState.papername" placeholder="请输入内容" />
      </a-form-item>
      <a-form-item ref="name" label="排名/总人数" class="custom-label" name="ranking">
        <a-input v-model:value="formState.ranking" placeholder="请输入内容" />
      </a-form-item>
      <a-form-item label="发表时间" name="date1">
        <a-date-picker
          v-model:value="formState.date1"
          type="date"
          placeholder="请选择日期"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item label="佐证材料">
        <a-form-item name="dragger" no-style>
          <a-upload-dragger
            v-model:file-list="formState.dragger"
            name="file"
            :max-count="1"
            :action="ossUploadUrl"
            :headers="headers"
            :beforeUpload="beforeUpload"
            @change="handleChange"
          >
            <p class="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p class="ant-upload-text">将文件拖到此处或点击上传</p>
          </a-upload-dragger>
        </a-form-item>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 15, offset: 12 }">
        <a-button type="primary" @click="onSubmit">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { Dayjs } from 'dayjs'
import { reactive, ref, toRaw } from 'vue'
import type { UnwrapRef } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import { InboxOutlined } from '@ant-design/icons-vue'
import { message, Upload } from 'ant-design-vue'
import type { UploadChangeParam } from 'ant-design-vue'
import cssAnimation from 'ant-design-vue/es/_util/css-animation'
import style = cssAnimation.style
import { BASE_URL } from '@/service/config'
import { useRouter } from 'vue-router'
import { zhqparperRequest } from '@/service/mains/science-star/publish-paper'
import { format } from 'date-fns'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
dayjs.locale('zh-cn')
interface FileItem {
  response: {
    data: string // 这里是 data 属性，应该是一个 URL 字符串
  }
}
interface FormState {
  name: string
  date1: string

interface FormState {
  name: string
  date1: Dayjs | undefined
  dragger: any[]
  papername: string
  ranking: string
  dragger: FileItem[]
}
const formRef = ref()
const labelCol = { span: 9 }
const wrapperCol = { span: 8 }
const formState: UnwrapRef<FormState> = reactive({
  name: '',
  date1: '',
  dragger: [],
  papername: '',
  ranking: ''
})
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请填写期刊名称', trigger: 'change' }],
  papername: [{ required: true, message: '请填写论文名称', trigger: 'change' }],
  ranking: [{ required: true, message: '请填写排名/总人数', trigger: 'change' }],
  date1: [{ required: true, message: '请填写发表时间', trigger: 'change', type: 'object' }],
  dragger: [{ required: true, message: '请上传佐证材料', trigger: 'change' }]
}
const onSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      console.log('values', formState, toRaw(formState))
    })
    .catch((error) => {
      console.log('error', error)
    })
}
// 提交表单
async function onSubmit() {
  // 检查表单是否填写完整
  if (!formState.name || !formState.date1 || formState.dragger.length === 0) {
    message.error('请填写完整表单')
    return
  }
  // 将字符串日期转换为日期对象
  const dateObject = new Date(formState.date1)
  // 将日期对象转换为格式化后的日期字符串
  const signuptime = formatDate(dateObject.getTime(), 'yyyy-MM-dd')
  // 创建符合期望类型的对象
  const requestData = {
    scitype: title as string,
    sciname: formState.name,
    scigrade: formState.papername,
    ranking: formState.ranking,
    signuptime: signuptime,
    url: formState.dragger.map((item) => item.response.data).join(',')
  }
  try {
    // 调用 ContestRequest 函数
    const response = await zhqparperRequest(requestData)
    // 在接口请求成功后进行提示
    message.success('提交成功')
    ;(formState.name = ''),
      (formState.papername = ''),
      (formState.ranking = ''),
      (formState.date1 = '')
    formState.dragger = []
  } catch (error) {
    // 在接口请求失败时进行提示
    message.error('提交失败')
  }
}
// 判断只能上传PDF文件
const beforeUpload = (file: any) => {
  const isPDF = file.type === 'application/pdf'
  if (!isPDF) {
    message.error('只能上传 PDF 文件！')
  }
  return isPDF || Upload.LIST_IGNORE
}
const fileList = ref([])
const handleChange = (info: UploadChangeParam) => {
  const status = info.file.status
  if (status === 'done') {
    message.success(`${info.file.name} 文件上传成功！.`)
    const fileurl = info.file.response.data
  if (status !== 'uploading') {
    console.log(info.file, info.fileList)
  } else if (status === 'error') {
    message.error(`${info.file.name} 文件上传失败！.`)
  }
}
function handleDrop(e: DragEvent) {
  console.log(e)
}
const resetForm = () => {
  formRef.value.resetFields()
}
</script>
<style scoped>
.describe {
  width: 100%;
  background-color: rgb(255, 255, 255);
  border-radius: 16px;
  padding: 10px;
  overflow: hidden;
}
.describe_content {
  line-height: normal;
  color: #02509b;
}
.form {
  width: 90%;
  margin-top: 40px;
}
:deep(:where(.css-dev-only-do-not-override-19yxfbp).ant-form-item .ant-form-item-label > label) {
  color: #02509b;
}
</style>
