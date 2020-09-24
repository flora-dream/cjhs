<template>
<el-container class="container">
  <el-header class="header">
    <el-row>
      <!--1.logo
      <el-col :span="4">
        <div class="grid-content bg-purple">
           <img src="../../assets/logo.png" alt="无法显示该图片" width="50px" height="50px">
        </div>
      </el-col>
      -->
      <el-col :span="23" class="middle">
        <h3>中华人民共和国长江海事局</h3>
      </el-col>
      <el-col :span="1">
        <div class="grid-content bg-purple">
          <a href="#" class="loginout" @click="handleLoginout()">退出</a>
        </div>
      </el-col>
    </el-row>
  </el-header>
  <el-container>
    <el-aside class="aside" width="200px">
      <el-menu router="true">
        <!--1.账号管理-->
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>账号管理</span>
          </template>
          <el-menu-item index="user">用户管理</el-menu-item>

        </el-submenu>

        <!--2.文件管理-->
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-folder-opened"></i>
            <span>文件管理</span>
          </template>
          <el-menu-item index="fileup">文件上传</el-menu-item>
          <el-menu-item index="file_management">文件查阅/删除</el-menu-item>
          <el-menu-item index="file_opts">操作记录</el-menu-item>
          <el-menu-item index="file_review" disabled>文件删除审核</el-menu-item>
        </el-submenu>

        <!--3.意见反馈-->
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-chat-dot-square"></i>
            <span>意见反馈</span>
          </template>
          <el-menu-item index="comment">意见反馈</el-menu-item>
        </el-submenu>

        <!--4.文件信息导出-->
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-files"></i>
            <span>文件信息导出</span>
          </template>
          <!--<el-menu-item index="exp_excel">导出Excel</el-menu-item>-->
          <a :href="this.GLOBAL.baseURL + '/file/downloadexcel'" style="text-decoration:none"><el-menu-item>导出Excel</el-menu-item></a>
        </el-submenu>

        <el-menu-item index="5" disabled>
          <i class="el-icon-document"></i>
          <span slot="title">待增加项</span>
        </el-menu-item>

      </el-menu>
    </el-aside>
    <el-main class="main">
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data() {
    return {
      menus: [],

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
  created() {
    this.$router.push({
      name: 'welcome'
    })   
  },
  methods: {
    // 获取导航数据
    async getMenus() {
      const res = await this.$http.get(`menus`)
      this.menus = res.data.data
    },
    async handleLoginout() {
      // 向后台logout get 发送退出请求
      const res = await this.$http.get('/logout')
      if (res.status === 200) {
        // 清除session
        sessionStorage.clear()
        // 提示
        this.$message.success('退出成功！')
        // 来到login组件
        this.$router.push({
          name: 'login'
        })
      }
    },
  }
}
</script>

<style lang="">
.container {
  height: 100%;
}

.header {
  background-color: #373f41;
  color: #fff;
  font-size: 20px;
}

.aside {
  padding-top:20px
}

.main {
  background-color: #e9eef3;
}

/*头部样式*/
.middle {
  text-align: center;
}

.loginout {
  text-decoration: none;
  line-height: 60px;
  color: #fff;
  font-size: 20px;
}

.loginout:hover {
  color: #fe6d53
}
</style>
