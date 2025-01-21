import {
  exportUrl,
  downloadTemplateUrl,
} from '@/api/limsStandardItemsHistory/limsStandardItemsHistory'

import {exportExcel} from '@/utils/judge'
import {deleteFile, getUnit} from "@/api/common";
import url from "@/axios/url";
import store from "@/store";
import {getAllUserList} from "@/api/user";
import {getLimsUnitList, getParentTypeList} from "@/api/limsStandardItems/limsStandardItems";
const { adminUrl } = url()
// 列表头按钮配置
export const operateList = [
  {
    name: $i18n.t("common.export"),
    type: "primary",
    icon: "el-icon-download",
    handleName: "export", //点击时返回的标识
    url: exportUrl,
    //auth: "auth:operlog:export", //权限字段
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
    itemsName: {
      type: "input",
      label: $i18n.t("standardItemsHistory.itemsName"),
    },
    itemsCode: {
      type: "input",
      label: $i18n.t("standardItemsHistory.itemsCode"),
    },
    // defaultCheckerId: {
    //   type: "select",
    //   label: "默认检测人",
    //   prop: {
    //     value: 'jobNumber',
    //     text: 'nickName'
    //   },
    //   options: async (data) => {
    //     const list = await getAllUserList()
    //     return list.data.result
    //   }
    // },
    // expirationDate: {
    //   type: 'daterange',
    //   label: '有效期',
    //   attrs: {
    //     valueFormat: 'yyyy-MM-dd HH:mm:ss',
    //     searchArrKey: ['expirationDateMin', 'expirationDateMax']
    //   }
    // },
    // status: {
    //   type: 'select',
    //   label: '状态',
    //   prop: {
    //     value: 'value',
    //     text: 'description'
    //   },
    //   options: async (data) => {
    //     const list = await getItemsStatusList()
    //     return list.data.result
    //   }
    // },
    parentCode: {
      type: 'select',
      label: $i18n.t("standardItemsHistory.parentCode"),
      prop: {
        value: 'value',
        text: 'description'
      },
      options: async (data) => {
        const list = await getParentTypeList()
        return list.data.result
      }
    },
    version: {
      type: "input",
      label: $i18n.t("standardItemsHistory.version"),
    },
  },
}
// 新增/删除表单配置
export const formDescDialog = {
  span: 24,
  disabled: false,
  isShowSubmitBtn: true,
  formDesc: {
    itemsName: {
      type: "input",
      label: $i18n.t("standardItemsHistory.itemsName"),
      layout: 12,
      required: true,
    },
    aliasName: {
      type: "input",
      label: $i18n.t("standardItemsHistory.aliasName"),
      layout: 12,
      required: false,
    },
    itemsCode: {
      type: "input",
      label: $i18n.t("standardItemsHistory.itemsCode"),
      layout: 12,
      required: true,
    },
    parentCode: {
      type: 'select',
      label: $i18n.t("standardItemsHistory.parentCode"),
      layout: 12,
      required: false,
      prop: {
        value: 'value',
        text: 'description'
      },
      options: async (data) => {
        const list = await getParentTypeList()
        return list.data.result
      },
    },
    standardName: {
      type: "input",
      label: $i18n.t("standardItemsHistory.standardName"),
      layout: 12,
      required: false,
    },
    referenceValue: {
      type: "input",
      label: $i18n.t("standardItemsHistory.referenceValue"),
      layout: 12,
      required: false,
    },
    unit: {
      type: "select",
      label: $i18n.t("standardItemsHistory.unit"),
      layout: 12,
      required: false,
      prop: {
        value: 'value',
        text: 'description'
      },
      options: async (data) => {
        const list = await getUnit()
        return list.data.result
      },
    },
    // defaultCheckerId: {
    //   type: "select",
    //   label: "默认检测人",
    //   layout: 12,
    //   required: false,
    //   prop: {
    //     value: 'jobNumber',
    //     text: 'nickName'
    //   },
    //   options: async (data) => {
    //     const list = await getAllUserList()
    //     return list.data.result
    //   },
    // },
    // expirationDate: {
    //   type: 'date',
    //   label: '有效期',
    //   layout: 12,
    //   required: true,
    //   attrs: {
    //     valueFormat: 'yyyy-MM-dd'
    //   }
    // },
    version: {
      type: "input",
      label: $i18n.t("standardItemsHistory.version"),
      layout: 12,
      required: false,
      disabled: true,
    },
    fileList: {
      type: 'upload-file',
      label: $i18n.t("standardItemsHistory.fileList"),
      layout: 24,
      required: false,
      attrs: {
        limit: 1,
        fileType: ['pdf', 'doc', 'docx'],
        accept: '.pdf, .doc, .docx',
        action: `${adminUrl}file`,
        data:{
          bucket :"limsservice"
        },
        headers: {
          Satoken:  store.getters.token
        },
        beforeRemove: (data, list) => {
          const filename = data.name
          const versionId = data.versionId
          return new Promise((resolve, reject) => {
            deleteFile(`${adminUrl}file`, {
              filename,
              versionId
            })
              .then((res) => {
                resolve(res.data)
              })
              .catch((error) => {
                reject(error)
              })
          })
        },
        // autoUpload: false,
        responseFn(response, file) {
          if (response.code === 0) {
            return {
              name: file.name,
              url: response.result.path, // 文件id
              size: file.size,
              ...response.result
            }
          }
        }
      }
    },
    // orderNum: {
    //   type: "number",
    //   label: "显示顺序",
    //   layout: 12,
    //   required: false,
    // },
    remark: {
      type: "textarea",
      label: $i18n.t("standardItemsHistory.remark"),
      layout: 24,
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
            label: $i18n.t("standardItemsHistory.file"),
            layout: 24,
            // required: true,

        },
    }
}

