<template>
  <div>
    <v-empty-data v-if="logList.length===0" style="width: 20%" />
    <div v-for="item in logList" :key="item.id" class="item">
      <div class="info clearfix">
        <!-- 操作类型 -->
        <span class="left">
          <i class="el-icon-s-operation" />
          {{ getType(item.type) }}
        </span>
        <!-- ip定位 -->
        <span class="center">
          <el-popover
            placement="top"
            trigger="click"
            :content="ipLocation || item.ipAddress"
            width="300"
            @show="getIpLocation(item.ipAddress)"
          >
            <span slot="reference">
              <i class="el-icon-location-outline" />
              {{ item.ipAddress }}
            </span>
          </el-popover>
        </span>
        <!-- 操作时间 -->
        <span class="right">
          <i class="el-icon-date" />
          {{ item.createTime }}
        </span>
      </div>
      <!-- 操作内容 -->
      <div class="content">
        <el-popover
          placement="top-start"
          trigger="hover"
          :content="item.content"
          width="420"
        >
          <span slot="reference">{{ item.content }}</span>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
import { getIpLocation } from '@/api/others'

export default {
  name: 'LogList',
  components: {
    'v-empty-data': () => import('@/components/Common/empty-data')
  },
  props: {
    logList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      logTypes: {
        COMMON: '普通操作',
        LOGGED_IN: '用户登入',
        LOGGED_OUT: '用户登出',
        LOGIN_FAILED: '登入失败',
        PASSWORD_UPDATED: '密码更新',
        PROFILE_UPDATED: '资料更新',
        BLOG_PUBLISHED: '文章发表',
        BLOG_EDITED: '文章编辑',
        BLOG_DELETED: '文章删除',
        OPTION_UPDATE: '设置更新'
      },
      ipLocation: ''
    }
  },
  methods: {
    setData(logList) {
      this.logList = logList
    },
    getType(type) {
      return this.logTypes[type] || this.logTypes.COMMON
    },
    getIpLocation(ip) {
      getIpLocation(ip).then(res => {
        res.status === 'fail'
          ? this.ipLocation = ip
          : this.ipLocation = `${res.country} ${res.regionName} ${res.city} ${res.isp}`
      }).catch(err => {
        console.error(err)
      })
    }
  }
}
</script>

<style lang="scss">
.el-divider--horizontal {
  margin: 6px 0;
}

.el-popover--plain {
  padding: 12px;
}

</style>

<style scoped lang="scss">
.item {
  border-bottom: #DCDFE6 1px solid;
  padding: 12px 0;

  &:last-child {
    margin-bottom: 0;
    border-bottom: none;
  }

  .info {
    text-align: center;
    font-size: 12px;
    padding-bottom: 7px;

    .left {
      float: left;
    }

    .right {
      float: right;
    }

    .center {
      &:hover {
        cursor: pointer;
        color: #20a0ff;
      }
    }
  }

  .content {
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

}
</style>
