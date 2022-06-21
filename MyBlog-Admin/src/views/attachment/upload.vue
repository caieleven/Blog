<template>
  <div>
    <div style="display: flex;align-items: center;margin-bottom: 20px;">
      <span>上传至分组：</span>
      <el-select
        v-model="team"
        style="width:calc(100% - 85px);"
        size="mini"
        filterable
        allow-create
        default-first-option
      >
        <el-option label="默认分组" value="" style="font-style: italic" />
        <el-option
          v-for="(item,index) in teamList"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <el-upload
      ref="upload"
      drag
      :action="uploadUrl"
      multiple
      with-credentials
      :on-success="uploadSucceed"
      :before-upload="beforeUpload"
      :auto-upload="true"
      :data="{team: team}"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip" style="text-align:right;">
        可上传任何类型文件；单个文件大小不超过10MB
      </div>
    </el-upload>
  </div>
</template>

<script>
import { listAllTeams, uploadUrl } from '@/api/attachment'

export default {
  name: 'Upload',
  data() {
    this.uploadUrl = uploadUrl
    return {
      team: '',
      teamList: []
    }
  },
  created() {
    this.getTeamList()
  },
  methods: {
    uploadSucceed(response, file, fileList) {
      if (response.status === 200) {
        this.$message.success(response.message)
      } else {
        this.$message.error(response.message)
      }
      this.removeFile(file, fileList)
    },
    beforeUpload(file) {
      const isLt10MB = file.size / 1024 / 1024 < 10
      if (!isLt10MB) {
        this.$message.warning('上传的文件大小请不要超过10MB')
        this.removeFile(file, this.$refs.upload.uploadFiles)
        return false
      }
    },
    removeFile(file, fileList) {
      fileList.splice(fileList.indexOf(file), 1)
    },
    // 获取所有文件类型
    getTeamList() {
      listAllTeams().then(resp => {
        this.teamList = resp.data.filter((t) => { return !!t })
      })
    }
  }
}
</script>

<style lang="scss">
.el-upload, .el-upload-dragger {
  width: 100%;
}
</style>
