import Vue from "vue";
import store from "@/store";
import VueRouter from "vue-router";
import admin from "./admin";
import iframe from "./iframe";
import layout from "@/views/layout/layout.vue";
import qs from "qs";
import { loadLanguageAsync,updateLanguageConfig } from "@/lang/i18n-setup";
import { setTitle } from "@/utils/judge.js";
const sys = require("@/config.js");

// 重复点击路由
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
const tenantCode = store.getters.userInfo.tenantCode;

Vue.use(VueRouter);

// 根据是否使用qiankun，加载不同的路由
// 如果不使用qiankun，当访问/，自动跳转到login路径
let layoutRoute = {
  path: "/",
  name: "Layout",
  component: layout,
  children: [...admin, ...iframe],
};

const isMicro = window.__POWERED_BY_QIANKUN__;
!isMicro && (layoutRoute.redirect = `/login/${tenantCode}`);

const routes = [
  {
    path: "/login/*",
    name: "login",
    meta: {
      title: "登录",
      noAddMenu: true,
    },
    component: (resolve) => require(["@/views/login/index.vue"], resolve),
  },
  layoutRoute,
];

setTimeout(() => {
  const routesArr = [...layoutRoute["children"], routes[1]].map(item => {
    item['meta']?.['title'] && (item['meta']['title'] = $i18n.t(item['meta']?.['title']) || '');
    return item;
  })
  isMicro &&
  sessionStorage.setItem(
    "limsRoutes",
    JSON.stringify(routesArr)
  );
},3000)
const router = new VueRouter({
  base: sys.publicPath,
  mode: "history",
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});
router.beforeEach(async (to, from, next) => {
  const query = JSON.parse(JSON.stringify(to.query));
  const { noAddMenu, noKeepAlive } = to.meta;
  const topmenus = store.getters.topmenus; //顶部所有菜单
  if (!noAddMenu && !noKeepAlive) {
    store.commit("SET_ALIVE", to.name); // keepAlive 是否缓存的字段

    //带参数的页面不缓存,  by bing
    if (Object.keys(query).length) {
      store.commit("SET_DELETE", to.name);
    }
    const topmenu = topmenus.find((item) => item.path === to.path);
    if (topmenu) {
      const pageQuery = topmenu.query;
      // 判断路由的query 跟缓存的query是否相同 ，相同就清除缓存，就是刷新
      const isKeepAlive =
        Object.entries(pageQuery).toString() ==
        Object.entries(query).toString();
      if (!isKeepAlive) store.commit("SET_DELETE", to.name);
    } else {
      // store.commit("SET_DELETE", to.name);
    }
  }
  let language = store.getters.language;
  let messages = $i18n.messages;
  let currentLocal = messages[language];
  const btnAuths = store.getters.btnAuths;
  if (Object.keys(currentLocal).length == 0) {
    await loadLanguageAsync();
  }

 // 首次进入页面或者不缓存页面，且需要加载私有化配置
 if (to.meta.refreshWords) {
  const resourceId =
    store.getters.routers.find((item) => {
      let url = sys.pathReplaceStr + to.path;
      return item.path === url;
    })?.id || "";
  if (resourceId) {
     await updateLanguageConfig({
      pageNum: 1,
      pageSize: 200,
      resourceId: resourceId,
      language: language,
    });
  }
}

  if (Array.isArray(btnAuths) || to.name == "login") {
    next();
  } else {
    store.dispatch("getPermissions").finally(() => {
      next();
    });
  }
});
router.afterEach((to, from) => {
  const { noAddMenu } = to.meta;
  const query = qs.parse(qs.stringify(to.query));
  const pathname = window.location.pathname;
  store.commit("SET_DEFAULTACTIVE", pathname);
  if (!noAddMenu) {
    // 为了取id和name
    const routeStr = window.location.pathname;
    let str1 = routeStr.split("").reverse().join("");
    const item = store.getters.routers.find((val) => {
      let str2 = val.path.split("").reverse().join("");
      return str1.indexOf(str2||110110) === 0;
    });
    const title = item ? item.name : $i18n.t(to.meta.title);
    let resourceId = "";
    if (item) {
      resourceId = item.id;
      store.commit("SET_RESOURCEID", item.id);
    }
    const menu = {
      path: to.path,
      pathname,
      ...to.meta,
      query,
      title,
      name: to.name,
      resourceId,
    };
    !window.__POWERED_BY_QIANKUN__ &&
      store.commit("SET_ADDTOPMENUS", JSON.parse(JSON.stringify(menu)));
  }
});

export default router;
