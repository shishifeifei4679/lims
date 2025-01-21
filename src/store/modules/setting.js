import { getUnreadNum } from "@/api/message";
const setting = {
  state: {
    isShowMerge: false, // 展开,折上,按钮 状态管理
    indexActive: null, // 上方下标
    isTwinkle: false, //消息闪烁
    unreadNum: 0,
    isShowTopMenu: true,
    refreshKey:1,
  },
  mutations: {
    SET_ISSHOWMERGE: (state, bool) => {
      state.isShowMerge = bool;
    },
    SET_ISTWINKLE: (state, bool) => {
      state.isTwinkle = bool;
    },
    SET_INDEXACTIVE: (state, index) => {
      state.indexActive = index;
    },
    SET_ISSHOWTOPMENU: (state, bool) => {
      state.isShowTopMenu = bool;
    },
    SET_UNREADNUM: (state, num = 0) => {
      state.unreadNum = num;
    },
    SET_REFRESH_KEY: (state, refreshKey) => {
      state.refreshKey = refreshKey;
    },
  },
  actions: {
    // 用户信息
    GetUnreadNum({ commit }) {
      return new Promise((resolve, reject) => {
        getUnreadNum()
          .then((res) => {
            const { result } = res.data;
            commit("SET_UNREADNUM", result);
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
  getters: {},
};

export default setting;
