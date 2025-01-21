import request from '@/axios/request';
import url from '@/axios/url';

const {limsUrl, adminUrl} = url();
// 导出url
export const exportUrl = `${limsUrl}limsCheckTask/export`

// 分页查询
export function getList(params = {}) {
  return request({
    url: `${limsUrl}limsCheckTask`,
    method: 'get',
    params,
  });
}

export function getReportList(params = {}) {
  return request({
    url: `${limsUrl}limsCheckTask/reportPage`,
    method: 'get',
    params,
  });
}

// 新增
export function rowCreate(data = {}) {
  return request({
    url: `${limsUrl}limsCheckTask`,
    method: 'post',
    data,
  });
}

// 修改
export function rowUpdate(data = {}) {
  return request({
    url: `${limsUrl}limsCheckTask`,
    method: 'put',
    data,
  });
}
export function returnTask(taskCode) {
  return request({
    url: `${limsUrl}limsCheckTask/returnTask/${taskCode}`,
    method: 'put',
  });
}
// 删除
export function rowDel(id) {
  return request({
    url: `${limsUrl}limsCheckTask/${id}`,
    method: 'put',
  });
}

// 详情
export function rowDetail(id) {
  return request({
    url: `${limsUrl}limsCheckTask/info/${id}`,
    method: 'get',
  });
}


// 获取审批流
export function approvalProcess(id) {
  return request({
    url: `${limsUrl}limsCheckTask/approvalProcess/${id}`,
    method: 'get',
  });
}

// 导入用户
export function importData(data = {}) {
  return request({
    url: `${limsUrl}limsCheckTask/import`,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}

// 修改状态  传ids+status
// 新增
export function setStatus(data = {}) {
  return request({
    url: `${limsUrl}limsCheckTask/setStatus`,
    method: 'post',
    data,
  });
}
export function getContractList(data = {}) {
  return request({
    url: `${limsUrl}limsCheckTask/getContractList`,
    method: 'post',
    data,
  });
}




// 下载模板
export const downloadTemplateUrl = `${limsUrl}limsCheckTask/template`

