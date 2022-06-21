import request from '@/utils/request'

const api_prefix = '/api/admin/comment'

// param: current、pageSize 、blogId、status、keyword（author、content、email）
export function listComments(data) {
  return request({
    url: `${api_prefix}/list`,
    method: 'post',
    data
  })
}

// 更新评论状态
// param: id、status
export function updateStatus(data) {
  return request({
    url: `${api_prefix}/update/status`,
    method: 'post',
    data
  })
}

// 批量更新评论状态
// param: ids []、status
export function updateStatusBatch(data) {
  return request({
    url: `${api_prefix}/update/status-batch`,
    method: 'post',
    data
  })
}

export function deleteComments(commentId) {
  return request({
    url: `${api_prefix}/delete/${commentId}`,
    method: 'delete'
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

// 回复评论
// params: content、blogId、[parentId]
export function replyComments(data) {
  return request({
    url: `${api_prefix}/reply`,
    method: 'post',
    data
  })
}

