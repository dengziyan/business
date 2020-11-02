import request from '@/utils/request'

// 查询批次列表
export function listPayBills(query) {
  return request({
    url: 'chargeBatch/getChargeBatchs',
    method: 'post',
    params: query
  })
}
// 批量导入
export function batchAddChargeBatch(id, data) {
  return request({
    url: '/chargeBill/import/parkingFee',
    method: 'post',
    params: {
      cycleId: id
    },
    data: data
  })
}
// 修改
export function updatePayBills(data) {
  return request({
    url: '/chargeBatch/',
    method: 'put',
    data: data
  })
}
// 删除
export function delBatch(id) {
  return request({
    url: '/chargeBatch/' + id,
    method: 'delete'
  })
}
// 批量新增-導入賬單
export function addPayBills(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data: data
  })
}
// 获取收费类型列表
export function listChargeCategoryOptions() {
  return request({
    url: '/chargeCategory/listChargeCategoryName',
    method: 'get'
  })
}
// 获取收费项目名称列表
export function listChargeProjectOptions(data) {
  return request({
    url: '/project/listProject',
    method: 'post',
    data: data
  })
}
// 下载模板
export function importTemplates(data) {
  return request({
    url: '/chargeBill/template',
    method: 'get',
    responseType: 'arraybuffer',
    params: { projectId: data }
  })
}
