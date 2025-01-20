<template>
  <div>
    <div class="lims-container">
      <el-tabs v-model="activeNameTop" type="card" @tab-click="handleClickTop">
        <el-tab-pane
          :label="$t('limsMeasuringToolsLedgerCollectReturn.all')"
          name="-1"
        ></el-tab-pane>
        <el-tab-pane
          :label="`${ite.description}`"
          v-for="(ite, i) in statusList"
          :key="i"
          :name="ite.value"
        ></el-tab-pane>
      </el-tabs>
      <ele-tree-composite-table leftWidth="300px"
      :showDrag="true"
        v-loading="loading"
        :formConfig="searchConfig"
        :operateList="operateList"
        @handleOperateEvent="handleOperateEvent"
        :column="column"
        :otherParams="{
          collectReturnStatus: activeNameTop == '-1' ? '' : activeNameTop,
        }"
        :props="{ label: 'name' }"
        :getList="getList"
        ref="treeCompositeTable"
        row-key="id"
        :apiImmediate="false"
        :defaultSelection="true"
        :getParamsFromNode="getParamsFromNode"
        :treeApi="getDepartmentCodeTree"
        uniqueId="commonMeasuringtoolscollectreturnTable"
      >
        <template v-slot:default="{ data }">
          <div>
            <div class="flex label-pack">
              <span class="padd-r-5">
                <img v-if="data.data.children" src="@/assets/images/xia.png" />
                <img v-else src="@/assets/images/ping.png" />
              </span>

              <span class="tree-label">{{ data.node.label }}</span>
            </div>
          </div>
        </template>
      </ele-tree-composite-table>

      <!-- 领用表单 -->
      <ele-form-drawer
        class="dialog-pack"
        size="60%"
        :isLoading="isLoading"
        v-model="collectFormDataDialog"
        v-bind="collectFormDescDialog"
        :request-fn="collecthandleSubmit"
        :visible.sync="collectVisible"
        :title="title"
      ></ele-form-drawer>

      <!-- 归还表单 -->
      <ele-form-drawer
        class="dialog-pack"
        size="50%"
        :isLoading="isLoading"
        v-model="returnFormDataDialog"
        v-bind="returnFormDescDialog"
        :request-fn="returnhandleSubmit"
        :visible.sync="returnVisible"
        :title="title"
      ></ele-form-drawer>

      <!-- 领用表单中 量检具 选择弹出列表 领用归还状态(字典：measuring_tool_status)【1：在库 2：已借出】-->
      <ele-dialog-table
        :title="
          $t('limsMeasuringToolsLedgerCollectReturn.selectMeasuringTools')
        "
        width="800px"
        ref="dialogMeasuringTools"
        :visible.sync="collectMeasuringToolsVisible"
        :formConfig="measuringToolsSearchDialog"
        :column="measuringToolsDialogColumn"
        @getSelectData="setSelectMeasuringTools"
        :getList="getMeasuringToolsList"
        :otherParam="{ collectReturnStatus: 1 }"
        :hasFooter="measuringToolsHasFooter"
      ></ele-dialog-table>
