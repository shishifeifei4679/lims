
import { uniqueKey } from "@/utils/judge"
import {
  getList as  getCollectReturnLogList,
  rowCreate,
  rowUpdate,
  rowDel,
  rowDetail,
  importData,
  getDepartmentCodeTree
} from '@/api/limsmeasuringtools/measuringToolscollectreturndetail'
import {
  getDict // 字典查询
} from '@/api/common';
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
      collectReturnLogDialogColumn:[
        {
          type: "index",
          label: $i18n.t("common.order"), // 序号
          fixed: "left",
        },
        {
          prop: "orderNo",
          label: $i18n.t('limsMeasuringToolsCollectReturnDetail.orderNo'),  // 申请编码
          width: 160,
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: { // 非必填 对象{} 不设置，就是默认模糊搜索
            //type: 'radio', //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
          },
        },

        {
          prop: "operateType",
          label: $i18n.t('limsMeasuringToolsCollectReturnDetail.operateType'),  // 操作类型(字典：领用归还操作类型-lims_collect_return_operate_type) 1：领用 2：归还
          width: '120',
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: {
            // 非必填 对象{} 不设置，就是默认模糊搜索
            type: "radio", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
            specifySearchKey: 'operateType',
          },
          optionProp: {
            value: "value",
            label: "description",
          },
          option: async (data) => {
            const list = await getDict("lims_collect_return_operate_type");
            return list.data.result;
          },
        },
        {
          prop: "collectDepartmentName",
          label: $i18n.t("limsMeasuringToolsCollectReturnDetail.collectDepartmentName"), // 领用部门
          width: "120",
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
//          render: (h, scope) => {
//            // scope列表上选择的数据
//            return (
//              <span>{scope.row.collectDepartmentName || '/'}</span>
//            );
//          },
        },
        {
          prop: "expectedReturnDate",
          label: $i18n.t('limsMeasuringToolsCollectReturnDetail.expectedReturnDate'),  // 预计归还日期
          width: 170,
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: {
            type: "dateTimePicker", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
            valueFormat: 'yyyy-MM-dd'
          },
//          render: (h, scope) => {
//            // scope列表上选择的数据
//            return (
//              <span>{scope.row.expectedReturnDate || '/'}</span>
//            );
//          },
        },
        {
          prop: "operateExplain",
          label: $i18n.t('limsMeasuringToolsCollectReturnDetail.operateExplain'),  // 情况说明
          width: '160',
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: { // 非必填 对象{} 不设置，就是默认模糊搜索
            //type: 'radio', //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
          },
//          render: (h, scope) => {
//            // scope列表上选择的数据
//            return (
//              <span>{scope.row.operateExplain || '/'}</span>
//            );
//          },
        },
        {
          prop: "createByName",
          label: $i18n.t('limsMeasuringToolsCollectReturnDetail.createByName'),  // 创建人
          width: '120',
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: { // 非必填 对象{} 不设置，就是默认模糊搜索
            //type: 'radio', //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
          },
        },
        {
          prop: "createTime",
          label: $i18n.t('limsMeasuringToolsCollectReturnDetail.createTime'),  // 创建时间
          width: 160,
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: {
            type: "dateTimePicker", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
            // defaultValue: ['2024-08-03 00:00:00', '2024-08-16 23:59:59'],
          },
        },
      ]
    }
  },
  methods: {

  }
}
