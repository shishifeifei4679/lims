<template>
  <div v-loading="loading">
    <el-row
      ref="operateList"
      type="flex"
      :justify="justify"
      class="operateList"
    >
      <div v-if="operateList.length !== 0" class="btn-pack">
        <span v-for="(item, index) in operateList" :key="index" class="btn">
          <lb-render
            v-if="item.render"
            :render="item.render"
            :scope="multipleSelection"
          />
          <el-button
            v-else
            :type="item.type"
            :icon="item.icon"
            :class="item.class"
            @click="handleOperate(item)"
            :disabled="isDisabled(item)"
            v-btnAuths="item.auth"
            v-show="isShow(item)"
          >
            {{ item.name }}
          </el-button>
        </span>
      </div>
      <div class="operateIcon" v-if="isShowTool">
        <el-popover
          popper-class="column-search-popover"
          placement="right"
          width="850"
          trigger="hover"
          v-if="showColumnSearch"
        >
          <div class="column-search-block">
            <el-tabs v-model="activeName" type="card" size="mini">
              <el-tab-pane
                :label="$i18n.t('common.screeningCondition')"
                name="first"
              >
                <span slot="label">
                  <i class="el-icon-search"></i>
                  {{ $i18n.t("common.screeningCondition") }}
                  <!-- 筛选条件 -->
                </span>

                <div>
                  <el-table
                    :data="columnSearchListInUse"
                    border
                    style="width: 100%"
                    @row-click="searchFormSingleEdit"
                  >
                    <el-table-column
                      type="index"
                      width="40"
                      align="center"
                    ></el-table-column>
                    <el-table-column
                      prop="label"
                      :label="$i18n.t('common.columnName')"
                      width="180"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="value"
                      :label="$i18n.t('common.screeningCondition')"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="sort"
                      :label="$i18n.t('common.columnSort')"
                      width="100"
                      align="center"
                    >
                    </el-table-column>
                    <el-table-column
                      :label="$i18n.t('common.operation')"
                      width="100"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <i
                          @click="
                            searchFormSingleReset(scope.row, scope.$index)
                          "
                          style="color: red; cursor: pointer"
                          class="el-icon-delete"
                        ></i>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <i slot="reference" class="el-icon-search"></i>
        </el-popover>
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('common.reset')"
          placement="top"
        >
          <i class="el-icon-refresh-left" @click="searchFormReset"></i>
        </el-tooltip>
        <el-dropdown
          placement="bottom"
          @command="command"
          size="small"
          trigger="click"
        >
          <span class="el-dropdown-link">
            <i class="el-icon-finished"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="medium">{{
              $t("common.loose")
            }}</el-dropdown-item>
            <el-dropdown-item divided command="small">{{
              $t("common.default")
            }}</el-dropdown-item>
            <el-dropdown-item divided command="mini">{{
              $t("common.compact")
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('common.refresh')"
          placement="top"
        >
          <i class="el-icon-refresh" @click="getTableData(true)"></i>
        </el-tooltip>
        <el-popover placement="bottom" width="150" trigger="click">
          <config-column
            :column="column"
            :uniqueId="uniqueId"
            @changeColumn="changeColumn"
          ></config-column>
          <i class="el-icon-s-operation" slot="reference"></i>
        </el-popover>
      </div>
    </el-row>
    <div v-if="dataDisplay">
      <lb-table
        v-tableMaxHeight
        :column="selfColumn"
        :data="data"
        :border="border"
        :align="align"
        :pagination="pagination"
        :layout="pageSet"
        :page-sizes="pageSizes"
        :pager-count="pagerCount"
        :current-page.sync="selfCurrentPage"
        :total="total"
        :page-size="selfPageSize"
        v-bind="$attrs"
        v-on="$listeners"
        :height="selfMaxHeight"
        highlight-current-row
        background
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        @size-change="handleSizeChange"
        @p-current-change="handleCurrentChange"
        @sort-change="sortChange"
        @header-dragend="changeTableWidth"
        @row-click="rowClick"
        @column-search="columnSearch"
        :size="size"
        :stripe="true"
        :initForm="initForm"
      >
      </lb-table>
    </div>
    <el-empty v-else :description="$t('common.noFieldShow')"></el-empty>
  </div>
</template>

<script>
import lbTable from "@/components/lb-table/lb-table";
import lbRender from "@/components/lb-table/lb-render";
import configColumn from "./configColumn";
export default {
  name: "eleTable",
  components: { lbTable, configColumn, lbRender },
  props: {
    isShowTool: {
      type: Boolean,
      default: true,
    },
    // 表格唯一ID，配置列用
    uniqueId: [String, Number],
    // 接口函数是否立即执行
    apiImmediate: {
      type: Boolean,
      default: true,
    },
    align: {
      type: String,
      default: "center",
    },
    // 必须返回一个Promise
    // 列表数据的转化，某些时候请求后的数据不是我们想要的  仅接受一个Promise
    // return { records：Array,total:Number }

    /** 示例
    async transFormdata(data) {
    console.log(data);
   1.
    return Promise.resolve({
      records：Array,
      total:Number
    });
    2.
    const list = await 一个异步方法();
    return {records：Array,total:Number };
    },
      */
    // 数据转化函数
    transFormdata: {
      type: Function,
    },
    // 列表接口函数
    getList: {
      type: Function,
    },
    // 请求参数
    formData: {
      type: Object,
      default() {
        return {};
      },
    },
    // 操作列表数组
    operateList: {
      type: Array,
      default() {
        return [];
      },
    },

    // 列数据
    column: {
      type: Array,
      default() {
        return [];
      },
      required: true,
    },
    // 是否有边框
    border: {
      type: Boolean,
      default: true,
    },
    // 是否要分页
    pagination: {
      type: Boolean,
      default: true,
    },
    // 显示分页按钮的个数
    pagerCount: {
      type: Number,
      default: 5,
    },
    // 分页的字段
    pageSet: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper",
    },
    // 页长备选长度
    pageSizes: {
      type: Array,
      default() {
        return [10, 50, 100, 200];
      },
    },
    // // 页长
    pageSize: {
      type: Number,
      default: 10,
    },
    // 按钮组的位置
    justify: {
      type: String,
      default: "start",
    },
    ismock: {
      type: Boolean,
      default: false,
    },
    mockdata: {
      type: Object,
      default: () => {
        return {
          records: [],
          total: 0,
        };
      },
    },
    // 请求之前的钩子
    beforeRequest: Function,
    // 表格最大高度
    maxHeight: Number|String,
    //初始化时form的值
    initForm: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      queryParam: {}, // 请求参数
      selfCurrentPage: 1, // 当前页
      selfPageSize: 10, // 默认每页10条
      data: [], // 表格数据
      total: 0, // 总数
      multipleSelection: [],
      loading: false,
      selfMaxHeight: 0, // 最大高度
      size: "small",
      selfColumn: [],
      field: [], // 排序字段，
      sort: [], // 排序方式，asc正序，desc倒序
      dataDisplay: true,
      activeName: "first",
      columnSearchListInUse: [
        // {
        //   // label: "", 列名
        //   // value: "", 拼接后的搜索条件值
        //   // sort: "", 排序方式
        //   // columnKey: "", 列columnKey
        // },
      ], // 正在生效中的搜索条件list
      showColumnSearch: false, // 列搜索icon显示隐藏
    };
  },
  mounted() {
    if (this.apiImmediate && this.getList && !this.ismock) {
      this.initTable()
    } else {
      this.initTable(false)
      if (this.ismock) this.getMockData()
    }
  },
  updated() {
    this.$nextTick(() => {
      this.doLayout();
    });
  },

  computed: {
    // 按钮是否可点击
    isDisabled() {
      return function (item) {
        if (!item.disabled) return false;
        const disabled = item.disabled(this.multipleSelection);
        return disabled;
      };
    },
    // 按钮是否隐藏显示
    isShow() {
      return function (item) {
        const btnAuths = this.$store.getters.btnAuths || [];
        if (!item.auth || btnAuths.includes(item.auth)) {
          if (!item.show) return true;
          const show = item.show(this.multipleSelection);
          return show;
        } else {
          return false;
        }
      };
    },
  },
  methods: {
    // 初始化表格
    // isFetch 是否请求数据
    initTable(isFetch = true) {
      this.$nextTick(() => {
        this.getDefaultColumnSearch()

        isFetch && this.getTableData(true)

        this.$nextTick(() => {
          setTimeout(() => {
            this.getInUseSearchForm()
          }, 1000)
        })
      })
    },
    /**
     * @description 获取生效中的搜索条件list， 应该用searchFormConfirmed对象就是已经触发搜索的条件
     */
    getInUseSearchForm() {
      const columnList =
        this.$refs.multipleTable &&
        this.$refs.multipleTable.$refs.elTable &&
        this.$refs.multipleTable.$refs.elTable.$children
          ? this.$refs.multipleTable.$refs.elTable.$children
          : [];
      const dateList = ["timePicker", "datePicker", "dateTimePicker", "number"];
      const sortSwitch = {
        asc: $i18n.t("common.ascendingArrangement"),
        desc: $i18n.t("common.descendingArrangement"),
      };

      const columnSearchListInUse = [];
      columnList.forEach((item) => {
        if (item.searchFormConfirmed && item.searchFormConfirmed.columnKey) {
          const newObj = {
            label: item._props.column.label,
            value: "",
            sort: "",
            columnKey: item.searchFormConfirmed.columnKey,
          };

          // 有value值的用value值，没有value值的用defaultValue，在没有的就不管
          if (
            item.searchFormConfirmed.value === "" ||
            (Array.isArray(item.searchFormConfirmed.value) &&
              item.searchFormConfirmed.value.length == 0)
          ) {
            item.searchFormConfirmed.value = item.searchFormConfirmed
              .defaultValue
              ? item.searchFormConfirmed.defaultValue
              : item.searchFormConfirmed.value;
          }

          const sortNew = item.searchFormConfirmed.sort || "";
          newObj.sort = sortSwitch[sortNew] || $i18n.t("common.columnNoSort");

          // 日期的搜索条件需要单独处理，拼接min max
          if (dateList.includes(item.searchFormConfirmed.type)) {
            if (Array.isArray(item.searchFormConfirmed.value)) {
              if (item.searchFormConfirmed.value.length > 0) {
                const min = item.searchFormConfirmed.value[0];
                const max = item.searchFormConfirmed.value[1];
                newObj.value = $i18n.t("common.columnTip3", {
                  min: min || '-',
                  max: max || '-',
                }); // `大于${min}小于${max}`;
              } else {
                newObj.value = $i18n.t("common.columnNoSort");
              }
            } else {
              newObj.value = item.searchFormConfirmed.value;
            }
          } else {
            // 其他类型搜索条件，数组转字符串、字符串不变
            // if (item.searchFormConfirmed.type == "input") {
            if (!Array.isArray(item.searchFormConfirmed.value)) {
              // 单选value编码转label
              if (
                item.searchFormConfirmed.type == "radio" &&
                newObj.value != $i18n.t("common.columnNoSort")
              ) {
                let labelSwitch = "";
                const optionProp = item.$options.propsData.column
                  .optionProp || {
                  label: "label",
                  value: "value",
                };

                item.selectList.forEach((itemOptions) => {
                  if (
                    item.searchFormConfirmed.value ==
                    itemOptions[optionProp.value]
                  ) {
                    labelSwitch = itemOptions[optionProp.label];
                  }
                });

                newObj.value =
                  labelSwitch != ""
                    ? $i18n.t("common.columnTip2", {
                        data: labelSwitch,
                      })
                    : $i18n.t("common.columnNoSort"); // 无  `包含${item.searchFormConfirmed.value}`
              } else {
                newObj.value =
                  item.searchFormConfirmed.value != "" &&
                  item.searchFormConfirmed.value != undefined
                    ? $i18n.t("common.columnTip2", {
                        data: item.searchFormConfirmed.value,
                      })
                    : $i18n.t("common.columnNoSort"); // 无  `包含${item.searchFormConfirmed.value}`
              }
            } else {
              const newObjValueLabel = [];
              const checkboxVal = Array.isArray(item.searchFormConfirmed.value)
                ? JSON.parse(JSON.stringify(item.searchFormConfirmed)).value
                : [];

              if (item.searchFormConfirmed.type == "tree") {
                // 处理树形结构
                this.selectListTree(
                  item.selectList,
                  checkboxVal,
                  newObjValueLabel,
                  item
                );
              } else {
                item.selectList.forEach((itemOptions) => {
                  const optionProp = item.$options.propsData.column
                    .optionProp || {
                    label: "label",
                    value: "value",
                  };
                  if (checkboxVal.includes(itemOptions[optionProp.value])) {
                    newObjValueLabel.push(itemOptions[optionProp.label]);
                  }
                });
              }

              newObj.value =
                newObjValueLabel.length > 0
                  ? newObjValueLabel.length > 1
                    ? $i18n.t("common.columnTip1", {
                        data: newObjValueLabel.join("、"),
                      })
                    : $i18n.t("common.columnTip4", {
                        data: newObjValueLabel.join("、"),
                      })
                  : $i18n.t("common.columnNoSort"); // `等于${newVal}中的任意一条`
            }
          }

          if (
            (newObj.value != "" &&
              newObj.value != $i18n.t("common.columnNoSort")) ||
            (newObj.sort != $i18n.t("common.columnNoSort") && newObj.sort != "")
          ) {
            columnSearchListInUse.push(newObj);
          }
        }
      });

      this.columnSearchListInUse = columnSearchListInUse;
    },

    /**
     * @description 处理tree树形结构数据
     */
    selectListTree(selectList, checkboxVal, newObjValueLabel, item) {
      selectList.forEach((itemOptions) => {
        const optionProp = item.$options.propsData.column.optionProp || {
          label: "label",
          value: "value",
        };
        if (checkboxVal.includes(itemOptions[optionProp.value])) {
          newObjValueLabel.push(itemOptions[optionProp.label]);
        }
        if (itemOptions.children) {
          this.selectListTree(
            itemOptions.children,
            checkboxVal,
            newObjValueLabel,
            item
          );
        }
      });
    },

    /**
     * @description 获取列搜索条件中的默认值
     */
    getDefaultColumnSearch() {
      const columnList =
        this.$refs.multipleTable &&
        this.$refs.multipleTable.$refs.elTable &&
        this.$refs.multipleTable.$refs.elTable.$children
          ? this.$refs.multipleTable.$refs.elTable.$children
          : [];
      const dateList = ["timePicker", "datePicker", "dateTimePicker", "number"];
      const fieldList = !!this.queryParam.field
        ? JSON.parse(JSON.stringify(this.queryParam)).field.split(",")
        : [];
      const sortList = !!this.queryParam.sort
        ? JSON.parse(JSON.stringify(this.queryParam)).sort.split(",")
        : [];

      columnList.forEach((item) => {
        if (!!item.showColumnSearch) {
          this.showColumnSearch = true; // true显示表格右上角的搜索icon
        }

        if (item.searchForm && item.searchForm.columnKey) {
          // 有value值的用value值，没有value值的用defaultValue，在没有的就不管
          if (
            item.searchForm.value === "" ||
            (Array.isArray(item.searchForm.value) &&
              item.searchForm.value.length == 0)
          ) {
            item.searchForm.value = item.searchForm.defaultValue
              ? item.searchForm.defaultValue
              : item.searchForm.value;
          }

          // 树重置需要 setCheckedKeys()
          if (item.searchForm.type == "tree") {
            item.$refs.treeSearch.setCheckedKeys(item.searchForm.value || []);
          }

          const sortNew = item.searchForm.sort || "";
          const fieldNew = !!item.searchForm.sort
            ? item.searchForm.columnKey
            : "";

          // 日期的搜索条件需要单独处理，拼接min max
          if (dateList.includes(item.searchForm.type)) {
            if (Array.isArray(item.searchForm.value)) {
              const min = item.searchForm.columnKey + "Min";
              const max = item.searchForm.columnKey + "Max";
              this.queryParam[min] =
                item.searchForm.value.length > 0
                  ? item.searchForm.value[0]
                  : undefined;
              this.queryParam[max] =
                item.searchForm.value.length > 0
                  ? item.searchForm.value[1]
                  : undefined;

              if (sortNew) {
                const keyIndex = fieldList.indexOf(fieldNew);
                if (keyIndex != -1) {
                  sortList[keyIndex] = sortNew;
                } else {
                  sortList.push(sortNew);
                  fieldList.push(fieldNew);
                }
              } else if (fieldNew) {
                const keyIndex = fieldList.indexOf(fieldNew);

                if (keyIndex != -1) {
                  sortList.splice(keyIndex, 1);
                  fieldList.splice(keyIndex, 1);
                }
              }
            } else {
              this.queryParam[item.searchForm.columnKey] =
                item.searchForm.value;
              const min = item.searchForm.columnKey + "Min";
              const max = item.searchForm.columnKey + "Max";
              this.queryParam[min] = undefined;
              this.queryParam[max] = undefined;
            }
          } else {
            // 其他类型搜索条件，数组转字符串、字符串不变
            this.queryParam[item.searchForm.columnKey] = Array.isArray(
              item.searchForm.value
            )
              ? item.searchForm.value.length > 0
                ? item.searchForm.value.join()
                : undefined
              : item.searchForm.value || undefined;

            if (sortNew) {
              const keyIndex = fieldList.indexOf(fieldNew);
              if (keyIndex != -1) {
                sortList[keyIndex] = sortNew;
              } else {
                sortList.push(sortNew);
                fieldList.push(fieldNew);
              }
            } else if (fieldNew) {
              const keyIndex = fieldList.indexOf(fieldNew);
              if (keyIndex != -1) {
                sortList.splice(keyIndex, 1);
                fieldList.splice(keyIndex, 1);
              }
            }
          }
          // 将searchForm.value 转换为 valueText用于快捷清空的显示
          item.valueChange(item.searchForm.value, item.searchForm.type);
          // 这是为了保持搜索按钮的图标正确显示
          item.searchFormConfirmed = JSON.parse(
            JSON.stringify(item.searchForm)
          );
        }
      });

      this.queryParam.sort = sortList.join();
      this.queryParam.field = fieldList.join();
    },

    /**
     * @description 每列header上的快捷搜索
     */
    columnSearch(data, refresh = true) {
      const field = !!this.queryParam.field
        ? this.queryParam.field.split(",")
        : [];
      const sort = !!this.queryParam.sort
        ? this.queryParam.sort.split(",")
        : [];
      const fieldNew = JSON.parse(JSON.stringify(data)).field;
      const sortNew = JSON.parse(JSON.stringify(data)).sort;
      if (data.sort) {
        const keyIndex = field.indexOf(fieldNew);
        if (keyIndex != -1) {
          sort[keyIndex] = sortNew;
        } else {
          field.push(fieldNew);
          sort.push(sortNew);
        }
      } else if (data.field) {
        const keyIndex = field.indexOf(fieldNew);
        if (keyIndex != -1) {
          sort.splice(keyIndex, 1);
          field.splice(keyIndex, 1);
        }
      }
      delete data.field;
      delete data.sort;

      this.queryParam = {
        ...this.queryParam,
        ...data,
        field: field.join(),
        sort: sort.join(),
      };

      this.getInUseSearchForm();
      if (refresh) {
        this.getTableData(true);
      }
    },

    /**
     * @description 重置全部列搜索条件
     */
     searchFormReset(refresh = true) {
      // const columnList = this.$refs.multipleTable.$refs.elTable.$children || [];
      const columnList =
        this.$refs.multipleTable && this.$refs.multipleTable.$refs.elTable && this.$refs.multipleTable.$refs.elTable.$children
          ? this.$refs.multipleTable.$refs.elTable.$children
          : []
      columnList.forEach((item) => {
        if (item.searchForm && ((item.searchForm.value !== '' && item.searchForm.value !== undefined && item.searchForm.value !== null) || item.searchForm.sort)) {
          item.searchForm.value = item.searchForm.defaultValue ? item.searchForm.defaultValue : item.searchForm.value !== '' && Array.isArray(item.searchForm.value) ? [] : ''
          item.searchForm.sort = ''
          item.searchForm.field = ''

          // 这里重置是为了重置icon状态，searchFormConfirmed保持和searchForm一致
          item.searchFormConfirmed.value = Array.isArray(item.searchFormConfirmed.value) ? [] : ''
          item.searchFormConfirmed.sort = ''
          item.searchFormConfirmed.field = ''
        }
      })
      this.queryParam = JSON.parse(JSON.stringify(this.formData))
      this.getDefaultColumnSearch()
      if (refresh) {
        this.getTableData(true)
      }
      this.getInUseSearchForm()
    },

    /**
     * @description 重置某列搜索条件
     */
    searchFormSingleReset(row, index) {
      // const columnList = this.$refs.multipleTable.$refs.elTable.$children || [];
      const columnList =
        this.$refs.multipleTable &&
        this.$refs.multipleTable.$refs.elTable &&
        this.$refs.multipleTable.$refs.elTable.$children
          ? this.$refs.multipleTable.$refs.elTable.$children
          : [];
      columnList.forEach((item) => {
        if (
          item.searchForm &&
          !!item.searchForm.columnKey &&
          item.searchForm.columnKey == row.columnKey
        ) {
          item.searchForm.value = Array.isArray(item.searchForm.value)
            ? []
            : "";
          item.searchForm.sort = "";
          item.searchForm.field = "";

          // 这里重置是为了重置icon状态，searchFormConfirmed保持和searchForm一致
          item.searchFormConfirmed.value = Array.isArray(
            item.searchFormConfirmed.value
          )
            ? []
            : "";
          item.searchFormConfirmed.sort = "";
          item.searchFormConfirmed.field = "";
        }
      });
      this.queryParam = JSON.parse(JSON.stringify(this.formData));

      this.$nextTick(() => {
        this.getDefaultColumnSearch();
        this.getTableData(true);

        this.$nextTick(() => {
          setTimeout(() => {
            this.getInUseSearchForm();
          }, 1000);
        });
      });
    },

    /**
     * @description 通过生效中的搜索条件表格中的操作，定位某列的搜索
     */
    searchFormSingleEdit(row, cloumn, event) {
      if (cloumn.label == $i18n.t("common.operation")) return; // 操作列禁止生肖

      const columnList =
        this.$refs.multipleTable &&
        this.$refs.multipleTable.$refs.elTable &&
        this.$refs.multipleTable.$refs.elTable.$children
          ? this.$refs.multipleTable.$refs.elTable.$children
          : [];
      columnList.forEach((item) => {
        if (
          item.searchForm &&
          !!item.searchForm.columnKey &&
          item.searchForm.columnKey == row.columnKey
        ) {
          // const refObj = item.columnSearchBtnRef; // lb-column回传的搜索图标的dom实例
          // const refObjParentNode =
          //   refObj.parentNode.parentNode.parentNode.parentNode.parentNode; // lb-column回传的搜索图标的父级节点 th呢一层，用于判断定位
          // const columnOffsetLeft = refObjParentNode.offsetLeft; // 当前列距离table容器起点的位置
          let refObj = item.columnSearchBtnRef; // lb-column回传的搜索图标的dom实例
          let refObjParentNode = "";
          let columnOffsetLeft = "";
          if (refObj) {
            refObjParentNode =
              refObj.parentNode.parentNode.parentNode.parentNode.parentNode; // lb-column回传的搜索图标的父级节点 th呢一层，用于判断定位
            columnOffsetLeft = refObjParentNode.offsetLeft; // 当前列距离table容器起点的位置
          }
          const lbTableWidth = this.$refs.multipleTable.$el.offsetWidth; // table容器的宽度

          // 表格总长度
          // const tableWidth =
          //   this.$refs.multipleTable.$refs.elTable.$el.getElementsByClassName(
          //     "el-table__header"
          //   ) &&
          //   this.$refs.multipleTable.$refs.elTable.$el.getElementsByClassName(
          //     "el-table__header"
          //   ).length > 0
          //     ? this.$refs.multipleTable.$refs.elTable.$el.getElementsByClassName(
          //         "el-table__header"
          //       )[0].offsetWidth
          //     : 0;

          // 要滚动条滚动的目标区域dom
          const scrollTarget =
            this.$refs.multipleTable.$refs.elTable.$el.getElementsByClassName(
              "el-table__body-wrapper"
            ) &&
            this.$refs.multipleTable.$refs.elTable.$el.getElementsByClassName(
              "el-table__body-wrapper"
            ).length > 0
              ? this.$refs.multipleTable.$refs.elTable.$el.getElementsByClassName(
                  "el-table__body-wrapper"
                )[0]
              : undefined;

          const tableHeader = document
            .getElementById("appPage")
            .getElementsByClassName("el-table__header-wrapper"); // 页面appPage容器下的table对象 html对象

          Array.from(tableHeader).forEach((itemTableHeader) => {
            Array.from(
              itemTableHeader.getElementsByClassName("el-table__cell")
            ).forEach((itemTableCell) => {
              if (
                itemTableCell.getElementsByClassName("column-search-btn") &&
                itemTableCell.getElementsByClassName("column-search-btn")
                  .length > 0 &&
                itemTableCell
                  .getElementsByClassName("column-search-btn")[0]
                  .getAttribute("data-id") == item.columnSearchBtnUuidv4
              ) {
                scrollTarget.scrollLeft =
                  lbTableWidth < columnOffsetLeft
                    ? columnOffsetLeft - lbTableWidth + lbTableWidth / 2
                    : 0; // 计算滚动位置
                // 延迟点击
                setTimeout(() => {
                  itemTableCell
                    .getElementsByClassName("column-search-btn")[0]
                    .click();
                }, 300);
              }
            });
          });
        }
      });
    },

    rowClick(row) {
      // const selected = this.multipleSelection.some(
      //   (item) => item.selectId === row.selectId
      // );
      // if (!selected) {
      //   this.multipleSelection.push(row);
      //    this.$refs["multipleTable"].toggleRowSelection(row, true);
      //  } else {
      //    var filArr = this.multipleSelection.filter((item) => {
      //      return item.selectId !== row.selectId;
      ////    });
      //    this.multipleSelection = filArr; // 取消后剩余选中的
      //    this.$refs["multipleTable"].toggleRowSelection(row, false);
      //  }
    },
    changeTableWidth() {
      this.$nextTick(() => {
        this.doLayout();
      });
    },
    getMockData() {
      const { records = [], total } = this.mockdata;
      this.data = records.map((ite, index) => {
        return { ...ite, selectId: index };
      });
      this.total = total || 0;
    },
    // 重置列表数据
    resetTableData() {
      this.data = [];
      this.total = 0;
      this.selfCurrentPage = 1;
    },
    /**
     * @description table表格列表数据调用
     */
    getTableData(isReset) {
      if (isReset) {
        this.selfCurrentPage = 1;
      }
      const getParams = {
        pageNum: this.selfCurrentPage,
        pageSize: this.selfPageSize,
        field: this.field.join(","),
        sort: this.sort.join(","),
        ...this.queryParam,
      };
      const data = this.beforeRequest
        ? { ...this.beforeRequest(getParams) }
        : getParams;
      this.loading = true;
      setTimeout(() => {
        this.getList(data)
          .then((res) => {
            if (this.transFormdata) {
              this.transFormdata(res)
                .then((params) => {
                  const { records = [], total } = params;

                  this.data = records.map((ite, index) => {
                    return { ...ite, selectId: index };
                  });
                  this.total = +total || 0;
                })
                .finally(() => {
                  this.loading = false;
                });
            } else {
              if (!this.pagination) {
                this.data = res.data.result
              } else {
                const { records = [], total } = res.data.result
                this.data = records.map((ite, index) => {
                  return { ...ite, selectId: index }
                })
                this.total = +total || 0
              }
            }
          })
          .finally(() => {
            if (!this.transFormdata) {
              this.loading = false;
            }
            this.changeTableWidth();
          });
      });
    },
    // 点击页码
    handleCurrentChange(val) {
      this.selfCurrentPage = val;
      this.getTableData();
    },
    // 点击每页展示几天数据
    handleSizeChange(val) {
      this.selfCurrentPage = 1;
      this.selfPageSize = val;
      this.getTableData();
    },
    // 按钮事件处理
    handleOperate(item) {
      const data = {
        ...item,
      };
      if (item.isSingle && this.multipleSelection.length != 1) {
        this.$message.error(this.$t("common.single"));
        return;
      }
      if (item.isMultiple && this.multipleSelection.length == 0) {
        this.$message.error(this.$t("common.multiple"));
        return;
      }

      data.rows = JSON.parse(JSON.stringify(this.multipleSelection));

      this.$emit("handleOperateEvent", data);
    },
    // 排序
    sortChange({ column, prop, order }) {
      if (typeof column.sortable === "boolean") return;
      const sort = { ascending: "asc", descending: "desc" };
      const index = this.field.indexOf(prop);
      if (order) {
        // splice
        if (index > -1) {
          this.$set(this.sort, index, sort[order]);
        } else {
          this.field.push(prop);
          this.sort.push(sort[order]);
        }
      } else {
        this.field.splice(index, 1);
        this.sort.splice(index, 1);
      }
      this.getTableData(true);
    },
    handleSelectionChange(rows) {
      this.multipleSelection = rows;
    },
    clearSelection() {
      this.$refs.multipleTable.clearSelection();
    },
    doLayout() {
      this.$refs.multipleTable.doLayout();
    },
    command(size) {
      this.size = size;
      this.$nextTick(() => {
        this.doLayout();
      });
    },
    // 列改变时触发
    changeColumn(data) {
      this.dataDisplay = data.length > 0;
      if (this.dataDisplay) {
        let list = data.filter((ite) => !ite.type);
        let { width, minWidth } = data[data.length - 1];
        if (list.findIndex((ite) => !ite.width && !ite.minWidth) == -1) {
          delete data[data.length - 1].width;
          data[data.length - 1].minWidth = width || minWidth;
        }
        this.selfColumn = data;
        this.$nextTick(() => {
          this.doLayout();
        });
      }
    },
  },
  watch: {
    pageSize: {
      handler(val) {
        this.selfPageSize = val;
      },
      immediate: true,
    },
    formData: {
      handler(val) {
        this.queryParam = val; // JSON.parse(JSON.stringify(val));
      },
      immediate: true,
      deep: true,
    },
    maxHeight: {
      handler(val) {
        if (!val) return;
        this.selfMaxHeight = val;
      },
      immediate: true,
    },
    column: {
      handler(val) {
        if (!val) return;
        this.selfColumn = val;
      },
      immediate: true,
      deep: true,
    },
    initForm: {
      handler(val) {
        this.initTable(false)
      },
      deep: true
    }
  },
};
</script>

<style lang="scss" scoped>
.operateList {
  // margin-bottom: 10px; //bing
}
.btn-pack {
  display: flex;
  flex-wrap: wrap;
}
.btn {
  margin-right: 10px;
  margin-bottom: 10px;
}
.operateIcon {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 10px;
  height: 32px;
  margin-bottom: 10px;

  i {
    font-size: 20px;
    margin-left: 15px;
    font-weight: 550;
    cursor: pointer;
    color: #333333;
  }

  & > span,
  & > div {
    height: 20px;
  }
}

.column-search-block {
  /deep/.el-tabs {
    .el-tabs__item {
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      padding: 0 10px;
    }

    .el-tabs__header {
      margin-bottom: 0;
    }

    .el-tabs__content {
      border: 1px solid #e4e7ed;
      border-top: 0;
      padding: 15px 10px 15px 10px;
    }
  }
}
</style>
