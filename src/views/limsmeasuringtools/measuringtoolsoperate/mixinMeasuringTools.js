import {
  getList as  getMeasuringToolsList,
  getMeasuringToolsTypeCodeList,
  getMeasuringToolsTypeCodeTree,
  getAccuracyLevelCodeList,
  getInstrumentCategoryList,
  getStatusList,
  getCheckStatusList,
  getCollectReturnStatusList
} from '@/api/limsmeasuringtools/measuringtoolsoperate'
import { uniqueKey } from "@/utils/judge"

export const measuringToolsDialog = {
  data() {
    return {
      measuringToolsVisible: false, //表格弹框隐藏显示
      getMeasuringToolsList, // 获取弹框数据接口
      measuringToolsHasFooter: true, // 是否需要底部按钮默认true
      measuringToolsSearchDialog: {
        inline: true,
        span: 24,
        formDesc: {
          measuringToolCode: {
            type: "input",
            layout: 8,
            label: $i18n.t("limsMeasuringToolsLedgerCollectReturn.measuringToolCode")
          },
          measuringToolName: {
            type: "input",
            layout: 8,
            label: $i18n.t("limsMeasuringToolsLedgerCollectReturn.measuringToolName")
          }
        }
      },
      measuringToolsDialogColumn: [
        {
          type: "selection",
          fixed: "left"
        },
        {
          type: "index",
          label: $i18n.t("common.order"),
          width: 60,
          fixed: "left"
        },
        {
          prop: "measuringToolCode",
          label: $i18n.t('limsMeasuringToolsLedgerCollectReturn.measuringToolCode'),  // 量检具编码
          width: "120",
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "measuringToolName",
          label: $i18n.t('limsMeasuringToolsLedgerCollectReturn.measuringToolName'),  // 量检具名称
          width: "150",
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "measuringToolSpecification",
          label: $i18n.t('limsMeasuringToolsLedgerCollectReturn.measuringToolSpecification'),  // 规格型号
          width: "150",
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "measuringToolsTypeName",
          label: $i18n.t('limsMeasuringToolsLedgerCollectReturn.measuringToolsTypeCode'),  // 类型编码
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
            associatedQueryColumnProp: [ //需要变动的列搜索数据的prop。  当前值变动时，需要有其它列搜索，根据此列的值变动重新获取列搜索数据。 非必填
              {
                refreshKey: 'accuracyLevelCode', // refreshKey当前列值变动后要刷新的列的key
                searchKey: "typeCode", // 刷新列的数据源接口重新请求后要变动的参数值的key，将当前列的搜索条件返回值赋给刷新列的参数key例如 {regionName: xxx(当前列的值)}
              },
            ],
          },
        },
        {
          prop: "accuracyLevelCode",
          label: $i18n.t('limsMeasuringToolsLedgerCollectReturn.accuracyLevelCode'),  // 精度等级编码
          width: "100",
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: {
            // 非必填 对象{} 不设置，就是默认模糊搜索
            type: "radio", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
          },
          optionProp: {
            value: "accuracyLevelCode",
            label: "accuracyLevelName",
          },
          option: async (data) => {
            if (!data || data.typeCode == '') {
              data = {}
            }
            const list = await getAccuracyLevelCodeList({
                typeCode: data['typeCode'],
              });
            return list.data.result;
          },
        },
        {
          prop: "measuringRange",
          label: $i18n.t('limsMeasuringToolsLedgerCollectReturn.measuringRange'),  // 测量范围
          width: "120",
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "instrumentCategory",
          label: $i18n.t('limsMeasuringToolsLedgerCollectReturn.instrumentCategory'),  // 仪器类别(字典：instrument_category_type)【1：内部检定 2：送检设备 3：厂商检定 4：不需检定】
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
            const list = await getInstrumentCategoryList();
            return list.data.result;
          },
        },
//        {
//          prop: "status",
//          label: $i18n.t('limsMeasuringToolsLedgerCollectReturn.status'),  // 状态(字典：measuring_tool_status)【1：使用中 2：封存 3：报废 4：停用 5：丢失】
//          width: "100",
//          showOverflowTooltip: true,
//          showColumnSearch: true,
//          showColumnSearchConfig: {
//            // 非必填 对象{} 不设置，就是默认模糊搜索
//            type: "radio", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
//          },
//          optionProp: {
//            value: "value",
//            label: "description",
//          },
//          option: async (data) => {
//            const list = await getStatusList();
//            return list.data.result;
//          },
//        },
        {
          prop: "collectReturnStatus",
          label: $i18n.t('limsMeasuringToolsLedgerCollectReturn.collectReturnStatus'),  // 领用归还状态(字典：measuring_tool_status)【1：在库 2：已借出】
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
        {
          prop: "checkStatus",
          label: $i18n.t('limsMeasuringToolsLedgerCollectReturn.checkStatus'),  // 检定状态(字典：check_status)【1：送检中 2：已检定 3：待检定 4：已逾期】
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
            return list.data.result
          },
        },
      ]
    }
  },
  methods: {
    // 弹框表格，双击表格，或者点击确定 返回选中数据
    setSelectMeasuringTools(data) {
      // 调试完成记得删除控制台打印
      console.log("选中数据", data)
      let list = [
        ...(this.operateFormDataDialog?.detailList ?? []),
        ...data.map((ite) => {
          return {
            ...ite
          }
        })
      ]

      // 筛选重复值,插入
      this.$set(this.operateFormDataDialog, "detailList", uniqueKey(list, "measuringToolCode"))
    }
  }
}
