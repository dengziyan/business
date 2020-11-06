import request from '@/utils/request'

// 查询住户信息列表
export function listResident(query) {
  return request({
    url: '/sys/resident',
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
// 新增商户
export function addMerchart(data) {
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
      merchantId: data.merchantId
    },
    data: data
  })
}
// 修改小区
export function updateCommunity(id, data) {
  return request({
    url: '/sys/community' + id,
    method: 'post',
    data: data
  })
}
// 新增楼栋
export function addBuilding(data) {
  return request({
    url: '/sys/community/building',
    method: 'post',
    params: {
      communityId: data.communityId,
      admin: data.admin
    },
    data: data
  })
}
// 修改楼栋
export function updateBuilding(id, data) {
  return request({
    url: '/sys/community/building' + id,
    method: 'post',
    data: data
  })
}
// 新增单元
export function addUnit(data) {
  return request({
    url: '/sys/community/unit',
    method: 'post',
    params: {
      buildingId: data.buildingId,
    },
    data: data
  })
}
// 修改单元
export function updateUnit(id, data) {
  return request({
    url: '/sys/community/unit' + id,
    method: 'post',
    data: data
  })
}
// 删除物业
export function delProperty(data) {
  return request({
    url: '/sys/property/info',
    method: 'delete',
    data: data
  })
}
// 下载导入模板
// export function importTemplates() {
//   return request({
//     url: '',
//     method: 'get',
//     responseType: 'arraybuffer'
//   })
// }
