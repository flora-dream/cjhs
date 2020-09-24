<template>
<div class="login-wrap">
  <el-form class="login-form" label-position="left" :model="formLabelAlign">
    <p class="name">法律法规服务系统</p>
    <el-form-item>
      <el-row>
        <el-col :span="4">
          <i style="font-size:36px; color: #333333;
          margin-top: 5px;" class="el-icon-user"></i>
        </el-col>
        <el-col :span="20">
          <el-input v-model="name" placeholder="请输入用户名"></el-input>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-row>
        <el-col :span="4">
          <i style="font-size:36px; color: #333333;
          margin-top: 5px;" class="el-icon-suitcase"></i>
        </el-col>
        <el-col :span="20">
          <el-input v-model="password" placeholder="请输入密码"></el-input>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-row>
        <el-col :span="8">
          <el-image :src="url" alt="验证码" id="image" @click="changeImg()"></el-image>
        </el-col>
        <el-col :span="16">
          <el-input v-model="code"></el-input>
        </el-col>
      </el-row>
      <p style="margin-top: 0px; text-align: center">看不清，请点击图片换一张！</p>
    </el-form-item>
    <p style="text-align: center">【温馨提示】忘记密码请联系管理员！</p>
    <el-button @click.prevent="Verify()" class="login-btn" type="primary">登录</el-button>
  </el-form>
</div>
</template>

<script>
import {
  randomBytes
} from 'crypto';
export default {
  data() {
    return {
      name: '',
      password: '',
      code: '',
      url: '',
    };
  },
  created() {
    //设置验证码的url地址
    this.url = this.GLOBAL.baseURL + '/verify_img'
  },
  methods: {
    // 登陆请求
    async Verify() {
      var formdata = new FormData()
      formdata.append("name", this.name)
      formdata.append("password", this.password)
      formdata.append("code", this.code)
      
      const res = await this.$http.post('/login', formdata)
      
      const {
        code,
        admin_name,
        message
      } = res.data 
      
      if (code === 1014) {
          sessionStorage.setItem('admin_name', admin_name)
          this.$message.success(message)
          this.$router.push({
            name: 'home'
          })       
        } else if (code === 2014) {
          this.$message.warning(message)
        } else if (code === 2006) {
          this.$message.warning(message)
        } else if (code === 2007) {
          this.$message.warning(message)
        } else if (code === 2014) {
          this.$message.warning(message)
        } else if (code === 2012) {
          this.$message.warning(message)
        } else {
          this.$message.warning("登陆失败！")
        }
        
    },

    // 点击图片更改验证码图片
    changeImg() {
      this.url = this.GLOBAL.baseURL + '/verify_img?' + randomBytes(1)
    },

    // 



  }
}
</script>

<style lang="">
.login-wrap {
  height: 100%;
  background-color: #324152;
  background-image: url(../../assets/images/login/bg.jpg);
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrap .login-form {
  width: 360px;
  height: 500px;
  background-color: #fff;
  border-radius: 5px;
  padding: 40px;
}

.name {
  margin-top: 60px;
  font-size: 24px;
  color: #333333;
  margin-bottom: 50px;
}

el-col i {
  font-size: 15px;
  color: #333333;
  margin-top: 5px;
}

.login-wrap .login-btn {
  width: 100%;
}
</style>
