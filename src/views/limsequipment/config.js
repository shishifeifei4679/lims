import {
  exportUrl,
  downloadTemplateUrl,
} from '@/api/limsequipment/limsEquipment'

import { checkStr, exportExcel } from '@/utils/judge'
import { getDict } from '@/api/common'
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
  // {
  //   name: "批量新增",
  //   type: "primary",
  //   icon: "el-icon-circle-plus-outline",
  //   handleName: "batchAdd", //点击时返回的标识
  // },
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
  modelingCodes: {
    type: "tree-select",
    label: $i18n.t("baseRegionModeling.modeling"),
    attrs: {
      multiple: false,
      appendToBody: true,
      // disableBranchNodes: true, //只能选子节点
      normalizer(node) {
        return {
          id: node.modelingCode,
          label: node.label,
          children: node.children,
        };
      },
    },
    options: async (data) => {
      const list = await getModelingTree();
      return list.data.result;
    },
  },
  formDesc: {
    equipmentCode: {
      type: 'input',
      label: $i18n.t("equipment.equipmentCode"),
    },
    equipmentName: {
      type: 'input',
      label: $i18n.t("equipment.equipmentName"),
    },
    productionNumber: {
      type: 'input',
      label: $i18n.t("equipment.productionNumber"),
    },
    managementNumber: {
      type: 'input',
      label: $i18n.t("equipment.managementNumber"),
    },
    equipmentModel: {
      type: 'input',
      label: $i18n.t("equipment.equipmentModel"),
    },
    status: {
      type: 'select',
      label: $i18n.t("equipment.status"),
      prop: {
        value: "value",
        text: "description"
      },
      options: async (data) => {
        const list = await getDict("lims_equipment_status");
        return list.data.result
      }
    },
    // location: {
    //   type: 'input',
    //   label: '设备所在位置',
    // },
  },
}
var validatePass = (rule, value, callback) => {
  setTimeout(() => {
    if (!checkStr(value, 'english-number')) {
      callback(new Error($i18n.t('equipment.rule8')))
    } else {
      callback()
    }
  }, 100)
}
// 新增/删除表单配置
export const formDescDialog = {
  span: 24,
  disabled: false,
  isShowSubmitBtn: true,
  rules: {
    productionNumber: [{ validator: validatePass, trigger: ['change', 'blur'] }],
    managementNumber: [{ validator: validatePass, trigger: ['change', 'blur'] }]
  },
  formDesc: {
    equipmentCode: {
      type: "input",
      label: $i18n.t("equipment.equipmentCode"),
      layout: 12,
      required: true,
    },
    equipmentName: {
      type: "input",
      label: $i18n.t("equipment.equipmentName"),
      layout: 12,
      required: true,
      disabled: true,
    },
    productionNumber: {
      type: "input",
      label: $i18n.t("equipment.productionNumber"),
      layout: 12,
      required: true,
    },
    managementNumber: {
      type: "input",
      label: $i18n.t("equipment.managementNumber"),
      layout: 12,
      required: true,
    },
    equipmentModel: {
      type: "input",
      label: $i18n.t("equipment.equipmentModel"),
      layout: 12,
      required: true,
    },
    status: {
      type: "select",
      label: $i18n.t("equipment.status"),
      layout: 12,
      required: true,
      prop: {
        value: "value",
        text: "description"
      },
      options: async (data) => {
        const list = await getDict("lims_equipment_status");
        return list.data.result
      }
    },
    // location: {
    //   type: "input",
    //   label: $i18n.t("equipment.location"),
    //   layout: 12,
    //   required: true,
    // },
    administratorName: {
      type: "input",
      label: $i18n.t("equipment.administratorName"),
      layout: 12,
      required: true,
    },
    validity: {
      type: "datetime",
      label: $i18n.t("equipment.validity"),
      layout: 12,
      required: true,
      attrs: {
        "valueFormat": "yyyy-MM-dd HH:mm:ss",
      },
    },
    remark: {
      type: "textarea",
      label: $i18n.t("equipment.remark"),
      layout: 24,
      required: false,
    },
    // factoryCode: {
    //   type: "input",
    //   label: "工厂编码",
    //   layout: 12,
    //   required: false,
    // },
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
      label: $i18n.t("equipment.model"),
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
      label: $i18n.t("equipment.file"),
      layout: 24,
      // required: true,

    },
  }
}

export const editTableRowConfig = [
  {
    name: $i18n.t("common.delete"),
    type: "danger",
    handleName: "delete", //点击时返回的标识
  },
];
export const editTableFormDesc = {
  span: 21,
  isShowSubmitBtn: false,
  isShowBackBtn: false,
  positionLabel: "right",
  formDesc: {
    equipmentCode: {
      type: "input",
      label: $i18n.t("equipment.equipmentCode"),
      layout: 12,
      required: false,
    },
    equipmentName: {
      type: "input",
      label: $i18n.t("equipment.equipmentName"),
      layout: 12,
      required: false,
    },
    productionNumber: {
      type: "input",
      label: $i18n.t("equipment.productionNumber"),
      layout: 12,
      required: false,
    },
    managementNumber: {
      type: "input",
      label: $i18n.t("equipment.managementNumber"),
      layout: 12,
      required: false,
    },
    equipmentModel: {
      type: "input",
      label: $i18n.t("equipment.equipmentModel"),
      layout: 12,
      required: false,
    },
    status: {
      type: "select",
      label: $i18n.t("equipment.status"),
      layout: 12,
      required: false,
      prop: {
        value: "value",
        text: "description"
      },
      options: async (data) => {
        const list = await getDict("lims_equipment_status");
        return list.data.result
      }
    },
    location: {
      type: "input",
      label: $i18n.t("equipment.location"),
      layout: 12,
      required: false,
    },
    administratorName: {
      type: "input",
      label: $i18n.t("equipment.administratorName"),
      layout: 12,
      required: false,
    },
    validity: {
      type: "datetime",
      label: $i18n.t("equipment.validity"),
      layout: 12,
      required: false,
      attrs: {
        "valueFormat": "yyyy-MM-dd HH:mm:ss",
      },
    },
    remark: {
      type: "input",
      label: $i18n.t("equipment.remark"),
      layout: 12,
      required: false,
    },
    // factoryCode: {
    //   type: "input",
    //   label: "工厂编码",
    //   layout: 12,
    //   required: false,
    // },
  },
};
