<template>
<el-card class="box-card">
  <!--面包屑-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>文件管理</el-breadcrumb-item>
    <el-breadcrumb-item>多文件上传</el-breadcrumb-item>
  </el-breadcrumb>

  <!--进度条-->
  <!--进度条-->
  <div style="height: 300px;margin:50px">
  <el-steps :active="active" direction="vertical">
    <el-step title="步骤 1">
      <template slot="description">
        <el-upload limit="1" class="upload-demo" ref="upload" :http-request="uploadSectionFile" action="http://10.141.105.211:8080/file/upload_excel" :on-change="handleChange" :file-list="fileList" :auto-upload="false" accept=".xls">
        <el-button slot="trigger" type="primary" style="margin:20px">选取Excel</el-button>
        <span slot="tip" class="el-upload__tip" style="margin-left:20px">【提示】只能上传.xls文件</span>
      </el-upload>
      </template>
    </el-step>
    <el-step title="步骤 2">
      <template slot="description">
        <el-button type="warning" @click="onSubmit()" style="margin:20px">上传Excel</el-button>
      </template>
    </el-step>
    <el-step title="步骤 3">
      <template slot="description">
        <el-upload multiple class="upload-demo" ref="upload2" :http-request="uploadMultiFile" action="http://10.141.105.211:8080/file/addMultiFiles" :on-change="handleMultiChange" :file-list="fileListMulti" :auto-upload="false" accept=".doc, .docx, .pdf">
        <el-button slot="trigger" type="primary" style="margin:20px">选取文件</el-button>
        <span slot="tip" class="el-upload__tip" style="margin-left:20px">【提示】只能上传.doc, .docx, .pdf文件</span>
      </el-upload>
      </template>
    </el-step>
    <el-step title="步骤 4">
      <template slot="description">
        <el-button type="warning" @click="onMultiSubmit()" style="margin:20px">立即上传</el-button>
      </template>
    </el-step>
  </el-steps>
</div>

 

</el-card>
</template>

<script>
export default {
  data() {
    return {
      active:0,
      form: {
        file: '',
        name: '',

      },
      fileList: [],
      fileListMulti: [],
      fileData: new FormData(), // 文件上传数据（多文件合一）
    }
  },
  methods: {
    async uploadSectionFile(param) {
      var fileObj = param.file;
      var formdata = new FormData();

      formdata.append('excel_file', fileObj);
      
      const res = await this.$http.post('/file/upload_excel', formdata)
      //console.log(res.data.code)
      if (res.status === 200) {
        if (res.data.code === 1016) {
          this.$message({
            type: 'success',
            message: res.data.message
          })
          this.active=2
          this.form = {}
          fileList = []
        } else {
          this.$message({
            type: 'warning',
            message: res.data.message
          })
        }
      }
    },

    // 多文件上传
    async uploadMultiFile(param) {
      this.fileData.append('files', param.file); // append增加数据
      // var fileObj = param.file;
      // var formdata = new FormData();
      // formdata.append('files', fileObj);
      console.log(this.fileData)
      
      const res = await this.$http.post('/file/addMultiFiles', this.fileData)
      this.active = 4
      if (res.status === 200) {
        
          this.$message({
            type: 'success',
            message: '上传成功'
          })
          this.form = {}
          fileList = []
      }
      else {
          this.$message({
            type: 'warning',
            message: '上传失败'
          })     
      }
    },

    onMultiSubmit() {
      this.$refs.upload2.submit() //这个地方注意refs.upload和之前的上传excel重复了
      console.log("ewdftgerdygh")

    },

    onSubmit() {
      if (this.form.name === '') {
        this.$message({
          type: 'warning',
          message: '请选择上传文件！'
        })
      } else {
        this.$refs.upload.submit();
        
      }
    },
    // excel上传后将文件列表更新
    handleChange(file, fileList) {
      this.form.name = fileList[0].name
      this.form.file = file
      this.active = 1
    },

    // 多文件上传后将文件列表更新
    handleMultiChange(file, fileList) {
      if(this.active === 2) {
        this.active = 3
      }
      
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    }
  }
}
</script>

<style lang="">
.box-card {
  height: 100%;
}
</style>
