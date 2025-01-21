import request from '@/axios/request';
import url from '@/axios/url';
const { limsUrl, generalUrl, adminUrl } = url();
// 导出url
export const exportUrl = `${limsUrl}limsMeasuringToolsOperate/pageOperate/export`
// 分页查询
export function getList(params = {}) {
  return request({
    url: `${limsUrl}limsMeasuringToolsOperate/pageOperate`,
    method: 'get',
    params,
  });
}
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
// 查询精度等级测量范围编码列表
export function getAccuracyLevelRangeList(params = {}) {
  return request({
    url: `${generalUrl}commonMeasuringToolsAccuracyLevel/listRange`,
    method: 'get',
    params
  });
}
// 查询仪器类别(字典：common_instrument_category_type)【1：内部检定 2：送检设备 3：厂商检定 4：不需检定】列表
export function getInstrumentCategoryList() {
  return request({
    url: `${adminUrl}dict/type/common_instrument_category_type`,
    method: 'get',
  });
}
// 查询状态(字典：common_measuring_tool_status)【1：使用中 2：封存 3：报废 4：停用 5：丢失】列表
export function getStatusList() {
  return request({
    url: `${adminUrl}dict/type/common_measuring_tool_status`,
    method: 'get',
  });
}
// 查询检定状态(字典：common_check_status)【1：送检中 2：已检定 3：待检定 4：已逾期】列表
export function getCheckStatusList() {
  return request({
    url: `${adminUrl}dict/type/common_check_status`,
    method: 'get',
  });
}
// 查询领用归还状态(字典：common_collect_return_status)【1：在库 2：已借出】列表
export function getCollectReturnStatusList() {
  return request({
    url: `${adminUrl}dict/type/common_collect_return_status`,
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
// 启用、停用、封存、报废、丢失
export function applyOperate(data = {}) {
  return request({
    url: `${limsUrl}limsMeasuringToolsOperate/applyOperate`,
    method: 'post',
    data,
  });
}
// 操作记录-分页查询
export function getOperateLogList(params = {}) {
  return request({
    url: `${limsUrl}limsMeasuringToolsOperate/pageLog`,
    method: 'get',
    params,
  });
}
// 量检具处置管理记录不分页
export function listLog(params = {}) {
  return request({
    url: `${limsUrl}limsMeasuringToolsOperate/listLog`,
    method: 'get',
    params,
  });
}
//查询启用的部门树形列表
export function getDepartment(params = {}) {
  params['status'] = '1';
  return request({
    url: `${adminUrl}dept/tree`,
    method: "get",
    params,
  });
}
// 详情
export function rowDetail(id) {
  return request({
    url: `${limsUrl}limsMeasuringToolsLedger/info/${id}`,
    method: 'get',
  });
}
// 详情
export function treeList() {
  return request({
    url: `${generalUrl}commonMeasuringToolsLedger/dept/tree`,
    method: 'get',
  });
}

// 根据量检具编码列表返回量检具信息
export function commonMeasuringToolsLedgerList(params) {
  return request({
    url: `${generalUrl}commonMeasuringToolsLedger/list`,
    method: 'get',
    params
  });
}


// 删除 【量检具删除关联关系】
export function deleteRelate(data) {
  return request({
    url: `${limsUrl}limsMeasuringToolsOperate/deleteRelate`,
    method: 'post',
    data
  });
}

// 基本信息
export function getInfoByCode(params) {
  return request({
    url: `${generalUrl}commonMeasuringToolsLedger/getInfoByCode`,
    method: 'get',
    params
  });
}