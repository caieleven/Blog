import request from '@/utils/request'

const api_prefix = '/api/admin/log'

// 分页获取日志
export function listLogs(data) {
  return request({
    url: `${api_prefix}/list`,
    method: 'post',
    data
  })
}

// param : [id1, id2 ...]
export function deleteCommentsBatch(data) {
  return request({
    url: `${api_prefix}/delete`,
    method: 'delete',
    data
  })
}
