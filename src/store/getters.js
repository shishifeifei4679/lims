const getters = {
  token: (state) => state.user.token,
  userInfo: (state) => state.user.userInfo,
  menus: (state) => state.user.menus,
  topmenus: (state) => state.user.topmenus,
  defaultActive: (state) => state.user.defaultActive,
  resourceId: (state) => state.user.resourceId,
  isShowMerge: (state) => state.setting.isShowMerge,
  leftMenus: (state) => state.user.leftMenus,
  indexActive: (state) => state.setting.indexActive,
  isShowTopMenu: (state) => state.setting.isShowTopMenu,
  btnAuths: (state) => state.btnAuth.btnAuth,
  avatar: (state) => state.user.avatar,
  factoryCode: (state) => state.user.factoryCode,
  routers: (state) => state.user.routers,
  isTwinkle: (state) => state.setting.isTwinkle,
  unreadNum: (state) => state.setting.unreadNum,
  keepAlive: (state) => state.keepAlive.keepAlive,
  language: (state) => state.language.language,
  logos: (state) => state.user.logos,
  titles: (state) => state.user.titles,
  routersFolt: (state) => state.user.routersFolt,
  twoTitle: (state) => state.user.twoTitle,
  refreshKey: (state) => state.setting.refreshKey,
};
export default getters;
