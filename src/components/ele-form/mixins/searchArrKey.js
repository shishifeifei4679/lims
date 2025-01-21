import { verifyFormat } from "../utils.js";
export default {
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
      const formData = JSON.parse(JSON.stringify(data));
      const map = this.searchArrKey;
      const keys = Object.keys(map);

      if (keys.length) {
        for (const key in map) {
          const formDataItem = formData?.[key] ?? { length: 0 };
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
      const list = this.formDesc;
      const obj = {};
      for (const key in list) {
        const item = list[key].attrs?.searchArrKey ?? { length: 0 };
        if (item.length) {
          obj[key] = item;
        }
      }
      this.searchArrKey = obj;
    },
    //插入字符串校验规则
    verifyFormat(item, callbacks) {
      let obj = null;
      if (item.type == "input" && item.validator) {
        obj = {
          validator: (rule, value, callback) => {
            setTimeout(() => {
              let str = verifyFormat(value, item.validator);
              if (item.required) {
                str? callback(str):callback();
              } else {
                if (value === "" || value == undefined|| value == null) {
                  callback();
                } else {
                  str? callback(str):callback();
                }
              }
            }, 100);
          },
          trigger: ["change", "blur"],
        };
        callbacks ? callbacks(obj) : "";
      }
    },
  },
  created() {
    this.setSearchArrKey();
  },
};
