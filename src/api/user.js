import request from "@/axios/request";
import url from "@/axios/url";
const { adminUrl } = url();
export const refreshToken = `${adminUrl}user/renew`;

// 用户列表
export function getUserList(params) {
  return request({
    url: `${adminUrl}user/listInUserRole`,
    method: "get",
    params,
  });
}

// 用户列表(不分页)
export function getAllUserList(params) {
  return request({
    url: `${adminUrl}user/getuserlist`,
    method: "get",
    params,
  });
}
