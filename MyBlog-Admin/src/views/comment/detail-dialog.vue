<template>
  <el-dialog
    title="评论详情"
    :visible.sync="dialogVisible"
    width="36vw"
  >
    <div v-for="(value,key,index) in field" :key="index" class="item">
      <span class="field-name">{{ value }}</span>
      <span class="field-value">{{ comment[key] }}</span>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DetailDialog',
  data() {
    return {
      dialogVisible: false,
      comment: {},
      field: {
        author: '作者昵称',
        email: '邮箱地址',
        blogTitle: '所属文章',
        createTime: '发表时间',
        ipAddress: 'IP地址'
      }
    }
  },
  methods: {
    open(data) {
      this.dialogVisible = true
      this.comment = data
    }
  }
}
</script>

<style scoped lang="scss">
.item {
  padding: 16px 0;
  border-bottom: 1px solid #EBEEF5;

  &:last-child {
    border-bottom: none;
  }

  .field-name {
    display: inline-block;
    width: 30%;
  }

  .field-value {
    border-left: 1px solid #EBEEF5;
    padding-left: 10px;
    width: 70%;
  }
}
</style>
