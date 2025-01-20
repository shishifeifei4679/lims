import {
  exportUrl,
  downloadTemplateUrl,
} from '@/api/limsCheckTask/limsCheckTask'

import {exportExcel} from '@/utils/judge'
import {getAllUserList, getUserList} from "@/api/user";
import {getDict} from "@/api/common";

// 列表头按钮配置
export const operateList = [
  // {
  //   name: "导出",
  //   type: "primary",
  //   icon: "el-icon-download",
  //   handleName: "export", //点击时返回的标识
  //   url: exportUrl,
  //   //auth: "auth:operlog:export", //权限字段
  // },
  {
    name: $i18n.t("common.add"),
    type: "primary",
    icon: "el-icon-circle-plus-outline",
    handleName: "add", //点击时返回的标识
  },
  {
    name: $i18n.t("common.delete"),
    type: "danger",
    icon: "el-icon-delete",
    handleName: "deleteBatch", //点击时返回的标识
    isMultiple: true, // isSingle 表示必须选择一项//isMultiple: true, // 表示必须多选
  },
  {
    name: $i18n.t("checkTask.submitBatch"),
    type: "success",
    icon: "el-icon-finished",
    handleName: "submitBatch", //点击时返回的标识
    isMultiple: true, // isSingle 表示必须选择一项//isMultiple: true, // 表示必须多选
  },
  {
    name: $i18n.t("checkTask.auditBatch"),
    type: "success",
    icon: "el-icon-circle-check",
    handleName: "auditBatch", //点击时返回的标识
    isSingle: true, // isSingle 表示必须选择一项//isMultiple: true, // 表示必须多选
  },
  /*{
    name: "导入",
    type: "primary",
    icon: "el-icon-circle-plus-outline",
    handleName: "import", //点击时返回的标识
  },*/
]
// 行末按钮配置
export const rowConfig = [
  {
    name: $i18n.t("common.edit"),
    type: "primary",
    class: "row-btn-primary",
    handleName: "edit", //点击时返回的标识
    disabled: (data)=>{
      return data.status == 3
    },
  },
  {
    name: $i18n.t("common.details"),
    type: "info",
    class: "row-btn-info",
    handleName: "detail", //点击时返回的标识
  },
  {
    name: $i18n.t("common.delete"),
    type: "danger",
    class: "row-btn-danger",
    handleName: "delete", //点击时返回的标识
  },
]
// 搜索条件配置
export const searchConfig = {
  inline: true,
  formDesc: {
    code: {
      type: 'input',
      label: $i18n.t("checkTask.code"),
    },
    expectFinishTime: {
      type: 'datetimerange',
      label: $i18n.t("checkTask.expectFinishTime"),
      attrs: {
        valueFormat: "yyyy-MM-dd HH:mm:ss",
        searchArrKey: ["expectFinishTimeMin", "expectFinishTimeMax"]
      },
    },
    entrustName: {
      type: 'input',
      label: $i18n.t("checkTask.entrustName"),
      // prop: {
      //   value: 'jobNumber',
      //   text: 'nickName'
      // },
      // options: async (data) => {
      //   const list = await getAllUserList()
      //   return list.data.result
      // },
    },
    senderName: {
      type: 'input',
      label: $i18n.t("checkTask.senderName"),
      // prop: {
      //   value: 'jobNumber',
      //   text: 'nickName'
      // },
      // options: async (data) => {
      //   const list = await getAllUserList()
      //   return list.data.result
      // },
    },
    // sendTime: {
    //   type: 'datetimerange',
    //   label: '送达时间',
    //   attrs: {
    //     valueFormat: "yyyy-MM-dd HH:mm:ss",
    //     searchArrKey: ["sendTimeMin", "sendTimeMax"]
    //   },
    // },
    finishTime: {
      type: 'datetimerange',
      label: $i18n.t("checkTask.finishTime"),
      attrs: {
        valueFormat: "yyyy-MM-dd HH:mm:ss",
        searchArrKey: ["finishTimeMin", "finishTimeMax"]
      },
    },
    status: {
      type: 'select',
      label: $i18n.t("checkTask.status"),
      prop: {
        value: "value",
        text: "description"
      },
      options: async (data) => {
        const list = await getDict("lims_check_task_status");
        return list.data.result
      }
    },
  },
}
// 新增/删除表单配置
export const formDescDialog = {
  span: 24,
  disabled: false,
  isShowSubmitBtn: true,
  formDesc: {
    code: {
      type: "input",
      label: $i18n.t("checkTask.code"),
      layout: 12,
      required: false,
    },
    deptId: {
      type: "number",
      label: $i18n.t("checkTask.deptId"),
      layout: 12,
      required: false,
    },
    deptName: {
      type: "input",
      label: $i18n.t("checkTask.deptName"),
      layout: 12,
      required: false,
    },
    expectFinishTime: {
      type: "datetime",
      label: $i18n.t("checkTask.expectFinishTime"),
      layout: 12,
      required: false,
      attrs: {
        "valueFormat": "yyyy-MM-dd HH:mm:ss",
      },
    },
    entrustId: {
      type: "number",
      label: $i18n.t("checkTask.entrustId"),
      layout: 12,
      required: false,
    },
    entrustName: {
      type: "input",
      label: $i18n.t("checkTask.entrustName"),
      layout: 12,
      required: false,
    },
    entrustTelephone: {
      type: "input",
      label: $i18n.t("checkTask.entrustTelephone"),
      layout: 12,
      required: false,
    },
    senderId: {
      type: "number",
      label: $i18n.t("checkTask.senderId"),
      layout: 12,
      required: false,
    },
    senderName: {
      type: "input",
      label: $i18n.t("checkTask.senderName"),
      layout: 12,
      required: false,
    },
    senderTelephone: {
      type: "input",
      label: $i18n.t("checkTask.senderTelephone"),
      layout: 12,
      required: false,
    },
    sendTime: {
      type: "datetime",
      label: $i18n.t("checkTask.sendTime"),
      layout: 12,
      required: false,
      attrs: {
        "valueFormat": "yyyy-MM-dd HH:mm:ss",
      },
    },
    finishTime: {
      type: "datetime",
      label: $i18n.t("checkTask.finishTime"),
      layout: 12,
      required: false,
      attrs: {
        "valueFormat": "yyyy-MM-dd HH:mm:ss",
      },
    },
    status: {
      type: "input",
      label: $i18n.t("checkTask.status"),
      layout: 12,
      required: false,
    },
    reportUsable: {
      type: "input",
      label: $i18n.t("checkTask.reportUsable"),
      layout: 12,
      required: false,
    },
    reportOpinion: {
      type: "input",
      label: $i18n.t("checkTask.reportOpinion"),
      layout: 12,
      required: false,
    },
    reportReviewerId: {
      type: "number",
      label: $i18n.t("checkTask.reportReviewerId"),
      layout: 12,
      required: false,
    },
    reportReviewerName: {
      type: "input",
      label: $i18n.t("checkTask.reportReviewerName"),
      layout: 12,
      required: false,
    },
    remark: {
      type: "input",
      label: $i18n.t("checkTask.remark"),
      layout: 12,
      required: false,
    },
    factoryCode: {
      type: "input",
      label: $i18n.t("checkTask.factoryCode"),
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
            label: $i18n.t("checkTask.file"),
            layout: 24,
            // required: true,

        },
    }
}

