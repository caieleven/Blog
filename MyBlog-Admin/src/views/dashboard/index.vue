<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="12" :sm="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="cardName">文章</span>
            <router-link :to="{name:'BlogList'}">
              <el-button class="cardLink" type="text" icon="el-icon-link" />
            </router-link>
          </div>
          <div class="cardContent">{{ statistic.blogCount }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="cardName">评论</span>
            <router-link :to="{name:'Comment'}">
              <el-button class="cardLink" type="text" icon="el-icon-link" />
            </router-link>
          </div>
          <div class="cardContent">{{ statistic.commentCount }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="cardName">分类</span>
            <router-link :to="{name:'BlogCategory'}">
              <el-button class="cardLink" type="text" icon="el-icon-link" />
            </router-link>
          </div>
          <div class="cardContent">{{ statistic.categoryCount }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="cardName">标签</span>
            <router-link :to="{name:'BlogTag'}">
              <el-button class="cardLink" type="text" icon="el-icon-link" />
            </router-link>
          </div>
          <div class="cardContent">{{ statistic.tagCount }}</div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 图表等 -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="18">
        <el-card class="box-card">
          <div slot="header" class="clearfix" style="height: 28px;line-height: 28px">
            <span class="cardName">每日数据统计</span>
            <div class="cardName" style="float: right">
              统计日期：
              <el-date-picker
                v-model="beginToEnd"
                style="width: 260px"
                size="mini"
                type="daterange"
                :picker-options="pickerOptions"
                :clearable="false"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </div>
          </div>
          <div class="cardContent">
            <v-chart :start-end="beginToEnd" />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6" style="padding: 0">
        <!-- 友链数量 -->
        <el-col :xs="12" :sm="24">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="cardName">友链</span>
              <router-link :to="{name:'Link'}">
                <el-button class="cardLink" type="text" icon="el-icon-link" />
              </router-link>
            </div>
            <div class="cardContent">{{ statistic.linkCount }}</div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="24">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="cardName">文章总访问量</span>
              <el-tooltip class="cardLink" effect="dark" placement="top-end">
                <div slot="content">文章总访问量为：{{ statistic.blogTotalVisits }}</div>
                <el-button class="cardLink" type="text" icon="el-icon-warning-outline" />
              </el-tooltip>
            </div>
            <div class="cardContent">{{ statistic.blogTotalVisits }}</div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="24">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="cardName">网站总访问量</span>
              <el-tooltip class="cardLink" effect="dark" placement="top-end">
                <div slot="content">网站总访问量为：{{ statistic.webTotalVisits }}</div>
                <el-button class="cardLink" type="text" icon="el-icon-warning-outline" />
              </el-tooltip>
            </div>
            <div class="cardContent">{{ statistic.webTotalVisits }}</div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="24">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="cardName">博客建立天数</span>
              <el-tooltip class="cardLink" effect="dark" placement="top-end">
                <div slot="content">博客建立于：{{ statistic.birthday }}</div>
                <el-button class="cardLink" type="text" icon="el-icon-warning-outline" />
              </el-tooltip>
            </div>
            <div class="cardContent">{{ statistic.establishDaysCount }}</div>
          </el-card>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { getCommonStatistics } from '@/api/statistics'
import { parseTime } from '@/utils'

export default {
  name: 'Dashboard',
  components: {
    'v-chart': () => import('@/views/dashboard/daily-chart')
  },
  data() {
    return {
      statistic: {
        blogCount: 0,
        commentCount: 0,
        categoryCount: 0,
        tagCount: 0,
        totalVisitCount: 0,
        establishDaysCount: 0,
        birthday: ''
      },
      // 统计时间选择框选项
      pickerOptions: {
        shortcuts: [{
          text: '最近半个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 14)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近两个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      // [begin, end]
      beginToEnd: [
        parseTime(new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime() - 30 * 24 * 60 * 60 * 1000, ''),
        parseTime(new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime(), '')
      ]
    }
  },
  computed: {},
  created() {
    this.getStatistic()
  },
  methods: {
    getStatistic() {
      getCommonStatistics().then(response => {
        this.statistic = response.data
      })
    }
  }
}
</script>

<style lang="scss">
.el-col {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-card {
  &__header, &__body {
    padding: 12px 16px;
    line-height: 16px;
  }
}
</style>

<style lang="scss" scoped>
.box-card {
  .cardName {
    color: #97a8be;
  }

  .cardLink {
    float: right;
    padding: 0;
  }

  .cardContent {
    font-size: 26px;
    padding: 12px 0;
  }
}
</style>
