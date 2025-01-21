<template>
  <div class="master-sub-page">
    <!-- 查询表单 -->
    <ele-form-search
      :formConfig="formConfig"
      :initForm="initForm"
      @handleSearch="handleSearch"
      @handleReset="handleReset"
      ref="eleFormSearch"
      v-show="formSearchShow"
    ></ele-form-search>
    <!-- 主列表展示 -->
    <div ref="tableTop">
      <ele-table
        ref="masterTable"
        v-on="$listeners"
        v-bind="$attrs"
        :column="masterColumn"
        :getList="masterApi"
        :pagination="masterPagination"
        :beforeRequest="selfMasterBeforeRequest"
        :transFormdata="selfMasterTransFormdata"
        :maxHeight="maxHeight"
        @row-click="masterRowClick"
        @handleOperateEvent="handleOperateEvent"
        :initForm="initForm"
      >
      </ele-table>
    </div>

    <!-- 子列表展示 -->
    <ele-table
      ref="subTable"
      :column="subColumn"
      :getList="subApi"
      :beforeRequest="selfSubBeforeRequest"
      :transFormdata="selfSubTransFormdata"
      :apiImmediate="false"
      :maxHeight="maxHeight"
      :pagination="subPagination"
      :operateList="subOperateList"
      @handleOperateEvent="handleSubOperateEvent"
      :initForm="initForm"
    >
    </ele-table>
  </div>
</template>
<script>
import {
  addResizeListener,
  removeResizeListener,
} from "element-ui/src/utils/resize-event";
import eleFormSearch from "@/components/ele-form-search/index";
import { searchArrKey } from "@/mixins/searchArrKey";
import { exportExcel } from "@/utils/judge";
export default {
  name: "master-sub-page",
  components: { eleFormSearch },
  mixins: [searchArrKey],
  props: {
    formConfig: {
      type: Object,
      default: () => ({}),
    },
    // 主列表，列配置
    masterColumn: Array,
    // 主列表 ,请求以前的操作
    masterBeforeRequest: Function,
    // 主列表，api接口
    masterApi: Function,
    // 主列表，数据转化
    masterTransFormdata: Function,
    // 主表是否分页
    masterPagination: {
      type: Boolean,
      default: true,
    },
    // 子列表，列配置
    subColumn: Array,
    // 子列表 ,请求以前的操作
    subBeforeRequest: Function,
    // 子列表，api接口
    subApi: Function,
    // 子列表，数据转化
    subTransFormdata: Function,
    // 子表是否分页
    subPagination: {
      type: Boolean,
      default: true,
    },
    // 子表请求参数
    subRequestParams: {
      type: Object,
      default: () => {
        return {
          column: [],
        };
      },
    },
    //子表顶部按钮组
    subOperateList: Array,
    // 初始化时form的值
    initForm: Object,
  },
  data() {
    return {
      rowParams: {},
      maxHeight: 1,
      formSearchShow: true, // 如果column中有一列启用了，列搜索，便隐藏顶部搜索
    };
  },
  created() {
    if (this.masterColumn && Array.isArray(this.masterColumn) && this.masterColumn.length > 0) {
      this.masterColumn.forEach(item => {
        if (item.showColumnSearch) {
          this.formSearchShow = false
        }
      })
    }
  },
  methods: {
    // 搜索
    handleSearch() {
      this.$emit("handleSearch", this.getSearchParams());
      this.refresh(true);
    },
    // 重置
    handleReset() {
      this.$refs.eleFormSearch.formData = {};
      this.refresh(true);
      // 重置子表列表数据为空
      this.$refs.subTable.resetTableData();
      this.$emit("handleReset");
    },
    getSearchParams() {
      // let formData = this.$refs.eleFormSearch.formData || {};
      // let formData =
      //   this.$refs.eleFormSearch && this.$refs.eleFormSearch.formData
      //     ? this.$refs.eleFormSearch.formData
      //     : {};
      // formData = this.getArrtoMap(formData);
      // return formData;

      let formData =
        this.$refs.eleFormSearch && this.$refs.eleFormSearch.formData
          ? this.$refs.eleFormSearch.formData
          : {};
      const queryParam = !this.formSearchShow
        ? this.$refs.masterTable.queryParam
        : {};

      let newFormData = {
        ...formData,
        ...queryParam,
      };
      newFormData = this.getArrtoMap(newFormData);
      return newFormData;
    },
    // 主表，请求之前操作
    selfMasterBeforeRequest(data) {
      const list = { ...data, ...this.getSearchParams() };
      const params = this.masterBeforeRequest
        ? this.masterBeforeRequest(list)
        : list;
      return params;
    },
    // 子表，请求之前操作
    selfSubBeforeRequest(data) {
      const list = { ...data, ...this.rowParams };
      const params = this.subBeforeRequest ? this.subBeforeRequest(list) : list;
      return params;
    },
    // 主列表，数据转化
    selfMasterTransFormdata(data) {
      return this.masterTransFormdata
        ? this.masterTransFormdata(data)
        : Promise.resolve(data.data.result);
    },
    // 子列表，数据转化
    selfSubTransFormdata(data) {
      return this.subTransFormdata
        ? this.subTransFormdata(data)
        : Promise.resolve(data.data.result);
    },
    // 点击主表行
    masterRowClick(row) {
      this.getSubRequestParams(row);
      this.$refs.subTable.getTableData(true);
    },
    // 获取主表点击行参数，用于子表请求参数
    getSubRequestParams(data) {
      const { column, ...reset } = this.subRequestParams;
      const params = {};
      column.forEach(({ value, key }) => {
        const index = key || value;
        params[index] = data[value];
      });
      this.rowParams = { ...params, ...reset };
    },
    // 主表导出
    handleOperateEvent(data) {
      if (data.handleName === "export" && data.url) {
        exportExcel(data.url, this.getSearchParams());
      }
    },
    handleSubOperateEvent(data) {
      this.$emit("handleSubOperateEvent", data);
    },
    // 刷新主表
    refresh(isReset = true) {
      this.$nextTick(() => {
        this.$refs.masterTable.getTableData(isReset);
      });
    },
    // 刷新子表
    subRefresh(isReset = true) {
      this.$nextTick(() => {
        this.$refs.subTable.getTableData(isReset);
      });
    },
    inserted() {
      const appPage = document.getElementById("appPage");
      const isvertical = document.querySelector(
        "#scrollbar-main>.is-vertical>.el-scrollbar__thumb"
      );
      isvertical.style.display = "none";
      const _this = this;

      let paginationNum = 0;
      if (this.masterPagination) paginationNum++;
      if (this.subPagination) paginationNum++;
      let otherNum = 0;
      if (paginationNum == 2) otherNum = -60;
      appPage.resizeListener = async () => {
        const sumHeight =
          window.innerHeight -
          _this.$refs.tableTop.getBoundingClientRect().top -
          90 -
          otherNum -
          80 * paginationNum; //80为俩表格分页的高度

        _this.maxHeight = sumHeight / 2;
      };
      addResizeListener(appPage, appPage.resizeListener);
    },
  },
  mounted() {
    this.inserted();
  },
  beforeDestroy() {
    // 移除resize监听
    const appPage = document.getElementById("appPage");
    removeResizeListener(appPage, appPage.resizeListener);
    const isvertical = document.querySelector(
      "#scrollbar-main>.is-vertical>.el-scrollbar__thumb"
    );
    isvertical.style.display = "block";
  },
};
</script>
<style lang="scss" scoped></style>
