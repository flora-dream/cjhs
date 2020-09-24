<template>
<el-card class="box-card">
  <!--面包屑-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>账号管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  </el-breadcrumb>

  <!--搜索-->
  <el-row class="searchRow">
    <el-col>
      <el-input @clear="loadUserList()" clearable placeholder="请输入内容" v-model="query" class="inputSelect" :disabled="true">
        <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" @click="showAddUserDia()">添加用户</el-button>
    </el-col>
  </el-row>

  <!--表格-->
  <el-table :data="userlist" style="width: 100%">
    <el-table-column type="index" label="#" width="80">
    </el-table-column>
    <el-table-column prop="name" label="账号" width="200">
    </el-table-column>
    <el-table-column prop="password" label="密码" width="200">
    </el-table-column>
    <el-table-column prop="real_name" label="真实姓名" width="200">
    </el-table-column>
    <el-table-column prop="phone" label="电话" width="250">
    </el-table-column>
    <el-table-column prop="sex" label="性别" width="150">
    </el-table-column>
    <el-table-column label="角色">
      <template slot-scope="scope">
        <span v-if="scope.row.role==1">
          管理员
        </span>
        <span v-else>
          审核员
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="department" label="部门" width="200">
    </el-table-column>

    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button @click="showEditMsgBox(scope.row)" size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
        <el-button @click="showDeleteMsgBox(scope.row.id)" size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
      </template>
    </el-table-column>
  </el-table>

  <!--分页-->
  <el-pagination @current-change="handleCurrentChange" :current-page="page" page-size="10" layout="total, prev, pager, next, jumper" :total="total">
  </el-pagination>

  <!--对话框-->
  <!--1.添加用户的对话框-->
  <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
    <el-form :model="form" :rules="rules">
      <el-form-item label="账号名" label-width="100px" prop="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="密码" label-width="100px" prop="password">
        <el-input v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="真实姓名" label-width="100px" prop="real_name">
        <el-input v-model="form.real_name" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="电话" label-width="100px" prop="phone">
        <el-input v-model="form.phone" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="角色" label-width="100px" prop="role">
        <el-select v-model="form.role" placeholder="请选择">
          <el-option v-for="(item, index) in select1" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="性别" label-width="100px" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择">
          <el-option v-for="(item, index) in select2" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="部门" label-width="100px" prop="department">
        <el-select v-model="form.department" placeholder="请选择">
          <el-option v-for="(item, index) in select3" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
      <el-button type="primary" @click="addUser()">确 定</el-button>
    </div>
  </el-dialog>

  <!--2.编辑用户的对话框-->
  <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
    <el-form :model="form">
      <el-form-item label="账号名" label-width="100px">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="密码" label-width="100px">
        <el-input v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="真实姓名" label-width="100px">
        <el-input v-model="form.real_name" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="电话" label-width="100px">
        <el-input v-model="form.phone" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="角色" label-width="100px">
        <el-select v-model="form.role" placeholder="请选择">
          <el-option v-for="(item, index) in select1" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="性别" label-width="100px">
        <el-select v-model="form.sex" placeholder="请选择">
          <el-option v-for="(item, index) in select2" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="部门" label-width="100px">
        <el-select v-model="form.department" placeholder="请选择">
          <el-option v-for="(item, index) in select3" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
      <el-button type="primary" @click="editUser()">确 定</el-button>
    </div>
  </el-dialog>

</el-card>
</template>

