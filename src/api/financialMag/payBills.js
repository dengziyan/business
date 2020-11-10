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

// 批量导入
export function batchAddBatchBills(userId, modelId, data) {
  return request({
    url: '/chargeBatch/import/bills',
    method: 'post',
    params: {
      userId: userId,
      modelId: modelId
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
// 获取收费类型列表
export function listChargeCategoryOptions(query) {
  return request({
    url: '/chargeCategory/listChargeCategory',
    method: 'post',
    params: query
  })
}
// 获取收费项目名称列表
export function listChargeProjectOptions(data) {
  return request({
    url: '/project/listProject',
    method: 'post',
    params: data
  })
}
// 获取小区选项
export function listCommunityOptions(userId) {
  return request({
    url: '/sys/community/getCommunities/' + userId,
    method: 'get'
  })
}

// 下载模板
export function importTemplates(data) {
  return request({
    url: '/chargeBill/template',
    method: 'get',
    responseType: 'arraybuffer',
    params: { chargeCategory: data }
  })
}
