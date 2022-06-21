<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 添加/编辑标签 -->
      <el-col :xs="24" :sm="10">
        <el-card>
          <div slot="header">{{ modified ? '修改' : '添加' }}标签</div>
          <el-form ref="tagForm" label-position="top" :model="addOrUpdateData" size="small">
            <el-form-item label="名称：" prop="name">
              <el-input v-model="addOrUpdateData.name" />
            </el-form-item>
            <el-form-item>
              <el-button-group>
                <el-button type="primary" @click="modified?updateTag():addTag()">
                  {{ modified ? '更 新' : '保 存' }}
                </el-button>
                <el-button v-if="modified" @click="resetForm">返回添加</el-button>
              </el-button-group>
              <el-popconfirm
                v-if="modified"
                placement="top-start"
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                :title="`您要永久删除标签【${tagList[currentOperationIndex].name}】吗？`"
                style="float: right"
                @confirm="deleteTag"
              >
                <el-button slot="reference" type="danger" size="mini">删 除</el-button>
              </el-popconfirm>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <!-- 所有标签 -->
      <el-col :xs="24" :sm="14">
        <el-card>
          <div slot="header">所有标签</div>
          <v-empty-data v-if="tagList.length===0" style="width: 100px" />
          <div class="tag-group">
            <el-tag
              v-for="(tag,index) in tagList"
              :key="tag.id"
              :type="getRandomTagType()"
              size="small"
              @click="tryUpdate(index)"
            >{{ tag.name }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { addTag, deleteTag, listAllTags, updateTag } from '@/api/tag'
import { randomTagType } from '@/utils'

export default {
  name: 'Tag',
  components: {
    'v-empty-data': () => import('@/components/Common/empty-data')
  },
  data() {
    return {
      currentOperationIndex: 0,
      tagList: [],
      listLoading: false,
      modified: false,
      addOrUpdateData: {
        name: ''
      }
    }
  },
  created() {
    this.getTagList()
  },
  methods: {
    resetForm() {
      this.addOrUpdateData = { name: '' }
      this.modified = false
    },
    // 获取随机标签样式
    getRandomTagType() {
      return randomTagType()
    },
    operationSuccess(msg) {
      this.$message.success(msg)
      this.getTagList()
      this.resetForm()
    },
    tryUpdate(index) {
      // modified是某组件v-if渲染条件，本函数是 v-for item中绑定的事件，
      // 点击item时会造成v-for重新渲染，解决方法？
      this.modified = true
      this.currentOperationIndex = index
      this.addOrUpdateData = JSON.parse(JSON.stringify(this.tagList[index]))
    },
    // 获取分类列表信息
    getTagList() {
      this.listLoading = true
      listAllTags().then(resp => {
        this.tagList = resp.data
        this.listLoading = false
      }).catch(() => { this.listLoading = false })
    },
    // 删除分类
    deleteTag() {
      const id = this.tagList[this.currentOperationIndex].id
      deleteTag(id).then(resp => {
        this.operationSuccess(resp.message)
      })
    },
    addTag() {
      addTag(this.addOrUpdateData).then(resp => {
        this.operationSuccess(resp.message)
      })
    },
    updateTag() {
      updateTag(this.addOrUpdateData).then(resp => {
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

.tag-group .el-tag {
  margin: 6px 3px;
  cursor: pointer;
}
</style>

<style scoped lang="scss">
.pagination {
  float: right;
  margin: 16px 0;
}
</style>
