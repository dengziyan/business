import request from '@/utils/request'

// 查询列表
export function listIncomeDetail(query) {
  return request({
    url: '/paymentTurnover/getDetail',
    method: 'post',
    params: query
  })
}