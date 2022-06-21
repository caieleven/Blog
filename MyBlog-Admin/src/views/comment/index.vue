<template>
  <div class="app-container">
    <div class="search-box">
      <el-form ref="searchParamsForm" :inline="true" :model="searchParams" size="small">
        <el-form-item label="关键词：" prop="keyword">
          <el-input v-model="searchParams.keyword" placeholder="请输入关键词" />
        </el-form-item>
        <el-form-item label="评论状态：" prop="status">
          <el-select v-model="searchParams.status" style="width: 160px" placeholder="">
            <el-option label="审核中" :value="0" />
            <el-option label="已发布" :value="1" />
            <el-option label="回收站" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="文章：" prop="blogId">
          <el-select v-model="searchParams.blogId" style="width: 240px" filterable>
            <el-option
              v-for="blog in blogTitleList"
              :key="blog.id"
              class="title-option"
              :value="blog.id"
              :label="blog.title"
              :title="blog.title"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getCommentList">查 询</el-button>
          <el-button @click="resetSearchParams('searchParamsForm')">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="multipleSelected" style="margin-bottom: 12px">
      <el-popover placement="right" style="margin-right: 10px">
        <el-select v-model="multipleUpdatedStatus" size="mini" placeholder="请选择评论状态" style="width: 150px">
          <el-option label="发布" value="PUBLISHED" />
          <el-option label="回收站" value="RECYCLE" />
        </el-select>
        <el-button type="primary" size="mini" style="margin-left: 10px" @click="batchChangeStatus">更新</el-button>
        <el-button slot="reference" type="primary" size="mini">更新状态</el-button>
      </el-popover>
      <el-popconfirm
        placement="right"
        confirm-button-text="确定"
        cancel-button-text="取消"
        icon="el-icon-info"
        icon-color="red"
        title="您要永久删除这些评论吗？"
        @confirm="batchDelete"
      >
        <el-button slot="reference" type="danger" size="mini">永久删除</el-button>
      </el-popconfirm>
    </div>
    <div class="blog-list">
      <el-table
        v-loading="tableDataLoading"
        :data="commentList"
        tooltip-effect="dark"
        :header-cell-style="{fontWeight:'normal', color:'#666'}"
        @selection-change="multipleSelect"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="author" label="作者" width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isAdmin" effect="plain" size="mini">{{ nickname }}</el-tag>
            <span v-else>{{ scope.row.author }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-badge is-dot :type="getStatus(scope.row.status).type" class="badge-dot" />
            {{ getStatus(scope.row.status).name }}
          </template>
        </el-table-column>
        <el-table-column prop="blogId" label="文章" width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.blogTitle }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发表时间" width="160" />
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="info" size="mini" @click="openDetailDialog(scope.$index)">
                查看
              </el-button>
              <!-- 按钮 1：回复 -->
              <el-button
                v-if="scope.row.status==='PUBLISHED'"
                type="primary"
                size="mini"
                @click="openReplyDialog(scope.$index)"
              >回复</el-button>
              <!-- 按钮 2 ：通过/回收站/删除-->
              <el-popconfirm
                placement="top-start"
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                :title="scope.row.status==='PUBLISHED'
                  ?`您要将这条评论移至回收站吗？`
                  : scope.row.status === 'RECYCLE'
                    ? `您要永久删除这条评论吗？`
                    : `你要发表该评论吗？`"
                @confirm="changeStatus(scope.$index)"
              >
                <el-button v-if="scope.row.status==='AUDITING'" slot="reference" type="success" size="mini">
                  通过
                </el-button>
                <el-button v-if="scope.row.status==='PUBLISHED'" slot="reference" type="danger" size="mini">
                  回收站
                </el-button>
                <el-button v-if="scope.row.status==='RECYCLE'" slot="reference" type="danger" size="mini">
                  删除
                </el-button>
              </el-popconfirm>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size.sync="searchParams.pageSize"
        :current-page.sync="searchParams.current"
        @current-change="getCommentList"
        @size-change="getCommentList"
      />
    </div>
    <v-reply-dialog ref="replyDialog" @succeed="getCommentList" />
    <v-detail-dialog ref="detailDialog" />
  </div>
</template>

