import {
  exportUrl,
  downloadTemplateUrl, getParentTypeList, getItemsStatusList, getLimsUnitList,
} from '@/api/limsStandardItems/limsStandardItems'

import {exportExcel} from '@/utils/judge'
import url from "@/axios/url";
import {deleteFile, getUnit} from "@/api/common";
import store from "@/store";
import {getAllUserList} from "@/api/user";
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
  // {
  //   name: "导入",
  //   type: "primary",
  //   icon: "el-icon-circle-plus-outline",
  //   handleName: "import", //点击时返回的标识
  // },
]
// 行末按钮配置
export const rowConfig = [
  {
    name: $i18n.t("common.edit"),
    type: "primary",
    class: "row-btn-primary",
    handleName: "edit", //点击时返回的标识
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
    itemsName: {
      type: "input",
      label: $i18n.t("standardItems.itemsName"),
    },
    itemsCode: {
      type: "input",
      label: $i18n.t("standardItems.itemsCode"),
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
    //   },
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
      label: $i18n.t("standardItems.parentCode"),
      prop: {
        value: 'value',
        text: 'description'
      },
      options: async (data) => {
        const list = await getParentTypeList()
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
    itemsCode: {
      type: "input",
      label: $i18n.t("standardItems.itemsCode"),
      layout: 12,
      required: true,
      rules: {validator:(rule, value, cb) =>{
          const reg = /^[a-zA-Z0-9]*$/;
          if(reg.test(value)) {
            return cb();
          }
          cb(new Error($i18n.t("standardItems.theLettersNumerals")));
        },trigger: 'blur',},
      disabled: (data) => {
        return !!data.codeStrategy || !!data.id;
      },
    },
    itemsName: {
      type: "input",
      label: $i18n.t("standardItems.itemsName"),
      layout: 12,
      required: true,
    },
    aliasName: {
      type: "input",
      label: $i18n.t("standardItems.aliasName"),
      layout: 12,
      required: false,
    },
    parentCode: {
      type: 'select',
      label: $i18n.t("standardItems.parentCode"),
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
      label: $i18n.t("standardItems.standardName"),
      layout: 12,
      required: false,
    },
    referenceValue: {
      type: "input",
      label: $i18n.t("standardItems.referenceValue"),
      layout: 12,
      required: false,
    },
    unit: {
      type: "select",
      label: $i18n.t("standardItems.unit"),
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
    // defaultChecker: {
    //   type: "select",
    //   label: "默认检测人",
    //   layout: 12,
    //   required: false,
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
      label: $i18n.t("standardItems.version"),
      layout: 12,
      required: false,
      disabled: true,
    },
    fileList: {
      type: 'upload-file',
      label: $i18n.t("standardItems.fileList"),
      layout: 24,
      required: false,
      attrs: {
        limit: 1,
        fileType: ['pdf', 'doc', 'docx'],
        accept: '.pdf, .doc, .docx',
        action: `${adminUrl}file`,
        data:{
          bucket:"limsservice"
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
      label: $i18n.t("standardItems.remark"),
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
      label: $i18n.t("standardItems.file"),
      layout: 24,
      // required: true,

    },
  }
}

// var checkCode =
