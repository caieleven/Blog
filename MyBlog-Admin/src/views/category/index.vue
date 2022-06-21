<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 添加/编辑分类 -->
      <el-col :xs="24" :sm="10">
        <el-card>
          <div slot="header">{{ addOrUpdateData.id ? '修改' : '添加' }}分类</div>
          <el-form ref="categoryForm" label-position="top" :model="addOrUpdateData" size="small">
            <el-form-item label="名称：" prop="name">
              <el-input v-model="addOrUpdateData.name" />
            </el-form-item>
            <el-form-item label="描述：" prop="description" show-overflow-tooltip>
              <el-input v-model="addOrUpdateData.description" :rows="3" type="textarea" />
            </el-form-item>
            <el-form-item>
              <el-button-group>
                <el-button type="primary" @click="addOrUpdateData.id?updateCategory():addCategory()">
                  {{ addOrUpdateData.id ? '更 新' : '保 存' }}
                </el-button>
                <el-button v-if="addOrUpdateData.id" @click="resetForm">返回添加</el-button>
              </el-button-group>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <!-- 分类列表 -->
      <el-col :xs="24" :sm="14">
        <el-card>
          <div slot="header">分类列表</div>
          <el-table
            ref="blogListTable"
            v-loading="tableDataLoading"
            :data="categoryList"
            tooltip-effect="dark"
            :header-cell-style="{fontWeight:'normal', color:'#666'}"
          >
            <el-table-column prop="name" label="名称" width="148" />
            <el-table-column prop="blogCount" label="文章数" width="80" align="center" />
            <el-table-column prop="description" label="描述" />
            <el-table-column label="操作" width="136">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button type="primary" size="mini" @click="tryUpdate(scope.$index)">编辑</el-button>
                  <el-popconfirm
                    placement="top-start"
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                    icon="el-icon-info"
                    icon-color="red"
                    :title="`您要永久删除分类【${scope.row.name}】吗？`"
                    @confirm="deleteCategory(scope.$index)"
                  >
                    <el-button slot="reference" type="danger" size="mini">删除</el-button>
                  </el-popconfirm>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <div class="clearfix">
            <div class="pagination ">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="total"
                :page-size.sync="searchParams.pageSize"
                :current-page.sync="searchParams.current"
                @current-change="getCategoryList"
                @size-change="getCategoryList"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { addCategory, deleteCategory, listCategory, updateCategory } from '@/api/category'

export default {
  name: 'Category',
  data() {
    return {
      searchParams: {
        current: 1,
        pageSize: 10
      },
      total: 0,
      categoryList: [],
      tableDataLoading: false,
      addOrUpdateData: {
        name: '',
        description: ''
      }
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    resetForm() {
      this.addOrUpdateData = { name: '', description: '' }
    },
    operationSuccess(msg) {
      this.$message.success(msg)
      this.getCategoryList()
      this.resetForm()
    },
    tryUpdate(index) {
      this.addOrUpdateData = JSON.parse(JSON.stringify(this.categoryList[index]))
    },
    // 获取分类列表信息
    getCategoryList() {
      this.tableDataLoading = true
      listCategory(this.searchParams).then(resp => {
        this.total = resp.data.total
        this.categoryList = resp.data.list
        this.tableDataLoading = false
      }).catch(() => { this.listLoading = false })
    },
    // 删除分类
    deleteCategory(index) {
      const id = this.categoryList[index].id
      deleteCategory(id).then(resp => {
        this.operationSuccess(resp.message)
      })
    },
    addCategory() {
      addCategory(this.addOrUpdateData).then(resp => {
        this.operationSuccess(resp.message)
      })
    },
    updateCategory() {
      updateCategory(this.addOrUpdateData).then(resp => {
        this.operationSuccess(resp.message)
      })
    }
  }
}
</script>

<style lang="scss">
.el-card {
  &__header, &__body {
    padding: 12px 12px;
  }
}
</style>

<style scoped lang="scss">
.pagination {
  float: right;
  margin: 16px 0;
}
</style>
