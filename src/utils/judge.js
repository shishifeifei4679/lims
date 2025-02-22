import {Loading} from "element-ui";
import {Message} from "@/plugins/messageOverride";
import request from "@/axios/request";
import router from "@/router";
import store from "@/store";
import elementUI from 'element-ui';
const systemConfig = require("@/config.js");

// 退出登录
export const logout = () => {
  store.dispatch("Logout").then(() => {
    const tenantCode = store.getters.userInfo.tenantCode;
    setTimeout(() => {
      process.env.VUE_APP_CURRENTMODE == "development"
        ? (window.location.href = `${systemConfig.publicPath}login/${tenantCode}?redirect=${router.currentRoute.path}`)
        : (window.location.href = `/mom/login/${tenantCode}`);
    });
  });
};

// 系统跳转
export const routerPush = (pathname, params = "", routerInfo = {}) => {
  if (!pathname) return;
  // frame(是否是外链)  1:外部链接 0:内部路由
  if (routerInfo.frame == 1) {
    // openType打开方式  1:浏览器新Tab 0:系统内
    if (routerInfo.openType == 1) {
      const pathUrl = `${pathname}${pathname.includes("?") ? "&" : "?"}token=${
        store.getters.token
      }`;
      window.open(pathUrl);
      return;
    } else {
      document.title = routerInfo.name;
      router.push(`/iframe?url=${pathname}`);
      return;
    }
  } else {
    if (window.__POWERED_BY_QIANKUN__) {
      router.push(pathname + params);
    } else {
      // 不在qiankun中运行时，去掉路由前缀的/component/mes
      // 例如：主应用的资源中配置的路由为/component/mes/team/mesTeam，修改为/team/mesTeam
      router.push(
        `${pathname.replace(systemConfig.pathReplaceStr, "") + params}`
      );
    }
  }
};

// 设置title  isdef  true不展示默认项 是否展示默认项
export const setTitle = (type, isdef = true) => {
  let KEY = {
    cn: {
      key: "titleContent",
      val: "制造管理",
    },
    en: {
      key: "titleContentEn",
      val: "production management",
    },
  };
  let arr = store.getters.titles || [];
  let language = store.getters.language || "cn";
  try {
    let obj = arr.filter((item) => item.usePosition == type) || [
      {
        titleContent: "制造管理",
        titleContentEn: "production management",
      },
    ];
    let item =
      obj.find((ite) => ite.usageType == "20") ||
      obj.find((ite) => ite.usageType == "10");

    if (!isdef) {
      return item[KEY[language].key];
    } else {
      return item[KEY[language].key] || KEY[language].val;
    }
  } catch (error) {
    if (isdef) {
      return KEY[language].val;
    }
  }
};

// 导出excel的公用方法
/*
 @params  url: 导出接口地址,data: 传递参数 type: 请求类型
*/
// type: 'application/x-www-form-urlencoded' 或 'application/json' 或 其他
export const exportExcelOnly = (
  url,
  data,
  type = "application/json",
  method = "get"
) => {
  const loadingInstance = Loading.service({
    lock: true,
    text: $i18n.t("common.downLoading"),
    spinner: "el-icon-loading",
  });
  request({
    url,
    data,
    params: data,
    method,
    responseType: "blob",
    headers: {
      "content-Type": type,
    },
  })
    .then((res) => {
      const disposition = res.headers["content-disposition"];
      let fileName = "";
      let name = "";
      let suffix = "";
      if (disposition) {
        fileName = disposition.split("=")[1];
        const [na, suf] = fileName.split("'")[2].split(".");
        name = window.decodeURIComponent(na);
        suffix = suf;
      }
      const data = res.data;
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = name ? `${name}.${suffix}` : "文件下载";
      link.click();
    })
    .catch((err) => {
      console.log("debug log --> ", err);
    })
    .finally(() => {
      loadingInstance.close();
    });
};

