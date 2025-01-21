const keepAlive = {
  state: {
    keepAlive: []
  },
  mutations: {
    SET_ALIVE: (state, list) => {
      state.keepAlive.includes(list) ? null : state.keepAlive.push(list);
    },
    SET_DELETE: (state, name) => {
      state.keepAlive = state.keepAlive.filter(item => item !== name);
    },
    CLEAR_KEEPALIVE:(state) => {
      state.keepAlive = []
    }
  }
};

export default keepAlive;
