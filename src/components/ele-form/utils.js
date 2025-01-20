/**
 * @description 校验字符串是否符合正则规范
 * @author bing
 * @date 2024-05-30 14:09
 * @param {*} str 原字符串,
 * @param {*} type  正则类型
 */
export const verifyFormat = (str, type) => {
  const JSON = {
    Phone: {
      regular: /^1[3|4|5|6|7|8|9][0-9]{9}$/,
      msg:getI18nMsg("common.phoneRules", "请输入正确的手机号"),
    },
    Email: {
      regular: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
      msg:getI18nMsg("common.emailRules", "请输入正确的邮箱"),
    },
    Encoding: {
      regular: /^[A-Za-z0-9_-]*$/,
      msg: getI18nMsg("common.encodingRules", "只能输入英文、数字、中划线、下划线"),
      },
  };
  
  let item = JSON[type];
  return item ? (item.regular.test(str) ? null : item.msg) : null;
};

/**
 * @description 获取国际化值,目的,追加默认
 * @author bing
 * @date 2024-05-30 15:33
 * @param {*} key 国际化对应键,
 * @param {*} defMsg 国际化没用找到显示的默认值,
 */
export const getI18nMsg = (key, defMsg) => {
  return $i18n.t(key) == key ? defMsg : $i18n.t(key);
};
