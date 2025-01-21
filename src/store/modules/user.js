import { login, getUserInfo, getResources, logout } from "@/api/login";
import { Message } from "element-ui";
import router from "@/router";
import store from "../index";
const defUserLogo = require("@/assets/images/userInfo.png");
const user = {
  state: {
    token: null,
    userInfo: {},
    menus: [],
    leftMenus: [], // 左侧数据
    topmenus: [],
    defaultActive: "",
    resourceId: "",
    avatar: defUserLogo, // 头像
    factoryCode: "",
    routers: [], //所有页面级菜单
    routersFolt: [], //name凭借的平级路由
    twoTitle: {},
    logos: {},
    titles: [],
  },
  mutations: {
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_TITLE: (state, titles = []) => {
      state.titles = titles;
    },
    SET_LEFTMENUS: (state, menus = []) => {
      state.leftMenus = menus;
    },
    SET_TOKEN: (state, result = "") => {
      state.token = result;
    },
    SET_USERINFO: (state, user) => {
      state.userInfo = user || {};
    },
    SET_MENUS: (state, menus = []) => {
      state.menus = menus;
    },
    SET_ROUTERS: (state, routers = []) => {
      state.routers = routers;
    },
    SET_ROUTERSFOLT: (state, routers = []) => {
      state.routersFolt = routers;
    },

    SET_TWOTITLE: (state, menus = []) => {
      state.twoTitle = menus;
    },
    SET_ADDTOPMENUS: (state, menu) => {
      if (menu.iframe) {
        const { query } = menu;
        const itemIndex = state.topmenus.findIndex(
          (_item) => _item.query.url && _item.query.url.includes(query.url)
        );
        const router = state.routers.find((val) => val.path === query.url);
        menu.title = router.name || "title错误";
        document.title = router.name;
        itemIndex > -1
          ? state.topmenus.splice(itemIndex, 1, menu)
          : state.topmenus.push(menu);
      } else {
        const itemIndex = state.topmenus.findIndex(
          (_item) => _item.path === menu.path
        );
        itemIndex > -1
          ? state.topmenus.splice(itemIndex, 1, menu)
          : state.topmenus.push(menu);
      }
    },
    SET_DELTOPMENUS: (state, menu) => {
      let item = [];
      if (menu.iframe) {
        const { query } = menu;
        item = state.topmenus.filter(
          (_item) => !(_item.query.url && _item.query.url.includes(query.url))
        );
      } else {
        item = state.topmenus.filter((_item) => _item.path !== menu.path);
      }
      state.topmenus = item || [];
    },
    SET_TOPMENUS: (state, menu) => {
      state.topmenus = menu || [];
    },
    SET_CLEARTOPMENUS: (state) => {
      state.topmenus = [];
    },
    SET_RESOURCEID: (state, resourceId) => {
      state.resourceId = resourceId;
    },
    SET_DEFAULTACTIVE: (state, defaultActive) => {
      state.defaultActive = defaultActive;
    },
    SET_FACTORYCODE: (state, code) => {
      state.factoryCode = code;
    },
    SET_LOGO: (state, logos = {}) => {
      state.logos = logos;
    },
    CLEAR_USER: (state) => {
      const { tenantCode } = state.userInfo;
      state.token = null;
      state.userInfo = { tenantCode };
      state.menus = [];
      state.leftMenus = [];
      state.topmenus = [];
      state.defaultActive = "";
      state.resourceId = "";
      state.avatar = defUserLogo;
      state.factoryCode = "";
      state.routers = [];
      state.logos = {};
    },
  },
  actions: {
    // 登录
    Login({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        login(requestData)
          .then((res) => {
            const { result } = res.data;
            commit("SET_TOKEN", result);
            resolve(res.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 用户信息
    GetuserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((res) => {
            const { result } = res.data;
            commit("SET_USERINFO", result);
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 资源菜单
    GetMenus({ commit }) {
      getResources().then((res) => {
        const data = res.data.result;
        if (!data || data.length === 0) {
          Message({
            message: $i18n.t("ajaxErr.noPerm"),
            type: "error",
            duration: 5 * 1000,
          });
          router.push("/401");
          return;
        }

        commit("SET_MENUS", data);
        const indexActive =
          store.getters.indexActive ||
          data.findIndex((item) => item.children.length > 0);
        commit("SET_INDEXACTIVE", indexActive);
        commit("SET_LEFTMENUS", data[indexActive].children || []);

        commit("SET_TWOTITLE", data[indexActive]);
        const routers = getRouters(data);
        let result = [];

        getTree(data, result);
        // 为了上方的搜索
        commit("SET_ROUTERSFOLT", result);
        commit("SET_ROUTERS", routers);
      });
    },
    // 退出登录
    Logout({ commit }) {
      return new Promise((resolve) => {
        const language = store.getters.language;
        console.log("language", language);

        // let loginInfo = localStorage.getItem("login");
        localStorage.clear();
        sessionStorage.clear();
        // localStorage.setItem("login", loginInfo);
        commit("CLEAR_USER");
        commit("SET_LANGUAGE", language);
        resolve({ success: true });
      });
    },
  },
};
function getRouters(data) {
  let routers = [];
  const getmenu = (lists) => {
    lists.forEach((val) => {
      if (val.children) {
        getmenu(val.children);
      }
      if (val.type == "C") {
        routers.push(val);
      }
    });
  };
  getmenu(data);
  return routers;
}

// 合并name  by  bing
function getTree(params = [], result = [], key = "") {
  if (Array.isArray(params) && params.length) {
    params.forEach((item) => {
      // 每次开启新的一轮循环，拷贝一份副本（key），因为副本会用于当前轮的其它兄弟，所以你不能改变副本（即不能改变key的值）
      let currentkey = key;
      if (item.type != "C") {
        currentkey = currentkey + item.name + ">";
      }
      // currentkey += item.name;
      if (item.children && item.type != "C") {
        getTree(item.children, result, currentkey);
      } else {
        if (item.type == "C") {
          result.push({
            ...item,
            mergeName: currentkey.slice(0, -1),
          });
        }
      }
    });
  }
}

export default user;
