import request from '@/axios/request'
import url from '@/axios/url'
const { adminUrl, minioUrl, generalUrl } = url()

// 导出url
export const exportUrl = `${generalUrl}baseRegionModeling/export`

// 列表查询
export function getDataList(params = {}) {
  return request({
    url: `${generalUrl}baseRegionModeling/list`,
    method: 'get',
    params
  })
}

// 获取树状结构
export function getTree(params = {}) {
  return request({
    url: `${generalUrl}baseRegionModeling/tree`,
    method: 'get',
    params
  })
}

// 获取树状结构
export function getTreeWithEquipments(params = {}) {
  return request({
    url: `${generalUrl}baseRegionModeling/getTreeWithEquipments`,
    method: 'get',
    params
  })
}

// 获取详情
export function getInfo(id = '') {
  return request({
    url: `${generalUrl}baseRegionModeling/` + id,
    method: 'get'
  })
}

// 批量删除
export function submitDelete(data = {}) {
  return request({
    url: `${generalUrl}baseRegionModeling/delete`,
    method: 'post',
    data
  })
}

// 新增
export function submitCreate(data = {}) {
  return request({
    url: `${generalUrl}baseRegionModeling/create`,
    method: 'post',
    data
  })
}

// 修改
export function submitEdit(data = {}) {
  return request({
    url: `${generalUrl}baseRegionModeling/edit`,
    method: 'post',
    data
  })
}

// 查询树形父code
export function getParentCodeTree() {
  return request({
    url: `${generalUrl}baseRegionModeling/tree`,
    method: 'get',
  })
}

// 查询树形系统建模
export function getModelingTree() {
  return request({
    url: `${adminUrl}baseFactoryModeling/treeFactory`,
    method: 'get'
  })
}

export function importData(data = {}) {
  return request({
    url: `${generalUrl}baseRegionModeling/import`,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}
//是否已绑定系统建模
export function isExistRela() {
  return request({
    url: `${generalUrl}baseRegionModeling/isExistRela`,
    method: 'get'
  })
}
//系统建模转换为区域
export function initModelingToRegion() {
  return request({
    url: `${generalUrl}baseRegionModeling/initModelingToRegion`,
    method: 'get'
  })
}

// 下载模板
export const downloadTemplateUrl = `${minioUrl}/platform-template/区域管理模板.xlsx`