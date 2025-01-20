import {
  getCheckRecordsList as  getCheckRecordsListLeft,
  getDepartmentCodeTree,
  getInstrumentCategoryList
} from '@/api/limsmeasuringtools/measuringtoolsinternalcheck'
import { uniqueKey } from "@/utils/judge"
import { getDict } from "@/api/common.js";
function getName(url) {
  if (url) {
    let arr = url.split("/");
    return arr.at(-1);
  } else {
    return "";
  }
}
export const measuringToolsCheckLogDialogLeft = {
  data() {
    return {
      checkRecordsVisible: false, //表格弹框隐藏显示
      getCheckRecordsListLeft, // 获取弹框数据接口
      checkRecordsHasFooter: false, // 是否需要底部按钮默认true
      checkRecordsSearchDialog: {
        inline: true,
        span: 24,
        formDesc: {
          checkTime: {
            type: "input",
            layout: 8,
            label: $i18n.t("measuringtoolsinternalcheck.checkTime")
          },
        }
      },
      checkRecordsDialogColumnLeft: [

        {
          type: "index",
          label: $i18n.t("common.order"),
          width: 60,
          fixed: "left"
        },
              //新增
              {
                prop: "sendCheckName",
                label: $i18n.t('measuringtoolsinternalcheck.sendCheckName'),  // 检定日期
                width: 145,
                showOverflowTooltip: true,
                showColumnSearch: true,
              },
              {
                prop: "sendCheckTime",
                label: $i18n.t('measuringtoolsinternalcheck.sendCheckTime'),  // 送检日期
                width: 175,
                showOverflowTooltip: true,
                showColumnSearch: true,
                showColumnSearchConfig: {
                  type: "dateTimePicker",
                  dateType: "datetimerange",
                }
              },
              {
                prop: "sendCheckType",
                label: $i18n.t('measuringtoolsinternalcheck.sendCheckType'),  // 检定日期
                width: 145,
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
                  let list = await getDict("lims_in_send_check_type");
                  return list.data.result;
                },
        },
        {
          prop: "checkTime",
          label: $i18n.t('measuringtoolsinternalcheck.checkTime'),  // 检定日期
          width: 165,
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: {
            type: 'dateTimePicker',
            dateType: 'daterange',
            valueFormat: 'yyyy-MM-dd'
          }
        },
        {
          prop: "checkResult",
          label: $i18n.t('measuringtoolsinternalcheck.checkResult'),  // 检定结果
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
        {
          prop: "checkDepartmentName",
          label: $i18n.t('measuringtoolsinternalcheck.checkDepartmentCode'),  // 检定部门
          width: 120,
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
          prop: "checkName",
          label: $i18n.t('measuringtoolsinternalcheck.checkName'),  // 检定人
          width: 150,
          showOverflowTooltip: true,
          showColumnSearch: true
        },
        // {
        //   prop: "checkType",
        //   label: $i18n.t('measuringtoolsinternalcheck.checkType'),  // 检定方式
        //   width: 100,
        //   showOverflowTooltip: true,
        //   showColumnSearch: true,
        //   showColumnSearchConfig: {
        //     // 非必填 对象{} 不设置，就是默认模糊搜索
        //     type: "radio", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
        //   },
        //   optionProp: {
        //     value: "value",
        //     label: "description",
        //   },
        //   option: async (data) => {
        //     let list = await getDict("lims_check_type");
        //     return list.data.result;
        //   },
        // },
        {
          prop: "checkContent",
          label: $i18n.t('measuringtoolsinternalcheck.checkContent'),  // 检定内容
          width: 120,
          showOverflowTooltip: true,
          showColumnSearch: true
        },
        {
          prop: "checkReport",
          label: $i18n.t('measuringtoolsinternalcheck.checkReport'),  // 检定报告
          width: 210,
          showOverflowTooltip: true,
          showColumnSearch: true,
          render: (h, { row }) => {
            return (
              <el-link type="primary" href={row.checkReport}  target="_blank">
                <span
                  style={{
                    width: "184px",
                    overflow: "hidden",
                    "text-overflow": "ellipsis",
                    "white-space": "nowrap",
                    display: "block",
                  }}
                  title={getName(row.checkReport)}
                >
                  {getName(row.checkReport)}
                </span>
              </el-link>
            );
          }
        },
        {
          prop: "checkReason",
          label: $i18n.t('measuringtoolsinternalcheck.checkReason'),  // 不合格说明
          width: 150,
          showOverflowTooltip: true,
          showColumnSearch: true
        },
      ]
    }
  },
  methods: {

  }
}
