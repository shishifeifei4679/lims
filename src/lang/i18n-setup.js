import i18n from "./index"
import store from "@/store/index"
import { Loading } from "element-ui"
import cn from "@/lang/zn.js"
import en from "@/lang/en.js"
import { getI18n,getLanguageConfig } from "@/api/language";
let langConfig;
export function loadLanguageAsync() {
  const lang = store.getters.language
  i18n.locale = lang
  document.querySelector("html").setAttribute("lang", lang)
  return new Promise(async (resolve, reject) => {
    let loadingInstance = Loading.service({
      lock: true,
      text: lang == "cn" ? "加载中..." : "Loading...",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.4)",
      fullscreen: true
    })

    const local = lang == "cn" ? cn : en;
    // 从后端获取国际化配置
    const params = {
      language: lang,  // 1:中文 0:英文
      terminalType: 0,  // 0:PC 1:App 2:Client
      sysCodes:"lims"
    };
    const res = await getI18n(params);
    // 合并国际化配置，后端返回的国际化配置优先级高于本地的
    langConfig = _.merge({}, local, res?.data?.result?.['lims'] || {})
    i18n.setLocaleMessage(lang, langConfig);
    loadingInstance.close()
    resolve({ success: true, lang })
  })
}

// 获取国际化私有配置
export async function updateLanguageConfig(data) {
  try {
    let config = {};
    const res = await getLanguageConfig(data);
    const records = res.data.result?.records || [];
    records.length &&
      records.forEach((item) => {
        // 将config的key转换为对象的key
        const keyArray = item.wordKey?.split(".");
        if (keyArray.length > 1) {
          !config[keyArray[0]] && (config[keyArray[0]] = {});
          config[keyArray[0]][keyArray[1]] =
            item.wordAliasName || item.wordOriginalName;
        }
      });
    langConfig = _.merge({}, langConfig, config);
    i18n.setLocaleMessage(store.getters.language, langConfig);
    return { success: true };
  } catch (e) {
    console.error(e)
    return { success: false };
  }
}
