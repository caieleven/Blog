import request from '@/utils/request'

const api_prefix = `/api/admin/blog/category`

// 分页获取分类
export function listCategory(data) {
  return request({
    url: `${api_prefix}/list`,
    method: 'post',
    data
  })
}

// 获取已使用的分类
export function listAllCategory() {
  return request({
    url: `${api_prefix}/list/all`,
    method: 'get'
  })
}

// 获取已使用的分类
export function listUsedCategory() {
  return request({
    url: `${api_prefix}/list/used`,
    method: 'get'
  })
}

// 删除分类
export function deleteCategory(categoryId) {
  return request({
    url: `${api_prefix}/delete/${categoryId}`,
    method: 'delete'
  })
}

// 添加分类
export function addCategory(data) {
  return request({
    url: `${api_prefix}/add`,
    method: 'post',
    data
  })
}

// 更新分类
export function updateCategory(data) {
  return request({
    url: `${api_prefix}/update`,
    method: 'post',
    data
  })
}
