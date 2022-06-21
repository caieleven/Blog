import request from '@/utils/request'

const api_prefix = `/api/admin/option`

export function listAllOptions() {
  return request({
    url: `${api_prefix}/list`,
    method: 'get'
  })
}

export function listAttributes() {
  return request({
    url: `/attributes`,
    method: 'get'
  })
}

export function updateOptions(data) {
  return request({
    url: `${api_prefix}/update`,
    method: 'post',
    data
  })
}
