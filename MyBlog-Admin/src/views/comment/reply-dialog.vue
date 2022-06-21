<template>
  <el-dialog
    :title="`回复 ${comment.author} 的评论`"
    :visible.sync="dialogVisible"
    width="36vw"
  >
    <el-input
      v-model="content"
      :rows="8"
      type="textarea"
      placeholder="支持HTML文本"
      maxlength="1023"
      show-word-limit
    />
    <span slot="footer">
      <el-button type="primary" size="small" @click="replyComments">回 复</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { replyComments } from '@/api/comment'

export default {
  name: 'ReplyDialog',
  data() {
    return {
      dialogVisible: false,
      comment: {},
      content: ''
    }
  },
  methods: {
    open(data) {
      this.dialogVisible = true
      this.content = ''
      this.comment = data
    },
    replySucceed() {
      this.$emit('succeed')
    },
    // 回复评论
    replyComments() {
      const data = { blogId: this.comment.blogId, parentId: this.comment.id, content: this.content }
      replyComments(data).then(resp => {
        this.$message.success(resp.message)
        this.dialogVisible = false
        this.replySucceed()
      })
    }
  }
}
</script>

<style lang="scss">
.el-dialog {
  &__header {
    padding: 16px;
  }

  &__body {
    padding: 0 16px 6px;
  }
}
</style>
