// 退款明细
import request from '@/utils/request'
// 查询退款明细列表
export function listRefundDetail(query) {
  return request({
    url: 'chargeBatch/getChargeBatchs',
    method: 'post',
    params: query
  })
}
