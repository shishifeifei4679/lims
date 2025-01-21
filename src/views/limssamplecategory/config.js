import {
  exportUrl,
  downloadTemplateUrl,
} from '@/api/limssamplecategory/limsSampleCategory'

import {exportExcel} from '@/utils/judge'
import {getDict} from "@/api/common";

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
    categoryCode: {
      type: 'input',
      label: $i18n.t("sampleCategory.categoryCode"),
    },
    categoryName: {
      type: 'input',
      label: $i18n.t("sampleCategory.categoryName"),
    },
    status: {
      type: 'select',
      label: $i18n.t("sampleCategory.status"),
      options: async (data) => {
        return [{text:$i18n.t("sampleCategory.available"),value:'1'},{text:$i18n.t("sampleCategory.disable"),value:'2'}]
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
    categoryCode: {
      type: "input",
      label: $i18n.t("sampleCategory.categoryCode"),
      layout: 12,
      required: true,
      rules: {validator:(rule, value, cb) =>{
          const reg = /^[a-zA-Z0-9]*$/;
          if(reg.test(value)) {
            return cb();
          }
          cb(new Error($i18n.t("sampleCategory.theLettersNumerals")));
        },trigger: 'blur',},
        disabled: false
    },
    categoryName: {
      type: "input",
      label: $i18n.t("sampleCategory.categoryName"),
      layout: 12,
      required: true,
    },
    categoryFields: {
      layout: 24,
      type: "select",
      label: $i18n.t("sampleCategory.categoryFields"),
      prop: {
        value: 'value',
        text: 'description'
      },
      options: async (data) => {
        const list = await getDict('lims_fields')
        return list.data.result || []
      },
      attrs:{
        multiple: true,
      },
      required: true,
    },
    remark: {
      type: "input",
      label: $i18n.t("sampleCategory.remark"),
      layout: 12,
      required: false,
    },
    // factoryCode: {
    //   type: "input",
    //   label: "工厂编码",
    //   layout: 12,
    //   required: false,
    // },
    status: {
      type: "select",
      label: $i18n.t("sampleCategory.status"),
      options: async (data) => {
        return [{text:$i18n.t("sampleCategory.available"),value:'1'},{text:$i18n.t("sampleCategory.disable"),value:'2'}]
      },
      default:'1',
      layout: 12,
      required: true,
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
            label: $i18n.t("sampleCategory.file"),
            layout: 24,
            // required: true,

        },
    }
}

