import {
  exportUrl,
  downloadTemplateUrl,
} from '@/api/limscheckitems/limsCheckItems'

import {exportExcel} from '@/utils/judge'
import {getDict} from "@/api/common";

// 列表头按钮配置
export const operateList = [
  {
    name: $i18n.t("checkItems.resultEntry"),
    type: "success",
    icon: "el-icon-check",
    handleName: "resultEntry", //点击时返回的标识
    isSingle: true, // isSingle 表示必须选择一项//isMultiple: true, // 表示必须多选
    //auth: "auth:operlog:export", //权限字段
  },
  {
    name: $i18n.t("checkItems.handleBackAll"),
    type: "danger",
    icon: "el-icon-warning-outline",
    handleName: "handleBackAll", //点击时返回的标识
    isSingle: true, // isSingle 表示必须选择一项//isMultiple: true, // 表示必须多选
  },
]
// 行末按钮配置
export const rowConfig = [
  {
    name: $i18n.t("common.details"),
    type: "info",
    class: "row-btn-info",
    handleName: "detail", //点击时返回的标识
  },
]
// 搜索条件配置
export const searchConfig = {
  inline: true,
  formDesc: {
    taskCode: {
      type: 'input',
      label: $i18n.t("checkItems.taskCode"),
    },
    sampleName: {
      type: 'input',
      label: $i18n.t("checkItems.sampleName"),
    },
    status: {
      type: 'select',
      label: $i18n.t("checkItems.status"),
      prop: {
        value: "value",
        text: "description"
      },
      options: async (data) => {
        const list = await getDict("lims_check_sample_status");
        return list.data.result
      }
    },
    // factoryBrand: {
    //   type: 'input',
    //   label: '厂家及品牌',
    // },
  },
}
// 新增/删除表单配置
export const formDescDialog = {
  span: 24,
  disabled: false,
  isShowSubmitBtn: true,
  formDesc: {
    taskId: {
      type: "number",
      label: $i18n.t("checkItems.taskId"),
      layout: 12,
      required: false,
    },
    taskCode: {
      type: "input",
      label: $i18n.t("checkItems.taskCode"),
      layout: 12,
      required: false,
    },
    sampleId: {
      type: "number",
      label: $i18n.t("checkItems.sampleId"),
      layout: 12,
      required: false,
    },
    sampleName: {
      type: "input",
      label: $i18n.t("checkItems.sampleName"),
      layout: 12,
      required: false,
    },
    itemsId: {
      type: "number",
      label: $i18n.t("checkItems.itemsId"),
      layout: 12,
      required: false,
    },
    itemsName: {
      type: "input",
      label: $i18n.t("checkItems.itemsName"),
      layout: 12,
      required: false,
    },
    itemsCode: {
      type: "input",
      label: $i18n.t("checkItems.itemsCode"),
      layout: 12,
      required: false,
    },
    parentCode: {
      type: "input",
      label: $i18n.t("checkItems.parentCode"),
      layout: 12,
      required: false,
    },
    standardName: {
      type: "input",
      label: $i18n.t("checkItems.standardName"),
      layout: 12,
      required: false,
    },
    referenceValue: {
      type: "input",
      label: $i18n.t("checkItems.referenceValue"),
      layout: 12,
      required: false,
    },
    unit: {
      type: "input",
      label: $i18n.t("checkItems.unit"),
      layout: 12,
      required: false,
    },
    requirement: {
      type: "input",
      label: $i18n.t("checkItems.requirement"),
      layout: 12,
      required: false,
    },
    colorNo: {
      type: "input",
      label: $i18n.t("checkItems.colorNo"),
      layout: 12,
      required: false,
    },
    checkValue: {
      type: "input",
      label: $i18n.t("checkItems.checkValue"),
      layout: 12,
      required: false,
    },
    checkResult: {
      type: "input",
      label: $i18n.t("checkItems.checkResult"),
      layout: 12,
      required: false,
    },
    checkerId: {
      type: "number",
      label: $i18n.t("checkItems.checkerId"),
      layout: 12,
      required: false,
    },
    checkerName: {
      type: "input",
      label: $i18n.t("checkItems.checkerName"),
      layout: 12,
      required: false,
    },
    fileName: {
      type: "input",
      label: $i18n.t("checkItems.fileName"),
      layout: 12,
      required: false,
    },
    fileUrl: {
      type: "input",
      label: $i18n.t("checkItems.fileUrl"),
      layout: 12,
      required: false,
    },
    status: {
      type: "input",
      label: $i18n.t("checkItems.status"),
      layout: 12,
      required: false,
    },
    orderNum: {
      type: "number",
      label: $i18n.t("checkItems.orderNum"),
      layout: 12,
      required: false,
    },
    remark: {
      type: "input",
      label: $i18n.t("checkItems.remark"),
      layout: 12,
      required: false,
    },
    factoryCode: {
      type: "input",
      label: $i18n.t("checkItems.factoryCode"),
      layout: 12,
      required: false,
    },
  },
}
//导入数据
export const importFormDescDialog = {
  span: 24,
  disabled: false,
  isShowSubmitBtn: true,
  formDesc: {
    model: {
      type: "button",
      label: "",
      layout: 24,
      required: false,
      title: $i18n.t("common.downloadTemplate"),
      style: {
        color: '#1867c0',
        fontSize: '14px'
      },
      on: {
        click: () => {
          exportExcel(downloadTemplateUrl)
        }
      }
    },
    file: {
      type: "input",
      label: $i18n.t("checkItems.file"),
      layout: 24,
      // required: true,

    },
  }
}

