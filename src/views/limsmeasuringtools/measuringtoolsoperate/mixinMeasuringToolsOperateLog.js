import {
  getOperateLogList as  getOperateLogList,
  getDepartmentCodeTree
} from '@/api/limsmeasuringtools/measuringtoolsoperate'
import { uniqueKey } from "@/utils/judge"
import { getDict } from "@/api/common.js";

export const measuringToolsOperateLogDialog = {
  data() {
    return {
      operateLogVisible: false, //表格弹框隐藏显示
      getOperateLogList, // 获取弹框数据接口
      operateLogHasFooter: false, // 是否需要底部按钮默认true
      operateLogSearchDialog: {
        inline: true,
        span: 24,
        formDesc: {
          collectName: {
            type: "input",
            layout: 8,
            label: $i18n.t("measuringtoolsoperate.collectName")
          },
        }
      },
      operateLogDialogColumn: [
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
          prop: "createTime",
          label: $i18n.t('measuringtoolsoperate.applyTime'),  // 申请时间
          width: 165,
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: {
            type: 'dateTimePicker',
            dateType: 'datetimerange',
          }
        },
        {
          prop: "operateType",
          label: $i18n.t('measuringtoolsoperate.operateType'),  // 操作类型(字典：lims_operate_type)【0：量检具登记 1：启用 2：封存 3：报废 4：停用 5：丢失】
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
            let list = await getDict("lims_operate_type");
            return list.data.result;
          },
        },
        {
          prop: "operateContent",
          label: $i18n.t('measuringtoolsoperate.operateContent'),  // 操作内容
          width: 100,
          showOverflowTooltip: true,
          showColumnSearch: true
        },
        {
          prop: "operateExecutorName",
          label: $i18n.t('measuringtoolsoperate.operateExecutorName'),  // 执行人
          width: 165,
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "operateApprovalResult",
          label: $i18n.t('measuringtoolsoperate.operateApprovalResult'),  // 审批结果
          width: 165,
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
      ]
    }
  },
  methods: {

  }
}
