import request from '@/utils/request'
import { jsonObj2FormData } from '@/utils'

const api_prefix = '/api/admin/attachment'

/**
 * 分页获取附件列表信息
 * @param data => {
 *    current：当前页
 *    pageSize：每页大小
 *    name：附件名
 *    mediaType：附件类型
 * }
 */
export function listAttachments(data) {
  return request({
    url: `${api_prefix}/list`,
    method: 'post',
    data
  })
}

// 获取所有文件类型
export function listAllMediaTypes() {
  return request({
    url: `${api_prefix}/list/type`,
    method: 'get'
  })
}

// 获取所有文件分组
export function listAllTeams() {
  return request({
    url: `${api_prefix}/list/team`,
    method: 'get'
  })
}

// 上传地址
export const uploadUrl = `${process.env.VUE_APP_BASE_API}${api_prefix}/upload`

// 上传附件
export function uploadAttachment(data) {
  return request({
    url: `${api_prefix}/upload`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: jsonObj2FormData(data)
  })
}

/**
 * @param data => {id: '', name: ''}
 */
export function updateAttachment(data) {
  return request({
    url: `${api_prefix}/update`,
    method: 'post',
    data
  })
}

// 删除附件
export function deleteAttachment(attachmentId) {
  return request({
    url: `${api_prefix}/delete/${attachmentId}`,
    method: 'delete'
  })
}

// 批量删除
export function deleteAttachments(data) {
  return request({
    url: `${api_prefix}/delete`,
    method: 'delete',
    data
  })
}

// 移动到分组
export function updateTeam(data) {
  return request({
    url: `${api_prefix}/update/team`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: jsonObj2FormData(data)
  })
}