// 根据后端返回结果判断是下载文件，还是展示提示信息
export const exportExcel = (
  url,
  data,
  type = "application/json",
  method = "get",
  headers,
) => {
  const loadingInstance = Loading.service({
    lock: true,
    text: $i18n.t("common.downLoading"),
    spinner: "el-icon-loading",
  });
  request({
    url,
    data,
    params: method == "get" ? data : undefined,
    method,
    responseType: 'blob',
    headers: {
      "content-Type": type,
      ...headers
    },
  })
    .then((res) => {
      const contentType = res.headers["content-type"];
      // 如果是json格式，将blob还原为json
      if (contentType.indexOf('application/json') === 0) {
        const reader = new FileReader();
        reader.readAsText(res.data, 'UTF-8');
        reader.onload = function(e) {
          const { message, code } = JSON.parse(e.target.result);
          if(code == -100 || code == -2){
            elementUI.Message.warning(message || $i18n.t('common.expUnknowError'));
          }else if(code == -200 || code == -1){
            elementUI.Message.error(message || $i18n.t('common.expUnknowError'));
          }else if(code == -110){
            // 二级警告
            elementUI.Message.warning(message || $i18n.t('common.expUnknowError'));
          }else{
            elementUI.Message.success(message || $i18n.t('common.expSuccess'));
          }
        };
      } else {
        const disposition = res.headers["content-disposition"];
        let fileName = "";
        let name = "";
        let suffix = "";
        if (disposition) {
          fileName = disposition.split("=")[1];
          const [na, suf] = fileName.split("'").length==1?fileName.split("."):fileName.split("'")[2].split(".")
          name = window.decodeURIComponent(na);
          suffix = suf;
        }
        const data = res.data;
        const url = URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = url;
        link.download = name ? `${name}.${suffix}` : "文件下载";
        link.click();
      }
    })
    .catch((err) => {
      console.log("debug log --> ", err);
    })
    .finally(() => {
      loadingInstance.close();
    });
};

// 获取浏览器高度
export const clientHeight = () => {
  return document.documentElement
    ? document.documentElement.clientHeight
    : document.body.clientHeight;
};

// 判断是否为空
export const isEmpty = (value) => {
  return [null, "", "undefined", undefined].includes(value);
};

// 邮箱
export const isEmail = (s) => {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(
    s
  );
};
// 手机号码

export const isMobile = (s) => {
  return /^1[0-9]{10}$/.test(s);
};
// 电话号码

export const isPhone = (s) => {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s);
};
// 4.是否url地址
export const isURL = (s) => {
  return /^http[s]?:\/\/.*/.test(s);
};

//  ua判断
export const ua = navigator.userAgent.toLowerCase();

// 19.是否是微信浏览器

export const isWeiXin = () => {
  return ua.match(/microMessenger/i) == "micromessenger";
};
// 20.是否是移动端
export const isDeviceMobile = () => {
  return /android|webos|iphone|ipod|balckberry/i.test(ua);
};

// 23.是否ios

export const isIos = () => {
  var u = navigator.userAgent;
  if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
    // 安卓手机
    return false;
  } else if (u.indexOf("iPhone") > -1) {
    // 苹果手机
    return true;
  } else if (u.indexOf("iPad") > -1) {
    // iPad
    return false;
  } else if (u.indexOf("Windows Phone") > -1) {
    // winphone手机
    return false;
  } else {
    return false;
  }
};
// 24.是否为PC端

export const isPC = () => {
  var userAgentInfo = navigator.userAgent;
  var Agents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod",
  ];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
};
// 25.去除html标签
export const removeHtmltag = (str) => {
  return str.replace(/<[^>]+>/g, "");
};

// 32.获取滚动的坐标

export const getScrollPosition = (el = window) => ({
  x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
  y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop,
});
// 33.滚动到顶部

export const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
};
// 34.el是否在视口范围内

