<template>
  <div v-loading="loading">
    <ve-line
      v-if="chartData.rows && chartData.rows.length !== 0"
      :data="chartData"
      :settings="chartSettings"
      :extend="extend"
      height="387px"
    />
    <v-empty-data v-else style="width: 415px" />
  </div>
</template>

<script>
import { getDailyStatistics } from '@/api/statistics'
import { parseTime } from '@/utils'

export default {
  name: 'StatisticChart',
  components: {
    'v-empty-data': () => import('@/components/Common/empty-data')
  },
  props: {
    startEnd: {
      type: Array,
      default: function() {
        const now = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime()
        const start = parseTime(now - 30 * 24 * 60 * 60 * 1000)
        const end = parseTime(now)
        return [start, end]
      }
    }
  },
  data() {
    return {
      loading: false,
      chartData: {
        columns: ['date', 'webVisitCount', 'blogVisitCount', 'commentCount'],
        rows: []
      },
      chartSettings: {
        labelMap: {
          webVisitCount: '网站访问量',
          blogVisitCount: '博客访问量',
          commentCount: '博客评论量'
        },
        area: true
      },
      extend: {
        legend: {
          left: '12'
        },
        grid: {
          bottom: '10'
        }
      }
    }
  },
  watch: {
    startEnd(val) {
      this.getDailyStatistics()
    }
  },
  created() {
    this.getDailyStatistics()
  },
  methods: {
    getDailyStatistics() {
      this.loading = true
      getDailyStatistics(this.startEnd[0], this.startEnd[1]).then(response => {
        this.chartData.rows = response.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
