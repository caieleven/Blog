<template>
  <div class="app-container">
    <el-form label-position="top" :model="blogData">
      <el-form-item prop="title">
        <el-input v-model="blogData.title" placeholder="请输入博客标题" />
      </el-form-item>
    </el-form>
    <mavon-editor
      ref="editor"
      v-model="blogData.originalContent"
      class="editor"
      :ishljs="true"
      @change="editing"
      @save="saveDraftMsgBox"
      @imgAdd="addImage"
      @fullScreen="editorFullscreen"
      @helpToggle="editorNotehelpToggle"
    />
    <div class="operation footer-toolbar">
      <el-button size="medium" @click="attachmentListDrawer=true">附件库</el-button>
      <el-button type="info" size="medium" @click="saveDraftMsgBox">保存草稿</el-button>
      <el-button type="primary" size="medium" @click="openPublishDrawer">发 表</el-button>
    </div>
    <!-- 发表博客Drawer -->
    <el-drawer
      :visible.sync="publishDrawer"
      destroy-on-close
      direction="rtl"
      title="博客设置"
      :class="['inner-drawer',selectAttachmentDrawer?'inner-drawer-open':'inner-drawer-close']"
      :before-close="closePublishDrawer"
    >
      <v-sitting-drawer ref="publishDrawer" @attachmentSelected="selectAttachmentDrawer = true" />
      <div class="footer-toolbar" style="width: 30%">
        <el-button type="primary" size="medium" @click="addBlog">发 表</el-button>
      </div>
      <el-drawer :visible.sync="selectAttachmentDrawer" append-to-body direction="rtl" title="选择附件">
        <v-attachment-select ref="selectAttachmentDrawer" style="padding: 0 20px" @selected="setSelectedAttachmentUrl" />
      </el-drawer>
    </el-drawer>
    <!-- 附件库Drawer -->
    <el-drawer
      :visible.sync="attachmentListDrawer"
      direction="rtl"
      title="附件库"
      :class="['inner-drawer',attachmentDetailDrawer?'inner-drawer-open':'inner-drawer-close']"
    >
      <v-attachment-select ref="selectAttachmentDrawer" style="padding: 0 20px" @selected="openDetailDrawer" />
      <el-drawer :visible.sync="attachmentDetailDrawer" append-to-body direction="rtl" title="附件详情">
        <v-detail-drawer ref="detailDrawer" style="padding: 0 20px 70px 20px" />
      </el-drawer>
    </el-drawer>

  </div>
</template>

<script>
import { addBlog, getBlog, updateBlog } from '@/api/blog'
import { uploadAttachment } from '@/api/attachment'
import { deepClone } from '@/utils'

export default {
  name: 'WriteBlog',
  components: {
    'v-sitting-drawer': () => import('@/views/blog/setting'),
    'v-attachment-select': () => import('@/views/attachment/select'),
    'v-detail-drawer': () => import('@/views/attachment/detail')
  },
  data() {
    return {
      publishDrawer: false,
      selectAttachmentDrawer: false,
      attachmentListDrawer: false,
      attachmentDetailDrawer: false,
      blogData: {
        originalContent: '',
        formatContent: '',
        title: '',
        url: '',
        summary: '',
        thumbnail: '',
        topRank: 0,
        category: { id: null, name: '' },
        tags: [],
        allowComment: 'ALLOWED_AUDITING'
      }
    }
  },
  computed: {
    isUpdate: function() {
      return Object.prototype.toString.call(this.blogData) === '[object Object]' && this.blogData.id
    }
  },
  watch: {
    $route(to, from) {
      this.getBlog()
    }
  },
  created() {
    this.getBlog()
  },
  methods: {
    editing(md, html) {
      this.blogData.formatContent = html
    },
    openPublishDrawer() {
      this.publishDrawer = true
      setTimeout(() => {
        this.$refs.publishDrawer.setData(this.blogData)
      }, 200)
    },
    closePublishDrawer(done) {
      this.blogData = this.$refs.publishDrawer.getData()
      done()
    },
    editorFullscreen(status, value) {
      const e = document.querySelector('.editor')
      if (e) {
        e.style['z-index'] = status ? 9999 : 1500
      }
    },
    editorNotehelpToggle(status, value) {
      setTimeout(function() {
        const e = document.querySelector('.v-note-help-wrapper')
        if (e) {
          e.style['z-index'] = status ? 9999 : 1600
        }
      }, 36)
    },
    // editor中的上传图片功能
    addImage(pos, $file) {
      const formdata = new FormData()
      formdata.append('file', $file)
      uploadAttachment(formdata).then(resp => {
        this.$message.success(resp.message)
        const url = this.baseUrl + resp.data.path
        this.$refs.editor.$img2Url(pos, url)
      })
    },
    // 把选择的附件url赋值给博客设置项的thumbnail
    setSelectedAttachmentUrl(data) {
      const path = this.baseUrl + data.path
      this.$refs.publishDrawer.blogData.thumbnail = path
      this.selectAttachmentDrawer = false
    },
    openDetailDrawer(data) {
      this.attachmentDetailDrawer = true
      setTimeout(() => {
        this.$refs.detailDrawer.setData(data)
      }, 200)
    },
    // 保存草稿确认框
    saveDraftMsgBox() {
      this.$confirm('您要把此文章保存至草稿箱吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 确认
        this.saveDraft()
      }).catch(() => { // 取消
      })
    },
    // 获取博客
    getBlog() {
      const blogId = this.$route.query.blogId
      if (blogId) {
        getBlog(blogId).then(resp => {
          this.blogData.id = blogId
          this.blogData = resp.data
        }).catch(() => {
          this.blogData = {}
        })
      }
    },
    // 发表博客
    addBlog() {
      const blogData = this.$refs.publishDrawer.getData()
      if (this.isUpdate) {
        blogData.status = 'PUBLISHED'
        updateBlog(blogData).then(resp => {
          this.$message.success(resp.message)
          this.$router.push({ name: 'BlogList' })
        })
      } else {
        addBlog(blogData).then(resp => {
          this.$message.success(resp.message)
          this.$router.push({ name: 'BlogList' })
        })
      }
    },
    // 保存草稿
    saveDraft() {
      const blogData = deepClone(this.blogData)
      blogData.status = 'DRAFT'
      if (this.isUpdate) {
        updateBlog(blogData).then(resp => {
          this.$message.success(resp.message)
          this.$router.push({ name: 'BlogList' })
        })
      } else {
        addBlog(blogData).then(resp => {
          this.$message.success(resp.message)
          this.$router.push({ name: 'BlogList' })
        })
      }
    }
  }
}
</script>
<style lang="scss">
.openSidebar {
  .operation {
    width: calc(100% - 210px);
  }
}

.hideSidebar {
  .operation {
    width: calc(100% - 54px);
  }
}
</style>

<style scoped lang="scss">
.editor {
  min-height: 75vh;
}

.operation {
  transition: all .3s;
}

.inner-drawer {
  transition: all .3s;

  &-open {
    margin-right: 150px;
  }

  &-close {
    margin-right: 0;
  }
}

</style>
