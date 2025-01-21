import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import setting from "./modules/setting";
import btnAuth from "./modules/btnAuth";
import getters from "./getters";
import keepAlive from "./modules/keepAlive";
import language from "./modules/language";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);
const PERSIST_PATHS = ["user", "setting"];

const loadOnlyStorage = {
  getItem: (key) => sessionStorage.getItem(key),
  setItem: (key, value) => {
    const val = JSON.parse(value);
    // 作为子应用运行时，从sessionStorage中获取顶部菜单topMainMenus，赋值给user.topmenus
    val && val['user'] && window.__POWERED_BY_QIANKUN__ && (val['user']['topmenus'] = JSON.parse(sessionStorage.getItem('topMainMenus')));
    sessionStorage.setItem(key, JSON.stringify(val));
  },
  removeItem: (key) => sessionStorage.removeItem(key),
};

const store = new Vuex.Store({
  modules: {
    user,
    setting,
    btnAuth,
    keepAlive,
    language,
  },
  getters,
  plugins: [
    createPersistedState({
      storage: loadOnlyStorage,
      paths: PERSIST_PATHS,
    }),
    createPersistedState({
      storage: window.localStorage,
      paths: ["language"],
    }),
  ],
});

export default store;
