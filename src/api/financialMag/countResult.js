import request from '@/utils/request'
import da from 'element-ui/src/locale/lang/da'

// 查询列表
export function listCountResult(query) {
  return request({
    url: 'chargeBatch/getChargeBatchs',
    method: 'post',
    params: query
  })
}
