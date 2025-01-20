import request from '@/axios/request';
import url from '@/axios/url';

const {limsUrl, adminUrl} = url();
// 导出url
export const exportUrl = `${limsUrl}limsStandardItems/export`

// 分页查询
export function getList(params = {}) {
  return request({
    url: `${limsUrl}limsStandardItems`,
    method: 'get',
    params,
  });
}

// 新增
export function rowCreate(data = {}) {
  return request({
    url: `${limsUrl}limsStandardItems`,
    method: 'post',
    data,
  });
}

// 修改
export function rowUpdate(data = {}) {
  return request({
    url: `${limsUrl}limsStandardItems`,
    method: 'put',
    data,
  });
}

// 删除
export function rowDel(id) {
  return request({
    url: `${limsUrl}limsStandardItems/${id}`,
    method: 'put',
  });
}

// 详情
export function rowDetail(id) {
  return request({
    url: `${limsUrl}limsStandardItems/info/${id}`,
    method: 'get',
  });
}

// 导入用户
export function importData(data = {}) {
  return request({
    url: `${limsUrl}limsStandardItems/import`,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}

// 查询父级字典
export function getParentTypeList() {
  return request({
    url: `${adminUrl}dict/type/lims_standard_items_parent`,
    method: "get",
  });
}
// 查询单位字典
export function getLimsUnitList() {
  return request({
    url: `${adminUrl}dict/type/lims_unit`,
    method: "get",
  });
}
// 禁用状态
export function getItemsStatusList() {
  return request({
    url: `${adminUrl}dict/type/lims_standard_items_status`,
    method: "get",
  });
}

// 下载模板
export const downloadTemplateUrl = `${limsUrl}limsStandardItems/template`

