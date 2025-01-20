import request from "@/axios/request";
import url from "@/axios/url";
import qs from "qs";
const { adminUrl, limsUrl,generalUrl } = url();
//获取角色列表
export function getRoleList(params = {}) {
  return request({
    url: `${adminUrl}role/listNew`,
    method: "get",
    params,
  });
}
//获取岗位列表
export function getPostList(params = {}) {
  return request({
    url: `${adminUrl}post/select`,
    method: "get",
    params,
  });
}
// 获取数据字典
export function getDict(type = "") {
  return request({
    url: `${adminUrl}dict/type/` + type,
    method: "get",
  });
}
// 获取数据字典
export function getUnit(data = {}) {
  return request({
    url: `${generalUrl}baseUnitConversion/list`,
    method: "get",
    data
  });
}

// 查询系统列表
export function getSystemList() {
  return request({
    url: `${adminUrl}baseModuleInfo/system`,
    method: "get",
  });
}

// 查询模块列表
export function getModuleList() {
  return request({
    url: `${adminUrl}baseModuleInfo/module`,
    method: "get",
  });
}

// 查询系统/模块级联下拉
export function getSysModuleCascader() {
  return request({
    url: `${adminUrl}baseModuleInfo/sysModule`,
    method: "get",
  });
}

// 删除文件
export function deleteFile(url, params = {}) {
  return request({
    url: url,
    method: "delete",
    params,
  });
}

// 获取用户页面资源-到按钮级别
export function resourceWithBs(params) {
  return request({
    url: `${adminUrl}resource/resourceWithBs`,
    method: "get",
    params,
  });
}

// 获取计量单位数据字典
export function getUnitDictList() {
  return request({
    url: `${generalUrl}baseUnitConversion/list`,
    method: "get",
  });
}
// 修改数据字典详情项
export function putAuthDictItem(data = {}) {
  return request({
    url: `${adminUrl}dict/item`,
    method: "put",
    data,
  });
}


// 获取编码规则列表
export function getBaseCodeStrategy(params = {}) {
  return request({
    url: `${adminUrl}baseCodeStrategy/list`,
    method: "get",
    params,
  });
}

// 查询样品列表字段
export function getCategoryList(params = {}) {
  return request({
    url: `${limsUrl}limsSampleCategory/getCategoryList`,
    method: "get",
    params,
  });
}

//查询设备
export function getEquipmentList(data = {}) {
  let params = { ...data, isNotScrap: "1" }
  return request({
    url: `${generalUrl}commonBaseEquipment`,
    method: "get",
    params,
  });
}

// 分页查询
// 分页查询设备主数据已下发当前组件
export function getNewList(data = {}) {
  const pageParams = {
    pageNum: data.pageNum,
    pageSize: data.pageSize,
    field: data.field,
    sort: data.sort,
  }
  const otherParams = {
    sysCode: 'lims',
    params: {
      "device_code": data.device_code,
      "device_name": data.device_name,
      "device_status": data.device_status
    }
  }
  return request({
    url: `${generalUrl}device/remotePage?${qs.stringify(pageParams)}`,
    method: "post",
    data: otherParams
  });
}
