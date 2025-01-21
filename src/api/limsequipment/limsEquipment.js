import request from '@/axios/request';
import url from '@/axios/url';
const { limsUrl, generalUrl } = url();
// 导出url
export const exportUrl = `${limsUrl}limsEquipment/export`

export function getTree(params = {}) {
  return request({
    url: `${generalUrl}device/remoteRegionTree?sysCode=lims`,
    method: 'get',
    params
  })
}

// 分页查询
export function getList(params = {}) {
  return request({
    url: `${limsUrl}limsEquipment`,
    method: 'get',
    params,
  });
}


// 新增
export function rowCreate(data = {}) {
  return request({
    url: `${limsUrl}limsEquipment/checkAdd`,
    method: 'post',
    data,
  });
}
// 批量新增
export function rowBatchCreate(data = []) {
  return request({
    url: `${limsUrl}limsEquipment/batch`,
    method: 'post',
    data,
  });
}
// 修改
export function rowUpdate(data = {}) {
  return request({
    url: `${limsUrl}limsEquipment`,
    method: 'put',
    data,
  });
}
// 删除
export function rowDel(id) {
  return request({
    url: `${limsUrl}limsEquipment/${id}`,
    method: 'put',
  });
}
// 详情
export function rowDetail(id) {
  return request({
    url: `${limsUrl}limsEquipment/info/${id}`,
    method: 'get',
  });
}

// 导入用户
export function importData (data = {}) {
  return request({
    url: `${limsUrl}limsEquipment/import`,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}
// 下载模板
export const downloadTemplateUrl = `${limsUrl}limsEquipment/template`

