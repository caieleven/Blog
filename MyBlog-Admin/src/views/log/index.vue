<template>
  <v-log-list :log-list="logList" />
</template>

<script>
import { listLogs } from '@/api/log'

export default {
  name: 'Log',
  components: {
    'v-log-list': () => import('@/views/log/log-list')
  },
  data() {
    return {
      logList: [],
      searchParams: {
        current: 1,
        pageSize: 5
      }
    }
  },
  created() {
    this.getLogList()
  },
  methods: {
    getLogList() {
      listLogs(this.searchParams).then(resp => {
        this.logList = resp.data.list
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
