<!--
    * @FileDescription: 报名表单管理 —— 竞赛之星报名管理。
    * @Author: 钟胡琴
    * @Date: 2024年1月22日
    * @LastEditors: 李思佳
    * @LastEditTime: 2024年1月30日
-->
<template>
  <div class="contain">
    <div class="main">
      <a-spin tip="正在加载，请稍候..." :spinning="spinning">
        <!--        列表-->
        <a-table
          :data-source="data"
          :pagination="false"
          :scroll="{ x: 1300 }"
          :columns="columns"
          bordered
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'signuptime'">
              {{ record.signuptime }}
            </template>
            <!-- 佐证材料 -->
            <template v-if="column.dataIndex == 'url'">
              <a-button type="link" @click="() => showUrl(record)">点击查看</a-button>
            </template>
            <!-- 状态 -->
            <template v-else-if="column.dataIndex == 'state' && record.state == '0'">
              <span style="color: #000">未审核</span>
            </template>
            <template v-if="column.dataIndex == 'state' && record.state == '1'">
              <span style="color: #81c26b">已通过</span>
            </template>
            <template v-else-if="column.dataIndex == 'state' && record.state == '2'">
              <span style="color: #d41212">未通过</span>
            </template>
            <template v-else-if="column.dataIndex == 'operate'">
              <!-- 操作 -->
              <template v-if="record.state == '1'">
                <CheckCircleTwoTone :style="{ fontSize: '25px' }" />
              </template>
              <template v-else-if="record.state == '0'">
                <!-- 确定修改内容 -->
                <a-button
                  type="primary"
                  style="background-color: rgb(241, 170, 78)"
                  @click="showModal1(record)"
                >
                  修改
                </a-button>
                <a-popconfirm
                  v-if="data.length"
                  title="您确定删除？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="onDelete(record.key, record)"
                >
                  <a-button type="primary" style="margin-left: 3%" danger>删除</a-button>
                </a-popconfirm>
              </template>
              <template v-else-if="record.state == '2'">
                <a-button type="text" danger @click="showModal2(record.key, record)"
                  >查看驳回原因</a-button
                >
                <a-popconfirm
                  v-if="data.length"
                  title="您确定删除？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="onDelete(record.key, record)"
                >
                  <a-button type="primary" style="margin-left: 3%" danger>删除</a-button>
                </a-popconfirm>
              </template>
            </template>
          </template>
        </a-table>
      </a-spin>
      <a-modal
        v-model:open="open"
        title="修改填写内容"
        centered
        @ok="onSubmit"
        okText="确认"
        cancelText="取消"
      >
        <a-spin tip="上传中，请稍候..." :spinning="spinningModel">
          <!-- 表单验证 -->
          <a-form
            ref="form"
            :model="formState"
            :layout="'vertical'"
            hideRequiredMark
            :rules="rules"
          >
            <a-form-item label="参赛名称:" name="entryname">
              <a-input v-model:value="formState.entryname" @input="handleFormChange" />
            </a-form-item>
            <a-form-item label="竞赛报名时间" name="signuptime">
              <a-config-provider :locale="locale">
                <a-date-picker
                  v-model:value="formState.signuptime"
                  type="date"
                  format="YYYY-MM-DD"
                  placeholder="请选择日期"
                  style="width: 100%"
                  :locale="locale"
                />
              </a-config-provider>
            </a-form-item>
            <a-form-item label="佐证材料" name="url">
              <a-form-item name="file" no-style>
                <a-upload
                  :action="ossUploadUrl"
                  :multiple="true"
                  :headers="headers"
                  :file-list="fileList"
                  @change="handleChange"
                  @input="handleFormChange"
                  @remove="handleRemove"
                  :beforeUpload="beforeUpload"
                >
                  <a-button>
                    <upload-outlined></upload-outlined>
                    点击上传
                  </a-button>
                </a-upload>
              </a-form-item>
            </a-form-item>
          </a-form>
          <!-- <template #footer>
            <a-button key="back" @click="handleCancel">取消</a-button>
            <a-button key="submit" type="primary" @click="onSubmit">确定</a-button>
          </template> -->
        </a-spin>
      </a-modal>
      <a-modal v-model:open="open2" title="查看驳回原因" :footer="null" centered>
        {{ reason }}
      </a-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { UnwrapRef } from 'vue'

