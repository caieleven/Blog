<template>
  <div class="app-container">
    <div class="search-box">
      <el-form ref="searchParamsForm" :inline="true" :model="searchParams" size="small">
        <el-form-item label="关键词：" prop="title">
          <el-input v-model="searchParams.title" placeholder="请输入关键词" />
        </el-form-item>
        <el-form-item label="博客状态：" prop="status">
          <el-select v-model="searchParams.status" style="width: 160px">
            <el-option label="已发表" value="0" />
            <el-option label="草稿箱" value="1" />
            <el-option label="回收站" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="博客分类：" prop="categoryId">
          <el-select v-model="searchParams.categoryId" style="width: 160px" filterable>
            <el-option :value="0" label="未分类" />
            <el-option
              v-for="category in usedCategoryList"
              :key="category.id"
              :value="category.id"
              :label="category.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getBlogList">查 询</el-button>
          <el-button @click="resetSearchParams('searchParamsForm')">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom: 12px">
      <router-link :to="{name:'WriteBlog'}">
        <el-button type="primary" size="small" icon="el-icon-edit-outline">写文章</el-button>
      </router-link>
    </div>
    <div class="blog-list">
      <el-table
        ref="blogListTable"
        v-loading="tableDataLoading"
        :data="blogList"
        tooltip-effect="dark"
        :header-cell-style="{fontWeight:'normal', color:'#666'}"
      >
        <el-table-column prop="title" label="标题" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-badge v-if="scope.row.topRank > 0" value="top" class="badge-dot" />
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90" align="center">
          <template slot-scope="scope">
            <el-badge is-dot :type="getStatus(scope.row.status).type" class="badge-dot" />
            {{ getStatus(scope.row.status).name }}
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="130">
          <template slot-scope="scope">
            {{ (scope.row.category != null && scope.row.category.id > 0) ? scope.row.category.name : '未分类' }}
          </template>
        </el-table-column>
        <el-table-column label="标签" width="240" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="tag-group">
              <el-tag v-for="tag in scope.row.tags" :key="tag.id" :type="getRandomTagType()" size="mini">
                {{ tag.name }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="commentCount" label="评论量" width="80" align="center">
          <template slot-scope="scope">
            <el-tag effect="dark" size="small" style="border-radius: 50%">{{ scope.row.commentCount }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="visits" label="访问量" width="80" align="center">
          <template slot-scope="scope">
            <el-tag effect="dark" type="warning" size="small" style="border-radius: 50%">{{ scope.row.visits }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发布时间" width="160" align="center" />
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button-group>
              <!-- 按钮 1：编辑/还原 -->
              <el-button
                v-if="scope.row.status==='RECYCLE'"
                type="primary"
                size="mini"
                @click="statusRecycleToPublish(scope.$index)"
              >还原
              </el-button>
              <router-link
                v-else
                class="el-button el-button--primary el-button--mini"
                :to="{name:'WriteBlog', query:{blogId:scope.row.id}}"
              >编辑
              </router-link>
              <!-- 按钮 2：设置 -->
              <el-button type="success" size="mini" @click="openSittingDrawer(scope.$index)">设置</el-button>
              <!-- 按钮 3 ：回收站/删除-->
              <el-popconfirm
                placement="top-start"
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                :title="scope.row.status==='RECYCLE'
                  ?`您要永久删除博客【${scope.row.title}】吗？`
                  :`您要将博客【${scope.row.title}】移至回收站吗？`"
                @confirm="changeStatus(scope.$index)"
              >
                <el-button v-if="scope.row.status==='RECYCLE'" slot="reference" type="danger" size="mini">删除</el-button>
                <el-button v-else slot="reference" type="danger" size="mini">回收站</el-button>
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
        @current-change="getBlogList"
        @size-change="getBlogList"
      />
    </div>
    <!-- 博客设置drawer -->
    <el-drawer
      :visible.sync="sittingDrawer"
      destroy-on-close
      direction="rtl"
      title="博客设置"
      :class="['inner-drawer',selectAttachmentDrawer?'inner-drawer-open':'inner-drawer-close']"
    >
      <v-sitting-drawer ref="sittingDrawer" @attachmentSelected="selectAttachmentDrawer = true" />
      <div class="footer-toolbar" style="width: 30%">
        <el-button type="primary" size="medium" @click="updateBlog">保 存</el-button>
      </div>
      <el-drawer :visible.sync="selectAttachmentDrawer" append-to-body direction="rtl" title="选择附件">
        <v-attachment-select ref="selectAttachmentDrawer" style="padding: 0 20px" @selected="setSelectedAttachmentUrl" />
      </el-drawer>
    </el-drawer>
  </div>
</template>

<script>
import { listBlogs, updateBlog, deleteBlog } from '@/api/blog'
import { listUsedCategory } from '@/api/category'
import { randomTagType } from '@/utils'

export default {
  name: 'BlogList',
  components: {
    'v-sitting-drawer': () => import('@/views/blog/setting'),
    'v-attachment-select': () => import('@/views/attachment/select')
  },
  data() {
    return {
      searchParams: {
        current: 1,
        pageSize: 10,
        title: null,
        categoryId: null,
        status: null
      },
      total: 0,
      blogList: [],
      usedCategoryList: [],
      tableDataLoading: false,
      sittingDrawer: false,
      selectAttachmentDrawer: false
    }
  },
  created() {
    this.getBlogList()
    this.listUsedCategory()
  },
  methods: {
    resetSearchParams(formName) {
      this.$refs[formName].resetFields()
      this.searchParams.current = 1
      this.getBlogList()
    },
    // 获取博客状态
    getStatus(val) {
      const status = {
        PUBLISHED: {
          name: '已发表',
          type: 'success'
        },
        DRAFT: {
          name: '草稿箱',
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
    // 获取随机标签样式
    getRandomTagType() {
      return randomTagType()
    },
    openSittingDrawer(index) {
      this.sittingDrawer = true
      const data = this.blogList[index]
      setTimeout(() => {
        this.$refs.sittingDrawer.setData(data)
      }, 200)
    },
    // 把选择的附件url赋值给博客设置项的thumbnail
    setSelectedAttachmentUrl(data) {
      const path = this.baseUrl + data.path
      this.$refs.sittingDrawer.blogData.thumbnail = path
      this.selectAttachmentDrawer = false
    },
    // 获取博客列表信息
    getBlogList() {
      this.tableDataLoading = true
      listBlogs(this.searchParams).then(resp => {
        this.total = resp.data.total
        this.blogList = resp.data.list
        this.tableDataLoading = false
      }).catch(() => { this.listLoading = false })
    },
    // 获取已经用的博客分类
    listUsedCategory() {
      listUsedCategory().then(resp => {
        this.usedCategoryList = resp.data
      })
    },
    // 改变博客状态
    changeStatus(index) {
      const blog = this.blogList[index]
      const status = blog.status
      // 回收站里的，可以删除博客
      if (status === 'RECYCLE') {
        deleteBlog(blog.id).then(resp => {
          this.$message.success(resp.message)
          this.getBlogList()
        })
      } else { // 已发表或草稿里的，放入回收站
        updateBlog({ id: blog.id, status: 'RECYCLE' }).then(resp => {
          this.$message.success(resp.message)
          this.getBlogList()
        })
      }
    },
    // 放入回收站的还原成已发表状态
    statusRecycleToPublish(index) {
      const blog = this.blogList[index]
      updateBlog({ id: blog.id, status: 'PUBLISHED' }).then(resp => {
        this.$message.success(resp.message)
        this.getBlogList()
      })
    },
    // 更新博客
    updateBlog() {
      const blogData = this.$refs.sittingDrawer.getData()
      updateBlog(blogData).then(resp => {
        this.$message.success(resp.message)
        this.sittingDrawer = false
        this.getBlogList() // 刷新列表
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

</style>
