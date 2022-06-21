import request from '@/utils/request'

const api_prefix = `/api/admin/blog/tag`

export function listAllTags() {
  return request({
    url: `${api_prefix}/list`,
    method: 'get'
  })
}

// 删除分类
export function deleteTag(tagId) {
  return request({
    url: `${api_prefix}/delete/${tagId}`,
    method: 'delete'
  })
}

// 添加分类
export function addTag(data) {
  return request({
    url: `${api_prefix}/add`,
    method: 'post',
    data
  })
}

// 更新分类
export function updateTag(data) {
  return request({
    url: `${api_prefix}/update`,
    method: 'post',
    data
  })
}
