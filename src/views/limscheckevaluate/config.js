import {
  exportUrl,
  downloadTemplateUrl,
} from '@/api/limscheckevaluate/limsCheckEvaluate'

import {exportExcel} from '@/utils/judge'
import {getDict} from "@/api/common";

// 列表头按钮配置
export const operateList = [
  {
    name: $i18n.t("checkEvaluate.review"),
    type: "success",
    icon: "el-icon-circle-check",
    handleName: "review", //点击时返回的标识
    isSingle:true
    //auth: "auth:operlog:export", //权限字段
  },
  {
    name: $i18n.t("checkEvaluate.evaluate"),
    type: "success",
    icon: "el-icon-star-off",
    handleName: "evaluate", //点击时返回的标识
    isSingle:true
  },
  {
    name: $i18n.t("checkEvaluate.downloadPDF"),
    type: "primary",
    icon: "el-icon-download",
    handleName: "downloadPDF", //点击时返回的标识
    isSingle: true, // isSingle 表示必须选择一项//isMultiple: true, // 表示必须多选
  },
]
// 行末按钮配置
export const rowConfig = [
  {
    name: $i18n.t("common.details"),
    type: "info",
    class: "row-btn-info",
    handleName: "view", //点击时返回的标识
  },
]
// 搜索条件配置
export const searchConfig = {
  inline: true,
  formDesc: {
    code: {
      type: 'input',
      label: $i18n.t("checkEvaluate.code"),
    },
    // sampleName: {
    //   type: 'input',
    //   label: '样品名称',
    // },
    status: {
      type: 'select',
      label: $i18n.t("checkEvaluate.status"),
      prop: {
        value: "value",
        text: "description"
      },
      options: async (data) => {
        const list = await getDict("lims_check_task_status");
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
      label: $i18n.t("checkEvaluate.taskId"),
      layout: 12,
      required: false,
    },
    taskCode: {
      type: "input",
      label: $i18n.t("checkEvaluate.taskCode"),
      layout: 12,
      required: false,
    },
    evaluateItemId: {
      type: "number",
      label: $i18n.t("checkEvaluate.evaluateItemId"),
      layout: 12,
      required: false,
    },
    evaluateItemName: {
      type: "input",
      label: $i18n.t("checkEvaluate.evaluateItemName"),
      layout: 12,
      required: false,
    },
    score: {
      type: "input",
      label: $i18n.t("checkEvaluate.score"),
      layout: 12,
      required: false,
    },
    evaluateContent: {
      type: "input",
      label: $i18n.t("checkEvaluate.evaluateContent"),
      layout: 12,
      required: false,
    },
    evaluatorName: {
      type: "input",
      label: $i18n.t("checkEvaluate.evaluatorName"),
      layout: 12,
      required: false,
    },
    evaluatorId: {
      type: "input",
      label: $i18n.t("checkEvaluate.evaluatorId"),
      layout: 12,
      required: false,
    },
    evaluateTime: {
      type: "datetime",
      label: $i18n.t("checkEvaluate.evaluateTime"),
      layout: 12,
      required: false,
      attrs: {
        "valueFormat": "yyyy-MM-dd HH:mm:ss",
      },
    },
    remark: {
      type: "input",
      label: $i18n.t("checkEvaluate.remark"),
      layout: 12,
      required: false,
    },
    factoryCode: {
      type: "input",
      label: $i18n.t("checkEvaluate.factoryCode"),
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
            label: $i18n.t("checkEvaluate.model"),
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
            label: $i18n.t("checkEvaluate.file"),
            layout: 24,
            // required: true,

        },
    }
}

