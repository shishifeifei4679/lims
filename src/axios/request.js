import service from "@/axios/axios"
import store from "@/store"
import { refreshToken } from "@/api/login"
import { Message } from "element-ui"
import { logout } from "@/utils/judge"
import i18n from "@/lang/index"

let newoptions = {};

export default function request(options = {}) {
  newoptions = options;
  return service
    .request(options)
    .then(checkStatus)
    .catch((error) => {
      return Promise.reject(error)
    });
}

let isRefreshing = true;
function checkStatus(response) {
  // 状态码code == 100 ，token 过期
  if (response && response.data.code === 100) {
    // 刷新token的函数,这需要添加一个开关，防止重复请求
    if (isRefreshing) {
      refreshTokenRequst()
    }
    isRefreshing = false;
    // 这个Promise函数很关键
    const retryOriginalRequest = new Promise((resolve) => {
      addSubscriber(() => {
        resolve(request(newoptions))
      });
    });
    return retryOriginalRequest;
  } else if (response && response.data.code == undefined) {
    //去除返回值为流的情况
    const contentType = response.headers["content-type"]
    const interceptors = [
      "application/octet-stream",
      "application/vnd.ms-excel;charset=utf-8",
      "application/octet-stream;charset=UTF-8",
      "application/pdf;charset=utf-8",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];
    if (interceptors.includes(contentType) || contentType.indexOf('application/json') === 0) {
      return response;
    } else {
      const message = response.data.message || i18n.t("ajaxErr.400")
      Message.error({
        message: message,
      });
      return Promise.reject(response);
    }
  } else {
    if (response.data.code == 0) {
      return response;
    } else {
      const message = response.data.message || $i18n.t("ajaxErr.400")
      Message.error({
        message: message,
      });
      return Promise.reject(response)
    }
  }
}

function refreshTokenRequst() {
  service
    .request({
      url: refreshToken,
      method: "get",
    })
    .then((response) => {
      if (response.data.code == 0) {
        if (!response.data.result) {
          logout();
        } else {
          store.commit("SET_TOKEN", response.data.result);
          onAccessTokenFetched();
          isRefreshing = true;
        }
      }
    });
}

let subscribers = [];
function onAccessTokenFetched() {
  subscribers.forEach((callback) => {
    callback();
  });
  subscribers = [];
}

function addSubscriber(callback) {
  subscribers.push(callback);
}
