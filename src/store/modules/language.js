const language = {
  state: {
    language: "cn",
  },
  mutations: {
    SET_LANGUAGE: (state, language = "cn") => {
      state.language = language;
    },
  },
};

export default language;
