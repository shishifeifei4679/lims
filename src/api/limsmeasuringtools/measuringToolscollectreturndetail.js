import request from '@/axios/request';
import url from '@/axios/url';
const { limsUrl, generalUrl, adminUrl } = url();
// 导出url
export const exportUrl = `${limsUrl}limsMeasuringToolsCollectReturn/pageLog/export`
// 分页查询
export function getList(params = {}) {
  return request({
    url: `${limsUrl}limsMeasuringToolsCollectReturn/pageLog`,
    method: 'get',
    params,
  });
}
// 新增
export function rowCreate(data = {}) {
  return request({
    url: `${generalUrl}commonMeasuringToolsLedger`,
    method: 'post',
    data,
  });
}
// 批量新增
export function rowBatchCreate(data = []) {
  return request({
    url: `${generalUrl}commonMeasuringToolsLedger/batch`,
    method: 'post',
    data,
  });
}
// 修改
export function rowUpdate(data = {}) {
  return request({
    url: `${generalUrl}commonMeasuringToolsLedger`,
    method: 'put',
    data,
  });
}
// 删除
export function rowDel(id) {
  return request({
    url: `${generalUrl}commonMeasuringToolsLedger/${id}`,
    method: 'put',
  });
}
// 详情
export function rowDetail(id) {
  return request({
    url: `${generalUrl}commonMeasuringToolsLedger/info/${id}`,
    method: 'get',
  });
}

// 导入
export function importData (data = {}) {
  return request({
    url: `${generalUrl}commonMeasuringToolsLedger/import`,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}
// 下载模板
export const downloadTemplateUrl = `${generalUrl}commonMeasuringToolsLedger/template`

// 查询部门树
export function getDepartmentCodeTree(params = {}) {
  params['status'] = '1';
  return request({
    url: `${adminUrl}dept/tree`,
    method: "get",
    params,
  });
}

