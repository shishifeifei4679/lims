import request from '@/axios/request';
import url from '@/axios/url';
const { limsUrl, adminUrl } = url();
// 导出url
export const exportUrl = `${limsUrl}limsCheckSample/export`
// 分页查询
export function getList(params = {}) {
  return request({
    url: `${limsUrl}limsCheckSample`,
    method: 'get',
    params,
  });
}
// 新增
export function rowCreate(data = {}) {
  return request({
    url: `${limsUrl}limsCheckSample`,
    method: 'post',
    data,
  });
}
// 批量新增
export function rowBatchCreate(data = []) {
  return request({
    url: `${limsUrl}limsCheckSample/batch`,
    method: 'post',
    data,
  });
}
// 修改
export function rowUpdate(data = {}) {
  return request({
    url: `${limsUrl}limsCheckSample`,
    method: 'put',
    data,
  });
}

// 修改
export function batchReturn(ids) {
  return request({
    url: `${limsUrl}limsCheckSample/batchReturn/${ids}`,
    method: 'put',
  });
}

// 修改
export function returnSample(id) {
  return request({
    url: `${limsUrl}limsCheckSample/returnSample/${id}`,
    method: 'put',
  });
}

// 接收
export function receive(data = {}) {
  return request({
    url: `${limsUrl}limsCheckSample/receive`,
    method: 'post',
    data,
  });
}

// 修改
export function batchReceive(ids) {
  return request({
    url: `${limsUrl}limsCheckSample/batchReceive/${ids}`,
    method: 'put',
  });
}
// 删除
export function rowDel(id) {
  return request({
    url: `${limsUrl}limsCheckSample/${id}`,
    method: 'put',
  });
}
// 详情
export function rowDetail(id) {
  return request({
    url: `${limsUrl}limsCheckSample/info/${id}`,
    method: 'get',
  });
}
export function receiveDetail(id) {
  return request({
    url: `${limsUrl}limsCheckSample/getSampleDetail/${id}`,
    method: 'get',
  });
}

// 导入用户
export function importData (data = {}) {
  return request({
    url: `${limsUrl}limsCheckSample/import`,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}
// 下载模板
export const downloadTemplateUrl = `${limsUrl}limsCheckSample/template`

