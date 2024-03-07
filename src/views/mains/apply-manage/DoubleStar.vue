<!--ile
    * @FileDescription: 报名表单管理 —— 双创之星报名管理。
    * @Author: 蒋雯绘
    * @Date: 2024年1月24日
    * @LastEditors: 蒋雯绘
    * @LastEditTime: 2024年2月1日
-->
<template>
  <div class="contain">
    <a-table class="ant-table-striped" :dataSource="dataSource" :columns="columns" bordered>
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
          <a style="color:chocolate" class="aaa">未审批</a>
        </template>
        <template v-else-if="column.dataIndex == 'operate'">
          <template v-if="record.state == 1">
            <a-button type="link" style="color: green" @click="showModal4">查看证书</a-button>
          </template>
          <template v-else-if="record.state == 0">
            <a-button
              type="primary"
              style="background-color: rgb(241, 170, 78)"
              @click="changebutton(record.url)"
            >
              修改
            </a-button>
            <a-modal v-model:open="open" title="修改填写内容" @ok="handleMoodelChange(record)" okText="确认" cancelText="取消">
              <!-- 修改表单 -->
              <a-form :model="formState" style="max-width: 500px">
                <a-form-item label="注册公司名称">
                  <a-input v-model:value="formState.companyname" :placeholder="record.companyname" />
                </a-form-item>
                <a-form-item label="虚拟/实体">
                  <a-input v-model:value="formState.vp"  :placeholder="record.vp" />
                </a-form-item>
                <a-form-item label="申报人排名">
                  <a-input v-model:value="formState.ranking" :placeholder="record.ranking"/>
                </a-form-item>
                <a-form-item label="注册时间">
                  <a-input v-model:value="formState.signuptime" :placeholder="record.signuptime"/>
                </a-form-item>
                <a-form-item label="公司规模">
                  <a-input v-model:value="formState.scale" :placeholder="record.scale"/>
                </a-form-item>
                <a-form-item label="佐证材料" name="dragger" >
                    <!-- <a-upload-dragger
                      v-model:fileList="formState.dragger"
                      name="files"
                      action="http://47.108.144.113:2000/api/stu/OssUpdate"
                      :beforeUpload="beforeUpload"
                      :change="customRequest"
                      v-model:file-list="fileList"
                    > -->
                    <a-upload-dragger
                    action="http://47.108.144.113:2000/api/stu/OssUpdate"
                    :beforeUpload="beforeUpload"
                    :multiple="true"
                    :file-list="fileList"
                    @change="handleChange"
                  >
                    <p class="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p class="ant-upload-text">将文件拖到此处或点击上传</p>
                  </a-upload-dragger>
                </a-form-item>
              </a-form>
            </a-modal>
            <a-popconfirm
              v-if="dataSource.length"
              title="是否想要删除?"
              @confirm="onDelete(record.key, record)"
            >
              <a-button type="primary" style="margin-left: 45px" danger>删除</a-button>
            </a-popconfirm>
          </template>
          <template v-else-if="record.state == 2">
            <a-button type="link" danger @click="showModal2(record)">查看驳回原因</a-button>
            <a-modal
              v-model:open="open2"
              title="查看驳回原因"
              @ok="handleOk2"
              :footer="null"
            >{{reasondata}}
              <p>{{ record.name }}</p>
            </a-modal>
            <a-popconfirm
              v-if="dataSource.length"
              title="是否想要删除?"
              @confirm="onDelete(record.key, record)"
            >
              <a-button type="primary" style="margin-left: 45px" danger>删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, toRaw, type UnwrapRef } from 'vue'
import { message, Upload } from 'ant-design-vue'
import { InboxOutlined } from '@ant-design/icons-vue'
import type { UploadChangeParam,UploadProps } from 'ant-design-vue'
import { JWHgetdoubleRequest,JWHeditRequest,JWHdeleteRequest,JWHupfileRequest,JWHgetreasonRequest } from '../../../service/mains/apply-manage/double-star'

const reasondata = ref(''); // 使用 ref 定义 reasondata
const url = ref('');

// const awardurl = ref<string[]>([]);
  const awardurl = ref('');
//定义表单
interface FormState {
  companyname: string
  vp:string
  ranking:string
  signuptime: string
  scale:string
  materials: string
  state: string
  address:string
  operate: string
  dragger: any[]
}
const formState: UnwrapRef<FormState> = reactive({
  companyname:'',
  vp:'',
  ranking:'',
  signuptime: '',
  scale:'',
  materials: '',
  state: '',
  address:'',
  operate: '',
  dragger: []
})
//表格表头
const columns = [
  {
    title: '注册公司名称',
    dataIndex: 'companyname',
    key: 'companyname',
    width: 160,
    align: 'center'
  },
  {
    title: '虚拟/实体',
    dataIndex: 'vp',
    key: 'vp',
    width: 160,
    align: 'center'
  },
  {
    title: '申报人排名',
    dataIndex: 'ranking',
    key: 'ranking',
    width: 160,
    align: 'center'
  },
  {
    title: '时间',
    dataIndex: 'signuptime',
    key: 'signuptime',
    width: 160,
    align: 'center'
  },
  {
    title: '公司规模',
    dataIndex: 'scale',
    key: 'scale',
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
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    width: 300,
    align: 'center',
  }
]
// 表格内容
const dataSource = ref<{
  key: string;
  companyname: string;
  vp: string;
  ranking: string;
  signuptime: string;
  scale: string;
  state: string;
}[]>([]);
//获取双创表单页面
  grade();
