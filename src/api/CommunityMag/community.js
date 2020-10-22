import request from '@/utils/request'

// 查询住户信息列表
export function listResident(query) {
  return request({
    url: '/sys/community/resident',
    method: 'get',
    params: query
  })
}
