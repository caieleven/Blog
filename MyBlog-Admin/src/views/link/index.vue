<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 添加/编辑友链 -->
      <el-col :xs="24" :sm="9">
        <el-card>
          <div slot="header">{{ isAdd ? '添加' : '修改' }}友链</div>
          <el-form label-position="top" :model="addOrUpdateData" size="small">
            <el-form-item label="友链名称：" prop="name">
              <el-input v-model="addOrUpdateData.name" placeholder="请输入友链名称" />
            </el-form-item>
            <el-form-item label="友链链接：" prop="url">
              <el-input
                v-model="addOrUpdateData.url"
                placeholder="请附带http[s]://前缀"
                @blur.native.capture="checkUrl();setUrlLogoParser();"
              />
            </el-form-item>
            <el-form-item label="Logo链接：" prop="logo" style="position: relative">
              <el-input v-model="addOrUpdateData.logo" placeholder="请输入友链Logo链接" :disabled="logoType==='api'">
                <el-avatar
                  slot="prefix"
                  shape="square"
                  :size="18"
                  fit="cover"
                  :src="addOrUpdateData.logo"
                  style="vertical-align:middle;margin-bottom: 2px;"
                ><slot name="error">ico</slot></el-avatar>
              </el-input>
              <el-radio-group v-model="logoType" class="link-logo-type" @change="logoTypeChange">
                <el-radio label="api">使用API解析</el-radio>
                <el-radio label="custom">自定义</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="友链排名：" prop="topRank">
              <el-input-number v-model="addOrUpdateData.topRank" controls-position="right" style="width: 100%" />
              <p class="input-tips">* 值越大越靠前</p>
            </el-form-item>
            <el-form-item label="描述：" prop="description">
              <el-input v-model="addOrUpdateData.description" :rows="3" type="textarea" placeholder="描述一下友链" />
            </el-form-item>
            <el-form-item>
              <el-button-group>
                <el-button type="primary" @click="isAdd?addLink():updateLink()">
                  {{ isAdd ? '保 存' : '更 新' }}
                </el-button>
                <el-button v-if="!isAdd" @click="resetForm">返回添加</el-button>
              </el-button-group>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <!-- 友链列表 -->
      <el-col :xs="24" :sm="15">
        <el-card>
          <div slot="header">友链列表</div>
          <!-- 操作栏 -->
          <div class="search-box">
            <el-form ref="searchParamsForm" :inline="true" :model="searchParams" size="small">
              <el-form-item label="关键字：" prop="keyword">
                <el-input v-model="searchParams.keyword" clearable placeholder="请输入名称或URL搜索" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getLinkList">查 询</el-button>
                <el-button @click="resetSearchParams('searchParamsForm')">重 置</el-button>
              </el-form-item>
              <el-form-item style="float: right">
                <el-button type="success" @click="dialogVisible=true">修改Logo解析API</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- 友链列表 -->
          <el-table
            ref="blogListTable"
            v-loading="tableDataLoading"
            :data="linkList"
            tooltip-effect="dark"
            :header-cell-style="{fontWeight:'normal', color:'#666'}"
          >
            <el-table-column prop="name" label="图标" width="52" align="center">
              <template slot-scope="scope">
                <el-avatar
                  slot="prefix"
                  shape="square"
                  :size="24"
                  fit="cover"
                  :src="scope.row.logo"
                  style="vertical-align:middle;margin-bottom: 2px;"
                ><slot name="error">ico</slot></el-avatar>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="名称" width="180" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-link target="_blank" type="primary" :href="scope.row.url" :underline="false">
                  {{ scope.row.name }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="topRank" label="排名" width="100" />
            <el-table-column prop="description" label="描述" show-overflow-tooltip />
            <el-table-column label="操作" width="131" align="center">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button type="primary" size="mini" @click="tryUpdate(scope.$index)">编辑</el-button>
                  <el-popconfirm
                    placement="top-start"
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                    icon="el-icon-info"
                    icon-color="red"
                    :title="`您要永久删除友链【${scope.row.name}】吗？`"
                    @confirm="deleteLink(scope.$index)"
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
                @current-change="getLinkList"
                @size-change="getLinkList"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      title="修改友链Logo解析API"
      :visible.sync="dialogVisible"
      width="36vw"
      @closed="urlLogoParser=options['url_favicon_parser']"
    >
      <el-input v-model="urlLogoParser" clearable placeholder="请输入友链Logo解析API" />
      <div style="color: #97a8be;font-size: 12px;line-height: 150%;margin-top: 10px;">
        <div>说明：</div>
        <div style="padding-left: 2rem">
          <div>在API链接中插入"{}"符号，代表该友链链接</div>
          <div>如果缺省，默认在API链接后面追加</div>
        </div>
        <div>示例：</div>
        <div style="padding-left: 2rem">
          <div>如输入的解析API为"https://www.google.cn/s2/favicons?domain={}"</div>
          <div>若友链为"https://www.baidu.com/"</div>
          <div>则解析成"https://www.google.cn/s2/favicons?domain=https://www.baidu.com/"</div>
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary" size="small" @click="updateUrlLogoParser">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listLinks, addLink, deleteLink, updateLink, updateLinkLogoParser } from '@/api/link'
import { mapGetters } from 'vuex'
import { jsonObj2FormData } from '@/utils'

export default {
  name: 'Link',
  data() {
    return {
      searchParams: {
        current: 1,
        pageSize: 10,
        keyword: ''
      },
      total: 0,
      linkList: [],
      tableDataLoading: false,
      isAdd: true,
      logoType: 'api',
      addOrUpdateData: {
        name: '',
        url: '',
        logo: '',
        topRank: 0,
        description: ''
      },
      urlLogoParser: '',
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['options'])
  },
  created() {
    this.getLinkList()
    this.urlLogoParser = this.options['url_favicon_parser'] || ''
  },
  methods: {
    resetForm() {
      this.isAdd = true
      this.addOrUpdateData = {
        name: '',
        url: '',
        logo: '',
        topRank: 0,
        description: ''
      }
    },
    resetSearchParams(formName) {
      this.$refs[formName].resetFields()
      this.searchParams.current = 1
      this.getLinkList()
    },
    operationSuccess(msg) {
      this.$message.success(msg)
      this.getLinkList()
      this.resetForm()
    },
    tryUpdate(index) {
      this.isAdd = false
      this.addOrUpdateData = { ...this.linkList[index] }
    },
    checkUrl() {
      const url = this.addOrUpdateData.url || ''
      if (!new RegExp('^https?://').test(url)) {
        this.addOrUpdateData.url = 'http://' + url
      }
    },
    setUrlLogoParser() {
      if (this.logoType !== 'api') {
        return
      }
      if (new RegExp('.*{}.*').test(this.urlLogoParser)) {
        this.addOrUpdateData.logo = this.urlLogoParser.replace('{}', this.addOrUpdateData.url)
      } else {
        this.addOrUpdateData.logo += this.addOrUpdateData.url
      }
    },
    logoTypeChange(label) {
      switch (label) {
        case 'api':
          this.setUrlLogoParser()
          break
        case 'custom':
          // this.addOrUpdateData.logo = ''
          break
      }
    },
    // 获取友链列表信息
    getLinkList() {
      this.tableDataLoading = true
      listLinks(this.searchParams).then(resp => {
        this.total = resp.data.total
        this.linkList = resp.data.list
        this.tableDataLoading = false
      }).catch(() => {
        this.tableDataLoading = false
      })
    },
    // 删除友链
    deleteLink(index) {
      const id = this.linkList[index].id
      deleteLink(id).then(resp => {
        this.operationSuccess(resp.message)
      })
    },
    addLink() {
      addLink(this.addOrUpdateData).then(resp => {
        this.operationSuccess(resp.message)
      })
    },
    updateLink() {
      updateLink(this.addOrUpdateData).then(resp => {
        this.operationSuccess(resp.message)
      })
    },
    updateUrlLogoParser() {
      updateLinkLogoParser(jsonObj2FormData({ parser: this.urlLogoParser })).then(resp => {
        this.$message.success(resp.message)
        this.dialogVisible = false
        const options = this.options
        options['url_favicon_parser'] = this.urlLogoParser
        this.$store.dispatch('option/changeOptions', options)
        if (this.logoType === 'api' && this.addOrUpdateData.url) {
          this.setUrlLogoParser()
        }
        this.getLinkList()
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

.link-logo-type {
  position: absolute;
  top: -22px;
  right: 3px;

  * {
    font-size: 12px;
  }

  .el-radio {
    margin-right: 20px;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>

<style scoped lang="scss">
.pagination {
  float: right;
  margin: 16px 0;
}
</style>
