import request from '@/utils/request'
// 查询收费详情列表
export function listPayDetail(query) {
  return request({
    url: 'chargeBatch/getChargeBatchs',
    method: 'post',
    params: query
  })
}
