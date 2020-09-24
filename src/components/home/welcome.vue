<!--该文件为欢迎页面-->

<template>
<el-card class="box-card">
  <!--面包屑-->
  
  <div class="pic">  
    <img src="../../assets/big.png" alt="无法显示该图片">
  </div>

</el-card>
</template>

<style lang="">
.box-card {
  height: 100%;
  
}

.pic {
  position: absolute;
  top: 40%;
  left: 40%;
}
</style>

<script>
export default {
  data() {
    return {

    }
  },
  beforeCreate() {
    const admin_name = sessionStorage.getItem('admin_name')
    if (!admin_name) {
      this.$router.push({
        name: 'login'
      })
    }
  },
  methods: {

  },
}
</script>
