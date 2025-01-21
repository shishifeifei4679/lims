import request from "@/axios/request";
import url from "@/axios/url";
const { adminUrl } = url();

// 投递消息成功
export function deliveredMessage(messageId) {
  return request({
    url: `${adminUrl}message/delivered/${messageId}`,
    method: "put",
  });
}
// 阅读消息成功
export function readMessage(messageId) {
  return request({
    url: `${adminUrl}message/read/${messageId}`,
    method: "put",
  });
}
// 未读消息数
export function getUnreadNum() {
  return request({
    url: `${adminUrl}message/unreadNum`,
    method: "get",
  });
}
// 查看已读未读消息
// 0 未读 1 已读
export function getMessageSend(params = {}) {
  return request({
    url: `${adminUrl}message/send`,
    method: "get",
    params,
  });
}
// 全部已读
export function messageReadAll() {
  return request({
    url: `${adminUrl}message/readAll`,
    method: "put",
  });
}
//删除
export function deletMessage(ids = "") {
  return request({
    url: `${adminUrl}message/send/${ids}`,
    method: "delete",
  });
}
