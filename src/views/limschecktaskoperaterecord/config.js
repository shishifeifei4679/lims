import {
  exportUrl,
  downloadTemplateUrl,
} from '@/api/limschecktaskoperaterecord/limsCheckTaskOperateRecord'

import {exportExcel} from '@/utils/judge'
import {getDict} from "@/api/common";
import {getAllUserList} from "@/api/user";

// 列表头按钮配置
export const operateList = []
// 行末按钮配置
export const rowConfig = []
// 搜索条件配置
export const searchConfig = {
  inline: true,
  formDesc: {
    taskCode: {
      type: 'input',
      label: $i18n.t("checkTaskOperateRecord.taskCode"),
    },
    sampleName: {
      type: 'input',
      label: $i18n.t("checkTaskOperateRecord.sampleName"),
    },
    // itemsName: {
    //   type: 'input',
    //   label: '检测项目名称',
    // },
    operatorName: {
      type: 'input',
      label: $i18n.t("checkTaskOperateRecord.operatorName"),
      // prop: {
      //   value: 'jobNumber',
      //   text: 'nickName'
      // },
      // options: async (data) => {
      //   const list = await getAllUserList()
      //   return list.data.result
      // },
    },
    operateTime: {
      type: 'datetimerange',
      label: $i18n.t("checkTaskOperateRecord.operateTime"),
      attrs: {
        valueFormat: "yyyy-MM-dd HH:mm:ss",
        searchArrKey: ["operateTimeMin", "operateTimeMax"]
      },
    },
    operateStage: {
      type: 'select',
      label: $i18n.t("checkTaskOperateRecord.operateStage"),
      prop: {
        value: "value",
        text: "description"
      },
      options: async (data) => {
        const list = await getDict("lims_check_task_operate_stage");
        return list.data.result
      }
    },
    operateName: {
      type: 'input',
      label: $i18n.t("checkTaskOperateRecord.operateName"),
    },
    // mainCheckerName: {
    //   type: 'select',
    //   label: '检测阶段主检人',
    //   prop: {
    //     value: 'jobNumber',
    //     text: 'nickName'
    //   },
    //   options: async (data) => {
    //     const list = await getAllUserList()
    //     return list.data.result
    //   },
    // },
    // remark: {
    //   type: 'input',
    //   label: '备注',
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
      label: $i18n.t("checkTaskOperateRecord.taskId"),
      layout: 12,
      required: false,
    },
    taskCode: {
      type: "input",
      label: $i18n.t("checkTaskOperateRecord.taskCode"),
      layout: 12,
      required: false,
    },
    sampleId: {
      type: "number",
      label: $i18n.t("checkTaskOperateRecord.sampleId"),
      layout: 12,
      required: false,
    },
    sampleName: {
      type: "input",
      label: $i18n.t("checkTaskOperateRecord.sampleName"),
      layout: 12,
      required: false,
    },
    itemsId: {
      type: "number",
      label: $i18n.t("checkTaskOperateRecord.itemsId"),
      layout: 12,
      required: false,
    },
    itemsName: {
      type: "input",
      label: $i18n.t("checkTaskOperateRecord.itemsName"),
      layout: 12,
      required: false,
    },
    operatorId: {
      type: "number",
      label: $i18n.t("checkTaskOperateRecord.operatorId"),
      layout: 12,
      required: false,
    },
    operatorName: {
      type: "input",
      label: $i18n.t("checkTaskOperateRecord.operatorName"),
      layout: 12,
      required: false,
    },
    operateTime: {
      type: "datetime",
      label: $i18n.t("checkTaskOperateRecord.operateTime"),
      layout: 12,
      required: false,
      attrs: {
        "valueFormat": "yyyy-MM-dd HH:mm:ss",
      },
    },
    operateStage: {
      type: "input",
      label: $i18n.t("checkTaskOperateRecord.operateStage"),
      layout: 12,
      required: false,
    },
    operateName: {
      type: "input",
      label: $i18n.t("checkTaskOperateRecord.operateName"),
      layout: 12,
      required: false,
    },
    // round: {
    //   type: "number",
    //   label: "操作轮次",
    //   layout: 12,
    //   required: false,
    // },
    // mainCheckerName: {
    //   type: "input",
    //   label: "样品检测阶段主检人",
    //   layout: 12,
    //   required: false,
    // },
    remark: {
      type: "input",
      label: $i18n.t("checkTaskOperateRecord.remark"),
      layout: 12,
      required: false,
    },
    factoryCode: {
      type: "input",
      label: $i18n.t("checkTaskOperateRecord.factoryCode"),
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
            label: $i18n.t("checkTaskOperateRecord.file"),
            layout: 24,
            // required: true,

        },
    }
}

