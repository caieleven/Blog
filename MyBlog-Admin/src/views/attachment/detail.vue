<template>
  <div class="content">
    <div style="margin-bottom: 16px">
      <a :href="baseUrl+data.path" target="_blank">
        <v-image :src="baseUrl+data.thumbPath" :alt="data.name" class="thumbnail">
          <div slot="error">
            <i v-if="isImage" class="el-icon-picture-outline" style="font-size: 86px" />
            <span v-else>{{ data.mediaType }}</span>
          </div>
        </v-image>
      </a>
    </div>
    <el-form label-position="top" :model="data" size="small" class="att-detail">
      <el-form-item label="附件名：">
        <i class="operate el-icon-edit-outline" @click="editing = !editing" />
        <el-input v-if="editing" v-model="data.name" @blur="updateAttachment" />
        <span v-else>{{ data.name }}</span>
      </el-form-item>
      <el-divider />
      <el-form-item label="附件类型：">{{ data.mediaType }}</el-form-item>
      <el-divider />
      <el-form-item label="附件大小：">{{ getSizeKB }}</el-form-item>
      <el-divider />
      <el-form-item v-if="data.width > 0 || data.height > 0" label="图片尺寸：">
        {{ data.width + ' x ' + data.height }}
      </el-form-item>
      <el-divider />
      <el-form-item label="附件分组：">
        <span v-if="data.team">{{ data.team }}</span>
        <span v-else style="font-style: italic;">默认分组</span>
      </el-form-item>
      <el-divider />
      <el-form-item label="上传时间：">{{ data.createTime }}</el-form-item>
      <el-divider />
      <el-form-item label="附件链接：">
        <i class="operate el-icon-document-copy" style="left: 70px" @click="copyNormalUrl" />
        <div class="urlText">{{ normalUrl }}</div>
      </el-form-item>
      <el-divider v-if="isImage" />
      <el-form-item v-if="isImage" label="Markdown链接：">
        <i class="operate el-icon-document-copy" style="left: 105px" @click="copyMarkdownUrl" />
        <div class="urlText">{{ markdownUrl }}</div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updateAttachment } from '@/api/attachment'

export default {
  name: 'AttachmentDetail',
  components: {
    'v-image': () => import('@/components/Common/simple-image')
  },
  data() {
    return {
      host: '',
      data: {
        id: 0,
        name: '',
        size: 0,
        path: '',
        mediaType: '',
        thumbPath: '',
        width: 0,
        height: 0,
        createTime: null
      },
      editing: false
    }
  },
  computed: {
    isImage() {
      const mediaType = this.data.mediaType || ''
      return mediaType.search('image') !== -1
    },
    normalUrl() {
      return this.host + this.data.path
    },
    markdownUrl() {
      return `![${this.data.name}](${this.normalUrl})`
    },
    getSizeKB() {
      const sizeByte = this.data.size || 0
      return (sizeByte / 1024).toFixed(2) + ' KB'
    }
  },
  methods: {
    setData(data) {
      this.data = data || this.data
      this.host = process.env.VUE_APP_BASE_API || window.location.protocol + '//' + window.location.host
    },
    copyToClipboard(text) {
      this.$copyText(text)
        .then(message => {
          console.log('复制内容：' + message.text)
          this.$message.success('复制成功')
        })
        .catch(err => {
          console.log(err)
          this.$message.error('复制失败')
        })
    },
    copyNormalUrl() {
      this.copyToClipboard(encodeURI(this.normalUrl))
    },
    copyMarkdownUrl() {
      const md = `![${this.data.name}](${encodeURI(this.normalUrl)})`
      this.copyToClipboard(md)
    },
    updateAttachment() {
      updateAttachment({ id: this.data.id, name: this.data.name }).then(resp => {
        this.$message.success(resp.message)
        this.editing = false
        this.$emit('updateSucceed')
      })
    }
  }
}
</script>

<style lang="scss">

.el-divider--horizontal {
  margin: 6px 0;
}

.att-detail {
  .el-form-item {
    .el-form-item__label {
      padding: 0;
    }

    * {
      color: #606266;
    }
  }

  .operate {
    color: #409eff;
    position: absolute;
    top: -22px;
    left: 55px;
    cursor: pointer;
  }

  .urlText {
    line-height: 22px;
    word-break: break-all;
  }
}

.thumbnail {
  border-radius: 5px;
  overflow: hidden;
}

</style>
