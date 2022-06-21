<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 一些信息 -->
      <el-col :xs="24" :sm="10">
        <el-card class="info-card">
          <div slot="header">个人信息</div>
          <v-l-info />
        </el-card>
        <el-card class="info-card">
          <div slot="header">
            操作日志
            <el-tooltip effect="dark" content="更多" placement="right">
              <el-link
                :underline="false"
                icon="el-icon-more"
                style="float: right"
                @click="$refs.moreLog.openDrawer()"
              />
            </el-tooltip>
          </div>
          <v-l-log ref="log" />
          <v-l-log-more ref="moreLog" @delSucceed="$refs.log.getLogList()" />
        </el-card>
      </el-col>
      <!-- 一些设置 -->
      <el-col :xs="24" :sm="14">
        <el-card class="sitting-card">
          <div slot="header">信息修改</div>
          <el-tabs type="border-card">
            <!-- 基本资料 -->
            <el-tab-pane>
              <span slot="label"><i class="tabs-icon el-icon-postcard" />基本资料</span>
              <v-r-profile />
            </el-tab-pane>
            <!-- 登录密码 -->
            <el-tab-pane>
              <span slot="label"><i class="tabs-icon el-icon-lock" />登录密码</span>
              <v-r-password />
            </el-tab-pane>
            <!-- 网站设置 -->
            <el-tab-pane>
              <span slot="label"><i class="tabs-icon el-icon-setting" />博客设置</span>
              <v-r-blog-setting />
            </el-tab-pane>
            <!-- 特殊清单 -->
            <el-tab-pane :lazy="true">
              <span slot="label"><i class="tabs-icon el-icon-tickets" />特殊清单</span>
              <v-r-speciallist />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'Profile',
  components: {
    'v-l-info': () => import('@/views/profile/l-info'),
    'v-l-log': () => import('@/views/log/index'),
    'v-l-log-more': () => import('@/views/log/more-log'),
    'v-r-profile': () => import('@/views/profile/r-profile'),
    'v-r-password': () => import('@/views/profile/r-password'),
    'v-r-blog-setting': () => import('@/views/profile/r-blog-setting'),
    'v-r-speciallist': () => import('@/views/speciallist/index')
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss">

.el-card {
  &__header, &__body {
    padding: 12px;
  }
}

.sitting-card {
  .el-card__body {
    padding: 0;
  }

  .el-tabs {
    border-top: none;
    border-left: none;
    border-right: none;
  }

  .tabs-icon {
    margin-right: 5px;
  }
}
</style>

<style scoped lang="scss">
.info-card {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
