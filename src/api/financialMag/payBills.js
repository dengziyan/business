import request from '@/utils/request'

// 查询批次列表
export function listPayBills(query) {
  return request({
    url: 'chargeBatch/getChargeBatchs',
    method: 'post',
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
// 获取收费类型列表
export function listChargeCategoryOptions(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data: data
  })
}
// 获取收费项目名称列表
export function listChargeProjectOptions(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data: data
  })
}
