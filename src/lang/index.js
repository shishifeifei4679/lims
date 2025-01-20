import Vue from "vue";
import store from "@/store/index";
import ElementLocale from "element-ui/lib/locale";
import VueI18n from "vue-i18n";
// 兼容工具
import eleFormLocale from "@/components/ele-form/locale";
Vue.use(VueI18n); // 全局注册国际化包
// 准备翻译的语言环境信息
const i18n = new VueI18n({
  // TODO
  // locale: storage.get('vuex')['language']['language'] || 'cn', // 初始化中文cn
  locale: 'cn', // 初始化中文cn
  messages: {
    cn: {},
    en: {},
  },
});
ElementLocale.i18n((key, value) => i18n.t(key, value));
eleFormLocale.i18n((key, value) => i18n.t(key, value));

window.$i18n = i18n;
export default i18n;
