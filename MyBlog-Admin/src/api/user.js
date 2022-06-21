import request from '@/utils/request'

const api_prefix = '/api/admin/user'

// 登录
export function login(data) {
  return request({
    url: `${api_prefix}/login`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/x-www-form-urlencoded'
    },
    data
  })
}

// 注销登录
export function logout() {
  return request({
    url: `${api_prefix}/logout`,
    method: 'post'
  })
}

// 检查登录状态
export function checkLogin() {
  return request({
    url: `${api_prefix}/checkLogin`,
    method: 'get'
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: `${api_prefix}/info`,
    method: 'get'
  })
}

// 修改信息
export function updateProfile(data) {
  return request({
    url: `${api_prefix}/update/profile`,
    method: 'post',
    data
  })
}

// 修改密码
export function updatePassword(data) {
  return request({
    url: `${api_prefix}/update/password`,
    method: 'post',
    data
  })
}

