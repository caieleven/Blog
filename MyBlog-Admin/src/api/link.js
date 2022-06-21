import request from '@/utils/request'

const api_prefix = '/api/admin/link'

/**
 * 分页获取友链列表信息
 * @param data => {
 *    current：当前页
 *    pageSize：每页大小
 *    name：友链名
 *    url：友链url
 * }
 */
export function listLinks(data) {
  return request({
    url: `${api_prefix}/list`,
    method: 'post',
    data
  })
}

export function updateLink(data) {
  return request({
    url: `${api_prefix}/update`,
    method: 'post',
    data
  })
}

export function deleteLink(linkId) {
  return request({
    url: `${api_prefix}/delete/${linkId}`,
    method: 'delete'
  })
}

export function addLink(data) {
  return request({
    url: `${api_prefix}/add`,
    method: 'post',
    data
  })
}

export function updateLinkLogoParser(data) {
  return request({
    url: `${api_prefix}/update/parser`,
    method: 'post',
    data
  })
}
