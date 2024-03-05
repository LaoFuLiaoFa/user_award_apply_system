<!--
    * @FileDescription: 首页页面。
    * @Author: 作者信息
    * @Date: 2024年1月23日
    * @LastEditors: 蒋雯绘
    * @LastEditTime: 2024年1月23日
-->
<template>
  <div>
    <p class="font1">欢迎使用</p>
    <p class="font1">成都东软学院</p>
    <p class="font1">学生学院奖项信息填报系统</p>
    <p class="font2">问题咨询请添加管理员QQ:</p>
    <div class="qqbg">
      <img src="@/assets/images/qq.png" />
    </div>
    <p class="font3">
      注意:若有多条奖项信息请分多次提交表单,切勿放在一个表单提交!否则次数计算将不达标.
    </p>
    <p class="font3">若已提交,请在审批之前删除数据重新提交!若被驳回,请修改之后重新提交即可.</p>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.font1 {
  font-size: 30px;
  padding: 10px 10px 20px;
  color: #02509b;
}
.font2 {
  font-size: 15px;
  padding: 10px 10px 20px;
  color: #02509b;
  font-weight: bold;
}
.qqbg > img {
  border-radius: 15px 15px 0px 15px;
  box-shadow: 1px 1px 20px #818181;
  width: 15%;
  margin-left: 10px;
  margin-top: 20px;
  margin-bottom: 40px;
}
.font3 {
  font-size: 20px;
  padding: 10px 10px 10px;
  color: #f80122;
}
</style>