<script>
export default {
  data() {
    return {
      select1: ['审核员', '管理员'], // 角色类型
      select2: ['男', '女'],
      select3: ['办公室', '法规规范处', '综合计划处', '财务会计处', '人事教育处',
        '指挥中心', '通航管理处', '船舶监督处', '船员管理处', '危管防污处', '船舶检查管理处',
        '基建装备处', '规费征稽处', '科技信息处', '党组工作处', '审计处', '宣传处', '纪委监察处', '直属机关党委办公室'
      ],
      query: '',
      // 表格绑定的数据
      userlist: [],
      // 分页相关的数据
      page: JSON.parse(sessionStorage.getItem('currentPage')) || 1,
      total: 0,
      // 添加对话框属性
      dialogFormVisibleAdd: false,
      // 编辑对话框属性
      dialogFormVisibleEdit: false,

      // 对话输入框规则验证
      rules: {
        name: [{
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
        phone: [{
          required: true,
          message: '请输入联系方式',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入您的密码',
          trigger: 'blur'
        }],
        real_name: [{
          required: true,
          message: '请输入您的真实姓名',
          trigger: 'blur'
        }],
        role: [{
          required: true,
          message: '请选择角色类型',
          trigger: 'change'
        }],
        sex: [{
          required: true,
          message: '请选择性别',
          trigger: 'change'
        }],
        department: [{
          required: true,
          message: '请选择部门',
          trigger: 'change'
        }],
      },

      // 添加用户的表单数据
      form: {
        name: '',
        password: '',
        department: '',
        real_name: '',
        sex: '',
        role: '',
        phone: '',
      },
      curRoleId: -1,
      curUserName: '',
      // 保存所有角色数据
      roles: []
    }
  },
  created() {
    this.getUserList()
    
  },
  methods: {
    // 获取用户列表请求
    async getUserList() {
      const res = await this.$http.get('/query_admin?page=' + this.page)

      if (res.status === 200) {
        // 1.给表格数据赋值
        this.userlist = res.data.admins
        // 2.给总数赋值
        this.total = res.data.all_count
        
        // 提示
        this.$message.success(msg)
      } else {
        // 提示
        this.$message.warning(msg)
      }
    },

    // 添加用户 发送请求
    async addUser() {
      // 1.关闭对话框
      this.dialogFormVisibleAdd = false
      //将数据封装到formdata格式（我们的后台只能接收这种，如果不转的话就是json格式传过去不起作用）
      var formdata = new FormData()
      formdata.append("name", this.form.name);
      formdata.append('password', this.form.password);
      formdata.append('real_name', this.form.real_name);
      formdata.append('phone', this.form.phone);
      formdata.append('sex', this.form.sex);
      formdata.append('role', this.form.role == '管理员' ? 1 : 2);
      formdata.append('department', this.form.department);

      const res = await this.$http.post('/add_admin', formdata)
      if (res.data.code === 2011) {
        this.$message.warning(res.data.message)
      } else if (res.data.code === 2015) {
        this.$message.warning(res.data.message)
      } else if (res.data.code === 2016) {
        this.$message.warning(res.data.message)
      } else {
        // 1.提示
        this.$message.success("添加用户成功")
        // 3.刷新视图
        this.getUserList()
        // 4.清空文本框
        this.form = {}
      }
    },

    // 显示添加用户对话框
    showAddUserDia() {
      this.form = {}
      this.dialogFormVisibleAdd = true
    },

    //分页跳转页面
    handleCurrentChange(val) {
      this.page = val
      this.getUserList()
    },

    // 编辑用户 - 显示对话框
    showEditMsgBox(user) {
      // 获取用户数据
      this.form = user
      console.log(this.form)
      this.dialogFormVisibleEdit = true
    },

    // 编辑用户 - 发送请求
    async editUser() {
      var formdata = new FormData()
      formdata.append("name", this.form.name);
      formdata.append('password', this.form.password);
      formdata.append('real_name', this.form.real_name);
      formdata.append('phone', this.form.phone);
      formdata.append('sex', this.form.sex);
      formdata.append('role', this.form.role == '管理员' ? 1 : 2);
      formdata.append('department', this.form.department);
      console.log(this.form.id)
      const res = await this.$http.post('/update_admin?id=' + this.form.id, formdata)
      if (res.data.code === 2011) {
        this.$message.warning('请先登录')
      } else if (res.data.code === 2016) {
        this.$message.warning('权限不够')
      } else {
        // 关闭对话框
        this.dialogFormVisibleEdit = false
        // 更新视图
        this.getUserList()
        this.$message.success('编辑成功')
      }
    },

    // 删除用户 - 确认框 -> 删除请求
    showDeleteMsgBox(userID) {
      this.$confirm('删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发送删除请求
        // 接受参数 int  id
        // 把id以参数形式传进来
        const res = await this.$http.get('/del_admin?id=' + userID)
        if (res.data.code === 2011) {
          this.$message.warning('请先登录')
        } else if (res.data.code === 2016) {
          this.$message.warning('权限不够')
        } else {
          // 更新视图
          this.page = 1
          this.getUserList()
          // 提示
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
  },
}
</script>

<style lang="">
.box-card {
  height: 100%;
}

.inputSelect {
  width: 500px;
}

.searchRow {
  margin-top: 20px;
}
</style>
