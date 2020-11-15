import request from '@/utils/request'

// 查询住户信息列表
export function listResident(query) {
  return request({
    url: '/sys/resident',
    method: 'get',
    params: query
  })
}
// 查询物业
export function listPropertyInfo(query) {
  return request({
    url: '/sys/property/info',
    method: 'get',
    params: query
  })
}
// 查询物业菜单
export function listProperty(query) {
  return request({
    url: '/sys/property/menu',
    method: 'get',
    params: query
  })
}
// 查询物业菜单
export function listUserProperty(id) {
  return request({
    url: '/sys/property/multi-menu',
    method: 'get',
    params: {
      userId: id
    }
  })
}
// 新增商户
export function addMerchant(data) {
  return request({
    url: '/sys/merchant',
    method: 'post',
    data: data
  })
}
// 修改商户
export function updateMerchart(id, data) {
  return request({
    url: '/sys/merchant' + id,
    method: 'post',
    data: data
  })
}
// 新增小区
export function addCommunity(data) {
  return request({
    url: '/sys/community',
    method: 'post',
    params: {
      user: data.userId,
      merchantId: data.merchantId
    },
    data: data
  })
}
// 新增楼栋
export function addBuilding(data) {
  return request({
    url: '/sys/community/building',
    method: 'post',
    params: {
      user: data.userId,
      communityId: data.communityId
    },
    data: data
  })
}
// 新增单元
export function addUnit(data) {
  return request({
    url: '/sys/community/unit',
    method: 'post',
    params: {
      user: data.userId,
      buildingId: data.buildingId
    },
    data: data
  })
}
// 修改小区
export function updateCommunity(id, data) {
  return request({
    url: '/sys/community',
    method: 'put',
    params: {
      user: id,
      merchant: data.merchantId
    },
    data: data
  })
}

// 修改楼栋
export function updateBuilding(id, data) {
  return request({
    url: '/sys/community/building',
    method: 'put',
    params: {
      user: id,
      community: data.communityId
    },
    data: data
  })
}
// 修改单元
export function updateUnit(id, data) {
  return request({
    url: '/sys/community/unit',
    method: 'put',
    params: {
      user: id,
      building: data.buildingId
    },
    data: data
  })
}
// 删除物业
export function delProperty(data) {
  return request({
    url: '/sys/property/info',
    method: 'delete',
    params: data
  })
}
// 修改住户信息
export function updateResident(data) {
  return request({
    url: '/sys/resident',
    method: 'put',
    data: data
  })
}
// 添加住户信息
export function addResident(data) {
  return request({
    url: '/sys/resident',
    method: 'post',
    data: data
  })
}
// 删除住户信息
export function delResident(data) {
  return request({
    url: '/sys/resident',
    method: 'delete',
    params: {
      residentId: data.residentId
    },
    data: data
  })
}
// 下载小区信息导入模板
export function importCommunityTemplates() {
  return request({
    url: '/sys/community/template-import',
    method: 'get',
    responseType: 'arraybuffer'
  })
}
// 下载住户信息导入模板
export function importResidentTemplates() {
  return request({
    url: '/sys/resident/template-import',
    method: 'get',
    responseType: 'arraybuffer'
  })
}
// 导入小区信息
export function batchAddCommunity(id, merchantId, data) {
  return request({
    url: '/sys/community/import',
    method: 'post',
    params: {
      id: id,
      merchantId: merchantId
    },
    data: data
  })
}
// 导入住户信息
export function batchAddResident(id, data) {
  return request({
    url: '/sys/resident/import',
    method: 'post',
    params: id,
    data: data
  })
}
// 导出住户信息
export function exportResident(query) {
  return request({
    url: '/sys/resident/export',
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}
// 导入室信息
export function addRoom(data) {
  return request({
    url: '/sys/community/room',
    method: 'post',
    params: {
      user: data.userId,
      unitId: data.unitId
    },
    data: data
  })
}
