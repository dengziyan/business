import request from '@/utils/request'

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
