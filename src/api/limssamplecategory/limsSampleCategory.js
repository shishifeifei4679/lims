import request from '@/axios/request';
import url from '@/axios/url';
const { limsUrl, adminUrl } = url();
// 导出url
export const exportUrl = `${limsUrl}limsSampleCategory/export`
// 分页查询
export function getList(params = {}) {
  return request({
    url: `${limsUrl}limsSampleCategory`,
    method: 'get',
    params,
  });
}
// 新增
export function rowCreate(data = {}) {
  return request({
    url: `${limsUrl}limsSampleCategory`,
    method: 'post',
    data,
  });
}
// 修改
export function rowUpdate(data = {}) {
  return request({
    url: `${limsUrl}limsSampleCategory`,
    method: 'put',
    data,
  });
}
// 删除
export function rowDel(id) {
  return request({
    url: `${limsUrl}limsSampleCategory/${id}`,
    method: 'put',
  });
}
// 详情
export function rowDetail(id) {
  return request({
    url: `${limsUrl}limsSampleCategory/info/${id}`,
    method: 'get',
  });
}

// 导入用户
export function importData (data = {}) {
  return request({
    url: `${limsUrl}limsSampleCategory/import`,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}
// 下载模板
export const downloadTemplateUrl = `${limsUrl}limsSampleCategory/template`