export const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  return partiallyVisible
    ? ((top > 0 && top < innerHeight) ||
        (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};

// 35.洗牌算法随机

export const shuffle = (arr) => {
  var result = [];
  var random;
  while (arr.length > 0) {
    random = Math.floor(Math.random() * arr.length);
    result.push(arr[random]);
    arr.splice(random, 1);
  }
  return result;
};

// 37.判断类型集合

export const checkStr = (str, type) => {
  switch (type) {
    case "phone": // 手机号码
      return /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(str);
    case "tel": // 座机
      return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
    case "card": // 身份证
      return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str);
    case "pwd": // 密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线
      return /^[a-zA-Z]\w{5,17}$/.test(str);
    case "postal": // 邮政编码
      return /[1-9]\d{5}(?!\d)/.test(str);
    case "QQ": // QQ号
      return /^[1-9][0-9]{4,9}$/.test(str);
    case "email": // 邮箱
      return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
    case "money": // 金额(小数点2位)
      return /^\d*(?:\.\d{0,2})?$/.test(str);
    case "URL": // 网址
      return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(
        str
      );
    case "IP": // IP
      return /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/.test(
        str
      );
    case "date": // 日期时间
      return (
        /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2})(?:\:\d{2}|:(\d{2}):(\d{2}))$/.test(
          str
        ) || /^(\d{4})\-(\d{2})\-(\d{2})$/.test(str)
      );
    case "number": // 数字
      return /^[0-9]$/.test(str);
    case "english": // 英文
      return /^[a-zA-Z]+$/.test(str);
    case "chinese": // 中文
      return /^[\\u4E00-\\u9FA5]+$/.test(str);
    case "lower": // 小写
      return /^[a-z]+$/.test(str);
    case "upper": // 大写
      return /^[A-Z]+$/.test(str);
    case "HTML": // HTML标记
      return /<("[^"]*"|'[^']*'|[^'">])*>/.test(str);
    case "english-number": // 英文、数字、_
      return /^[A-Za-z0-9_-]*$/.test(str); ///^[A-Za-z0-9_-]*$/.test(str); ///^\w+$/.test(str);
    case "english-number-": // 英文、数字、_ -
      return /^[A-Za-z0-9_-]*$/.test(str);
    default:
      return true;
  }
};
// 38.严格的身份证校验
export const isCardID = (sId) => {
  if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(sId)) {
    console.log("你输入的身份证长度或格式错误");
    return false;
  }
  // 身份证城市
  var aCity = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外",
  };
  if (!aCity[parseInt(sId.substr(0, 2))]) {
    console.log("你的身份证地区非法");
    return false;
  }

  // 出生日期验证
  var sBirthday = (
    sId.substr(6, 4) +
    "-" +
    Number(sId.substr(10, 2)) +
    "-" +
    Number(sId.substr(12, 2))
  ).replace(/-/g, "/");
  var d = new Date(sBirthday);
  if (
    sBirthday !=
    d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate()
  ) {
    console.log("身份证上的出生日期非法");
    return false;
  }

  // 身份证号码校验
  var sum = 0;
  var weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  var codes = "10X98765432";
  for (var i = 0; i < sId.length - 1; i++) {
    sum += sId[i] * weights[i];
  }
  var last = codes[sum % 11]; // 计算出来的最后一位身份证号码
  if (sId[sId.length - 1] != last) {
    console.log("你输入的身份证号非法");
    return false;
  }

  return true;
};
// 39.随机数范围

export const random = (min, max) => {
  if (arguments.length === 2) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  } else {
    return null;
  }
};

// 将阿拉伯数字翻译成中文的大写数字

export const numberToChinese = (num) => {
  var AA = new Array(
    "零",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
    "十"
  );
  var BB = new Array("", "十", "百", "仟", "萬", "億", "点", "");
  var a = ("" + num).replace(/(^0*)/g, "").split(".");
  var k = 0;
  var re = "";
  for (var i = a[0].length - 1; i >= 0; i--) {
    switch (k) {
      case 0:
        re = BB[7] + re;
        break;
      case 4:
        if (!new RegExp("0{4}//d{" + (a[0].length - i - 1) + "}$").test(a[0])) {
          re = BB[4] + re;
        }
        break;
      case 8:
        re = BB[5] + re;
        BB[7] = BB[5];
        k = 0;
        break;
    }
    if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) {
      re = AA[0] + re;
    }
    if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
    k++;
  }

  if (a.length > 1) {
    // 加上小数部分(如果有小数部分)
    re += BB[6];
    for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
  }
  if (re == "一十") re = "十";
  if (re.match(/^一/) && re.length == 3) re = re.replace("一", "");
  return re;
};
// 将数字转换为大写金额

