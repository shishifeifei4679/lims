<template>
  <div>
    <div>
      <!-- 左树右表格 -->
      <ele-tree-composite-table
        v-loading="loading"
        :formConfig="searchConfig"
        :operateList="operateList"
        @handleOperateEvent="handleOperateEvent"
        :column="column"
        :getList="getList"
        :showDrag="true"
        :props="{ label: 'name' }"
        nodeKey="deptCode"
        ref="treeCompositeTable"
        :getParamsFromNode="getParamsFromNode"
        :treeApi="getDepartment"
        uniqueId="measuringToolsOperate"
      ></ele-tree-composite-table>

      <!-- 新增、修改、详情侧抽 -->
      <ele-form-drawer
        class="dialog-pack"
        :isLoading="isLoading"
        v-model="formDataDialog"
        v-bind="formDescDialog"
        :request-fn="handleSubmit"
        :visible.sync="visible"
        :title="title"
        size="50%"
      >
        <!-- 目标负责人 -->
        <template v-slot:directorName>
          <!-- 插槽内容有el-form-item组件包裹 -->
          <el-input
            v-model="formDataDialog.directorName"
            readonly
            :placeholder="$i18n.t('measuringtoolsoperate.selDirectorCode')"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="userMixinClink('directorName')"
            ></el-button>
          </el-input>
        </template>
        <!-- 供应商 -->
        <template v-slot:supplierName>
          <!-- 插槽内容有el-form-item组件包裹 -->
          <el-input
            v-model="formDataDialog.supplierName"
            readonly
            :placeholder="$i18n.t('measuringtoolsoperate.selSupplierCode')"
            disabled=true
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="supplierMixinClink('supplierName')"
            ></el-button>
          </el-input>
        </template>

        <!-- 有效期 -->
        <template v-slot:validDate>
          <!-- 插槽内容有el-form-item组件包裹 -->
          <!-- @input="(val) => handleInputNumber(val, 'validDate')" -->
          <el-input
            :placeholder="$i18n.t('measuringtoolsoperate.inputValidDate')"
            v-model="formDataDialog.validDate"
            class="input-with-select"
            type="number"
          >
            <el-select
              v-model="formDataDialog.validDateUnit"
              slot="append"
              :placeholder="$i18n.t('common.select')"
              style="width: 90px"
            >
              <el-option
                v-for="item in dateUnitList"
                :label="item.description"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-input>
        </template>

        <!-- 检定周期 -->
        <template v-slot:verificationCycle>
          <!-- 插槽内容有el-form-item组件包裹 -->
          <!-- @input="(val) => handleInputNumber(val, 'verificationCycle')" -->
          <el-input
            :placeholder="
            $i18n.t('measuringtoolsoperate.inputVerificationCycle')
          "
            v-model="formDataDialog.verificationCycle"
            class="input-with-select"
            type="number"
          >
            <el-select
              v-model="formDataDialog.verificationCycleUnit"
              slot="append"
              :placeholder="$i18n.t('common.select')"
              style="width: 90px"
            >
              <el-option
                v-for="item in verificationCycleUnitList"
                :label="item.description"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-input>
        </template>

        <!-- 提醒时间 -->
        <template v-slot:reminderTime>
          <!-- 插槽内容有el-form-item组件包裹 -->
          <!-- @input="(val) => handleInputNumber(val, 'verificationCycle')" -->
          <el-input
            :placeholder="$i18n.t('measuringtoolsoperate.inputReminderTime')"
            v-model="formDataDialog.reminderTime"
            class="input-with-select"
            type="number"
          >
            <el-select
              v-model="formDataDialog.reminderTimeUnit"
              slot="append"
              :placeholder="$i18n.t('common.select')"
              style="width: 90px"
            >
              <el-option
                v-for="item in reminderTimeUnitList"
                :label="item.description"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-input>
        </template>
      </ele-form-drawer>

      <!-- 启用、停用、封存、报废、丢失 共用表单 -->
      <ele-form-drawer
        class="dialog-pack"
        size="50%"
        :isLoading="isLoading"
        v-model="operateFormDataDialog"
        v-bind="operateFormDescDialog"
        :request-fn="operateHandleSubmit"
        :visible.sync="operateVisible"
        :title="title"
      >
      </ele-form-drawer>

      <!-- 详情侧抽表单 -->
      <ele-form-drawer
        class="dialog-pack"
        size="50%"
        :isLoading="isLoading"
        v-model="logFormDataDialog"
        v-bind="logFormDescDialog"
        :request-fn="operateHandleSubmit"
        :visible.sync="logVisible"
        :title="$t('measuringtoolsoperate.operateInfo')"
      >
        <div class="block">
          <el-timeline >
            <el-timeline-item type="success" v-for="(item, index) in logList" :key="index" :timestamp="item.createTime" placement="top">
              <el-card>
                <p><span>执行人：{{ item.operateExecutorName }}</span></p>
                <p><span>内容：{{ item.operateContent }}</span></p>
                <p><span>理由：{{ item.operateApprovalReason }}</span></p>
                <p><span>审批结果：{{ item.operateApprovalResult }}</span></p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </ele-form-drawer>

      <!-- 量检具 选择弹出列表 -->
      <ele-dialog-table
        :title="$t('measuringtoolsoperate.selectMeasuringTools')"
        width="800px"
        ref="dialogMeasuringTools"
        :visible.sync="measuringToolsVisible"
        :formConfig="measuringToolsSearchDialog"
        :column="measuringToolsDialogColumn"
        @getSelectData="setSelectMeasuringTools"
        :getList="getMeasuringToolsList"
        :hasFooter="measuringToolsHasFooter"
      >
      </ele-dialog-table>

      <!-- 量检具操作记录 弹出列表 -->
      <ele-dialog-table
        :title="$t('measuringtoolsoperate.operateLog')"
        width="1200px"
        ref="dialogCollectReturnLog"
        :visible.sync="operateLogVisible"
        :formConfig="operateLogSearchDialog"
        :column="operateLogDialogColumn"
        :otherParam="{ measuringToolCode: measuringToolCodeLocal }"
        :getList="getOperateLogList"
        :hasFooter="operateLogHasFooter"
      >
      </ele-dialog-table>
    </div>
  </div>
