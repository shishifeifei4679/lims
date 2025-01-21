import {
  getCheckRecordsList as  getCheckRecordsList,
  getDepartmentCodeTree,
  getInstrumentCategoryList
} from '@/api/limsmeasuringtools/measuringtoolsoutsourcingcheck'
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
export const measuringToolsCheckLogDialog = {
  data() {
    return {
      checkRecordsVisible: false, //表格弹框隐藏显示
      getCheckRecordsList, // 获取弹框数据接口
      checkRecordsHasFooter: false, // 是否需要底部按钮默认true
      checkRecordsSearchDialog: {
        inline: true,
        span: 24,
        formDesc: {
          checkTime: {
            type: "input",
            layout: 8,
            label: $i18n.t("measuringtoolsoutsourcingcheck.checkTime")
          },
        }
      },
      checkRecordsDialogColumn: [
        {
          type: "index",
          label: $i18n.t("common.order"),
          width: 60,
          fixed: "left"
        },
        //新增
        {
          prop: "sendCheckName",
          label: $i18n.t('measuringtoolsoutsourcingcheck.sendCheckName'),  // 检定日期
          width: 145,
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "sendCheckTime",
          label: $i18n.t('measuringtoolsoutsourcingcheck.sendCheckTime'),  // 送检日期
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
          label: $i18n.t('measuringtoolsoutsourcingcheck.sendCheckType'),  // 检定日期
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
            let list = await getDict("lims_out_send_check_type");
            return list.data.result;
          },
        },
        // end
        {
          prop: "checkTime",
          label: $i18n.t('measuringtoolsoutsourcingcheck.checkTime'),  // 检定日期
          width: 165,
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: {
            type: "dateTimePicker",
            dateType: "daterange",
            valueFormat: 'yyyy-MM-dd'
          }
        },
        {
          prop: "checkResult",
          label: $i18n.t('measuringtoolsoutsourcingcheck.checkResult'),  // 检定结果
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
          prop: "verificationFee",
          label: $i18n.t('measuringtoolsoutsourcingcheck.verificationFee'),  // 检定费用
          width: 150,
          showOverflowTooltip: true,
          showColumnSearch: true
        },
        {
          prop: "verificationFeeUnit",
          label: $i18n.t('measuringtoolsoutsourcingcheck.verificationFeeUnit'),  // 检定费用单位(字典：lims_verification_fee_unit)【1：元 2：万元】
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
            let list = await getDict("lims_verification_fee_unit");
            return list.data.result;
          },
        },
        {
          prop: "checkType",
          label: $i18n.t('measuringtoolsoutsourcingcheck.checkType'),  // 检定方式
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
            let list = await getDict("lims_check_type");
            return list.data.result;
          },
        },
        {
          prop: "verificationManufacturerName",
          label: $i18n.t('measuringtoolsoutsourcingcheck.verificationManufacturerName'),  // 检定厂商
          width: 120,
          showOverflowTooltip: true,
          showColumnSearch: true
        },
        {
          prop: "verificationCertificateCode",
          label: $i18n.t('measuringtoolsoutsourcingcheck.verificationCertificateCode'),  // 检定证书编码
          width: 120,
          showOverflowTooltip: true,
          showColumnSearch: true
        },
        {
          prop: "verificationCertificateCode",
          label: $i18n.t('measuringtoolsoutsourcingcheck.verificationCertificateCode'),  // 检定证书编码
          width: 120,
          showOverflowTooltip: true,
          showColumnSearch: true
        },
        {
          prop: "checkContent",
          label: $i18n.t('measuringtoolsoutsourcingcheck.checkContent'),  // 检定内容
          width: 120,
          showOverflowTooltip: true,
          showColumnSearch: true
        },
        {
          prop: "checkReport",
          label: $i18n.t('measuringtoolsoutsourcingcheck.checkReport'),  // 检定报告
          width: 210,
          showOverflowTooltip: true,
          showColumnSearch: true,
          render: (h, { row }) => {
            return (
              <el-link type="primary"  target="_blank" href={row.checkReport}>
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
          label: $i18n.t('measuringtoolsoutsourcingcheck.checkReason'),  // 不合格说明
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
