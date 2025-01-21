<template>
  <div>
    <div class="lims-container">
      <el-tabs v-model="activeNameTop" type="card" @tab-click="handleClickTop">
        <el-tab-pane :label="$t('measuringtoolsinternalcheck.all')" name="-1"></el-tab-pane>
        <el-tab-pane :label="`${ite.description}`" v-for="(ite, i) in statusList" :key="i" :name="ite.value"> </el-tab-pane>
      </el-tabs>
      <ele-page
        v-loading="loading"
        :formConfig="searchConfig"
        ref="eleTable"
        :operateList="operateList"
        @handleOperateEvent="handleOperateEvent"
        :column="column"
        :otherParams="{
          checkStatus: activeNameTop == '-1' ? '' : activeNameTop
        }"
        :initForm="initParam"
        :getList="getList"
        uniqueId="mesTechnologyTable"
        :formSearchShowForce="true"
      >
      </ele-page>

      <!-- 登记 表单 -->
      <ele-form-drawer
        class="dialog-pack"
        size="50%"
        :isLoading="isLoading"
        v-model="formDataDialog"
        v-bind="formDescDialog"
        :request-fn="handleSubmit"
        :visible.sync="registionVisible"
        :title="title"
      >
        <!-- 检定人 -->
        <template v-slot:checkName>
          <!-- 插槽内容有el-form-item组件包裹 -->
          <el-input
            v-model="formDataDialog.checkName"
            readonly
            :placeholder="$i18n.t('measuringtoolsinternalcheck.selCheckName')"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="userMixinClink()"
            ></el-button>
          </el-input>
        </template>
      </ele-form-drawer>

      <!-- 登记 表单-检定人 弹出列表-->
      <ele-dialog-table
        :title="$i18n.t('measuringtoolsinternalcheck.selCheckName')"
        width="800px"
        :visible.sync="baseUserDialogVisible"
        :formConfig="baseUserSearchDialog"
        :column="baseUserDialogColumn"
        @getSelectData="getSelectBaseUser"
        :otherParam="{ applicableScope: measuringToolsTypeCodeLocal }"
        :getList="getBaseUserList"
        :hasFooter="hasBaseUserFooter"
      ></ele-dialog-table>

      <!-- 量检具检定记录 弹出列表 -->
      <ele-dialog-table
        :title="$t('measuringtoolsinternalcheck.checkRecords')"
        width="1200px"
        ref="dialogCheckRecords"
        :visible.sync="checkRecordsVisible"
        :formConfig="checkRecordsSearchDialog"
        :column="checkRecordsDialogColumn"
        :otherParam="{ measuringToolCode: measuringToolCodeLocal }"
        :getList="getCheckRecordsList"
        :hasFooter="checkRecordsHasFooter"
      >
      </ele-dialog-table>
    </div>
    <JianYan ref="jianyan" type="lims_in_send_check_type"></JianYan>
  </div>
</template>
<script>
import {
  operateList,
  searchConfig,
  rowConfig,
  formDescDialog
} from './config'
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
  registInternalCheck,
  getVerificationCycleUnitList
} from '@/api/limsmeasuringtools/measuringtoolsinternalcheck';
import { getDict } from "@/api/common.js";

