<template>
<el-card class="box-card">
  <!--面包屑-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>文件管理</el-breadcrumb-item>
    <el-breadcrumb-item>文件查阅/删除</el-breadcrumb-item>
  </el-breadcrumb>

  <!--搜索-->
  <el-row class="searchRow" type="flex" justify="center" :gutter="20">
    <el-col :span="5">
      <el-input @clear="loadUserList()" clearable placeholder="请输入内容" v-model="searchform.title">
        <template slot="prepend">查询标题：</template>
      </el-input>
    </el-col>
    <el-col :span="5">
      <el-input @clear="loadUserList()" clearable placeholder="请输入内容" v-model="searchform.content">
        <template slot="prepend">查询内容：</template>
      </el-input>
    </el-col>
    <el-col :span="3">
      <el-select v-model="searchform.service_type">
        <el-option value="业务类型" disabled>业务类型</el-option>
        <el-option v-for="item in searchform.select1" :key="item" :value="item">{{item}}</el-option>
      </el-select>&nbsp;&nbsp;
    </el-col>
    <el-col :span="3">
      <el-select v-model="searchform.file_type">
        <el-option value="文件类型" disabled>文件类型</el-option>
        <el-option v-for="item in searchform.select2" :key="item" :value="item">{{item}}</el-option>
      </el-select>&nbsp;&nbsp;
    </el-col>
    <el-col :span="3">
      <el-select v-model="searchform.scope">
        <el-option value="效力层级" disabled>效力层级</el-option>
        <el-option v-for="item in searchform.select3" :key="item" :value="item">{{item}}</el-option>
      </el-select>&nbsp;&nbsp;
    </el-col>
    <el-col :span="3">
      <el-select v-model="searchform.dept">
        <el-option value="颁布单位" disabled>颁布单位</el-option>
        <el-option v-for="item in searchform.select4" :key="item" :value="item">{{item}}</el-option>
      </el-select>&nbsp;&nbsp;
    </el-col>
  </el-row>

  <el-row class="searchRow" type="flex" justify="center" :gutter="20" style="">
    <el-col :span="9">有效日期：<el-date-picker v-model="searchform.effect_time_start" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
      &nbsp;至&nbsp;
      <el-date-picker v-model="searchform.effect_time_end" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
      &nbsp;&nbsp;
    </el-col>
    <el-col :span="9">发布时间：<el-date-picker v-model="searchform.pub_time_start" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
      &nbsp;至&nbsp;
      <el-date-picker v-model="searchform.pub_time_end" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
    </el-col>
    <el-col :span="2">
      <el-button type="success" @click="search(0)">高级检索</el-button>
    </el-col>
    <el-col :span="2">
      <el-button type="danger" @click="multi_del()">批量删除</el-button>
    </el-col>
    <el-col :span="2">
      <el-button type="primary" @click="multi_down()">批量下载</el-button>
    </el-col>
  </el-row>

  <!--表格-->
  <el-table :data="posts_lst" stripe style="width: 100%" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55">
    </el-table-column>
    <el-table-column type="index" label="#" width="60">
    </el-table-column>

    <el-table-column label="文件名称">
      <template slot-scope="scope">
        <a :href="'http://10.141.105.211:8080/file/show/' + scope.row.id" v-html="scope.row.name"></a>
      </template>
    </el-table-column>
    <el-table-column prop="content" label="相关内容">
      <template slot-scope="scope">
        <p v-html="scope.row.content"></p>
      </template>
    </el-table-column>
    <el-table-column prop="service_type" label="业务类型"> </el-table-column>
    <el-table-column prop="file_type" label="文件类型"></el-table-column>
    <el-table-column prop="scope" label="效力层级"></el-table-column>
    <el-table-column prop="dept" label="颁布单位"></el-table-column>
    <el-table-column prop="pub_time_s" label="发布时间"></el-table-column>
    <el-table-column prop="effect_time_s" label="生效时间"></el-table-column>
    <!--<el-table-column label="文件状态">
      <template slot-scope="scope">
        <el-switch disabled v-model="scope.row.is_del=='true'?true:false" active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
      </template>
    </el-table-column>-->
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button @click="showEditMsgBox(scope.row)" size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
        <a :href="'http://10.141.105.211:8080/file/download/' + scope.row.id">
          <el-button size="mini" plain type="success" icon="el-icon-download" circle></el-button>
        </a>
        <el-button @click="deleteFile(scope.row)" size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
      </template>
    </el-table-column>
  </el-table>

  <!--分页-->
  <el-pagination @current-change="handleCurrentChange" :current-page="page" page-size="10" layout="total, prev, pager, next, jumper" :total="total">
  </el-pagination>

  <!--编辑文件的对话框-->
  <el-dialog title="修改文件" :visible.sync="dialogFormVisibleEdit">
    <el-form :model="form">

      <el-form-item label="颁布文号">
        <el-input v-model="form.num" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker type="date" style="width:400px" placeholder="选择日期" v-model="form.pub_time_s" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="生效时间">
        <el-date-picker type="date" style="width:400px" placeholder="选择日期" v-model="form.effect_time_s" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="文件类型">
        <el-select v-model="form.file_type" style="width:400px" placeholder="请选择文件类型">
          <el-option v-for="(item, index) in searchform.select2" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="效力层级">
        <el-select v-model="form.scope" style="width:400px" placeholder="请选择效力层级">
          <el-option v-for="(item, index) in searchform.select3" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="颁布单位">
        <el-select v-model="form.dept" style="width:400px" placeholder="请选择效力层级">
          <el-option v-for="(item, index) in searchform.select4" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务类型">
        <el-select v-model="form.service_type" style="width:400px" placeholder="请选择效力层级">
          <el-option v-for="(item, index) in searchform.select1" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
      <el-button type="primary" @click="editFile()">确 定</el-button>
    </div>
  </el-dialog>

