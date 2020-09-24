<template>
<div class="content" style="height:100%">
  <el-tabs type="border-card">
    <el-tab-pane label="意见反馈">
      <div class="panel panel-default">
        <div class="panel-body">
          <el-form ref="form" :label-position="labelPosition" :model="form" :rules="rules">
            <!-- 
            上传图片：<input type="file" name="file" @change="upload($event)" accept="image/*">
            <br>-->
            <el-form-item label="意见类型：" prop="type">
              <el-select v-model="form.type" placeholder="请选择">
                <el-option v-for="item in form.select" :key="item" :value="item">{{item}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="姓名：" prop="author">
              <el-input v-model="form.author"></el-input>
            </el-form-item>
            <el-form-item label="联系方式：" prop="tel">
              <el-input v-model="form.tel"></el-input>
            </el-form-item>
            <el-form-item label="反馈内容：" prop="content">
              <el-input type="textarea" v-model="form.content" maxlength="200" show-word-limit></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submit('form')">提交反馈</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="反馈列表">
      <div style="border-left:8px solid #86bbdb;box-sizing: border-box;height: auto;overflow:auto;">
        <div id="ajaxcontent">
          <table border="0" cellspacing="0" cellpadding="0" width="100%">
            <tbody v-for="(item, index) in comments_lst" :key="index">
              <tr>
                <td style="BORDER-BOTTOM: #86bbdb 1px solid" bgcolor="#ecf7f9" height="22" valign="center" width="20%" align="middle">
                  <span style="COLOR: #003399; FONT-SIZE: 12px; FONT-WEIGHT: bold">用户『{{item.name}}』：</span>
                </td>
                <td style="BORDER-BOTTOM: #86bbdb 1px solid; WORD-WRAP: break-word; TABLE-LAYOUT: fixed; WORD-BREAK: break-all" class="hui2" bgcolor="#ecf7f9" valign="center" width="80%" align="left">
                  {{item.feed}}
                  <span style="float: right"><small>[{{item.pull_time_s}}]</small></span>
                </td>
              </tr>
              <tr>
                <td height="8" colspan="2"></td>
              </tr>
              <tr>
                <td valign="center" align="middle">
                  <span style="COLOR: #ff0000; FONT-SIZE: 12px">『回 复』：</span>
                </td>
                <td style="WORD-WRAP: break-word; TABLE-LAYOUT: fixed; WORD-BREAK: break-all" class="article" valign="top" align="left">
                  {{item.advice}}
                  <span style="float: right"><small>[{{item.feed_time_s}}]</small></span>
                </td>
              </tr>
              <td height="15">&nbsp;</td>
            </tbody>
          </table>
        </div>

      </div>
      <!--分页-->
      <el-pagination @current-change="handleCurrentChange" :current-page="page" page-size="10" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>

    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      total: 0,
      form: {
        //img: '',
        //img_name: '',
        type: '',
        select: ['文件增加', '文件修改', '功能反馈'],
        author: '',
        tel: '',
        content: '',
      },
      rules: {
        author: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ],
        tel: [{
          required: true,
          message: '请输入联系方式',
          trigger: 'blur'
        }],
        content: [{
          required: true,
          message: '请输入您的意见',
          trigger: 'blur'
        }],
        type: [{
          required: true,
          message: '请选择意见类型',
          trigger: 'change'
        }],
      },

      labelPosition: 'top',

      comments_lst: [],
      state: 1,
    }

  },
  created() {
    this.getcomments()
  },
  methods: {
    // 反馈意见的图片上传
    upload(event) {
      this.form.img = event.target.files[0];
      var iMaxFilesize = 2097152; //2M
      if (this.form.img.size > iMaxFilesize) {
        alert("图片大小不能超过2M");
        return;
      }
    },

    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          var that = this
          var formdata = new FormData();
          // if (this.form.img != '') {
          //   formdata.append('img', this.form.img)
          // }
          formdata.append('name', this.form.author)
          formdata.append('phone', this.form.tel)
          formdata.append('type', this.form.type)
          formdata.append('advice', this.form.content)

          this.$http.post('/feedback/add', formdata).then(function (response) {
            if (response.status == 200) {
              that.$message({
                type: 'success',
                message: '已反馈！等待管理员审核'
              });
              that.getcomments()
            }
          }).catch(function (error) {
            alert(error)
          })
        } else {
          return false;
        }
      });
    },

    // 获取所有评论
    getcomments() {
      var that = this
      let formdata = new FormData();
      //formdata.append("state", this.state);

      this.$http.post('/feedback/query?page=' + this.page).then(function (response) {
        that.comments_lst = response.data.feedbacks
        that.total = response.data.all_count
      }).catch(function (error) {
        alert(error)
      })
    },

    handleCurrentChange(val) {
      this.page = val
      this.getcomments()
    },
  },

};
</script>

<style>

</style>
