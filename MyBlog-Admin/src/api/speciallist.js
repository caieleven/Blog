import request from '@/utils/request'
import { jsonObj2FormData } from '@/utils'

const api_prefix = '/api/admin/speciallist'

// 分页获取日志
export function listSpeciallist(data) {
  return request({
    url: `${api_prefix}/list`,
    method: 'post',
    data
  })
}

// param : [id1, id2 ...]
export function deleteSpeciallistBatch(data) {
  return request({
    url: `${api_prefix}/delete`,
    method: 'delete',
    data
  })
}

// 列出所有已枚举清单类型
export function listTypes() {
  return request({
    url: `${api_prefix}/types`,
    method: 'get'
  })
}

// 批量导入清单词条
export function addSpeciallistBatch(data) {
  return request({
    url: `${api_prefix}/add`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: jsonObj2FormData(data)
  })
}

// 刷新上下文
export function refreshContext(type) {
  return request({
    url: `${api_prefix}/refresh-context/${type}`,
    method: 'get'
  })
}
