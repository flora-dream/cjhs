<template>
<el-card class="box-card">
  <!--面包屑-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>意见反馈</el-breadcrumb-item>
    <el-breadcrumb-item>意见反馈</el-breadcrumb-item>
  </el-breadcrumb>

  <!--反馈信息表单-->
  <el-table :data="comments_lst" stripe style="width: 100%">
    <!--可向下扩展的折叠框-->
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="用户反馈意见：">
            <span>{{ props.row.advice }}</span>
          </el-form-item>
          <br>
          <el-form-item label="回复内容：">
            <span>{{ props.row.feed }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column prop="type" label="意见类型"></el-table-column>
    <el-table-column prop="name" label="提交人"></el-table-column>
    <el-table-column prop="phone" label="联系方式"> </el-table-column>
    <el-table-column label="反馈状态">
      <template slot-scope="scope">
        <el-switch disabled v-model="scope.row.state=='1'?true:false" active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
      </template>
    </el-table-column>

    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button size="mini" type="primary" @click="reply(scope.row)">回复</el-button>
        <el-button size="mini" type="danger" @click="del(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!--分页-->、
  <el-pagination @current-change="handleCurrentChange" :current-page="page" page-size="10" layout="total, prev, pager, next, jumper" :total="total">
  </el-pagination>

  <!-- 弹出框 -->
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <el-form>
      <el-form-item label="回复内容" :label-width="formLabelWidth">
        <el-input type="textarea" v-model="msg"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>

</el-card>
</template>

<script>
export default {
  data() {
    return {
      comments_lst: [],
      page: 1,
      total: 0,
      msg: '',
      title: '',
      id: 0,

      dialogFormVisible: false,
      formLabelWidth: '80px',
    };
  },
  created() {
    this.getcomments() //
  },
  methods: {
    // 获取所有评论
    async getcomments() { // 获取所有评论
      var that = this
      var formdata = new FormData();
      formdata.append("state", '');

      const response = await this.$http.post('/feedback/query?page=' + this.page, formdata)
      if (response.status === 200) {
        that.comments_lst = response.data.feedbacks
        that.total = response.data.all_count
      } else {
        this.$message.warning("获取数据失败")
      }
    },

    //分页跳转页面
    handleCurrentChange(val) {
      this.page = val
      this.getcomments()
    },

    // 打开回复弹框
    reply(val) {
      this.dialogFormVisible = true;
      this.title = `回复  [${val.name}]`
      this.id = val.id
    },

    // 提交回复
    async submit() {
      // 如果msg不为空则发出请求，否则提示用户回复为空
      if (this.msg) {
        var that = this;
        var formdata = new FormData()
        formdata.append("id", this.id)
        formdata.append("feed", this.msg)

        const response = await this.$http.post('/feedback/reply/' + this.id, formdata)
        if (response.status === 200) {
          that.getcomments();
          that.dialogFormVisible = false;
          that.$message({
            type: 'success',
            message: '回复成功'
          });
        }
        this.msg = ''
      } else {
        this.$message({
          type: 'warning',
          message: '回复不能为空！请输入回复信息'
        })
      }
    },

    del(val) { // 删除反馈
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        var that = this;
        const response = await this.$http.get('/feedback/delete/' + val.id)
        if (response.status === 200) {
          that.getcomments();
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
  },
}
</script>

<style lang="">
.box-card {
  height: 100%;
}
</style>
