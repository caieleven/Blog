import request from '@/utils/request'

const api_prefix = '/api/admin/blog'

/**
 * 分页获取博客列表信息
 * @param data => {
 *    current：当前页
 *    pageSize：每页大小
 *    title：博客标题
 *    category：分类
 *    status：状态（0：已发表；1：草稿；2：回收站）
 * }
 */
export function listBlogs(data) {
  return request({
    url: `${api_prefix}/list`,
    method: 'post',
    data
  })
}

export function listAllTitles() {
  return request({
    url: `${api_prefix}/list/all-titles`,
    method: 'get'
  })
}

// 获取详细博客信息
export function getBlog(blogId) {
  return request({
    url: `${api_prefix}/get/${blogId}`,
    method: 'get'
  })
}

// 更新博客信息
export function updateBlog(data) {
  return request({
    url: `${api_prefix}/update`,
    method: 'post',
    data
  })
}

// 删除博客
export function deleteBlog(blogId) {
  return request({
    url: `${api_prefix}/delete/${blogId}`,
    method: 'delete'
  })
}

// 添加博客
export function addBlog(data) {
  return request({
    url: `${api_prefix}/add`,
    method: 'post',
    data
  })
}
