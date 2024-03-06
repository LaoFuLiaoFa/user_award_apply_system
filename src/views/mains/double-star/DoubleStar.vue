<!--
    * @FileDescription: 双创之星报名。
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
        >1.作为主要创业成员(股权排名前三)在学校大学生创业中心创办1家虚拟公司；</span
      >
      <div class="describe_content">
        2.作为主要创业成员(股权排名前三)在国家相关部门注册1家实体公司。
      </div>
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
      <a-form-item ref="name" label="注册公司名称" class="custom-label" name="name">
        <a-input v-model:value="formState.name" placeholder="请输入内容" />
      </a-form-item>
      <a-form-item ref="name" label="虚拟/实体" class="custom-label" name="nature">
        <a-input v-model:value="formState.nature" placeholder="请输入内容" />
      </a-form-item>
      <a-form-item ref="name" label="申报人排名" class="custom-label" name="ranking">
        <a-input v-model:value="formState.ranking" placeholder="请输入内容" />
      </a-form-item>
      <a-form-item label="注册时间" name="date1">
        <a-date-picker
          v-model:value="formState.date1"
          type="date"
          placeholder="请选择日期"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item ref="name" label="公司规模" class="custom-label" name="size">
        <a-input v-model:value="formState.size" placeholder="请输入内容" />
      </a-form-item>
      <a-form-item label="佐证材料">
        <a-form-item name="dragger" no-style>
          <a-upload-dragger
            v-model:fileList="formState.dragger"
            name="files"
            action="/upload.do"
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

interface FormState {
  name: string
  date1: Dayjs | undefined
  dragger: any[]
  nature: string
  size: string
  ranking: string
}
const formRef = ref()
const labelCol = { span: 9 }
const wrapperCol = { span: 8 }
const formState: UnwrapRef<FormState> = reactive({
  name: '',
  date1: undefined,
  dragger: [],
  nature: '',
  size: '',
  ranking: ''
})
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请填写注册公司名称', trigger: 'change' }],
  nature: [{ required: true, message: '请填写公司性质', trigger: 'change' }],
  ranking: [{ required: true, message: '请填写申报人排名', trigger: 'change' }],
  date1: [{ required: true, message: '请填写注册时间', trigger: 'change', type: 'object' }],
  size: [{ required: true, message: '请填写公司规模', trigger: 'change' }],
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
//上传pdf
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
  if (status !== 'uploading') {
    console.log(info.file, info.fileList)
  }
  if (status === 'done') {
    message.success(`${info.file.name} file uploaded successfully.`)
  } else if (status === 'error') {
    message.error(`${info.file.name} file upload failed.`)
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