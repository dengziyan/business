import request from '@/utils/request'
// 查询收费详情列表
export function listPayDetail(query) {
  return request({
    url: '/chargeBill/listBill',
    method: 'get',
    params: query
  })
}