</template>

<script>
import { operateList, searchConfig, formDescDialog, rowConfig } from "./config";
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
  applyOperate,
  listLog,
  rowDetail,
  getDepartment
} from "@/api/limsmeasuringtools/measuringtoolsoperate.js";

import { measuringToolsDialog } from "./mixinMeasuringTools";
import { measuringToolsOperateLogDialog } from "./mixinMeasuringToolsOperateLog";

export default {
  name: "mesTechnology",
  mixins: [searchConfig, measuringToolsDialog, measuringToolsOperateLogDialog],
  data() {
    return {
      getParamsFromNode: {
            column: [{ value: 'deptCode', key: 'departmentCode' }]
      },
      statusList: [],
      measuringToolCodeLocal: "",
      searchData: {},
      title: null,
      visible: false,
      isLoading: false,
      loading: false,
      formDataDialog: {},
      formDescDialog, //新增修改框

      operateVisible: false,
      logVisible: false,
      operateFormDataDialog: {},
      logFormDataDialog: {},
      searchConfig,
      operateList,
      getList,
      getDepartment,
      logFormDescDialog: {
        isShowSubmitBtn: false,
        formDesc: {},
      },
      // 启用、停用、封存、报废、丢失 共用表单
      operateFormDescDialog: {
        span: 24,
        disabled: false,
        isShowSubmitBtn: true,
        formDesc: {
          detailList: {
            type: "table-editor",
            label: $i18n.t("measuringtoolsoperate.selectMeasuringTools"),
            layout: 24,
            required: true,
            attrs: {
              // 上方,按钮,render
              topBtnRender: (h, solt) => {
                return (
                  <el-button
                    type="primary"
                    onClick={() => {
                      this.addList();
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
                  width: 60,
                },
                {
                  // el-table-column 的属性
                  prop: "measuringToolCode",
                  align: "center",
                  label: $i18n.t("measuringtoolsoperate.measuringToolCode"), // 量检具编码
                  width: 170,
                },
                {
                  prop: "measuringToolName",
                  align: "center",
                  label: $i18n.t("measuringtoolsoperate.measuringToolName"), // 量检具名称
                  showOverflowTooltip: true,
                  width: 175,
                },
                {
                  prop: "measuringToolsTypeName",
                  align: "center",
                  label: $i18n.t(
                    "measuringtoolsoperate.measuringToolsTypeCode"
                  ), // 类型编码
                  showOverflowTooltip: true,
                  width: 100,
                },
                {
                  prop: "measuringToolSpecification",
                  align: "center",
                  label: $i18n.t(
                    "measuringtoolsoperate.measuringToolSpecification"
                  ), // 规格型号
                  showOverflowTooltip: true,
                  width: 195,
                },
                {
                  prop: "collectReturnStatusName",
                  align: "center",
                  label: $i18n.t("measuringtoolsoperate.collectReturnStatus"), // 领用归还状态
                  showOverflowTooltip: true,
                  width: 195,
                },
                {
                  prop: "checkStatusName",
                  align: "center",
                  label: $i18n.t("measuringtoolsoperate.checkStatus"), // 检定状态
                  showOverflowTooltip: true,
                  width: 160,
                },
              ],
            },
          },
          operateContent: {
            type: "textarea",
            label: $i18n.t("measuringtoolsoperate.operateContent"),
            layout: 24,
            required: true,
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
          label: $i18n.t("measuringtoolsoperate.measuringToolCode"), // 量检具编码
          width: "120",
          showOverflowTooltip: true,
          showColumnSearch: true,
          fixed: "left",
        },
        {
          prop: "measuringToolName",
          label: $i18n.t("measuringtoolsoperate.measuringToolName"), // 量检具名称
          width: "150",
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "departmentName",
          label: $i18n.t("measuringtoolsoperate.departmentCode"), // 部门编码
          width: "120",
          showColumnSearch: true,
          optionProp: {
            value: "deptCode",
            label: "name",
          },
          showColumnSearchConfig: {
            // 非必填 对象{} 不设置，就是默认模糊搜索
            type: "tree", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
            specifySearchKey: "departmentCode",
            option: async (data) => {
              const list = await getDepartmentCodeTree();
              return list.data.result;
            },
          },
        },
        {
          prop: "instrumentCategory",
          label: $i18n.t("measuringtoolsoperate.instrumentCategory"), // 仪器类别(字典：instrument_category_type)【1：内部检定 2：送检设备 3：厂商检定 4：不需检定】
          width: "130",
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
          label: $i18n.t("measuringtoolsoperate.measuringToolsTypeCode"), // 类型编码
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
          label: $i18n.t("measuringtoolsoperate.measuringToolSpecification"), // 规格型号
          width: "150",
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "accuracyLevelName",
          label: $i18n.t("measuringtoolsoperate.accuracyLevelCode"), // 精度等级编码
          width: "100",
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: {
            // 非必填 对象{} 不设置，就是默认模糊搜索
            type: "radio", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
            specifySearchKey: 'accuracyLevelCode',
            option: async (data) => {
              if (!data || data.typeCode == '') {
                data = {}
              }
              const list = await getAccuracyLevelCodeList({
                  typeCode: data['typeCode'][0],
                });
              return list.data.result;
            },
            associatedQueryColumnProp: [ //需要变动的列搜索数据的prop。  当前值变动时，需要有其它列搜索，根据此列的值变动重新获取列搜索数据。 非必填
              {
                refreshKey: 'measuringRangeName', // refreshKey当前列值变动后要刷新的列的key
                searchKey: "levelCode", // 刷新列的数据源接口重新请求后要变动的参数值的key，将当前列的搜索条件返回值赋给刷新列的参数key例如 {regionName: xxx(当前列的值)}
              },
            ],
          },
          optionProp: {
            value: "accuracyLevelCode",
            label: "accuracyLevelName",
          }
        },
        {
          prop: "measuringRangeName",
          label: $i18n.t("measuringtoolsoperate.measuringRangeCode"), // 测量范围
          width: "120",
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: {
            // 非必填 对象{} 不设置，就是默认模糊搜索
            type: "radio", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
            specifySearchKey: 'measuringRangeCode',
            option: async (data) => {
              console.log("data.levelCode",data.levelCode);
              if (!data || data.levelCode == '') {
                data = {}
              }
              const list = await getAccuracyLevelRangeList({
                  accuracyLevelCode: data['levelCode'],
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
          label: $i18n.t("measuringtoolsoperate.status"), // 状态(字典：measuring_tool_status)【1：使用中 2：封存 3：报废 4：停用 5：丢失】
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
          label: $i18n.t("measuringtoolsoperate.collectReturnStatus"), // 领用归还状态(字典：measuring_tool_status)【1：在库 2：已借出】
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
          label: $i18n.t("measuringtoolsoperate.checkStatus"), // 检定状态(字典：check_status)【1：送检中 2：已检定 3：待检定 4：已逾期】
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
          },
        },
        {
          prop: "operate",
          label: $i18n.t("common.operation"),
          width: 200,
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
      logList:[]
    };
  },
  computed: {},
  mounted() {
  },
  methods: {
    //表格顶部按钮操作事件
    handleOperateEvent(data) {
      this.title = data.name;
      const fnc = {
        // 操作类型(字典：lims_operate_type)【0：量检具登记 1：启用 2：封存 3：报废 4：停用 5：丢失】
        // 启用
        operateEnable: () => {
          this.operateFormDataDialog.detailList = data.rows;
          this.operateFormDataDialog.operateType = 1;
          this.operateVisible = true;
        },
        // 停用
        operateDeactivate: () => {
          this.operateFormDataDialog.detailList = data.rows;
          this.operateFormDataDialog.operateType = 4;
          this.operateVisible = true;
        },
        // 封存
        operateSealUpForSafekeeping: () => {
          this.operateFormDataDialog.detailList = data.rows;
          this.operateFormDataDialog.operateType = 2;
          this.operateVisible = true;
        },
        // 报废
        operateScrap: () => {
          this.operateFormDataDialog.detailList = data.rows;
          this.operateFormDataDialog.operateType = 3;
          this.operateVisible = true;
        },
        // 丢失
        operateLoss: () => {
          this.operateFormDataDialog.detailList = data.rows;
          this.operateFormDataDialog.operateType = 5;
          this.operateVisible = true;
        },
      };
      fnc[data.handleName]();
    },
    // 表格行操作事件
    rowOperate({ handleName, name, row }) {
      this.title = name;
      const fnc = {
        // 修改
        edit: () => {
          this.rowDetail(row.id);
          this.visible = true;
        },
        // 查看审批流
        operateViewApprovalProcess: () => {},
        // 详情
        operateInfo: () => {
          this.getListLog(row)
          this.logVisible = true;
        },
        // 操作记录
        operateLog: () => {
          this.measuringToolCodeLocal = row.measuringToolCode;
          this.operateLogVisible = true;
        },
      };
      fnc[handleName]();
    },
    // 获取量检具操作记录
    getListLog(row) {
      listLog({ measuringToolCode: row.measuringToolCode }).then((res) => {
        this.logList = res.data.result || []
      })

    },
    // 启用、停用、封存、报废、丢失 提交事件
    operateHandleSubmit(data) {
      if (this.isLoading) return; // 判断状态
      this.isLoading = true;
      applyOperate(data)
        .then((res) => {
          const message = res.data.message;
          this.$message.success(
            message || $i18n.t("measuringtoolsoperate.operateSuccess")
          ); // 操作成功
          this.visible = false;
          this.refresh(false);
          this.operateVisible = false;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    rowDetail(id) {
      rowDetail(id).then((res) => {
//        const { measuringToolPicPath, measuringToolFilePath } = res.data.result;
//        const measuringToolPicPaths = measuringToolPicPath
//          ? measuringToolPicPath.split(",").map((val) => {
//              const arr = val.split("/");
//              return {
//                src: val,
//                title: arr[arr.length - 1],
//              };
//            })
//          : [];
//        const measuringToolFilePaths = measuringToolFilePath
//          ? measuringToolFilePath.split(",").map((val) => {
//              const arr = val.split("/");
//              return {
//                url: val,
//                name: arr[arr.length - 1],
//              };
//            })
//          : [];
//        this.formDataDialog = {
//          ...res.data.result,
//          measuringToolPicPath: measuringToolPicPaths,
//          measuringToolFilePath: measuringToolFilePaths,
//        };
        this.formDataDialog = {
          ...res.data.result
        };
      });
    },
    //刷新表格数据
    refresh(isReset = true) {
      this.$refs.eleTable.refresh(isReset);
    },
    addList() {
      this.measuringToolsVisible = true;
    },
    //Tab按钮从字典初始化
    async getStatusList() {
      let res = await getStatusList();
      this.statusList = res.data.result;
    },
  },
  created() {
    this.getStatusList();
  },
};
</script>