<!--      :otherParam="{ collectReturnStatus: 1, departmentCode:this.$refs.treeCompositeTable&&this.$refs.treeCompositeTable.currentData.deptCode }"-->

      <!-- 归还表单中 量检具 选择弹出列表 领用归还状态(字典：measuring_tool_status)【1：在库 2：已借出】-->
      <ele-dialog-table
        :title="
          $t('limsMeasuringToolsLedgerCollectReturn.selectMeasuringTools')
        "
        width="800px"
        ref="dialogMeasuringTools"
        :visible.sync="returnMeasuringToolsVisible"
        :formConfig="measuringToolsSearchDialog"
        :column="measuringToolsDialogColumn"
        @getSelectData="setSelectMeasuringTools"
        :getList="getMeasuringToolsList"
        :otherParam="{ collectReturnStatus: 2 }"
        :hasFooter="measuringToolsHasFooter"
      ></ele-dialog-table>

      <!-- 量检具领用归还记录 弹出列表 -->
      <ele-dialog-table
        :title="
          $t('limsMeasuringToolsLedgerCollectReturn.collectReturnRecords')
        "
        width="1200px"
        ref="dialogCollectReturnLog"
        :visible.sync="collectReturnLogVisible"
        :formConfig="collectReturnLogSearchDialog"
        :column="collectReturnLogDialogColumn"
        :otherParam="{ measuringToolCode: measuringToolCodeLocal }"
        :getList="getCollectReturnLogList"
        :hasFooter="collectReturnLogHasFooter"
      ></ele-dialog-table>

      <!-- 详情侧抽表单 -->
      <ele-form-drawer
        class="dialog-pack"
        size="50%"
        :isLoading="isLoadingInfo"
        v-model="logFormDataDialog"
        v-bind="logFormDescDialog"
        :visible.sync="logVisible"
        :title="$i18n.t('limsMeasuringToolsLedgerCollectReturn.records')"
      >
        <div class="block timeline-pack">
          <el-timeline v-if="logList.length">
            <el-timeline-item
              type="success"
              v-for="(item, index) in logList"
              :key="index"
              placement="top"
              :hide-timestamp="true"
            >
              <template #dot>
                <div
                  class="timeline-icon"
                  :class="item.operateType == 1 ? 'color1' : 'color2'"
                ></div>
              </template>
              <div class="date">
                <p>{{ item.createTime.split(" ")[0] }}</p>
                <p>{{ item.createTime.split(" ")[1] }}</p>
              </div>
              <template v-if="item.operateType == 1">
                <p class="tit">{{ item.operateTypeName }}</p>
                <p>
                  <span style="font-size: 12px; color: #3333;">
                    {{ item.collectTime }}
                  </span>
                </p>
                <p>
                  <span>
                    {{
                      $t("limsMeasuringToolsLedgerCollectReturn.applicant")
                    }}：{{ item.createByName }}
                  </span>
                </p>
                <p>
                  <span>
                    {{
                      $t(
                        "limsMeasuringToolsLedgerCollectReturn.userDepartment"
                      )
                    }}：{{ item.collectDepartmentName }}
                  </span>
                </p>
                <p>
                  <span>
                    {{
                      $t(
                        "limsMeasuringToolsLedgerCollectReturn.expectedReturnDate"
                      )
                    }}：{{ item.expectedReturnDate }}
                  </span>
                </p>
                <p>
                  <span>
                    {{
                      $t(
                        "limsMeasuringToolsLedgerCollectReturn.applicationDescription"
                      )
                    }}：{{ item.operateExplain }}
                  </span>
                </p>
              </template>
              <template v-else>
                <p class="tit">{{ item.operateTypeName }}</p>
                <p>
                  <span>
                    {{
                      $t("limsMeasuringToolsLedgerCollectReturn.returnedBy")
                    }}：{{ item.createByName }}
                  </span>
                </p>
                <p>
                  <span>
                    {{
                      $t(
                        "limsMeasuringToolsLedgerCollectReturn.situationDescription"
                      )
                    }}：{{ item.operateExplain }}
                  </span>
                </p>
              </template>
            </el-timeline-item>
          </el-timeline>
          <el-empty v-else></el-empty>
        </div>
      </ele-form-drawer>
    </div>
  </div>
</template>

<script>
import { searchConfig, rowConfig } from "./config";
import { exportExcel } from "@/utils/judge";
import {
  getList,
  getMeasuringToolsTypeCodeList,
  getMeasuringToolsTypeCodeTree,
  getAccuracyLevelCodeList,
  getAccuracyLevelRangeList,
  getInstrumentCategoryList,
  getStatusList,
  getCheckStatusList,
  getCollectReturnStatusList,
  getDepartmentCodeTree,
  applyCollect,
  applyReturn,
  listLog,
  exportUrl
} from "@/api/limsmeasuringtools/measuringtoolscollectreturn";

import { measuringToolsDialog } from "./mixinMeasuringTools";
import { measuringToolsCollectReturnLogDialog } from "./mixinMeasuringToolsCollectReturnLog";
import {
  getDict, // 字典查询
} from "@/api/common";

