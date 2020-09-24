<!--该文件弃用-->


<template>
<el-card class="box-card">
  <!--面包屑-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>文件信息导出</el-breadcrumb-item>
    <el-breadcrumb-item>导出Excel</el-breadcrumb-item>
  </el-breadcrumb>

  <!--导出按钮-->
  
  <a :href="this.GLOBAL.baseURL + '/file/downloadexcel'"><el-button type="primary">导出Excel</el-button></a>
  
</el-card>
</template>

<style lang="">
.box-card {
  height: 100%;
}
</style>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    
  },
}
</script>
