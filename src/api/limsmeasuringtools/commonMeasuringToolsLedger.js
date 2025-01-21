import request from '@/axios/request';
import url from '@/axios/url';
const { generalUrl, adminUrl } = url();
// 导出url
export const exportUrl = `${generalUrl}commonMeasuringToolsLedger/export`
// 分页查询
export function getList(params = {}) {
  return request({
    url: `${generalUrl}commonMeasuringToolsLedger`,
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

// 导入用户
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

// 查询类型编码列表
export function getMeasuringToolsTypeCodeList() {
  return request({
    url: `${generalUrl}commonMeasuringToolsType/list`,
    method: 'get',
  });
}
// 查询类型树
export function getMeasuringToolsTypeCodeTree() {
  return request({
    url: `${generalUrl}commonMeasuringToolsType/tree`,
    method: 'get',
  });
}
// 查询精度等级编码列表
export function getAccuracyLevelCodeList(params = {}) {
  return request({
    url: `${generalUrl}commonMeasuringToolsAccuracyLevel/list`,
    method: 'get',
    params
  });
}
// 查询部门编码列表
export function getDepartmentCodeList() {
  return request({
    url: `${adminUrl}dept/tree`,
    method: 'get',
  });
}
// 查询部门树
export function getDepartmentCodeTree(params = {}) {
  params['status'] = '1';
  return request({
    url: `${adminUrl}dept/tree`,
    method: "get",
    params,
  });
}
// 查询供应商编码列表
export function getSupplierCodeList() {
  return request({
    url: `${generalUrl}commonSupplier/list`,
    method: 'get',
  });
}

// 获取打印数据
export function getPrintData(params) {
  return request({
    url: `${generalUrl}commonMeasuringToolsLedger/getPrintData`,
    method: 'post',
    data:params
  });
}
// 获取用户列表
export function getUserList(params = {}) {
//  帐号状态（0审批中 1正常 2停用）
  params.status = '1';
  return request({
    url: `${adminUrl}user/list`,
    method: "get",
    params,
  });
}
// 查询精度等级测量范围编码列表
export function getAccuracyLevelRangeList(params = {}) {
  return request({
    url: `${generalUrl}commonMeasuringToolsAccuracyLevel/listRange`,
    method: 'get',
    params
  });
}
// 查询列表组件
export function getSystemList(params = {}) {
  return request({
    url: `${adminUrl}system/list`,
    method: 'get',
    params
  });
}
// 查询列表组件
export function commonMeasuringToolsLedger(params = {}) {
  return request({
    url: `${generalUrl}commonMeasuringToolsLedger`,
    method: 'get',
    params
  });
}

// 下发
export function issue(data) {
  return request({
    url: `${generalUrl}commonMeasuringToolsLedger/issue`,
    method: 'post',
    data
  });
}