export default {
  name: "mesTechnology",
  mixins: [
    searchConfig,
    measuringToolsDialog,
    measuringToolsCollectReturnLogDialog,
  ],
  data() {
    const _this = this;
    return {

      operateList :[
        {
          name: $i18n.t('common.export'),
          type: "primary",
          icon: "el-icon-download",
          handleName: "export", //点击时返回的标识
      //    url: exportUrl,
          //auth: "auth:operlog:export", //权限字段
        },
        {
          name: $i18n.t("limsMeasuringToolsLedgerCollectReturn.collect"),// 领用
          type: "primary",
          icon: "el-icon-s-order",
          isMultiple: true, //至少选择一条
          disabled: (data) => {
            let bool = (data||[]).some(ite => {
             return ite.collectReturnStatus ==2
            })
            return !data.length > 0|| bool;
          },
          show: (data) => {
          return  _this.activeNameTop==1||_this.activeNameTop==-1
          },
          handleName: "applyCollect", //点击时返回的标识
          auth: "auth:operlog:collect", //权限字段
        },
        {
          name: $i18n.t("limsMeasuringToolsLedgerCollectReturn.return"),// 归还
          type: "success",
          icon: "el-icon-s-promotion",
          isMultiple: true, //至少选择一条
          //是否可点击；
          disabled: (data) => {
            let bool = (data||[]).some(ite => {
             return ite.collectReturnStatus ==1
            })
            return !data.length > 0|| bool;
          },
          show: (data) => {
          return  _this.activeNameTop==2||_this.activeNameTop==-1
          },
          handleName: "applyReturn", //点击时返回的标识
          auth: "auth:operlog:return", //权限字段
        }
      ],
      //记录开始
      activeName: "0",
      isLoadingInfo: false,
      logVisible: false,
      logFormDataDialog: {},
      logList: [],
      logFormDescDialog: {
        isShowSubmitBtn: false,
        formDesc: {},
      },

      //记录end
      // value是点击左边树时要获取对象的哪个属性，eg object.id就写id;key是做表格查询时传入的搜索条件的name
      getParamsFromNode: {
        column: [{ value: "deptCode", key: "departmentCode" }],
      },
      activeNameTop: "-1",
      statusList: [],
      measuringToolCodeLocal: "",
      initParam: {},
      activeNameTopNum: {
        sum1: "0",
        sum2: "0",
      },
      searchData: {},
      title: null,
      visible: false,
      isLoading: false,
      loading: false,
      collectVisible: false,
      returnVisible: false,
      collectFormDataDialog: {},
      returnFormDataDialog: {},
      searchConfig,
      getList,
      getDepartmentCodeTree,
      collectReturnStatusList:[],
      checkStatusList:[],
      statusListList:[],
      // 领用表单
      collectFormDescDialog: {
        span: 24,
        disabled: false,
        isShowSubmitBtn: true,
        formDesc: {
          detailList: {
            type: "table-editor",
            label: $i18n.t(
              "limsMeasuringToolsLedgerCollectReturn.selectMeasuringTools"
            ),
            layout: 24,
            required: true,
            attrs: {
              // 上方,按钮,render
              topBtnRender: (h, solt) => {
                return (
                  <el-button
                    type="primary"
                    onClick={() => {
                      this.addCollectList();
                    }}
                  >
                    {$i18n.t("common.add2")}
                  </el-button>
                );
              },
              isShowAdd: false,
              isShowDelete: true,
              columns: [
                {
                  // el-table-column 的属性
                  type: "index",
                  align: "center",
                  label: $i18n.t("common.order"),
                  width: 66,
                },
                {
                  // el-table-column 的属性
                  prop: "measuringToolCode",
                  align: "center",
                  label: $i18n.t(
                    "limsMeasuringToolsLedgerCollectReturn.measuringToolCode"
                  ), // 量检具编码
                  width: 170,
                },
                {
                  prop: "measuringToolName",
                  align: "center",
                  label: $i18n.t(
                    "limsMeasuringToolsLedgerCollectReturn.measuringToolName"
                  ), // 量检具名称
                  showOverflowTooltip: true,
                  width: 175,
                },
                {
                  prop: "measuringToolsTypeName",
                  align: "center",
                  label: $i18n.t(
                    "limsMeasuringToolsLedgerCollectReturn.measuringToolsTypeCode"
                  ), // 类型编码
                  showOverflowTooltip: true,
                  width: 100,
                },
                {
                  prop: "measuringToolSpecification",
                  align: "center",
                  label: $i18n.t(
                    "limsMeasuringToolsLedgerCollectReturn.measuringToolSpecification"
                  ), // 规格型号
                  showOverflowTooltip: true,
                  width: 195,
                },
                {
                  prop: "collectReturnStatusName",
                  align: "center",
                  label: $i18n.t(
                    "limsMeasuringToolsLedgerCollectReturn.collectReturnStatus"
                  ), // 领用归还状态
                  showOverflowTooltip: true,
                  width: 195,
                },
                {
                  prop: "checkStatusName",
                  align: "center",
                  label: $i18n.t(
                    "limsMeasuringToolsLedgerCollectReturn.checkStatus"
                  ), // 检定状态
                  showOverflowTooltip: true,
                  width: 160,
                },
              ],
            },
          },
          collectDepartmentCode: {
            type: "tree-select",
            label: $i18n.t(
              "limsMeasuringToolsLedgerCollectReturn.collectDepartmentCode"
            ), // 部门编码
            layout: 12,
//            required: true,
            attrs: {
              normalizer(node) {
                return {
                  id: node.deptCode,
                  label: node.name,
                  children: node.children,
                };
              },
            },
            options: async (data) => {
              const list = await getDepartmentCodeTree();
              return list.data.result;
            },
          },
          expectedReturnDate: {
            type: "date",
            label: $i18n.t(
              "limsMeasuringToolsLedgerCollectReturn.expectedReturnDate"
            ),
            layout: 12,
//            required: true,
            attrs: {
              valueFormat: "yyyy-MM-dd",
              pickerOptions:{
              disabledDate(time) {
                return time.getTime() <= Date.now() - 8.64e7;;
                },
               }
            },
          },
          operateExplain: {
            type: "textarea",
            label: $i18n.t(
              "limsMeasuringToolsLedgerCollectReturn.collectExplain"
            ),
            layout: 24,
          },
        },
      },
      // 归还表单
      returnFormDescDialog: {
        span: 24,
        disabled: false,
        isShowSubmitBtn: true,
        formDesc: {
          detailList: {
            type: "table-editor",
            label: $i18n.t(
              "limsMeasuringToolsLedgerCollectReturn.selectMeasuringTools"
            ),
            layout: 24,
            required: true,
            attrs: {
              // 上方,按钮,render
              topBtnRender: (h, solt) => {
                return (
                  <el-button
                    type="primary"
                    onClick={() => {
                      this.addReturnList();
                    }}
                  >
                    {$i18n.t("common.add2")}
                  </el-button>
                );
              },
              isShowAdd: false,
              isShowDelete: true,
              columns: [
                {
                  // el-table-column 的属性
                  type: "index",
                  align: "center",
                  label: $i18n.t("common.order"),
                  width: 66,
                },
                {
                  // el-table-column 的属性
                  prop: "measuringToolCode",
                  align: "center",
                  label: $i18n.t(
                    "limsMeasuringToolsLedgerCollectReturn.measuringToolCode"
                  ), // 量检具编码
                  width: 170,
                },
                {
                  prop: "measuringToolName",
                  align: "center",
                  label: $i18n.t(
                    "limsMeasuringToolsLedgerCollectReturn.measuringToolName"
                  ), // 量检具名称
                  showOverflowTooltip: true,
                  width: 175,
                },
                {
                  prop: "measuringToolsTypeName",
                  align: "center",
                  label: $i18n.t(
                    "limsMeasuringToolsLedgerCollectReturn.measuringToolsTypeCode"
                  ), // 类型编码
                  showOverflowTooltip: true,
                  width: 100,
                },
                {
                  prop: "measuringToolSpecification",
                  align: "center",
                  label: $i18n.t(
                    "limsMeasuringToolsLedgerCollectReturn.measuringToolSpecification"
                  ), // 规格型号
                  showOverflowTooltip: true,
                  width: 195,
                },
                {
                  prop: "collectReturnStatusName",
                  align: "center",
                  label: $i18n.t(
                    "limsMeasuringToolsLedgerCollectReturn.collectReturnStatus"
                  ), // 领用归还状态
                  showOverflowTooltip: true,
                  width: 195,
                },
                {
                  prop: "checkStatusName",
                  align: "center",
                  label: $i18n.t(
                    "limsMeasuringToolsLedgerCollectReturn.checkStatus"
                  ), // 检定状态
                  showOverflowTooltip: true,
                  width: 160,
                },
              ],
            },
          },
          operateExplain: {
            type: "textarea",
            label: $i18n.t(
              "limsMeasuringToolsLedgerCollectReturn.returnExplain"
            ),
            layout: 24,
          },
        },
      },
      // 列表页字段的绑定配置
      column: [
        {
          type: "selection",
        },
        {
          type: "index",
          label: $i18n.t("common.order"),
          width: 60,
          fixed: "left",
        },
        {
          prop: "measuringToolCode",
          label: $i18n.t(
            "limsMeasuringToolsLedgerCollectReturn.measuringToolCode"
          ), // 量检具编码
          width: "120",
          showOverflowTooltip: true,
          showColumnSearch: true,
          fixed: "left",
        },
        {
          prop: "measuringToolName",
          label: $i18n.t(
            "limsMeasuringToolsLedgerCollectReturn.measuringToolName"
          ), // 量检具名称
          width: "150",
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "departmentName",
          label: $i18n.t(
            "limsMeasuringToolsLedgerCollectReturn.departmentCode"
          ), // 部门编码
          width: "120",
          showColumnSearch: true,
//          optionProp: {
//            value: "deptCode",
//            label: "name",
//          },
          showColumnSearchConfig: {
            specifySortKey: "departmentCode",
//            // 非必填 对象{} 不设置，就是默认模糊搜索
//            type: "tree", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
//            specifySearchKey: "departmentCode",
//            option: async (data) => {
//              const list = await getDepartmentCodeTree();
//              return list.data.result;
//            },
          },
        },
        {
          prop: "instrumentCategory",
          label: $i18n.t(
            "limsMeasuringToolsLedgerCollectReturn.instrumentCategory"
          ), // 仪器类别(字典：instrument_category_type)【1：内部检定 2：送检设备 3：厂商检定 4：不需检定】
          width: "120",
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: {
            // 非必填 对象{} 不设置，就是默认模糊搜索
            type: "radio", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
          },
          optionProp: {
            value: "value",
            label: "description",
          },
          option: async (data) => {
            const list = await getInstrumentCategoryList();
            return list.data.result;
          },
        },
        {
          prop: "measuringToolsTypeName",
          label: $i18n.t(
            "limsMeasuringToolsLedgerCollectReturn.measuringToolsTypeCode"
          ), // 类型编码
          width: "120",
          showOverflowTooltip: true,
          showColumnSearch: true,
          optionProp: {
            value: "id",
            label: "label",
          },
          showColumnSearchConfig: {
            // 非必填 对象{} 不设置，就是默认模糊搜索
            type: "tree", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
            specifySearchKey: "measuringToolsTypeCode",
            specifySortKey: "measuringToolsTypeCode",
            option: async (data) => {
              const list = await getMeasuringToolsTypeCodeTree();
              return list.data.result;
            },
            associatedQueryColumnProp: [
              //需要变动的列搜索数据的prop。  当前值变动时，需要有其它列搜索，根据此列的值变动重新获取列搜索数据。 非必填
              {
                refreshKey: "accuracyLevelName", // refreshKey当前列值变动后要刷新的列的key
                searchKey: "typeCode", // 刷新列的数据源接口重新请求后要变动的参数值的key，将当前列的搜索条件返回值赋给刷新列的参数key例如 {regionName: xxx(当前列的值)}
              },
            ],
          },
        },
        {
          prop: "measuringToolSpecification",
          label: $i18n.t(
            "limsMeasuringToolsLedgerCollectReturn.measuringToolSpecification"
          ), // 规格型号
          width: "150",
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "accuracyLevelName",
          label: $i18n.t(
            "limsMeasuringToolsLedgerCollectReturn.accuracyLevelCode"
          ), // 精度等级编码
          width: "100",
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: {
            // 非必填 对象{} 不设置，就是默认模糊搜索
            type: "radio", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
            specifySearchKey: "accuracyLevelCode",
            specifySortKey: "accuracyLevelCode",
            option: async (data) => {
              if (!data || data.typeCode == "") {
                return [];
              }
              const list = await getAccuracyLevelCodeList({
                typeCode: data["typeCode"][0],
              });
              return list.data.result;
            },
            associatedQueryColumnProp: [
              //需要变动的列搜索数据的prop。  当前值变动时，需要有其它列搜索，根据此列的值变动重新获取列搜索数据。 非必填
              {
                refreshKey: "measuringRangeName", // refreshKey当前列值变动后要刷新的列的key
                searchKey: "levelCode", // 刷新列的数据源接口重新请求后要变动的参数值的key，将当前列的搜索条件返回值赋给刷新列的参数key例如 {regionName: xxx(当前列的值)}
              },
            ],
          },
          optionProp: {
            value: "accuracyLevelCode",
            label: "accuracyLevelName",
          },
        },
        {
          prop: "measuringRangeName",
          label: $i18n.t(
            "limsMeasuringToolsLedgerCollectReturn.measuringRangeCode"
          ), // 测量范围
          width: "120",
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: {
            // 非必填 对象{} 不设置，就是默认模糊搜索
            type: "radio", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
            specifySearchKey: "measuringRangeCode",
            specifySortKey: "measuringRangeCode",
            option: async (data) => {
              if (!data || data.levelCode == "") {
                return [];
              }
              const list = await getAccuracyLevelRangeList({
                accuracyLevelCode: data["levelCode"],
              });
              return list.data.result;
            },
          },
          optionProp: {
            value: "measuringRangeCode",
            label: "measuringRangeName",
          },
        },
        {
          prop: "status",
          label: $i18n.t("limsMeasuringToolsLedgerCollectReturn.status"), // 状态(字典：measuring_tool_status)【1：使用中 2：封存 3：报废 4：停用 5：丢失】
          width: "100",
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: {
            // 非必填 对象{} 不设置，就是默认模糊搜索
            type: "radio", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
          },
          optionProp: {
              value: "value",
              label: "description",
            },
          option: async (data) => {
              const list = await getStatusList();
              return list.data.result;
            },
        },
        {
          prop: "collectReturnStatus",
          label: $i18n.t(
            "limsMeasuringToolsLedgerCollectReturn.collectReturnStatus"
          ), // 领用归还状态(字典：measuring_tool_status)【1：在库 2：已借出】
          width: "100",
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: {
            // 非必填 对象{} 不设置，就是默认模糊搜索
            type: "radio", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
          },
          optionProp: {
              value: "value",
              label: "description",
            },
          option: async (data) => {
            const list = await getCollectReturnStatusList();
            return list.data.result;
          },
        },
        {
          prop: "checkStatus",
          label: $i18n.t("limsMeasuringToolsLedgerCollectReturn.checkStatus"), // 检定状态(字典：check_status)【1：送检中 2：已检定 3：待检定 4：已逾期】
          width: "100",
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: {
            // 非必填 对象{} 不设置，就是默认模糊搜索
            type: "radio", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）

          },
          optionProp: {
              value: "value",
              label: "description",
            },
          option: async (data) => {
              const list = await getCheckStatusList();
              return list.data.result;
            }
        },
        {
          prop: "updateByName",
          label: $i18n.t("limsMeasuringToolsLedgerCollectReturn.updateByName"), // 更新人名称
          width: 150,
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "updateTime",
          label: $i18n.t("limsMeasuringToolsLedgerCollectReturn.updateTime"), // 更新时间
          width: 155,
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: {
            type: "dateTimePicker", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
            // defaultValue: ['2024-08-03 00:00:00', '2024-08-16 23:59:59'],
          },
        },
        {
          prop: "operate",
          label: $i18n.t("common.operation"),
          width: 180,
          fixed: "right",
          showOverflowTooltip: false,
          render: (h, scope) => {
            return (
              <ele-row-operation
                scope={scope}
                rowConfig={rowConfig}
                onRowOperate={this.rowOperate}
              />
            );
          },
        },
      ],
    };
  },
  computed: {},
  mounted() {
    if (this.$store.getters.language === "en") {
      document
        .getElementsByClassName("lims-container")[0]
        .getElementsByClassName("ele-form-search")[0].style.left = "792px";
    }
  },
  methods: {
    handleClickTop(tab, event) {
      this.$refs.treeCompositeTable.handleReset();
      // this.getList();
    },
    //表格顶部按钮操作事件
    handleOperateEvent(data) {
      this.title = data.name;
      const fnc = {
        //导出
        export: () => {
          console.log("currentKey", this.$refs.treeCompositeTable.currentKey);
          console.log("currentData.deptCode", this.$refs.treeCompositeTable.currentData.deptCode);
          let formData = this.$refs.treeCompositeTable.$refs.treeCompositeTable.getSearchParams();
          if (this.$refs.treeCompositeTable.currentData.deptCode) {
            formData.departmentCode =
              this.$refs.treeCompositeTable.currentData.deptCode;
          } else {
            formData.departmentCode = null;
          }
          console.log("formData", formData);
          exportExcel(exportUrl, formData);
        },
        applyCollect: () => {
          //          console.log(data.rows);
          this.collectFormDataDialog.detailList = data.rows;
          this.collectVisible = true;
        },
        applyReturn: () => {
          this.returnFormDataDialog.detailList = data.rows;
          this.returnVisible = true;
        },
      };
      fnc[data.handleName]();
    },
    // 表格行操作事件
    rowOperate({ handleName, name, row }) {
      this.title = name;
      const fnc = {
        collectReturnRecords: async () => {
          let res = await listLog({ measuringToolCode: row.measuringToolCode });
          this.logList = res.data.result;
          this.logVisible = true;
        },
      };
      fnc[handleName]();
    },
    // 领用提交事件
    collecthandleSubmit(data) {
      if (this.isLoading) return; // 判断状态
      this.isLoading = true;

      applyCollect(data)
        .then((res) => {
          const message = res.data.message;
          this.$message.success(
            message ||
              $i18n.t("limsMeasuringToolsLedgerCollectReturn.collectSuccess")
          ); // 领用成功
          this.visible = false;
          this.refresh(false);
          this.collectVisible = false;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    // 归还提交事件
    returnhandleSubmit(data) {
      if (this.isLoading) return; // 判断状态
      this.isLoading = true;

      applyReturn(data)
        .then((res) => {
          const message = res.data.message;
          this.$message.success(
            message ||
              $i18n.t("limsMeasuringToolsLedgerCollectReturn.returnSuccess")
          ); // 归还成功
          this.visible = false;
          this.refresh(false);
          this.returnVisible = false;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    //刷新表格数据
    refresh(isReset = true) {
      this.$refs.treeCompositeTable.refresh(isReset);
    },
    addCollectList() {
      this.collectMeasuringToolsVisible = true;
    },
    addReturnList() {
      this.returnMeasuringToolsVisible = true;
    },
    //Tab按钮从字典初始化
    async getStatusList() {
      let res = await getCollectReturnStatusList();
      this.statusList = res.data.result;

      let res1 = await getDict("common_collect_return_status");
      this.collectReturnStatusList = res1.data.result;

      let res2 = await getDict("common_check_status");
      this.checkStatusList = res2.data.result;

      let res3 = await getDict("common_measuring_tool_status");
      this.statusListList = res3.data.result;
    },
  },
  created() {
    this.getStatusList();
  },
};
</script>

<style lang="scss" scoped>
.lims-container {
  .card-pack {
    .tit {
      font-weight: 700;
      font-size: 15px !important;
    }
    p {
      line-height: 22px;
      font-size: 13px;
    }
  }
  .label-pack {
    display: flex;
    align-items: center;
    span {
      display: flex;
      align-items: center;
    }

    .padd-r-5 {
      padding-right: 5px;
    }
    .tree-label {
      padding-left: 5px;
      font-size: 14px;
    }
  }
  .tooltip {
    font-size: 12px;
    margin-left: 20px;
    line-height: 30px;
    color: #676869;
  }
  .flex {
    display: flex;
  }
  /deep/.ele-form-search {
    position: absolute;
    left: 610px;
    z-index: 1;

    .el-form-item {
      margin-bottom: 0;
    }

    .ele-form-btns {
      display: none;
    }
  }

  .timeline-pack {
    margin: 0 auto;
    width: 50%;
    font-size: 14px;
    color: #333333 !important;
    /deep/.el-timeline-item__tail {
      border-left: 2px dashed #e5e5e5;
    }
    .date {
      position: absolute;
      left: -90px;
      color: #5a6f82 !important;
    }
    .timeline-icon {
      width: 12px;
      height: 12px;
      background: #ffffff;
      border: 2px solid #57be6a;
      border-radius: 12px;
      margin-left: -3px;
    }
    .color1{
      border: 2px solid #F89D37;
    }
    .color2{
      border: 2px solid #57be6a;
    }
    .tit {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;

      color: #333333 !important;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
    p {
      line-height: 24px;
    }
  }
}
</style>