<script>
import { listAllTitles } from '@/api/blog'
import { listComments, deleteComments, updateStatus, updateStatusBatch, deleteCommentsBatch } from '@/api/comment'
import { jsonObj2FormData } from '@/utils'

export default {
  name: 'Comment',
  components: {
    'v-reply-dialog': () => import('@/views/comment/reply-dialog'),
    'v-detail-dialog': () => import('@/views/comment/detail-dialog')
  },
  data() {
    return {
      nickname: this.$store.getters.user.nickname,
      searchParams: {
        current: 1,
        pageSize: 10,
        keyword: null,
        blogId: null,
        status: null
      },
      total: 0,
      commentList: [],
      blogTitleList: [],
      multipleSelectedData: [], // 多选数据
      multipleUpdatedStatus: null, // 批量更新状态
      replyContent: '',
      tableDataLoading: false,
      multipleSelected: false
    }
  },
  created() {
    this.getCommentList()
    this.listBlogTitle()
  },
  methods: {
    resetSearchParams(formName) {
      this.$refs[formName].resetFields()
      this.searchParams.current = 1
      this.getCommentList()
    },
    // 获取评论状态
    getStatus(val) {
      const status = {
        PUBLISHED: {
          name: '已发表',
          type: 'success'
        },
        AUDITING: {
          name: '审核中',
          type: 'info'
        },
        RECYCLE: {
          name: '回收站',
          type: 'danger'
        }
      }
      const s = status[val]
      return s || { name: '', type: '' }
    },
    openReplyDialog(index) {
      this.$refs.replyDialog.open(this.commentList[index])
    },
    openDetailDialog(index) {
      this.$refs.detailDialog.open(this.commentList[index])
    },
    // 获取博客列表信息
    getCommentList() {
      this.tableDataLoading = true
      listComments(this.searchParams).then(resp => {
        this.total = resp.data.total
        this.commentList = resp.data.list
        this.tableDataLoading = false
      })
    },
    // 获取已经用的博客分类
    listBlogTitle() {
      listAllTitles().then(resp => {
        this.blogTitleList = resp.data
      })
    },
    // 改变博客状态
    changeStatus(index) {
      const comment = this.commentList[index]
      const status = comment.status
      // 回收站里的，可以删除
      if (status === 'RECYCLE') {
        deleteComments(comment.id).then(resp => {
          this.$message.success(resp.message)
          this.getCommentList()
        })
      } else {
        let s
        switch (status) {
          case 'AUDITING':
            s = 'PUBLISHED'
            break
          case 'PUBLISHED':
            s = 'RECYCLE'
            break
          default: return
        }
        updateStatus(jsonObj2FormData({ id: comment.id, status: s })).then(resp => {
          this.$message.success(resp.message)
          this.getCommentList()
        })
      }
    },
    // 多选，批量操作
    multipleSelect(selection) {
      this.multipleSelected = selection.length > 0
      this.multipleSelectedData = selection
    },
    // 批量更新状态
    batchChangeStatus() {
      if (!this.multipleUpdatedStatus) {
        this.$message.info('您未选择更新的状态')
        return
      }
      const ids = []
      for (const item of this.multipleSelectedData) {
        ids.push(item.id)
      }
      updateStatusBatch(jsonObj2FormData({ ids: ids, status: this.multipleUpdatedStatus }))
        .then(resp => {
          this.$message.success(resp.message)
          this.multipleUpdatedStatus = null
          this.getCommentList()
        })
    },
    // 批量删除评论
    batchDelete() {
      const ids = []
      for (const item of this.multipleSelectedData) {
        ids.push(item.id)
      }
      deleteCommentsBatch(ids).then(resp => {
        this.$message.success(resp.message)
        this.getCommentList()
      })
    }
  }
}
</script>

<style lang="scss">
.search-box {
  .el-form-item {
    margin-right: 40px;
  }
}

.tag-group {
  .el-tag {
    margin-right: 3px;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>

<style lang="scss" scoped>
.badge-dot {
  margin-right: 3px;
  position: relative;
  transform: translateY(25%);
}

.pagination {
  text-align: center;
  margin-top: 20px;
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

.title-option {
  width: 240px;
}
</style>
