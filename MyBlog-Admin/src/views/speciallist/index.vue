<template>
  <div>
    <!-- 操作栏 -->
    <div class="search-box">
      <el-form ref="searchParamsForm" :inline="true" :model="searchParams" size="mini">
        <el-form-item label="关键词：" prop="content">
          <el-input v-model="searchParams.content" clearable placeholder="请输入关键词进行搜索" />
        </el-form-item>
        <el-form-item label="类型：">
          <el-select v-model="searchParams.types" filterable multiple collapse-tags placeholder="请选择类型">
            <el-option
              v-for="item in typeData"
              :key="item.type"
              :label="item.type"
              :value="item.type"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">查 询</el-button>
          <el-button @click="resetSearchParams('searchParamsForm')">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="operation clearfix">
      <el-button v-if="multipleSelected" type="danger" size="mini" @click="deleteBatch">删除</el-button>
      <el-button type="primary" size="mini" @click="addDialogVisible=true">添加</el-button>
      <div style="float: right">
        <el-select filterable value="" size="mini" placeholder="刷新缓存" @change="refreshContext">
          <el-option
            v-for="item in typeData"
            :key="item.type"
            :label="item.type"
            :value="item.type"
          />
        </el-select>
      </div>
    </div>
    <!-- 友链列表 -->
    <el-table
      ref="blogListTable"
      v-loading="tableDataLoading"
      :data="speciallist"
      tooltip-effect="dark"
      :header-cell-style="{fontWeight:'normal', color:'#666'}"
      @selection-change="multipleSelect"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="type" label="类型" width="250" show-overflow-tooltip />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="createTime" label="创建时间" width="160" align="center" />
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size.sync="searchParams.pageSize"
        :current-page.sync="searchParams.current"
        @current-change="getList"
        @size-change="getList"
      />
    </div>
    <el-dialog
      title="导入特殊清单"
      :visible.sync="addDialogVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <div style="margin:-20px 0 10px 0;">
        <el-select v-model="addType" filterable size="small" placeholder="请选择导入类型" style="width:100%;">
          <el-option
            v-for="item in typeData"
            :key="item.type"
            :label="item.type"
            :value="item.type"
          />
        </el-select>
      </div>
      <div>
        <el-input v-model="addContents" type="textarea" placeholder="一行一词条" :rows="10" @input="addChange" />
      </div>
      <div style="margin-top:10px;">已输入 {{ addNum }} 条词条</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="addDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addBatch">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addSpeciallistBatch, deleteSpeciallistBatch, listSpeciallist, listTypes, refreshContext } from '@/api/speciallist'

export default {
  name: 'Speciallist',
  data() {
    return {
      searchParams: {
        current: 1,
        pageSize: 10,
        content: '',
        types: []
      },
      total: 0,
      tableDataLoading: false,
      speciallist: [],
      typeData: [],
      multipleSelectedData: [], // 多选数据
      multipleSelected: false,
      addDialogVisible: false,
      addType: '',
      addContents: '',
      addNum: 0
    }
  },
  created() {
    this.listTypes()
    this.getList()
  },
  methods: {
    getList() {
      this.tableDataLoading = true
      listSpeciallist(this.searchParams).then(resp => {
        this.total = resp.data.total
        this.speciallist = resp.data.list
        this.tableDataLoading = false
      }).catch(() => {
        this.tableDataLoading = false
      })
    },
    listTypes() {
      listTypes().then(resp => {
        this.typeData = resp.data
      })
    },
    resetSearchParams(formName) {
      this.$refs[formName].resetFields()
      this.searchParams.types = []
      this.searchParams.current = 1
      this.getList()
    },
    multipleSelect(selection) {
      this.multipleSelected = selection.length > 0
      this.multipleSelectedData = selection
    },
    deleteBatch() {
      const ids = []
      for (const item of this.multipleSelectedData) {
        ids.push(item.id)
      }
      deleteSpeciallistBatch(ids).then(resp => {
        this.$message.success(resp.message)
        this.multipleSelected = false
        this.getList()
      })
    },
    addChange(val) {
      const newNal = val.trim()
      if (!newNal) {
        this.addNum = 0
        return
      }
      let count = 0
      newNal.replace(/\n/g, function(m, i) {
        count++
      })
      this.addNum = count + 1
    },
    addBatch() {
      if (!this.addType) {
        this.$message.warning('请选择导入的清单类型')
        return
      }
      if (!this.addContents.trim()) {
        this.$message.warning('请输入导入词条')
        return
      }
      addSpeciallistBatch({
        type: this.addType,
        content: this.addContents.trim().split('\n')
      }).then(resp => {
        this.$message.success(resp.message)
        this.addDialogVisible = false
        this.addType = ''
        this.addContents = ''
        this.addNum = 0
      })
    },
    refreshContext(val) {
      refreshContext(val).then(resp => {
        this.$message.success(resp.message)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
