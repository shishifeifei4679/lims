import request from "@/axios/request";
import url from "@/axios/url";
const { adminUrl } = url();
export const refreshToken = `${adminUrl}user/renew`;
// 登录接口
export function login(data = {}) {
  return request({
    url: `${adminUrl}user/login`,
    method: "post",
    data,
  });
}

// 获取用户身份
export function getUserInfo() {
  return request({
    url: `${adminUrl}user/info`,
    method: "get",
  });
}

// 获取资源列表菜单
export function getResources() {
  return request({
    url: `${adminUrl}user/resources`,
    method: "get",
  });
}

// 获取用户按钮权限
export function getPermissions() {
  return request({
    url: `${adminUrl}user/permissions`,
    method: "get",
  });
}

// token续期
export function getUserRenew() {
  return request({
    url: `${adminUrl}user/renew`,
    method: "get",
  });
}

// 获取工厂
export function getFactories() {
  return request({
    url: `${adminUrl}user/factories`,
    method: "get",
  });
}

// 切换工厂
export function changeFactory(code) {
  return request({
    url: `${adminUrl}user/factory/${code}`,
    method: "put",
  });
}

// 击菜单事件上传服务端
export function resourceVisit(id) {
  return request({
    url: `${adminUrl}resource/visit/${id}`,
    method: "put",
  });
}

// 常用功能菜单
export function resourceCommonly() {
  return request({
    url: `${adminUrl}resource/visit/commonly`,
    method: "get",
  });
}

// 获取Logo
export function getLogo(params = {}) {
  return request({
    url: `${adminUrl}expose/getLogo`,
    method: "GET",
    params,
  });
}

// 获取系统名称
export function getTitle(params = {}) {
  return request({
    url: `${adminUrl}expose/getTitle`,
    method: "GET",
    params,
  });
}

// 退出系统
export function logout(data = {}) {
  return request({
    url: `${adminUrl}user/logout`,
    method: "POST",
    data
  });
}