import {
  ZHQdeleteJingsai,
  ZHQeditcompetition,
  ZHQgetCompetition,
  ZHQgetreasonJingsai
} from '@/service/mains/apply-manage/match-star'
import { message } from 'ant-design-vue'
import type { UploadChangeParam, UploadFile, UploadProps } from 'ant-design-vue/es/upload'
import { BASE_URL } from '@/service/config'
import { UploadOutlined } from '@ant-design/icons-vue'
// import { format } from 'date-fns'
import { Dayjs } from 'dayjs'
import type { Rule } from 'ant-design-vue/es/form'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
dayjs.locale('zh-cn')
import { Form } from 'ant-design-vue'
import { CheckCircleTwoTone, CloudDownloadOutlined } from '@ant-design/icons-vue'

// 定义加载状态
const spinning = ref<boolean>(true)
const spinningModel = ref<boolean>(false)
let data = ref([])
//时间戳转换
// const formatDate = (timestamp, formatStr = 'yyyy-MM-dd') => {
//   return format(new Date(timestamp), formatStr)
// }
/**
 * @description 请求竞赛之星数据。
 */
const getData = async () => {
  const loginResult = await ZHQgetCompetition()
  if (loginResult.code) {
    data.value = loginResult.data
    spinning.value = false
  } else {
    message.warning(`${loginResult.msg}`)
  }
}
getData()

/**
 * @description 定义表头。
 */
const columns = reactive([
  {
    title: '竞赛名称',
    dataIndex: 'entryname',
    customHeaderCell: () => ({
      style: {
        backgroundColor: '#F0FEFF',
        color: '#000',
        fontWeight: 'bold'
      }
    }),
    width: 150,
    align: 'center'
  },
  {
    title: '竞赛报名时间',
    dataIndex: 'signuptime',
    customHeaderCell: () => ({
      style: {
        backgroundColor: '#F0FEFF',
        color: '#000',
        fontWeight: 'bold'
      }
    }),
    width: 150,
    align: 'center'
  },
  {
    title: '佐证材料',
    dataIndex: 'url',
    customHeaderCell: () => ({
      style: {
        backgroundColor: '#F0FEFF',
        color: '#000',
        fontWeight: 'bold'
      }
    }),
    width: 150,
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'state',
    customHeaderCell: () => ({
      style: {
        backgroundColor: '#F0FEFF',
        color: '#000',
        fontWeight: 'bold'
      }
    }),
    width: 150,
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operate',
    customHeaderCell: () => ({
      style: {
        backgroundColor: '#F0FEFF',
        color: '#000',
        fontWeight: 'bold'
      }
    }),
    width: 250,
    fixed: 'right',
    align: 'center'
  }
])

/**
 * @description 表单相关。
 */
// 定义表单接口类型
interface FormState {
  entryname: string
  signuptime: Dayjs | undefined
  url: string
  id: string
}
const formState: UnwrapRef<FormState> = reactive({
  entryname: '',
  signuptime: undefined,
  url: '',
  id: ''
})
const rules: Record<string, Rule[]> = {
  entryname: [{ required: true, message: '请填写竞赛名称', trigger: 'change' }],
  signuptime: [
    { required: true, message: '请填写竞赛报名时间', trigger: 'change', type: 'object' }
  ],
  url: [{ required: true, message: '请上传佐证材料', trigger: 'change' }]
}
const fileList = ref<UploadProps['fileList'] | null>(null)!
const beforeUpload = (file: any) => {
  const isPDF = file.type === 'application/pdf'
  const maxFileSize = 10 * 1024 * 1024

  if (!isPDF) {
    file.status = 'error'
    message.error('只能上传 PDF 文件！')
  } else if (file.size > maxFileSize) {
    message.error('文件大小超过限制10MB！')
  }

  return isPDF && file.size <= maxFileSize
}

const handleChange = (info: UploadChangeParam) => {
  spinningModel.value = true
  const status = info.file.status
  if (status !== 'uploading') {
    // console.log(info.file, info.fileList)
    // message.success(`${info.file.name} 文件上传中，请稍候.`)
  }
  if (status === 'done') {
    spinningModel.value = false
    message.success(`${info.file.name} 文件上传成功.`)
  } else if (status === 'error') {
    message.error(`${info.file.name} 文件上传失败.`)
  }
  // if (!fileList.value) {
  //   fileList.value = []
  // }
  let resFileList = [...info.fileList]
  resFileList = resFileList.slice(-1)
  resFileList = resFileList.map((file) => {
    const newFile = {
      uid: file.uid,
      name: file.name || 'Untitled',
      url: file.response ? file.response.data : file.url
    }
    return newFile
  })
  fileList.value = resFileList

  // 打印上传文件的响应信息
  if (info.file.status === 'done' && info.file.response) {
    formState.url = info.file.response.data
    // console.log(formState.url)
  }
}

