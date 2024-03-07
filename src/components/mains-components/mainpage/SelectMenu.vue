<!--
    * @FileDescription: 注册页面选择部分。
    * @Author: 作者信息
    * @Date: 2024年1月22日
    * @LastEditors: 蒋雯绘
    * @LastEditTime: 2024年1月22日
-->
<template>
  <div class="demo-dropdown-wrap">
    <div >
      <a-dropdown>
        <template #overlay >
          <a-menu @click="handlegradeMenuClick">
            <a-menu-item v-for="grade in gradesArray" :key="grade.grade" > {{ grade.grade }} </a-menu-item>
          </a-menu>
        </template>
        <a-button style="width: 145px;">
          {{ Selectgrade }}
          <DownOutlined />
        </a-button>
      </a-dropdown>
      <a-dropdown >
        <template #overlay>
          <a-menu @click="handlemajorMenuClick">
            <a-menu-item v-for="major in majorsArray" :key="major.major">{{ major.major }} </a-menu-item>
          </a-menu>
        </template>
        <a-button style="width: 145px;">
          {{ Selectmajor }}
          <DownOutlined />
        </a-button>
      </a-dropdown>
      <a-dropdown >
        <template #overlay>
          <a-menu @click="handleclassMenuClick">
            <a-menu-item v-for="myclass in myclassesArray" :key="myclass.stuclass">{{ myclass.stuclass }}</a-menu-item>
          </a-menu>
        </template>
        <a-button style="width: 145px;">
          {{ Selectclass }}
          <DownOutlined />
        </a-button>
      </a-dropdown>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits,computed,onBeforeMount } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'
import { JWHgetgradeRequest } from '@/service/begin/signin/signin'
import { JWHgetmajorRequest } from '@/service/begin/signin/signin'
import { JWHgetclassRequest } from '@/service/begin/signin/signin'
const  emit  = defineEmits();
let g = computed(()=>{
 grade();
})
onBeforeMount(() => {
  grade(); // 初始化时获取年级数据
});

interface Grade {
  grade: string,
}
interface Major {
  major: string,
}
interface myClass {
  stuclass:string
}
const Selectgrade = ref('请选择年级')
const gradesArray = ref<Grade[]>([]);
const Selectmajor = ref('请选择专业')
const majorsArray = ref<Major[]>([]);
const Selectclass = ref('请选择班级')
const myclassesArray = ref<myClass[]>([]);

// 年级选项接口
async function grade() {
  const gradeResult = await JWHgetgradeRequest()
    // console.log(gradeResult)
  if (gradeResult.code == 200) {
    gradesArray.value = gradeResult.data;
  }
}
// 专业选项接口
async function major() {
  const majorResult = await JWHgetmajorRequest(Selectgrade.value)
    // console.log(Selectgrade.value)
    // console.log(majorResult.data)
  if (majorResult.code == 200) {
    majorsArray.value = majorResult.data;
    // console.log(majorsArray.value)
  }
}
//班级选项接口
async function myclass() {
  const myclassResult = await JWHgetclassRequest(Selectgrade.value,Selectmajor.value)
     // console.log(myclassResult)
  if (myclassResult.code == 200) {
    myclassesArray.value = myclassResult.data;
     // console.log(myclassesArray.value)
  }
}

 const handlegradeMenuClick = (info: any) => {
   const selectedOption = info.key
   Selectgrade.value = `${selectedOption}`
   major();
   emit('gradeSelected', Selectgrade.value); // 把数据传给父组件
 }
const handlemajorMenuClick = (info: any) => {
  const selectedOption = info.key
  Selectmajor.value = `${selectedOption}`
  // console.log(Selectmajor)
  myclass();
  emit('majorSelected', Selectmajor.value);
}
const handleclassMenuClick = (info: any) => {
  const selectedOption = info.key
  Selectclass.value = `${selectedOption}`
  // console.log(Selectclass)
  emit('classSelected', Selectclass.value);
}


</script>

<style scoped>
.demo-dropdown-wrap {
  margin-right: 8px;
  margin-left: 9px;
  margin-bottom: 20px;
}
.ant-dropdown-menu {
  min-width: 100px;
  max-height: 200px; /* 设置最大高度 */
  overflow-y: auto; /* 如果内容超出最大高度，显示滚动条 */
}

</style>
