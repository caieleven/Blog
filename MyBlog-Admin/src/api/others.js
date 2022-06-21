import request from '@/utils/request'

// 获得ip定位信息，免费版只支持 HTTP 协议请求
// this.ipLocation = `${res.country} ${res.regionName} ${res.city} ${res.isp}`
export function getIpLocation(ip) {
  const url = `http://ip-api.com/json/${ip}`
  return request.jsonp(url, { lang: 'zh-CN' })
}