export const changeToChinese = (Num) => {
  // 判断如果传递进来的不是字符的话转换为字符
  if (typeof Num === "number") {
    Num = new String(Num);
  }
  Num = Num.replace(/,/g, ""); // 替换tomoney()中的“,”
  Num = Num.replace(/ /g, ""); // 替换tomoney()中的空格
  Num = Num.replace(/￥/g, ""); // 替换掉可能出现的￥字符
  if (isNaN(Num)) {
    // 验证输入的字符是否为数字
    // alert("请检查小写金额是否正确");
    return "";
  }
  // 字符处理完毕后开始转换，采用前后两部分分别转换
  var part = String(Num).split(".");
  var newchar = "";
  // 小数点前进行转化
  for (var i = part[0].length - 1; i >= 0; i--) {
    if (part[0].length > 10) {
      return "";
      // 若数量超过拾亿单位，提示
    }
    var tmpnewchar = "";
    var perchar = part[0].charAt(i);
    switch (perchar) {
      case "0":
        tmpnewchar = "零" + tmpnewchar;
        break;
      case "1":
        tmpnewchar = "壹" + tmpnewchar;
        break;
      case "2":
        tmpnewchar = "贰" + tmpnewchar;
        break;
      case "3":
        tmpnewchar = "叁" + tmpnewchar;
        break;
      case "4":
        tmpnewchar = "肆" + tmpnewchar;
        break;
      case "5":
        tmpnewchar = "伍" + tmpnewchar;
        break;
      case "6":
        tmpnewchar = "陆" + tmpnewchar;
        break;
      case "7":
        tmpnewchar = "柒" + tmpnewchar;
        break;
      case "8":
        tmpnewchar = "捌" + tmpnewchar;
        break;
      case "9":
        tmpnewchar = "玖" + tmpnewchar;
        break;
    }
    switch (part[0].length - i - 1) {
      case 0:
        tmpnewchar = tmpnewchar + "元";
        break;
      case 1:
        if (perchar != 0) tmpnewchar = tmpnewchar + "拾";
        break;
      case 2:
        if (perchar != 0) tmpnewchar = tmpnewchar + "佰";
        break;
      case 3:
        if (perchar != 0) tmpnewchar = tmpnewchar + "仟";
        break;
      case 4:
        tmpnewchar = tmpnewchar + "万";
        break;
      case 5:
        if (perchar != 0) tmpnewchar = tmpnewchar + "拾";
        break;
      case 6:
        if (perchar != 0) tmpnewchar = tmpnewchar + "佰";
        break;
      case 7:
        if (perchar != 0) tmpnewchar = tmpnewchar + "仟";
        break;
      case 8:
        tmpnewchar = tmpnewchar + "亿";
        break;
      case 9:
        tmpnewchar = tmpnewchar + "拾";
        break;
    }
    var newchar = tmpnewchar + newchar;
  }
  // 小数点之后进行转化
  if (Num.indexOf(".") != -1) {
    if (part[1].length > 2) {
      // alert("小数点之后只能保留两位,系统将自动截断");
      part[1] = part[1].substr(0, 2);
    }
    for (i = 0; i < part[1].length; i++) {
      tmpnewchar = "";
      perchar = part[1].charAt(i);
      switch (perchar) {
        case "0":
          tmpnewchar = "零" + tmpnewchar;
          break;
        case "1":
          tmpnewchar = "壹" + tmpnewchar;
          break;
        case "2":
          tmpnewchar = "贰" + tmpnewchar;
          break;
        case "3":
          tmpnewchar = "叁" + tmpnewchar;
          break;
        case "4":
          tmpnewchar = "肆" + tmpnewchar;
          break;
        case "5":
          tmpnewchar = "伍" + tmpnewchar;
          break;
        case "6":
          tmpnewchar = "陆" + tmpnewchar;
          break;
        case "7":
          tmpnewchar = "柒" + tmpnewchar;
          break;
        case "8":
          tmpnewchar = "捌" + tmpnewchar;
          break;
        case "9":
          tmpnewchar = "玖" + tmpnewchar;
          break;
      }
      if (i == 0) tmpnewchar = tmpnewchar + "角";
      if (i == 1) tmpnewchar = tmpnewchar + "分";
      newchar = newchar + tmpnewchar;
    }
  }
  // 替换所有无用汉字
  while (newchar.search("零零") != -1) newchar = newchar.replace("零零", "零");
  newchar = newchar.replace("零亿", "亿");
  newchar = newchar.replace("亿万", "亿");
  newchar = newchar.replace("零万", "万");
  newchar = newchar.replace("零元", "元");
  newchar = newchar.replace("零角", "");
  newchar = newchar.replace("零分", "");
  if (newchar.charAt(newchar.length - 1) == "元") {
    newchar = newchar + "整";
  }
  return newchar;
};

// 44.去重
export const unique = (arr) => {
  if (Array.hasOwnProperty("from")) {
    return Array.from(new Set(arr));
  } else {
    var n = {};
    var r = [];
    for (var i = 0; i < arr.length; i++) {
      if (!n[arr[i]]) {
        n[arr[i]] = true;
        r.push(arr[i]);
      }
    }
    return r;
  }
};
// 45.求两个集合的并集
export const union = (a, b) => {
  var newArr = a.concat(b);
  return this.unique(newArr);
};
// 求两个集合的交集
export const intersect = (a, b) => {
  var _this = this;
  a = this.unique(a);
  return this.map(a, function (o) {
    return _this.contains(b, o) ? o : null;
  });
};