import { measuringToolsCheckLogDialog } from "./mixinMeasuringToolsCheckLog";
import { baseUserDialog } from "./userMixin";
import JianYan from "@/views/limsmeasuringtools/measuringtoolsoutsourcingcheck/jianyan.vue"
export default {
  name: 'mesTechnology',
  components:{JianYan},
  mixins: [searchConfig, measuringToolsCheckLogDialog, baseUserDialog],
  data() {
    return {
      activeNameTop: '-1',
      statusList: [],
      measuringToolCodeLocal: '',
      measuringToolsTypeCodeLocal: '',
      initParam: {},
      activeNameTopNum: {
        sum1: '0',
        sum2: '0',
      },
      searchData: {},
      title: null,
      visible: false,
      isLoading: false,
      loading: false,
      registionVisible: false,
      formDataDialog: {},
      formDescDialog,
      searchConfig,
      operateList,
      getList,
      collectReturnStatusList:[],
      checkStatusList:[],
      checkResultList:[],
      statusListList:[],
      // 列表页字段的绑定配置
      column: [
        {
          type: 'selection'
        },
        {
          type: 'index',
          label: $i18n.t('common.order'),
          width: 60,
          fixed: 'left'
        },
        {
          prop: "measuringToolCode",
          label: $i18n.t('measuringtoolsinternalcheck.measuringToolCode'),  // 量检具编码
          width: "120",
          showOverflowTooltip: true,
          showColumnSearch: true,
          fixed: 'left'
        },
        {
          prop: "measuringToolName",
          label: $i18n.t('measuringtoolsinternalcheck.measuringToolName'),  // 量检具名称
          width: "150",
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "departmentName",
          label: $i18n.t("measuringtoolsinternalcheck.departmentCode"), // 部门编码
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
            specifySortKey: "departmentCode",
            option: async (data) => {
              const list = await getDepartmentCodeTree();
              return list.data.result;
            },
          },
        },
        {
          prop: "instrumentCategory",
          label: $i18n.t('measuringtoolsinternalcheck.instrumentCategory'),  // 仪器类别(字典：instrument_category_type)【1：内部检定 2：送检设备 3：厂商检定 4：不需检定】
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
            let tmpInstrumentCategoryList = list.data.result;
            //只保留 1：内部检定
            tmpInstrumentCategoryList = tmpInstrumentCategoryList.filter(item => item.value == "1");
            return tmpInstrumentCategoryList;
          },
        },
        {
          prop: "measuringToolsTypeName",
          label: $i18n.t('measuringtoolsinternalcheck.measuringToolsTypeCode'),  // 类型编码
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
            associatedQueryColumnProp: [ //需要变动的列搜索数据的prop。  当前值变动时，需要有其它列搜索，根据此列的值变动重新获取列搜索数据。 非必填
              {
                refreshKey: 'accuracyLevelName', // refreshKey当前列值变动后要刷新的列的key
                searchKey: "typeCode", // 刷新列的数据源接口重新请求后要变动的参数值的key，将当前列的搜索条件返回值赋给刷新列的参数key例如 {regionName: xxx(当前列的值)}
              },
            ],
          },
        },
        {
          prop: "measuringToolSpecification",
          label: $i18n.t('measuringtoolsinternalcheck.measuringToolSpecification'),  // 规格型号
          width: "150",
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "accuracyLevelName",
          label: $i18n.t('measuringtoolsinternalcheck.accuracyLevelCode'),  // 精度等级编码
          width: "100",
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: {
            // 非必填 对象{} 不设置，就是默认模糊搜索
            type: "radio", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
            specifySearchKey: 'accuracyLevelCode',
            specifySortKey: 'accuracyLevelCode',
            option: async (data) => {
              if (!data || data.typeCode == '') {
                return []
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
          },
        },
        {
          prop: "measuringRangeName",
          label: $i18n.t('measuringtoolsinternalcheck.measuringRangeCode'),  // 测量范围
          width: "120",
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: {
            // 非必填 对象{} 不设置，就是默认模糊搜索
            type: "radio", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
            specifySearchKey: 'measuringRangeCode',
            specifySortKey: 'measuringRangeCode',
            option: async (data) => {
              console.log("data.levelCode",data.levelCode);
              if (!data || data.levelCode == '') {
               return []
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
          prop: "recentlyTestedDate",
          label: $i18n.t('measuringtoolsinternalcheck.recentlyTestedDate'),  // 最近检定日期
          width: "120",
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: { // 非必填 对象{} 不设置，就是默认模糊搜索
            type: 'dateTimePicker', //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
            dateType: 'daterange',
            valueFormat: 'yyyy-MM-dd',
          },
        },
        {
          prop: "verificationCycle",
          label: $i18n.t('measuringtoolsinternalcheck.verificationCycle'),  // 检定周期
          width: "100",
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "verificationCycleUnit",
          label: $i18n.t('measuringtoolsinternalcheck.verificationCycleUnit'),  // 检定周期单位(字典：cycle_type )【day：天 week：周 month：月 year：年】
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
            const list = await getVerificationCycleUnitList()
            return list.data.result
          },
        },
        {
          prop: "nextTestedDate",
          label: $i18n.t('measuringtoolsinternalcheck.nextTestedDate'),  // 下次检定日期
          width: "120",
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: { // 非必填 对象{} 不设置，就是默认模糊搜索
            type: 'dateTimePicker', //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
            dateType: 'daterange',
            valueFormat: 'yyyy-MM-dd',
          },
        },
        {
          prop: "checkStatus",
          label: $i18n.t('measuringtoolsinternalcheck.checkStatus'),  // 检定状态(字典：lims_check_status)【0：不需检定 1：送检中 2：已检定 3：待检定 4：已逾期】
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
            const list = await getCheckStatusList()
            let tmpCheckStatusList = list.data.result;
             return tmpCheckStatusList;
          },
        },
        {
          prop: "checkResult",
          label: $i18n.t('measuringtoolsinternalcheck.checkResult'),  // 检定结果(字典：lims_measuring_check_result)【1：合格 2：不合格 3：降级】
          width: 100,
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
            let list = await getDict("lims_measuring_check_result");
            return list.data.result;
          },
        },
//        {
//          prop: "status",
//          label: $i18n.t('measuringtoolsinternalcheck.status'),  // 状态(字典：common_measuring_tool_status)【1：使用中 2：封存 3：报废 4：停用 5：丢失】
//          width: "100",
//          showOverflowTooltip: true,
//          showColumnSearch: true,
//          showColumnSearchConfig: {
//            // 非必填 对象{} 不设置，就是默认模糊搜索
//            type: "radio", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
//            option: async (data) => {
//              const list = await getStatusList();
//              return list.data.result;
//            },
//          },
//          optionProp: {
//            value: "value",
//            label: "description",
//          },
//          render: (h, scope) => {
//            let obj = this.statusListList.find((item) => item.value == scope.row.status);
//            if(obj){
//              const classObj = {
//                'status-simulate-tags': true,
//                'status-simulate-tags-color-grey': scope.row.status == '2',
//                'status-simulate-tags-color-red': scope.row.status == '3',
//                'status-simulate-tags-color-orange': scope.row.status == '4',
//                'status-simulate-tags-color-blue-grey': scope.row.status == '5'
//              }
//              const text = obj.description;
//              return <span class={classObj}>{text}</span>
//            }else{
//              return <span >/</span>
//            }
//          }
//        },
        {
          prop: "collectReturnStatus",
          label: $i18n.t('measuringtoolsinternalcheck.collectReturnStatus'),  // 领用归还状态(字典：lims_collect_return_status)【1：在库 2：已借出】
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
            const list = await getCollectReturnStatusList()
            return list.data.result
          },
        },
//        {
//          prop: "collectDepartmentName",
//          label: $i18n.t('measuringtoolsinternalcheck.collectDepartmentName'),  // 领用部门名称
//          width: 100,
//          showOverflowTooltip: true,
//          showColumnSearch: true,
//          optionProp: {
//            value: "deptCode",
//            label: "name",
//          },
//          showColumnSearchConfig: {
//            // 非必填 对象{} 不设置，就是默认模糊搜索
//            type: "tree", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
//            specifySearchKey: "collectDepartmentCode",
//            option: async (data) => {
//              const list = await getDepartmentCodeTree();
//              return list.data.result;
//            },
//          },
//        },
//        {
//          prop: "collectName",
//          label: $i18n.t('measuringtoolsinternalcheck.collectName'),  // 领用人名称
//          width: 100,
//          showOverflowTooltip: true,
//          showColumnSearch: true
//        },
        {
          prop: "checkDepartmentName",
          label: $i18n.t('measuringtoolsinternalcheck.checkDepartmentCode'),  // 检定部门名称
          width: 100,
          showOverflowTooltip: true,
          showColumnSearch: true,
          optionProp: {
            value: "deptCode",
            label: "name",
          },
          showColumnSearchConfig: {
            // 非必填 对象{} 不设置，就是默认模糊搜索
            type: "tree", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
            specifySearchKey: "checkDepartmentCode",
            option: async (data) => {
              const list = await getDepartmentCodeTree();
              return list.data.result;
            },
          },
        },
        {
          prop: "updateByName",
          label: $i18n.t("measuringtoolsinternalcheck.updateByName"), // 更新人名称
          width: 120,
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "updateTime",
          label: $i18n.t("measuringtoolsinternalcheck.updateTime"), // 更新时间
          width: 160,
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: {
            type: "dateTimePicker", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
            dateType: "datetimerange",
          },
        },
        {
          prop: 'operate',
          label: $i18n.t('common.operation'),
          width: 200,
          fixed: 'right',
          showOverflowTooltip: false,
          render: (h, scope) => {
            return <ele-row-operation scope={scope} rowConfig={rowConfig} onRowOperate={this.rowOperate} />
          }
        }
      ]
    }
  },
  computed: {},
  mounted() {
    if(this.$store.getters.language==='en'){
      document.getElementsByClassName('lims-container')[0].getElementsByClassName('ele-form-search')[0].style.left = '792px';
    }
  },
  methods: {
    userMixinClink() {
      this.baseUserDialogVisible = true;
    },
    handleClickTop(tab, event) {
      this.$refs.eleTable.handleReset()
      // this.getList();
    },
    //表格顶部按钮操作事件
    handleOperateEvent(data) {
      this.title = data.name
      const fnc = {
        songjian: () => {
          this.$refs.jianyan.init(data.rows)
        },
      }
      fnc[data.handleName]()
    },
    // 表格行操作事件
    rowOperate({ handleName, name, row }) {
      this.title = name
      const fnc = {
        // 登记
        internalcheckRegistration: () => {
          this.registionVisible = true;
          this.formDataDialog.measuringToolCode = row.measuringToolCode;
          this.formDataDialog.measuringToolName = row.measuringToolName;
          this.measuringToolsTypeCodeLocal = row.measuringToolsTypeCode;
        },
        // 检定记录
        checkRecords: () => {
          this.measuringToolCodeLocal = row.measuringToolCode;
          this.checkRecordsVisible = true;
        }
      }
      fnc[handleName]()
    },
    // 登记提交事件
    handleSubmit(data) {
      if (this.isLoading) return // 判断状态
      this.isLoading = true;

      if (data.checkReport) {
        data.checkReport = data.checkReport
          .map((r) => r.url)
          .join(",");
      } else {
        data.checkReport = "";
      }

      registInternalCheck(data)
        .then((res) => {
          const message = res.data.message;
          this.$message.success(message || $i18n.t("measuringtoolsinternalcheck.registSuccess"));// 登记成功
          this.visible = false;
          this.refresh(false);
          this.registionVisible = false;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    //刷新表格数据
    refresh(isReset = true) {
      this.$refs.eleTable.refresh(isReset)
    },
    //Tab按钮从字典初始化
    async getStatusList() {
      let res = await getCheckStatusList();
      let tmpStatusList = res.data.result;
      // 剔除 /:/
      //检定状态(字典：common_check_status)【/:/ 1：送检中 2：已检定 3：待检定 4：已逾期】
      tmpStatusList = tmpStatusList.filter(item => item.value !== "/");
      this.statusList = tmpStatusList;

      let res1 = await getDict("common_collect_return_status");
      this.collectReturnStatusList = res1.data.result;

      let res2 = await getDict("common_check_status");
      this.checkStatusList = res2.data.result;

      let res3 = await getDict("common_measuring_tool_status");
      this.statusListList = res3.data.result;

      let res4 = await getDict("lims_measuring_check_result");
      this.checkResultList = res4.data.result;
    },
  },
  created() {
    this.getStatusList();
  }
}
</script>

<style lang="scss" scoped>
.lims-container {
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
}
</style>
