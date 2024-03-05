<!--
    * @FileDescription: 报名表单管理 —— 科研之星报名管理。
    * @Author: 张亭婷
    * @Date: 2024年1月22日
    * @LastEditors: 张亭婷
    * @LastEditTime: 2024-01-28 23:04:54
-->
<template>
  <div class="contain">
    <a-table :dataSource="dataSource" :columns="columns" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'address'">
          <a-button type="link" @click="showModal3">点击查看</a-button>
          <a-modal
            v-model:open="open3"
            title="佐证材料"
            @ok="handleOk3"
            :ok-button-props="{ disabled: true }"
            :cancel-button-props="{ disabled: true }"
          >
            <p>{{ record.name }}</p>
            <p>{{ record.name }}</p>
            <p>{{ record.name }}</p>
          </a-modal>
        </template>
        <template v-if="column.dataIndex == 'state' && record.state == '已通过'">
          <a style="color: #81c26b" class="aaa">已通过</a>
        </template>
        <template v-if="column.dataIndex == 'state' && record.state == '未通过'">
          <a style="color: #d41212" class="aaa">未通过</a>
        </template>
        <template v-else-if="column.dataIndex == 'operate'">
          <template v-if="record.state == '已通过'">
            <a-button type="link" style="color: green" @click="showModal4">查看证书</a-button>
            <a-modal
              v-model:open="open4"
              title="查看详情"
              @ok="handleOk4"
              :ok-button-props="{ disabled: true }"
              :cancel-button-props="{ disabled: true }"
            >
              <p>gfddxz</p>
            </a-modal>
            <a-modal
              v-model:open="open3"
              title="佐证材料"
              @ok="handleOk3"
              :ok-button-props="{ disabled: true }"
              :cancel-button-props="{ disabled: true }"
            >
              <p>{{ record.name }}</p>
              <p>{{ record.name }}</p>
              <p>{{ record.name }}</p>
            </a-modal>
          </template>
          <template v-else-if="record.state == '待审批'">
            <a-button
              type="primary"
              style="margin-right: 5px; background-color: rgb(241, 170, 78)"
              @click="showModal1"
            >
              修改
            </a-button>
            <a-modal v-model:open="open" title="修改填写内容" @ok="handleOk">
              <!-- 表单验证 -->
              <a-form :model="formState">
                <a-form-item label="参赛名称">
                  <a-input v-model:value="formState.name" />
                </a-form-item>
                <a-form-item label="报名时间">
                  <a-input v-model:value="formState.name" />
                </a-form-item>
                <a-form-item label="佐证材料">
                  <a-input v-model:value="formState.name" />
                </a-form-item>
                <a-form-item label="状态">
                  <a-input v-model:value="formState.name" />
                </a-form-item>
                <a-form-item label="操作">
                  <a-input v-model:value="formState.name" />
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
          <template v-else-if="record.state == '未通过'">
            <a-button type="link" danger @click="showModal2">查看驳回原因</a-button>
            <a-modal
              v-model:open="open2"
              title="查看驳回原因"
              @ok="handleOk2"
              :ok-button-props="{ disabled: true }"
              :cancel-button-props="{ disabled: true }"
            >
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
let dataSource = [
  {
    key: '1',
    style: '科技之星',
    objectName: '胡彦斌',
    objectNName: 'ssdda',
    objectTime: 111,
    totalPeople: 20,
    address: '点击材料',
    state: '待审批',
    operate: 'aaaa'
  },
  {
    key: '2',
    style: '科技之星',
    objectName: '胡彦斌',
    objectNName: 'ssdda',
    objectTime: 111,
    totalPeople: 20,
    address: '点击材料',
    state: '待审批',
    operate: 'aaaa'
  },
  {
    key: '3',
    style: '科技之星',
    objectName: '胡彦斌',
    objectNName: 'ssdda',
    objectTime: 111,
    totalPeople: 20,
    address: '点击材料',
    state: '待审批',
    operate: 'aaaa'
  },
  {
    key: '4',
    style: '科技之星',
    objectName: '胡彦斌',
    objectNName: 'ssdda',
    objectTime: 111,
    totalPeople: 20,
    address: '点击材料',
    state: '待审批',
    operate: 'aaaa'
  }
]
const columns = [
  {
    title: '类别',
    dataIndex: 'style',
    key: 'style',
    width: 100,
    align: 'center'
  },
  {
    title: '期刊名称',
    dataIndex: 'objectName',
    key: 'objectName',
    width: 110,
    align: 'center'
  },
  {
    title: '论文名称',
    dataIndex: 'objectNName',
    key: 'objectNName',
    width: 110,
    align: 'center'
  },
  {
    title: '发表时间',
    dataIndex: 'objectTime',
    key: 'objectTime',
    width: 110,
    align: 'center'
  },
  {
    title: '总人数',
    dataIndex: 'totalPeople',
    key: 'totalPeople',
    width: 100,
    align: 'center'
  },
  {
    title: '佐证材料',
    dataIndex: 'address',
    key: 'address',
    align: 'center',
    width: 110
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    align: 'center',
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    width: 250,
    align: 'center'
  }
]
//删除
const count = computed(() => dataSource.length + 1)
const onDelete = (key: string, record) => {
  delete dataSource[key]
  dataSource = dataSource.filter((item) => item.key !== key)
}
// 佐证材料
const open3 = ref<boolean>(false)

const showModal3 = () => {
  open3.value = true
}

const handleOk3 = (e: MouseEvent) => {
  console.log(e)
  open3.value = false
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
//表单
interface FormState {
  name: string
  time: number
}
const formState: UnwrapRef<FormState> = reactive({
  name: '',
  time: 0
})
const onSubmit = () => {
  console.log('submit!', toRaw(formState))
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
// 查看证书
const open4 = ref<boolean>(false)

const showModal4 = () => {
  open3.value = true
}

const handleOk4 = (e: MouseEvent) => {
  console.log(e)
  open3.value = false
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
.ant-table-striped {
  width: 90%;
}
:deep(:where(.css-dev-only-do-not-override-19yxfbp).ant-table-wrapper .ant-table-pagination) {
  opacity: 0;
}
:deep(:where(.css-dev-only-do-not-override-19yxfbp)[class^='ant-spin']) {
  margin-top: 10px;
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