async function grade() {
// 取出登录token
const doubletoken = "bearer"+' '+localStorage.getItem('LOGIN_TOKEN');
    //console.log(doubletoken)
  const doubleResult = await JWHgetdoubleRequest({
    headers: {
      Authorization: doubletoken,
    },
  })
  if (doubleResult.code == 200) {
    //console.log(doubleResult.data)
    dataSource.value = doubleResult.data
  }
}
//将新文件更新在列表中
const handleChange = (info: UploadChangeParam) => {
  let resFileList = [...info.fileList];

  resFileList = resFileList.slice(-1);

  resFileList = resFileList.map(file => {
    if (file.response) {
      file.url = file.response.url;
    }
    return file;
  });

  fileList.value = resFileList;
};
 //删除后端数据
async function liedelete(key:string) {
  const deleteResult = await JWHdeleteRequest(key)
   // console.log(key)
  if (deleteResult.code == 200) {
    message.success(`${deleteResult.msg}`)
  } else {
    message.warning(`${deleteResult.msg}`)
  }
}
const count = computed(() => dataSource.value.length + 1)
//删除前端数据
const onDelete = (key: string, record) => {
  delete dataSource[key]
  dataSource.value = dataSource.value.filter((item) => item.key !== key)
  liedelete(key)
}
//佐证材料
const open3 = ref<boolean>(false)
//判断是否是pdf
const beforeUpload = (file: any) => {
  const isPDF = file.type === 'application/pdf'
  if (!isPDF) {
    message.error('只能上传 PDF 文件！')
    return false;
  }
  upfile(file);
  return false;
}
//上传修改文件获得链接
async function upfile(file: any) {
  // 取出登录token
const filetoken = "bearer "+localStorage.getItem('LOGIN_TOKEN');
    console.log(file)
  const fileResult = await JWHupfileRequest(file,filetoken)
   console.log(1)
  if (fileResult.code == 200) {
    message.success(`${fileResult.msg}`)
    localStorage.setItem('fileResult', fileResult.data)
    console.log(2)
  } else {
    message.warning(`${fileResult.msg}`)
  }

}
//查看材料
const material = (item) => {
  open3.value = true
  //console.log(item);

  // console.log(url.value)
  window.open(
    item.url,
      '_blank'
    )
}


const handleOk3 = (e: MouseEvent) => {
  //console.log(e)
  open3.value = false
}
let currenturl = null;
const open = ref<boolean>(false)
const fileList = ref<UploadProps['fileList']>([]);
//点击修改
const changebutton = (url) => {
  open.value = true
  console.log(currenturl)
  fileList.value=[
  {
    uid: '-1',
    name: `${url}`,
    status: 'done',
    url: url,
  },
];
}

/* const customRequest = async () => {
  try {
    const filetoken = "bearer " + localStorage.getItem('LOGIN_TOKEN');
    const fileResult = await JWHupfileRequest(file, filetoken);

    if (fileResult.code === 200) {
      message.success(`${fileResult.msg}`);
      localStorage.setItem('fileResult', fileResult.data)
    } else {
      message.warning(`${fileResult.msg}`);
    }
  } catch (error) {
    console.error('上传文件出错：', error);
    message.error('上传文件出错，请重试！');
  }
}; */

//上传修改表单
const handleMoodelChange = async (record) => {
  open.value = false
  const upfile = localStorage.getItem('fileResult');
  const editResult = await JWHeditRequest(formState.companyname, formState.vp, formState.scale, formState.ranking, formState.signuptime, upfile, record.id)
  //console.log(editResult)
  if (editResult.code == 200) {
    message.success(`${editResult.msg}`)
    clear();
    grade();
  } else {
    message.warning(`${editResult.msg}`)
  }
  // edit();
  // grade();
}
// 清空数据
const clear= () => {
  formState.companyname=''
  formState.vp=''
  formState.scale=''
  formState.ranking=''
  formState.signuptime=''
}

// 查看驳回原因
const open2 = ref<boolean>(false)

const showModal2 = (item) => {
  open2.value = true
  reason(item.id)
}

const handleOk2 = (e: MouseEvent) => {
  //console.log(e)
  open2.value = false
}
// 查看证书
const open4 = ref<boolean>(false)

const showModal4 = () => {
  open3.value = true
  //console.log(awardurl.value)
  window.open(
    awardurl.value,
      '_blank'
    )
}

const handleOk4 = (e: MouseEvent) => {
 // console.log(e)
  open3.value = false
}


// 获取驳回原因
const reasontoken = "bearer"+' '+localStorage.getItem('LOGIN_TOKEN');
async function reason(id) {
  const reasonResult = await JWHgetreasonRequest(id,reasontoken)
     // console.log(id)
   //console.log(reasonResult.data)
  if (reasonResult.code == 200) {
    reasondata.value = reasonResult.data[0].reason;
     // console.log(reasondata)
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
