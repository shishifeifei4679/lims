import {
  getCollectReturnLogList as  getCollectReturnLogList,
  getDepartmentCodeTree
} from '@/api/limsmeasuringtools/measuringtoolscollectreturn'
import { uniqueKey } from "@/utils/judge"

export const measuringToolsCollectReturnLogDialog = {
  data() {
    return {
      collectReturnLogVisible: false, //表格弹框隐藏显示
      getCollectReturnLogList, // 获取弹框数据接口
      collectReturnLogHasFooter: false, // 是否需要底部按钮默认true
      collectReturnLogSearchDialog: {
        inline: true,
        span: 24,
        formDesc: {
          collectName: {
            type: "input",
            layout: 8,
            label: $i18n.t("limsMeasuringToolsLedgerCollectReturn.collectName")
          },
        }
      },
      collectReturnLogDialogColumn: [
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
          label: $i18n.t('limsMeasuringToolsLedgerCollectReturn.applyTime'),  // 申请时间
          width: 165,
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: {
            type: 'dateTimePicker',
            dateType: 'datetimerange',
          }
        },
        {
          prop: "collectName",
          label: $i18n.t('limsMeasuringToolsLedgerCollectReturn.collectName'),  // 领用人名称
          width: 100,
          showOverflowTooltip: true,
          showColumnSearch: true
        },
        {
          prop: "collectTime",
          label: $i18n.t('limsMeasuringToolsLedgerCollectReturn.collectTime'),  // 领用时间
          width: 165,
          showColumnSearch: true,
          showColumnSearchConfig: {
            type: 'dateTimePicker',
            dateType: 'datetimerange',
          }
        },
        {
          prop: "collectDepartmentName",
          label: $i18n.t('limsMeasuringToolsLedgerCollectReturn.collectDepartmentName'),  // 领用部门名称
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
            specifySearchKey: "collectDepartmentCode",
            option: async (data) => {
              const list = await getDepartmentCodeTree();
              return list.data.result;
            },
          },
        },
        {
          prop: "expectedReturnTime",
          label: $i18n.t('limsMeasuringToolsLedgerCollectReturn.expectedReturnTime'),  // 预计归还时间
          width: 165,
          showColumnSearch: true,
          showColumnSearchConfig: {
            type: 'dateTimePicker',
            dateType: 'datetimerange',
          }
        },
        {
          prop: "collectExplain",
          label: $i18n.t('limsMeasuringToolsLedgerCollectReturn.collectExplain'),  // 领用情况说明
          width: 150,
          showOverflowTooltip: true,
          showColumnSearch: true
        },
        {
          prop: "returnName",
          label: $i18n.t('limsMeasuringToolsLedgerCollectReturn.returnName'),  // 归还人名称
          width: 120,
          showOverflowTooltip: true,
          showColumnSearch: true
        },
        {
          prop: "returnTime",
          label: $i18n.t('limsMeasuringToolsLedgerCollectReturn.returnTime'),  // 归还时间
          width: 165,
          showColumnSearch: true,
          showColumnSearchConfig: {
            type: 'dateTimePicker',
            dateType: 'datetimerange',
          }
        },
      ]
    }
  },
  methods: {

  }
}
