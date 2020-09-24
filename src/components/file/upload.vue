<template>
<el-card class="box-card">
  <!--面包屑-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>文件管理</el-breadcrumb-item>
    <el-breadcrumb-item>文件上传</el-breadcrumb-item>
  </el-breadcrumb>

  <!--文件上传表单-->
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="选择文件">
      <el-upload limit="1" class="upload-demo" ref="upload" :http-request="uploadSectionFile" action="http://10.141.105.211:8080/file/add" :on-change="handleChange" :file-list="fileList" :auto-upload="false" accept=".doc, .docx, .pdf">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <span slot="tip" class="el-upload__tip" style="margin-left:20px">【提示】只能上传.doc, .docx, .pdf文件</span>
      </el-upload>
    </el-form-item>
    <el-form-item label="颁布文号">
      <el-input v-model="form.num"></el-input>
    </el-form-item>
    <el-form-item label="发布时间">
      <el-date-picker type="date" placeholder="选择日期" v-model="form.pub_time_s" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="生效时间">
      <el-date-picker type="date" placeholder="选择日期" v-model="form.effect_time_s" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="文件类型">
      <el-select v-model="form.file_type" placeholder="请选择文件类型">
        <el-option v-for="(item, index) in select2" :key="index" :label="item" :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="效力层级">
      <el-select v-model="form.scope" placeholder="请选择效力层级">
        <el-option v-for="(item, index) in select3" :key="index" :label="item" :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="颁布单位">
      <el-select v-model="form.dept" placeholder="请选择效力层级">
        <el-option v-for="(item, index) in select4" :key="index" :label="item" :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="业务类型">
      <el-select v-model="form.service_type" placeholder="请选择效力层级">
        <el-option v-for="(item, index) in select1" :key="index" :label="item" :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit()">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>

</el-card>
</template>

<script>
export default {
  data() {
    return {
      form: {
        file: '',
        name: '',
        num: '',
        service_type: '', // 业务类型
        file_type: '', //文件类型
        scope: '', //效力层级
        dept: '', //颁布单位
        pub_time_s: '', //发布时间
        effect_time_s: '', //生效时间
      },
      select1: ['综合管理', '船舶管理', '公司管理', '船检管理', '船员管理', '规费征稽', '航海保障', '事故调查', '通航管理', '危防管理', '应急搜救', '党内法规'], // 业务类型
      select2: ['内部文件', '外部文件'], // 文件类型
      select3: ['国际公约', '法律', '行政法规', '地方性法规', '部门规章', '地方政府规章',
        '规范性文件', '其他'
      ], //效力层级
      select4: ['全国人大', '国务院', '交通运输部', '地方人大、政府', '交通运输部海事局',
        '长江航务管理局', '长江海事局', '江苏海事局'
      ], //颁布单位
      formLabelWidth: '100px',
      fileList: [],
    }
  },
  methods: {
    async uploadSectionFile(param) {
      var fileObj = param.file;
      var formdata = new FormData();
      formdata.append("name", this.form.name);
      formdata.append('file', fileObj);
      formdata.append('num', this.form.num);
      formdata.append('pub_time_s', String(this.form.pub_time_s));
      formdata.append('effect_time_s', String(this.form.effect_time_s));
      formdata.append('service_type', this.form.service_type);
      formdata.append('file_type', this.form.file_type);
      formdata.append('scope', this.form.scope);
      formdata.append('dept', this.form.dept);
      const res = await this.$http.post('/file/add', formdata)
      //console.log(res.data.code)
      if (res.data.code === 2003) {
        this.$message({
          type: 'warning',
          message: '文件名相同或该文件已存在，请勿重新上传！'
        })
      } else {
        this.$message({
          type: 'success',
          message: '文件上传成功！'
        })
        this.form = {}
        fileList = []

      }
    },
    onSubmit() {

      if (this.form.name === '') {
        this.$message({
          type: 'warning',
          message: '请选择上传文件！'
        })
      } else if (this.form.service_type === '' ||
        this.form.scope === '' || this.form.dept === '' || this.form.file_type === '') {
        this.$message({
          type: 'warning',
          message: '请填写文件信息！'
        })
      } else {
        this.$refs.upload.submit();
        
      }
    },
    // 文件上传后将文件列表更新
    handleChange(file, fileList) {
      this.form.name = fileList[0].name
      this.form.file = file

    }
  }
}
</script>

<style lang="">
.box-card {
  height: 100%;
}
</style>
