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
// 下载导入模板
// export function importTemplates() {
//   return request({
//     url: '',
//     method: 'get',
//     responseType: 'arraybuffer'
//   })
// }
