import request from "@/axios/request";
import url from "@/axios/url";
const { adminUrl } = url();

//文件上传
export function langJsonUpload(data = {}) {
  return request({
    url: `${adminUrl}baseAppFile/fileBucket`,
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
}
// 获取国际化配置
export function getI18n(params = {}) {
  return request({
    url: `${adminUrl}expose/baseWordEntryConfig/loading`,
    method: "GET",
    params
  });
}
// 获取国际化的私有配置
export function getLanguageConfig(params = {}) {
  return request({
    url: `${adminUrl}baseWordEntryConfig`,
    method: "GET",
    params
  });
}