// 设置请求头
const token = localStorage.getItem('access_Token')
const headers = {
  Authorization: 'Bearer ' + token
}
//设置上传文件地址
// 上传PDF地址
const ossUploadUrl = BASE_URL + 'api/stu/OssUpdate'

// 移除已上传的文件
const handleRemove = (file: UploadChangeParam) => {
  if (!fileList.value) {
    fileList.value = []
  }
  const index = fileList.value.findIndex((item: UploadFile | any) => item.url === file)
  if (index !== -1) {
    fileList.value.splice(index, 1)
    formState.url = ''
    fileList.value = []
  }
}

/**
 * @description 佐证材料相关。
 */
const openUrl = ref<boolean>(false)
// 在 showUrl 函数中获取 record.url 并打开链接
const showUrl = (record: { url: string }) => {
  window.open(record.url, '_blank')
}

/**
 * @description 查看证书相关。
 */
const openCertificate = ref<boolean>(false)
const showCertificate = () => {
  openUrl.value = true
}

/**
 * @description 删除竞赛之星数据。
 */
const onDelete = async (key: string, record) => {
  try {
    // 调用 ContestRequest 函数
    const res = await ZHQdeleteJingsai(record.id)
    // 在接口请求成功后进行提示
    message.success('删除成功')
    getData()
  } catch (error) {
    // 在接口请求失败时进行提示
    message.error('删除失败')
  }
}
/**
 * @description 修改竞赛之星数据。
 */
const open = ref<boolean>(false)

const showModal1 = (record) => {
  // 将表格中的数据赋值给表单
  formState.entryname = record.entryname
  formState.signuptime = dayjs(record.signuptime)
  formState.url = record.url
  formState.id = record.id
  fileList.value = [
    {
      uid: '-1', // 为uid设置一个值，可以使用某个生成uid的方法
      name: record.url, // 为name设置一个值，可以使用record.name或其他默认名称
      url: record.url
    }
  ]
  open.value = true
}
//点击出现修改弹窗
const handleOk = (e: MouseEvent) => {
  open.value = false
}
/**
 * @description 提交竞赛之星表单数据。
 */
const handleCancel = () => {
  open.value = false
  isFormModified = false // 将表单修改标志设置为 false
}
// 定义一个变量来跟踪表单是否被修改过
let isFormModified = false

// 表单相关
const formRef = ref(null)
const { resetFields } = Form.useForm(formRef)
// 表单修改事件处理函数
function handleFormChange() {
  isFormModified = true
}
//表单修改
// 提交表单
async function onSubmit() {
  // 检查表单是否填写完整
  if (!formState.entryname || !formState.signuptime || !formState.url) {
    message.error('请填写完整表单')
    return
  }
  // 检查表单是否有变化
  // if (isFormModified) {
  try {
    const dateString = (formState.signuptime as dayjs.Dayjs).format('YYYY-MM-DD')
    // const dateString = dayjs(formState.signuptime)
    // 调用 ContestRequest 函数
    // spinning.value = true

    const response = await ZHQeditcompetition(
      formState.entryname,
      dateString,
      formState.url,
      formState.id
    )
    // console.log(response)

    // 在接口请求成功后进行提示
    message.success('提交成功')
    getData()
    fileList.value = []
    // formState.signuptime = {}
    // formState.entryname = ''
    // formState.url = ''
    open.value = false
    // spinning.value = false
  } catch (error) {
    // 在接口请求失败时进行提示
    message.error('提交失败')
  }
  // }

  // 重置表单修改标志
  isFormModified = false

  // 关闭表单提交对话框
  open.value = false
}
/**
 * @description 请求竞赛之星驳回原因。
 */
const open2 = ref<boolean>(false)
const reason = ref('')
const showModal2 = async (key: string, record) => {
  const loginResult = await ZHQgetreasonJingsai(record.id)
  reason.value = loginResult.data[0].reason
  open2.value = true
}
</script>

<style scoped>
.contain {
  width: 100%;
  height: 100%;
  background-color: rgb(255, 255, 255, 0.6);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.main {
  width: 98%;
  height: 90%;
  background-color: white;
  border-radius: 10px;
}

.ant-modal-content .ant-modal-footer {
  text-align: center;
  background-color: red;
}
:deep(:where(.css-dev-only-do-not-override-19yxfbp).ant-table-wrapper .ant-table-pagination-right) {
  opacity: 0;
}
[data-doc-theme='light'] .ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
[data-doc-theme='dark'] .ant-table-striped :deep(.table-striped) td {
  background-color: rgb(29, 29, 29);
}
</style>
