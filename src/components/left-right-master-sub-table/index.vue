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
    <div class="tableLayout">
      <!-- 主列表展示 -->
      <div :style="leftStyle" class="leftTable">
        <ele-table
          ref="masterTable"
          v-on="$listeners"
          v-bind="$attrs"
          :column="masterColumn"
          :getList="masterApi"
          :pagination="masterPagination"
          :beforeRequest="selfMasterBeforeRequest"
          :transFormdata="selfMasterTransFormdata"
          @row-click="masterRowClick"
          @handleOperateEvent="handleMasterOperateEvent"
          :initForm="initForm"
        >
        </ele-table>
      </div>
      <div :style="rightStyle" class="rightTable">
        <!-- 子列表展示 -->
        <ele-table
          ref="subTable"
          :column="subColumn"
          :getList="subApi"
          :beforeRequest="selfSubBeforeRequest"
          :transFormdata="selfSubTransFormdata"
          :apiImmediate="false"
          :pagination="subPagination"
          :operateList="subOperateList"
          @handleOperateEvent="handleOperateEvent"
          :initForm="initForm"
        >
        </ele-table>
      </div>
    </div>
  </div>
</template>
<script>
import eleFormSearch from "@/components/ele-form-search/index";
import { searchArrKey } from "@/mixins/searchArrKey";
import { exportExcel } from "@/utils/judge";
export default {
  name: "lr-master-sub-page",
  mixins: [searchArrKey],
  components: { eleFormSearch },
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
    // 初始化时form的值
    initForm: Object,
    // 左边表格宽度，右边自适应
    leftWidth: {
      type: [Number, String],
      default: 50,
    },
    subOperateList: Array,
  },
  data() {
    return {
      rowParams: {},
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
  computed: {
    clientWidth() {
      return document.body.clientWidth;
    },
    leftStyle() {
      return {
        width: `${this.leftWidth}%`,
      };
    },
    rightStyle() {
      return {
        width: `${100 - this.leftWidth}%`,
      };
    },
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
    // 获取搜索参数
    getSearchParams() {
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
    // 主表顶部操作方法
    handleMasterOperateEvent(data) {
      if (data.handleName === "export" && data.url) {
        exportExcel(data.url, this.getSearchParams());
      }
    },
    // 子表顶部操作方法
    handleOperateEvent(data) {
      if (data.handleName === "export" && data.url) {
        exportExcel(data.url);
      }
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
  },
};
</script>
<style lang="scss" scoped>
.tableLayout {
  display: flex;
  .leftTable {
    border-right: solid 10px #eff2fb;
    box-sizing: border-box;
    padding-right: 10px;
  }
  .rightTable {
    padding-left: 10px;
    box-sizing: border-box;
  }
}
</style>
