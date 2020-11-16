import request from '@/utils/request'

// 查询批次列表
export function listDataByDate(query) {
  return request({
    url: '/paymentTurnover/dataMap',
    method: 'get',
    params: query
  })
}