</el-card>
</template>

<script>
export default {
  data() {
    return {
      routename: 'file_management',
      posts_lst: [],
      del_lst: [],
      page: JSON.parse(sessionStorage.getItem('currentPage')) || 1,
      total: 0,
      multipleSelection: [],
      search_state: false, //是否是搜索状态，分页时需对搜索状态进行判断

      // 编辑对话框属性
      dialogFormVisibleEdit: false,
      dialogTableVisible: false,
      dialogFormVisible: false,

      searchform: {
        title: '', //查询标题
        content: '', //查询内容
        service_type: '业务类型：', // 业务类型
        file_type: '文件类型：', //文件类型
        scope: '效力层级：', // 效力层级
        dept: '颁布单位：', //颁布单位
        select1: ['全部', '综合管理', '船舶管理', '公司管理', '船检管理', '船员管理', '规费征稽', '航海保障', '事故调查', '通航管理', '危防管理', '应急搜救', '党内法规'], // 业务类型
        select2: ['全部', '内部文件', '外部文件'], // 文件类型
        select3: ['全部', '国际公约', '法律', '行政法规', '地方性法规', '部门规章', '地方政府规章',
          '规范性文件', '其他'
        ], //效力层级
        select4: ['全部', '全国人大', '国务院', '交通运输部', '地方人大、政府', '交通运输部海事局',
          '长江航务管理局', '长江海事局', '江苏海事局'
        ], //颁布单位
        effect_time_start: '',
        effect_time_end: '',
        pub_time_start: '',
        pub_time_end: ''
      },
      form: {
        id: -1,
        file: '',
        name: '', // 文件名称
        num: '', // 文号
        service_type: '', // 业务类型
        file_type: '', //文件类型
        scope: '', //效力层级
        dept: '', //颁布单位
        pub_time_s: '', //发布时间
        effect_time_s: '', //生效时间
      },
    }
  },
  created() {
    this.getposts(0)
  },
  watch: {
    'searchform.effect_time_start'(newVal, oldVal) {
      if (newVal == null) {
        this.searchform.effect_time_start = ''
        this.search(0)
      }
    },
    'searchform.effect_time_end'(newVal, oldVal) {
      if (newVal == null) {
        this.searchform.effect_time_end = ''
        this.search(0)
      }
    },
    'searchform.pub_time_start'(newVal, oldVal) {
      if (newVal == null) {
        this.searchform.pub_time_start = ''
        this.search(0)
      }
    },
    'searchform.pub_time_end'(newVal, oldVal) {
      if (newVal == null) {
        this.searchform.pub_time_end = ''
        this.search(0)
      }
    },
  },
  methods: {
    // 删除文件
    deleteFile(val) { // 添加到删除列表
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('已添加到删除审核列表!');
        var that = this
        this.$http.get('/file/delete/' + val.id).then((response) => {
          if (response.status === 200)
            that.getposts(1)
        }).catch(function (error) {
          alert(error)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      });
    },

    // 批量删除/file/multidel  get  批量删除
    // 参数idstring  由‘,’连接各id
    // 如：/file/multidel?idstring=78,89
    multi_del() {
      this.$confirm('此操作将永久删除已选文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {

        var that = this
        // multipleSelection里面是对象数组，需要取出数组中每一个对象的id值
        //可以用map() 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值
        //var id_list = arr.map(function(item){return item.id});
        //item为数组中的一项，在这里相当于其中一个对象
        var id_list = this.multipleSelection.map(function (item) {
          return item.id
        })
        //toString()把数组转换为字符串 
        const response = await this.$http.get('/file/multidel?idstring=' + id_list.toString())
        that.$message.success('删除成功!');
        this.multipleSelection = []
        if (response.status === 200)
          that.getposts(1)
      })
    },

    // 批量删除/file/multidownload  get  批量下载
    multi_down() {
      this.$confirm('该操作将下载所选文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {

        var that = this

        // multipleSelection里面是对象数组，需要取出数组中每一个对象的id值
        //可以用map() 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值
        //var id_list = arr.map(function(item){return item.id});
        //item为数组中的一项，在这里相当于其中一个对象
        var id_list = this.multipleSelection.map(function (item) {
          return item.id
        })
        window.location.href = this.GLOBAL.baseURL + '/file/multidownload?idstring=' + id_list.toString() //浏览器打开这个url

      })
    },

    // 编辑文件 - 显示对话框
    showEditMsgBox(info) {
      // 获取文件数据
      this.form = info
      this.dialogFormVisibleEdit = true
    },

    // 编辑文件 - 发送请求
    async editFile() {
      var formdata = new FormData();
      formdata.append("id", this.form.id)

      formdata.append("name", this.form.name);
      formdata.append('num', this.form.num);
      formdata.append('pub_time_s', String(this.form.pub_time_s));
      formdata.append('effect_time_s', String(this.form.effect_time_s));
      formdata.append('service_type', this.form.service_type);
      formdata.append('file_type', this.form.file_type);
      formdata.append('scope', this.form.scope);
      formdata.append('dept', this.form.dept);

      const res = await this.$http.post('/file/update/' + this.form.id, formdata)
      if (res.status === 200) {
        // 关闭对话框
        this.dialogFormVisibleEdit = false
        // 更新视图
        this.getposts(0)
        this.$message.success('编辑成功')
      } else {
        this.$message.warning('编辑失败')
      }
    },

    async search(val) {
      this.search_state = true
      let formdata = new FormData();
      formdata.append('title', this.searchform.title);
      formdata.append('content', this.searchform.content);
      if (this.searchform.effect_time_start != '') {
        formdata.append('effect_time_start', String(this.searchform.effect_time_start));
      }
       if (this.searchform.effect_time_end != '') {
        formdata.append('effect_time_end', String(this.searchform.effect_time_end));
      }
       if (this.searchform.pub_time_start != '') {
        formdata.append('pub_time_start', String(this.searchform.pub_time_start));
      }
       if (this.searchform.pub_time_end != '') {
        formdata.append('pub_time_end', String(this.searchform.pub_time_end));
      }
      
      
      if (this.searchform.service_type === '全部' | this.searchform.service_type === '业务类型：') {
        this.searchform.service_type = ''
      }
      formdata.append('service_type', this.searchform.service_type);
      if (this.searchform.file_type === '全部' | this.searchform.file_type === '文件类型：') {
        this.searchform.file_type = ''
      }
      formdata.append('file_type', this.searchform.file_type);
      if (this.searchform.scope === '全部' | this.searchform.scope === '效力层级：') {
        this.searchform.scope = ''
      }
      formdata.append('scope', this.searchform.scope);
      if (this.searchform.dept === '全部' | this.searchform.dept === '颁布单位：') {
        this.searchform.dept = ''
      }
      formdata.append('dept', this.searchform.dept);
      formdata.append('is_del', 'false');

      if (val === 0) {
        const res = await this.$http.post('/criteria_query', formdata)
        this.posts_lst = res.data.fileDTOS
        this.total = res.data.all_count
      } else {
        const res = await this.$http.post('/criteria_query?page=' + this.page, formdata)
        this.posts_lst = res.data.fileDTOS
      }
    },

    handleCurrentChange(val) {
      this.page = val
      console.log(val)

      if (this.search_state) {

        this.search(val)
      } else {
        this.getposts(val)
      }
    },

    // 处理多选
    handleSelectionChange(val) {
      this.multipleSelection = val;

    },

    async getposts(val) { // 获取所有未被删除的文件
      // 若传入参数为0 则为获取全部数据，若为其他数字则是获取该页数据
      var formdata = new FormData();
      formdata.append('is_del', 'false');

      if (val === 0) {
        const res = await this.$http.get('/query', formdata)
        this.posts_lst = res.data.fileDTOS
        this.total = res.data.all_count

        this.$message.success("列表加载成功！")
      } else {
        const res = await this.$http.get('/query?page=' + this.page, formdata)
        this.posts_lst = res.data.fileDTOS
        //this.total = res.data.all_count
        this.$message.success("列表加载成功！")
      }

    },
  },
}
</script>

<style lang="">
.box-card {
  height: 100%;
}

.searchRow {
  margin-top: 20px;
}
</style>
