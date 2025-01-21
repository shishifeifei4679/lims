export const searchArrKey = {
  data() {
    return {
      searchArrKey: {},
    };
  },
  methods: {
    /**
     * @description 查询条件,key为数组,赋值给单个字段
     * @author bing
     * @date 2022-01-27 11:08
     * @param {Object} data
     */
    getArrtoMap(data) {
      let formData = JSON.parse(JSON.stringify(data));
      let map = this.searchArrKey;
      let keys = Object.keys(map);

      if (keys.length) {
        for (let key in map) {
          let formDataItem = formData?.[key] ?? { length: 0 };
          if (formDataItem.length) {
            map[key].map((ite, index) => {
              formData[ite] = formData[key][index];
              if (index + 1 == map[key].length) {
                delete formData[key];
              }
            });
          }
        }
        return formData;
      } else {
        return formData;
      }
    },
    /**
     * @description 查找是否有需要,数组赋值单个变量,为了,查询条件(日期等),赋值给单个变量查询
     * @author bing
     * @date 2022-01-27 10:51
     */
    setSearchArrKey() {
      let list = this.formConfig.formDesc;
      let obj = {};

      for (let key in list) {
        let item = list[key].attrs?.searchArrKey ?? { length: 0 };
        if (item.length) {
          obj[key] = item;
        }
      }
      this.searchArrKey = obj;
    },
  },
  created() {
    this.setSearchArrKey();
  },
};
