<template>
  <div>
    <el-form ref="profileForm" label-position="top" :model="options" size="small">
      <el-form-item label="博客名：" prop="name">
        <el-input v-model="options.name" @blur.native.capture="addUpdateOption('name')" />
      </el-form-item>
      <el-form-item label="博客描述：" prop="description">
        <el-input v-model="options.description" @blur.native.capture="addUpdateOption('description')" />
      </el-form-item>
      <el-form-item label="博客主页地址：" prop="url">
        <el-input
          v-model="options.url"
          placeholder="请附带http[s]://前缀"
          @blur.native.capture="checkUrl();addUpdateOption('url')"
        />
      </el-form-item>
      <el-form-item label="博客Logo：" prop="logo">
        <el-input v-model="options.logo">
          <el-button slot="append" icon="el-icon-picture" @click="selectLogoDrawer=true" />
        </el-input>
      </el-form-item>
      <el-form-item label="博客Favicon：" prop="favicon">
        <el-input v-model="options.favicon">
          <el-button slot="append" icon="el-icon-picture" @click="selectFaviconDrawer=true" />
        </el-input>
      </el-form-item>
      <el-form-item label="页脚信息：" prop="footer">
        <el-input
          v-model="options.footer"
          :rows="5"
          type="textarea"
          placeholder="可填入HTML文本"
          @blur.native.capture="addUpdateOption('footer')"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateOption">保 存</el-button>
      </el-form-item>
    </el-form>
    <el-drawer :visible.sync="selectLogoDrawer" destroy-on-close direction="rtl" title="选择Logo">
      <v-attachment-select ref="selectLogoDrawer" style="padding: 0 20px" @selected="updateLogo" />
    </el-drawer>
    <el-drawer :visible.sync="selectFaviconDrawer" destroy-on-close direction="rtl" title="选择Favicon">
      <v-attachment-select ref="selectFaviconDrawer" style="padding: 0 20px" @selected="updateFavicon" />
    </el-drawer>
  </div>
</template>

<script>
import { updateOptions } from '@/api/option'
import { deepClone } from '@/utils'

export default {
  name: 'RBlogSetting',
  components: {
    'v-attachment-select': () => import('@/views/attachment/select')
  },
  data() {
    this.host = process.env.VUE_APP_BASE_API || window.location.protocol + '//' + window.location.host
    return {
      options: {},
      updateOptions: {},
      selectLogoDrawer: false,
      selectFaviconDrawer: false
    }
  },
  created() {
    this.options = deepClone(this.$store.getters.options)
  },
  methods: {
    updateLogo(data) {
      this.options.logo = this.host + data.path
      this.selectLogoDrawer = false
      this.addUpdateOption('logo')
    },
    updateFavicon(data) {
      this.options.favicon = this.host + data.path
      this.selectFaviconDrawer = false
      this.addUpdateOption('favicon')
    },
    updateOption() {
      updateOptions(this.updateOptions).then(resp => {
        this.$message.success(resp.message)
        this.$store.dispatch('option/getOptions')
      })
    },
    checkUrl() {
      const url = this.options.url || ''
      if (!new RegExp('^https?://').test(url)) {
        this.options.url = 'http://' + url
      }
    },
    addUpdateOption(key) {
      this.updateOptions[key] = this.options[key]
    }
  }
}
</script>

<style scoped>

</style>
