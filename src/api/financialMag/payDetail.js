import request from '@/utils/request'
// 查询收费详情列表
export function listPayDetail(query) {
  return request({
    url: '/chargeBill/listBill',
    method: 'get',
    params: query
  })
}
// 查询周期详情
export function getPaymentCycle(query) {
  return request({
    url: '/paymentCycle/getPaymentCycle/' + query,
    method: 'get'
  })
}
// 现金支付
export function updateByAmountPaid(query) {
  return request({
    url: '/paymentCycle/updateByAmountPaid',
    method: 'post',
    params: {
      userId: query.userId,
      AmountPaid: query.AmountPaid,
      id: query.id
    }
  })
}
