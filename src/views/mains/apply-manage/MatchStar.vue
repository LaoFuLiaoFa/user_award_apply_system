<!--
    * @FileDescription: 报名表单管理 —— 竞赛之星报名管理。
    * @Author: 张亭婷
    * @Date: 2024年1月22日
    * @LastEditors: 李思佳
    * @LastEditTime: 2024年1月30日
-->
<template>
  <div class="contain">
    <div class="main">
      <a-spin tip="正在加载，请稍候..." :spinning="spinning">
        <a-table :data-source="data" :columns="columns" bordered>
          <template #bodyCell="{ column, record }">
            <!-- 佐证材料 -->
            <template v-if="column.dataIndex == 'url'">
              <a-button type="link" @click="showUrl">点击查看</a-button>
              <a-modal v-model:open="openUrl" title="佐证材料" :footer="null" centered>
                <a>{{ record.url }}</a>
              </a-modal>
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
                  @click="showModal1"
                >
                  修改
                </a-button>
                <a-modal
                  v-model:open="open"
                  title="修改填写内容"
                  @ok="handleOk"
                  style="
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                  "
                  :footer="null"
                  centered
                >
                  <!-- 表单验证 -->
                  <a-form :model="formState" :layout="'vertical'">
                    <a-form-item label="参赛名称:">
                      <a-input v-model:value="formState.name" />
                    </a-form-item>
                    <a-form-item label="报名时间:">
                      <a-input v-model:value="formState.name" />
                    </a-form-item>
                    <a-form-item label="佐证材料:">
                      <a-input v-model:value="formState.name" />
                    </a-form-item>
                    <a-form-item label="状态:">
                      <a-input v-model:value="formState.name" />
                    </a-form-item>
                    <a-form-item label="操作:">
                      <a-input v-model:value="formState.name" />
                    </a-form-item>
                  </a-form>
                  <a-button type="primary" style="width: 30%"> 确 定 </a-button>
                </a-modal>
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
      <a-modal v-model:open="open" title="修改填写内容" @ok="handleOk" centered>
        <!-- 表单验证 -->
        <a-form ref="form" :model="formState" :layout="'vertical'" hideRequiredMark :rules="rules">
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
        <template #footer>
          <a-button key="back" @click="handleCancel">取消</a-button>
          <a-button key="submit" type="primary" @click="onSubmit">确定</a-button>
        </template>
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

import { ZHQgetCompetition } from '@/service/mains/apply-manage/match-star'
import { message } from 'ant-design-vue'
import type { UploadChangeParam, UploadProps } from 'ant-design-vue/es/upload'
import { BASE_URL } from '@/service/config'
import { UploadOutlined } from '@ant-design/icons-vue'
import { format } from 'date-fns'
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

let data = ref([])
/**
 * @description 请求竞赛之星数据。
 */
const getData = async () => {
  const loginResult = await ZHQgetCompetition()
  // console.log(loginResult)
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
    width: 180,
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
    width: 180,
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
    width: 180,
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
    width: 180,
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
    align: 'center'
  }
])

/**
 * @description 佐证材料相关。
 */
const openUrl = ref<boolean>(false)
const showUrl = () => {
  openUrl.value = true
}

/**
 * @description 查看证书相关。
 */
const openCertificate = ref<boolean>(false)
const showCertificate = () => {
  openUrl.value = true
}

//删除
const onDelete = (key: string, record) => {
  delete data[key]
}
//点击修改
const open = ref<boolean>(false)

const showModal1 = () => {
  open.value = true
}

const handleOk = (e: MouseEvent) => {
  console.log(e)
  open.value = false
}
// 查看驳回原因
const open2 = ref<boolean>(false)

const showModal2 = () => {
  open2.value = true
}

const handleOk2 = (e: MouseEvent) => {
  console.log(e)
  open2.value = false
}

const handleOk3 = (e: MouseEvent) => {
  console.log(e)
  openUrl.value = false
}

const handleCertificate = (e: MouseEvent) => {
  console.log(e)
  openUrl.value = false
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
//表单
interface FormState {
  name: string
  time: number
}
const formState: UnwrapRef<FormState> = reactive({
  name: '',
  time: 0
})
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
  width: 95%;
  height: 90%;
  background-color: white;
  border-radius: 10px;
}

.ant-modal-content .ant-modal-footer {
  text-align: cente;
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
:deep(
    :where(.css-dev-only-do-not-override-19yxfbp).ant-table-wrapper
      .ant-table-container
      table
      > thead
      > tr
      :first-child
      > *
      :first-child
  ) {
  font-weight: normal;
}
:deep(:where(.css-dev-only-do-not-override-19yxfbp).ant-table-wrapper .ant-table-thead > tr > th) {
  font-weight: normal;
}
</style>
