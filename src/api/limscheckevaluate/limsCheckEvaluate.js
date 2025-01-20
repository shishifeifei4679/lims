import request from '@/axios/request';
import url from '@/axios/url';
const { limsUrl, adminUrl } = url();
// 导出url
export const exportUrl = `${limsUrl}limsCheckEvaluate/export`
// 分页查询
export function getList(params = {}) {
  return request({
    url: `${limsUrl}limsCheckEvaluate`,
    method: 'get',
    params,
  });
}
// 新增
export function rowCreate(data = {}) {
  return request({
    url: `${limsUrl}limsCheckEvaluate`,
    method: 'post',
    data,
  });
}
// 修改
export function rowUpdate(data = {}) {
  return request({
    url: `${limsUrl}limsCheckEvaluate`,
    method: 'put',
    data,
  });
}
// 删除
export function rowDel(id) {
  return request({
    url: `${limsUrl}limsCheckEvaluate/${id}`,
    method: 'put',
  });
}
// 详情
export function rowDetail(id) {
  return request({
    url: `${limsUrl}limsCheckEvaluate/info/${id}`,
    method: 'get',
  });
}

// 详情
export function reportDetail(id) {
  return request({
    url: `${limsUrl}limsCheckTask/reportDetail/${id}`,
    method: 'get',
  });
}

// 导入用户
export function importData (data = {}) {
  return request({
    url: `${limsUrl}limsCheckEvaluate/import`,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}
// 下载模板
export const downloadTemplateUrl = `${limsUrl}limsCheckEvaluate/template`

export function downloadPDF(id="") {
  return `${limsUrl}limsCheckTask/download/${id}`
}

// 发布
export function publish(data = {}) {
  return request({
    url: `${limsUrl}limsCheckTask/publish`,
    method: 'post',
    data,
  });
}

export function evaluate(data = {}) {
  return request({
    url: `${limsUrl}limsCheckTask/evaluate`,
    method: 'post',
    data,
  });
}
export function returnCheck(data = {}) {
  return request({
    url: `${limsUrl}limsCheckTask/returnCheck`,
    method: 'post',
    data,
  });
}

