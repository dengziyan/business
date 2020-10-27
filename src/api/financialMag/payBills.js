import request from '@/utils/request'

// 查询批次列表
export function listPayBills(query) {
  return request({
    url: '/sys/resident',
    method: 'get',
    params: query
  })
}
// 修改
export function updatePayBills(data) {
  return request({
    url: '/sys/user',
    method: 'put',
    data: data
  })
}
// 新增
export function addPayBills(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data: data
  })
}