// 53.去除空格,type: 1-所有空格 2-前后空格 3-前空格 4-后空格
export const trim = (str, type) => {
  type = type || 1;
  switch (type) {
    case 1:
      return str.replace(/\s+/g, "");
    case 2:
      return str.replace(/(^\s*)|(\s*$)/g, "");
    case 3:
      return str.replace(/(^\s*)/g, "");
    case 4:
      return str.replace(/(\s*$)/g, "");
    default:
      return str;
  }
};

// 55.检测密码强度

export const checkPwd = (str) => {
  var Lv = 0;
  if (str.length < 6) {
    return Lv;
  }
  if (/[0-9]/.test(str)) {
    Lv++;
  }
  if (/[a-z]/.test(str)) {
    Lv++;
  }
  if (/[A-Z]/.test(str)) {
    Lv++;
  }
  if (/[\.|-|_]/.test(str)) {
    Lv++;
  }
  return Lv;
};

// 58.判断两个对象是否键值相同
export const isObjectEqual = (a, b) => {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  if (aProps.length !== bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];

    if (a[propName] !== b[propName]) {
      return false;
    }
  }
  return true;
};

// 获取菜单权限的第一个路由对象
export const getDefaultRouter = (data) => {
  let defaultRouter = {};
  const getRouter = (data) => {
    for (const i in data) {
      if (data[i].path && !data[i].path.includes("://")) {
        if (!defaultRouter.path) {
          defaultRouter = data[i];
        }
      } else {
        getRouter(data[i].children);
      }
    }
  };
  getRouter(data);
  return defaultRouter;
};

// 鼠标划入展示弹出层
export const popover = (data, h, width = "", callback) => {
  const Width = width;
  return (
    <div
      slot="reference"
      style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"
    >
      {callback ? (
        <span
          style="color: #3c7fcd;cursor:pointer"
          onClick={() => callback()}
        >
          {data}
        </span>
      ) : (
        <span style="cursor:pointer">
          {data}
        </span>
      )}
    </div>
  );
  // return (
  //   <div
  //     slot="reference"
  //     style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"
  //   >
  //     {callback ? (
  //       <p
  //         style="color: #3c7fcd; width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;cursor:pointer"
  //         onClick={() => callback()}
  //       >
  //         {data}
  //       </p>
  //     ) : (
  //       <p style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
  //         {data}
  //       </p>
  //     )}
  //   </div>
  // );
};

// 复制
export const copy = (data) => {
  const content = data;
  const oInput = document.createElement("input");
  oInput.value = content;
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象;
  document.execCommand("Copy"); // 执行浏览器复制命令
  oInput.style.display = "none";
  oInput.remove();
  Message.success($i18n.t("common.copyMsg"));
};
/**
 * @description  数组去重
 * @author bing
 * @date 2022-03-16 17:16
 * @param {Array} arr  原属数据
 * @param {String} key  指定根据哪个字段去重
 * @returns {*}
 */
export const uniqueKey = (arr, key) => {
  const map = new Map();
  return arr.filter(
    (item) => !map.has(item[key] + "") && map.set(item[key] + "", 1)
  );
};
///获取url指定参数值
export const GetQueryValue = (queryName) => {
  var reg = new RegExp("(^|&)" + queryName + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURI(r[2]);
  } else {
    return null;
  }
};
/**
 * 判断数值整数部分是否超长12位
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const validateL12 = (rule, value, callback) => {
  let s = (value + "").split(".")[0];
  if (value == null || value == "" || value == undefined) {
    callback();
  } else if (s.length > 12 || isNaN(s)) {
    callback(new Error($i18n.t("common.notIntegerExceed12")));
  } else {
    callback();
  }
};

export const compareDate = (beforeDate, afterDate, includeEqual = false) => {
  if (!beforeDate || !afterDate) return true;
  if (includeEqual) {
    return !(new Date(beforeDate).getTime() > new Date(afterDate).getTime());
  } else {
    return new Date(beforeDate).getTime() < new Date(afterDate).getTime();
  }
};

export const validateGZInteger = (rule, value, callback) => {
  if (value <= 0) {
    callback(new Error($i18n.t("validateRules.rule14")));
  } else {
    callback();
  }
};

// 防抖函数
export const debounce = (func, wait, immediate) => {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * 数组根据某一字段去重
 * @param value 字段名
 * @param arr 目标数组
 * @returns 结果数组
 */
export const arrSet = (value, arr) => {
  let obj = {}
  return arr.reduce((pre, cur) => {
    if (!obj[cur[value]]) {
      obj[cur[value]] = true
      pre.push(cur)
    }
    return pre
  }, [])
}
