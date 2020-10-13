<template>
<el-card class="box-card">
  <!--面包屑-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>文件管理</el-breadcrumb-item>
    <el-breadcrumb-item>操作记录</el-breadcrumb-item>
  </el-breadcrumb>

  <!--查询-->

  <el-row class="searchRow">
    <el-col>
      <el-date-picker v-model="searchform.time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
      <el-select v-model="searchform.operation">
        <el-option value="操作类型" disabled>操作类型</el-option>
        <el-option v-for="item in searchform.select" :key="item" :value="item">{{item}}</el-option>
      </el-select>&nbsp;&nbsp;
      <el-button type="success" @click="search(0)">检索</el-button>
    </el-col>
  </el-row>

  <el-table :data="posts_lst" style="width: 100%" stripe :row-class-name="tableRowClassName">

    <el-table-column type="index" label="#" width="100">
    </el-table-column>
    <el-table-column prop="filename" label="文件名">
    </el-table-column>
    <el-table-column prop="opt_time_s" label="操作时间">
    </el-table-column>
    <el-table-column prop="operation" label="操作类型">
    </el-table-column>
  </el-table>

  <!--分页-->
  <el-pagination @current-change="handleCurrentChange" :current-page="page" page-size="20" layout="total, prev, pager, next, jumper" :total="total">
  </el-pagination>
</el-card>
</template>

<script>
export default {
  data() {
    return {
      posts_lst: [],
      total: 0,
      page: JSON.parse(sessionStorage.getItem('currentPage')) || 1,
      search_state: false, //是否是搜索状态，分页时需对搜索状态进行判断
      form: {
        filename: '', // 文件名称
        opt_time: '', // 操作时间
        operation: '', // 操作类型      
      },
      searchform: {
        time: '',
        time_e: '',
        time_s: '',
        operation: '',
        select: ['全部', '修改', '删除', '新增'], // 操作类型
      }
    }
  },
  created() {
    this.search(0)
  },
  //这个地方因为时间日期选择器当清空时会导致绑定的time为null,
  watch: {
    'searchform.time'(newVal, oldVal) {
      if (newVal == null) {
        this.searchform.time = ''
        this.search(0)
      }
    },
  },
  methods: {
    // async getposts(val) { // 获取所有操作
    //   // 若传入参数为0 则为获取全部数据，若为其他数字则是获取该页数据
    //   // var formdata = new FormData();
    //   // formdata.append('is_del', 'false');

    //   if (val === 0) {
    //     const res = await this.$http.post('/getOptNotes')
    //     this.posts_lst = res.data.optNoteList
    //     this.total = res.data.count

    //     this.$message.success("列表加载成功！")
    //   } else {
    //     const res = await this.$http.post('/getOptNotes?page=' + this.page)
    //     this.posts_lst = res.data.optNoteList
    //     //this.total = res.data.all_count
    //     this.$message.success("列表加载成功！")
    //   }
    // },
    // 搜索
    async search(val) {
      this.search_state = true
      let formdata = new FormData();
      // 将中国标准时间转换为指定格式
      if (this.searchform.time != '') {
        var s = this.searchform.time[0]
        var e = this.searchform.time[1]
        var time_s = s.getFullYear() + '-' + (s.getMonth() + 1) + '-' + s.getDate() + ' ' + s.getHours() + ':' + s.getMinutes() + ':' + s.getSeconds()
        var time_e = e.getFullYear() + '-' + (e.getMonth() + 1) + '-' + e.getDate() + ' ' + e.getHours() + ':' + e.getMinutes() + ':' + e.getSeconds()
        formdata.append('time_s', time_s);
        formdata.append('time_e', time_e);
      }

      if (this.searchform.operation === '全部' | this.searchform.operation === '操作类型：') {
        this.searchform.operation = ''
      }
      formdata.append('operation', this.searchform.operation);

      if (val === 0) {
        const res = await this.$http.post('/getOptNotes', formdata)
        this.posts_lst = res.data.optNoteList
        this.total = res.data.count
        console.log(res)
      } else {
        const res = await this.$http.post('/getOptNotes?page=' + this.page, formdata)
        this.posts_lst = res.data.optNoteList
      }
    },
    // 分页处理
    handleCurrentChange(val) {
      this.page = val
      // if (this.search_state) {
      //   this.search(val)
      // } else {
      //   this.getposts(val)
      // }
      this.search(val)
    },

  },
}
</script>

<style lang="">
.searchRow {
  margin-top: 20px;
}

.box-card {
  height: 100%;
}
</style>
