<template>
  <div class="xpage">
    <!-- 查询表单 -->
    <ele-form-search
      :formConfig="formConfig"
      :initForm="initForm"
      @handleSearch="handleSearch"
      @handleReset="handleReset"
      ref="eleFormSearch"
      v-show="formSearchShow"
    ></ele-form-search>
    <!-- 列表展示 -->
    <ele-table
      ref="xTable"
      v-bind="$attrs"
      v-on="$listeners"
      :beforeRequest="beforeRequest"
      @handleOperateEvent="handleOperateEvent"
      :initForm="initForm"
    ></ele-table>
  </div>
</template>
<script>
import eleFormSearch from "@/components/ele-form-search/index";
import { searchArrKey } from "@/mixins/searchArrKey";
import { exportExcel } from "@/utils/judge";
export default {
  inheritAttrs: false,
  name: "xpage",
  mixins: [searchArrKey],
  components: { eleFormSearch },
  props: {
    formConfig: {
      type: Object,
      default: () => ({}),
    },
    beforeAjax: Function,
    //初始化时form的值
    initForm: {
      type: Object,
      default: () => ({}),
    },
    //其他参数
    otherParams: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      formSearchShow: true, // 如果column中有一列启用了，列搜索，便隐藏顶部搜索
    };
  },
  created() {
    if (
      this.$attrs &&
      this.$attrs.column &&
      Array.isArray(this.$attrs.column) &&
      this.$attrs.column.length > 0
    ) {
      this.$attrs.column.forEach((item) => {
        if (item.showColumnSearch) {
          this.formSearchShow = false;
        }
      });
    }
  },
  methods: {
    handleSearch() {
      const { handleSearch } = this.$listeners;
      handleSearch
        ? this.$emit("handleSearch", this.getSearchParams())
        : this.refresh(true);
    },
    handleReset() {
      const { handleReset } = this.$listeners;
      handleReset ? this.$emit("handleReset") : this.refresh(true);
    },
    getSearchParams() {
      // let formData = this.$refs.eleFormSearch.formData || {};
      let formData =
        this.$refs.eleFormSearch && this.$refs.eleFormSearch.formData
          ? this.$refs.eleFormSearch.formData
          : {};
      const queryParam = !this.formSearchShow
        ? this.$refs.xTable.queryParam
        : {};
      let newFormData = {
        ...formData,
        ...queryParam,
      };
      // formData = this.getArrtoMap(formData);
      newFormData = this.getArrtoMap(newFormData);
      return newFormData;
    },
    beforeRequest(data) {
      // let formData = this.$refs.eleFormSearch.formData || {};
      let formData =
        this.$refs.eleFormSearch && this.$refs.eleFormSearch.formData
          ? this.$refs.eleFormSearch.formData
          : {};
      const queryParam = !this.formSearchShow
        ? this.$refs.xTable.queryParam
        : {};
      let newFormData = {
        ...formData,
        ...queryParam,
      };
      newFormData = this.getArrtoMap(newFormData);
      // formData = this.getArrtoMap(formData);
      const params = { ...data, ...this.otherParams, ...newFormData };
      return this.beforeAjax ? this.beforeAjax(params) : params;
    },
    refresh(isReset = true) {
      this.$nextTick(() => {
        this.$refs.xTable.getTableData(isReset);
      });
    },
    handleOperateEvent(data) {
      if (data.handleName === "export" && data.url) {
        const params = { ...this.getSearchParams(), ...this.otherParams };
        exportExcel(data.url, params);
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
