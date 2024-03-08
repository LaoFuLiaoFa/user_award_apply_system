<!--
    * @FileDescription: 报名表单管理 —— 科研之星报名管理。
    * @Author: 蒋雯绘
    * @Date: 2024年2月2日
    * @LastEditors: 李思佳
    * @LastEditTime: 2024年2月2日
-->
<template>
  <div class="contain">
    <a-table class="ant-table-striped" :dataSource="dataSource" :columns="columns" bordered :scroll="{ y: 350 }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'address'">
          <a-button type="link" @click="material(record)">佐证材料</a-button>
        </template>
        <template v-if="column.dataIndex == 'state' && record.state == 1">
          <a style="color: #81c26b" class="aaa">已通过</a>
        </template>
        <template v-if="column.dataIndex == 'state' && record.state == 2">
          <a style="color: #d41212" class="aaa">未通过</a>
        </template>
        <template v-if="column.dataIndex == 'state' && record.state == 0">
          <a style="color: chocolate" class="aaa">未审批</a>
        </template>
        <template v-else-if="column.dataIndex == 'operate'">
          <template v-if="record.state == 1">
            <CheckCircleTwoTone :style="{ fontSize: '25px' }" />
          </template>
          <template v-else-if="record.state == 0">
            <a-button
              type="primary"
              style="background-color: rgb(241, 170, 78)"
              @click="changebutton(record)"
            >
              修改
            </a-button>
            <a-popconfirm
              v-if="dataSource.length"
              title="是否想要删除?"
              okText="是"
              cancelText="取消"
              @confirm="onDelete(record.id)"
            >
              <a-button type="primary" style="margin-left: 45px" danger>删除</a-button>
            </a-popconfirm>
          </template>
          <template v-else-if="record.state == 2">
            <a-button type="link" danger @click="showModal2(record)">查看驳回原因</a-button>
            <a-modal v-model:open="open2" title="查看驳回原因" @ok="handleOk2" :footer="null"
              >{{ reasondata }}
              <p>{{ record.name }}</p>
            </a-modal>
            <a-popconfirm
              v-if="dataSource.length"
              title="是否想要删除?"
              okText="是"
              cancelText="取消"
              @confirm="onDelete(record.id)"
            >
              <a-button type="primary" style="margin-left: 45px" danger>删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </template>
    </a-table>
    <a-modal
      v-model:open="open"
      title="修改填写内容"
      @ok="handleMoodelChange"
      okText="确认"
      cancelText="取消"
    >
      <a-spin tip="上传中，请稍候..." :spinning="spinningModel">
        <!-- 修改表单 -->
        <a-form :model="formState" style="max-width: 500px">
          <a-form-item label="项目名称/软著名称/期刊名称">
            <a-input v-model:value="formState.sciname" :placeholder="itemCloum.sciname" />
          </a-form-item>
          <a-form-item label="项目级别/颁发单位/论文名称">
            <a-input v-model:value="formState.scigrade" :placeholder="itemCloum.scigrade" />
          </a-form-item>
          <a-form-item label="排名/总人数">
            <a-input v-model:value="formState.ranking" :placeholder="itemCloum.ranking" />
          </a-form-item>
          <a-form-item label="立项时间/获批时间/发表时间">
            <a-date-picker
              v-model:value="formState.signuptime"
              :placeholder="itemCloum.signuptime"
              style="width: 100%"
            />
          </a-form-item>
          <a-form-item label="佐证材料" name="dragger">
            <a-upload-dragger
              action="http://47.108.144.113:2000/api/stu/OssUpdate"
              v-model="formState.dragger"
              name="file"
              :max-count="1"
              :file-list="fileList"
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
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, toRaw, type UnwrapRef } from 'vue'
import { message, Upload } from 'ant-design-vue'
import { InboxOutlined, CheckCircleTwoTone, CloudDownloadOutlined } from '@ant-design/icons-vue'
import type { UploadChangeParam, UploadFile, UploadProps } from 'ant-design-vue/es/upload'
import { BASE_URL } from '@/service/config'
import {
  JWHgetresearchRequest,
  JWHeditreserchRequest,
  JWHdeleteRequest,
  JWHgetreasonRequest
} from '../../../service/mains/apply-manage/research-star'
const reasondata = ref('') // 使用 ref 定义 reasondata
const awardurl = ref('')
//定义表单
interface FormState {
  scitype: string
  sciname: string
  scigrade: string
  ranking: string
  signuptime: string
  materials: string
  state: string
  address: string
  url: string
  dragger: string
}
const spinningModel = ref<boolean>(false)
const formState: UnwrapRef<FormState> = reactive({
  scitype: '',
  sciname: '',
  scigrade: '',
  ranking: '',
  signuptime: '',
  materials: '',
  state: '',
  address: '',
  url: '',
  dragger: ''
})
//初始化内容
//表格表头
const columns = [
  {
    title: '类别',
    dataIndex: 'scitype',
    key: 'scitype',
    width: 160,
    align: 'center'
  },
  {
    title: '项目名称/软著名称/期刊名称',
    dataIndex: 'sciname',
    key: 'sciname',
    width: 160,
    align: 'center'
  },
  {
    title: '项目级别/颁发单位/论文名称',
    dataIndex: 'scigrade',
    key: 'scigrade',
    width: 160,
    align: 'center'
  },
  {
    title: '排名/总人数',
    dataIndex: 'ranking',
    key: 'ranking',
    width: 160,
    align: 'center'
  },
  {
    title: '立项时间/获批时间/发表时间',
    dataIndex: 'signuptime',
    key: 'signuptime',
    width: 160,
    align: 'center'
  },
  {
    title: '佐证材料',
    dataIndex: 'address',
    key: 'address',
    width: 160,
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    width: 160,
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    width: 300,
    align: 'center'
  }
]
// 表格内容
const dataSource = ref([])
//获取科研表单页面
grade()
async function grade() {
  // 取出登录token
  const researchtoken = 'bearer' + ' ' + localStorage.getItem('access_Token')
  //console.log(doubletoken)
  const researchResult = await JWHgetresearchRequest({
    headers: {
      Authorization: researchtoken
    }
  })
  if (researchResult.code == 200) {
    //console.log(researchResult.data)
    dataSource.value = researchResult.data
    //  console.log(cundata.value )
  }
}
const fileList = ref<UploadProps['fileList']>([])
//将新文件更新在列表中
const handleChange = (info: UploadChangeParam) => {
  const status = info.file.status
  console.log(info)

  if (status !== 'uploading') {
    // console.log(info.file, info.fileList)
    // message.success(`${info.file.name} 文件上传中，请稍候.`)
  }
  if (status === 'done') {
    const fileurl = info.file.response.data
    formState.dragger = fileurl
    message.success(`${info.file.name} 文件上传成功.`)
  } else if (status === 'error') {
    message.error(`${info.file.name} 文件上传失败.`)
  }
  let resFileList = [...info.fileList]

  resFileList = resFileList.slice(-1)

  resFileList = resFileList.map((file) => {
    if (file.response) {
      file.url = file.response.url
    }
    return file
  })

  fileList.value = resFileList

  if (info.file.status === 'done' && info.file.response) {
    formState.url = info.file.response.data
    console.log(formState.url)
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

//删除后端数据
async function liedelete(key: string) {
  const deleteResult = await JWHdeleteRequest(key)
  // console.log(key)
  if (deleteResult.code == 200) {
    grade()
    message.success(`${deleteResult.msg}`)
  } else {
    message.warning(`${deleteResult.msg}`)
  }
}
const count = computed(() => dataSource.value.length + 1)
//删除前端数据
const onDelete = (key: string) => {
  delete dataSource[key]
  liedelete(key)
}
//佐证材料
const open3 = ref<boolean>(false)
//判断是否是pdf
const beforeUpload = (file: any) => {
  const isPDF = file.type === 'application/pdf'
  if (!isPDF) {
    file.status = 'error'
    message.error('只能上传 PDF 文件！')
    return
  }
  // upfile(file) // 直接将 file 对象传递给 upfile 函数
  return isPDF // 返回 false 取消默认的上传行为
}

//上传修改文件获得链接
// async function upfile(file: any) {
//   const filetoken = 'bearer' + ' ' + localStorage.getItem('access_Token')
//   // const fileResult = await JWHupfileRequest(file, filetoken)
//   if (fileResult.code == 200) {
//     message.success('上传成功')
//     localStorage.setItem('fileResult', fileResult.data)
//     // console.log(fileResult)
//   } else {
//     message.warning('上传失败')
//   }
// }
//查看材料
const material = (item) => {
  open3.value = true
  //console.log(item.url)
  window.open(item.url, '_blank')
}
const handleOk3 = (e: MouseEvent) => {
  // console.log(e)
  open3.value = false
}
let currenturl = null
const open = ref<boolean>(false)
const itemCloum = ref()
//点击修改
const changebutton = (item) => {
  // console.log(item);
  itemCloum.value = item
  // console.log(itemCloum.value.scigrade);
  open.value = true
  fileList.value = [
    {
      uid: '-1',
      name: `${itemCloum.value.url}`,
      url: itemCloum.value.url
    }
  ]
}

//上传修改表单
const handleMoodelChange = async () => {
  open.value = false
  const upfile = formState.url || itemCloum.value.url
  const newsciname = formState.sciname || itemCloum.value.sciname
  const newscigrade = formState.scigrade || itemCloum.value.scigrade
  const newranking = formState.ranking || itemCloum.value.ranking
  const newsignuptime = formState.signuptime || itemCloum.value.signuptime
  const editResult = await JWHeditreserchRequest(
    newsciname,
    newscigrade,
    newranking,
    newsignuptime,
    upfile,
    itemCloum.value.id
  )
  if (editResult.code == 200) {
    message.success(`${editResult.msg}`)
    clear()
    grade()
  } else {
    clear()
    message.warning(`${editResult.msg}`)
  }
}

// 清空数据
const clear = () => {
  formState.scitype = ''
  formState.sciname = ''
  formState.scigrade = ''
  formState.ranking = ''
  formState.signuptime = ''
}
// 查看驳回原因
const open2 = ref<boolean>(false)

const showModal2 = (item) => {
  open2.value = true
  //console.log(item)
  reason(item.id)
}

const handleOk2 = (e: MouseEvent) => {
  // console.log(e)
  open2.value = false
}
// 查看证书
const open4 = ref<boolean>(false)

const showModal4 = () => {
  open3.value = true
  // console.log(awardurl.value)
  window.open(awardurl.value, '_blank')
}

const handleOk4 = (e: MouseEvent) => {
  // console.log(e)
  open3.value = false
}

// 获取驳回原因
const reasontoken = 'bearer' + ' ' + localStorage.getItem('access_Token')
async function reason(id) {
  const reasonResult = await JWHgetreasonRequest(id, reasontoken)
  // console.log(id)
  //console.log(reasonResult.data)
  if (reasonResult.code == 200) {
    reasondata.value = reasonResult.data[0].reason
    //console.log(reasondata)
    message.success(`${reasonResult.msg}`)
  } else {
    message.warning(`${reasonResult.msg}`)
  }
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
  text-align: center;
}
:deep(:where(.css-dev-only-do-not-override-19yxfbp).ant-table-wrapper .ant-table-pagination-right) {
  opacity: 0;
}
:deep(:where(.css-dev-only-do-not-override-19yxfbp).ant-table-wrapper .ant-table) {
  margin-top: 40px;
}
:deep(
    :where(.css-dev-only-do-not-override-19yxfbp).ant-table-wrapper
      .ant-table-container
      table
      > thead
      > tr:first-child
      > *:first-child
  ) {
  font-weight: normal;
}
:deep(:where(.css-dev-only-do-not-override-19yxfbp).ant-table-wrapper .ant-table-thead > tr > th) {
  font-weight: normal;
}
</style>
