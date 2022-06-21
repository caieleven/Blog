import request from '@/utils/request'

const api_prefix = '/api/admin/statistics'

// 获取统计信息
export function getCommonStatistics() {
  return request({
    url: `${api_prefix}/common`,
    method: 'get'
  })
}

// 获取每日统计信息
export function getDailyStatistics(start, end) {
  return request({
    url: `${api_prefix}/daily/${start}/${end}`,
    method: 'get'
  })
}
