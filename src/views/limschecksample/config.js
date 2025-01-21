import {
  exportUrl,
  downloadTemplateUrl,
} from '@/api/limschecksample/limsCheckSample'
import {getDict} from '@/api/common'
import {exportExcel} from '@/utils/judge'

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
    name: $i18n.t("checkSample.receive"),
    type: "primary",
    icon: "el-icon-circle-plus-outline",
    handleName: "receive", //点击时返回的标识
    isSingle:true
  },
  {
    name: $i18n.t("checkSample.batchReceive"),
    type: "primary",
    icon: "el-icon-circle-plus-outline",
    handleName: "batchReceive", //点击时返回的标识
    isMultiple: true, 
  },
  {
    name: $i18n.t("checkSample.returnSample"),
    type: "danger",
    icon: "el-icon-delete",
    handleName: "returnSample", //点击时返回的标识
    isMultiple: true, // isSingle 表示必须选择一项//isMultiple: true, // 表示必须多选
  },
  {
    name: $i18n.t("checkSample.returnTask"),
    type: "danger",
    icon: "el-icon-delete",
    handleName: "returnTask", //点击时返回的标识
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
  // {
  //   name: "修改",
  //   type: "primary",
  //   class: "row-btn-primary",
  //   handleName: "edit", //点击时返回的标识
  // },
  {
    name: $i18n.t("common.details"),
    type: "info",
    class: "row-btn-info",
    handleName: "detail", //点击时返回的标识
  },
  // {
  //   name: $i18n.t("common.delete"),
  //   type: "danger",
  //   class: "row-btn-danger",
  //   handleName: "delete", //点击时返回的标识
  // },
]
// 搜索条件配置
export const searchConfig = {
  inline: true,
  formDesc: {
    taskCode: {
      type: 'input',
      label: $i18n.t("checkSample.taskCode"),
    },
    sampleCode: {
      type: 'input',
      label: $i18n.t("checkSample.sampleCode"),
    },
    sampleName: {
      type: 'input',
      label: $i18n.t("checkSample.sampleName"),
    },
    status: {
      type: 'select',
      label: $i18n.t("checkSample.status"),
      prop: {
        value: "value",
        text: "description"
      },
      options: async (data) => {
        const list = await getDict("lims_check_sample_status");
        return list.data.result
      }
    },
    // sampleModel: {
    //   type: 'input',
    //   label: '样品型号',
    // },
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
    // taskId: {
    //   type: "number",
    //   label: "委托单任务表id",
    //   layout: 12,
    //   required: false,
    // },
    taskCode: {
      type: "input",
      label: $i18n.t("checkSample.taskCode"),
      layout: 12,
      required: false,
    },
    sampleCode: {
      type: "input",
      label: $i18n.t("checkSample.sampleCode"),
      layout: 12,
      required: false,
    },
    sampleNo: {
      type: "input",
      label: $i18n.t("checkSample.sampleNo"),
      layout: 12,
      required: false,
    },
    sampleName: {
      type: "input",
      label: $i18n.t("checkSample.sampleName"),
      layout: 12,
      required: false,
    },
    categoryName: {
      type: "input",
      label: $i18n.t("checkSample.categoryName"),
      layout: 12,
      required: false,
    },
    sampleModel: {
      type: "input",
      label: $i18n.t("checkSample.sampleModel"),
      layout: 12,
      required: false,
    },
    sampleColor: {
      type: "input",
      label: $i18n.t("checkSample.sampleColor"),
      layout: 12,
      required: false,
    },
    sampleQty: {
      type: "number",
      label: $i18n.t("checkSample.sampleQty"),
      layout: 12,
      required: false,
    },
    unit: {
      type: "select",
      label: $i18n.t("checkSample.unit"),
      layout: 12,
      required: true,
      optionProp: {
        value: 'value',
        label: 'description'
      },
      option: async (data) => {
        const list = await getUnitDictList()
        return list.data.result
      }
    },
    factoryBrand: {
      type: "input",
      label: $i18n.t("checkSample.factoryBrand"),
      layout: 12,
      required: false,
    },
    customerName: {
      type: "input",
      label: $i18n.t("checkSample.customerName"),
      layout: 12,
      required: false,
    },
    contractCode: {
      type: "input",
      label: $i18n.t("checkSample.contractCode"),
      layout: 12,
      required: false,
    },
    wallThickness: {
      type: "number",
      label: $i18n.t("checkSample.wallThickness"),
      layout: 12,
      required: false,
    },
    pipeDiameter: {
      type: "number",
      label: $i18n.t("checkSample.pipeDiameter"),
      layout: 12,
      required: false,
    },
    appearance: {
      type: "input",
      label: $i18n.t("checkSample.appearance"),
      layout: 12,
      required: false,
    },
    ratio: {
      type: "input",
      label: $i18n.t("checkSample.ratio"),
      layout: 12,
      required: false,
    },
    expectFinishTime: {
      type: "datetime",
      label: $i18n.t("checkSample.expectFinishTime"),
      layout: 12,
      required: false,
      attrs: {
        "valueFormat": "yyyy-MM-dd HH:mm:ss",
      },
    },
    promiseFinishTime: {
      type: "datetime",
      label: $i18n.t("checkSample.promiseFinishTime"),
      layout: 12,
      required: false,
      attrs: {
        "valueFormat": "yyyy-MM-dd HH:mm:ss",
      },
    },
    // mainCheckerId: {
    //   type: "number",
    //   label: "主检人id（备用 委托一对多时使用）",
    //   layout: 12,
    //   required: false,
    // },
    mainCheckerName: {
      type: "input",
      label: $i18n.t("checkSample.mainCheckerName"),
      layout: 12,
      required: false,
    },
    // checkerDelegatorId: {
    //   type: "number",
    //   label: "代理检测人id",
    //   layout: 12,
    //   required: false,
    // },
    checkerDelegatorName: {
      type: "input",
      label: $i18n.t("checkSample.checkerDelegatorName"),
      layout: 12,
      required: false,
    },
    fileName: {
      type: "input",
      label: $i18n.t("checkSample.fileName"),
      layout: 12,
      required: false,
    },
    fileUrl: {
      type: "input",
      label: $i18n.t("checkSample.fileUrl"),
      layout: 12,
      required: false,
    },
    // receiverId: {
    //   type: "number",
    //   label: "收样人id",
    //   layout: 12,
    //   required: false,
    // },
    receiveTime: {
      type: "datetime",
      label: $i18n.t("checkSample.receiveTime"),
      layout: 12,
      required: false,
      attrs: {
        "valueFormat": "yyyy-MM-dd HH:mm:ss",
      },
    },
    receiver: {
      type: "input",
      label: $i18n.t("checkSample.receiver"),
      layout: 12,
      required: false,
    },
    // senderId: {
    //   type: "number",
    //   label: "送样人id",
    //   layout: 12,
    //   required: false,
    // },
    senderName: {
      type: "input",
      label: $i18n.t("checkSample.senderName"),
      layout: 12,
      required: false,
    },
    senderTelephone: {
      type: "input",
      label: $i18n.t("checkSample.senderTelephone"),
      layout: 12,
      required: false,
    },
    status: {
      type: "input",
      label: $i18n.t("checkSample.status"),
      layout: 12,
      required: false,
    },
    remark: {
      type: "input",
      label: $i18n.t("checkSample.remark"),
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
}
//导入数据
export const importFormDescDialog = {
    span: 24,
    disabled: false,
    isShowSubmitBtn: true,
    formDesc: {
        model: {
            type: "button",
            label: $i18n.t("checkSample.model"),
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
            label: $i18n.t("checkSample.file"),
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
    // taskId: {
    //   type: "number",
    //   label: "委托单任务表id",
    //   layout: 12,
    //   required: false,
    // },
    taskCode: {
      type: "input",
      label: $i18n.t("checkSample.taskCode"),
      layout: 12,
      required: false,
    },
    sampleCode: {
      type: "input",
      label: $i18n.t("checkSample.sampleCode"),
      layout: 12,
      required: false,
    },
    sampleNo: {
      type: "input",
      label: $i18n.t("checkSample.sampleNo"),
      layout: 12,
      required: false,
    },
    sampleName: {
      type: "input",
      label: $i18n.t("checkSample.sampleName"),
      layout: 12,
      required: false,
    },
    categoryName: {
      type: "input",
      label: $i18n.t("checkSample.categoryName"),
      layout: 12,
      required: false,
    },
    sampleModel: {
      type: "input",
      label: $i18n.t("checkSample.sampleModel"),
      layout: 12,
      required: false,
    },
    sampleColor: {
      type: "input",
      label: $i18n.t("checkSample.sampleColor"),
      layout: 12,
      required: false,
    },
    sampleQty: {
      type: "number",
      label: $i18n.t("checkSample.sampleQty"),
      layout: 12,
      required: false,
    },
    unit: {
      type: "input",
      label: $i18n.t("checkSample.unit"),
      layout: 12,
      required: false,
    },
    factoryBrand: {
      type: "input",
      label: $i18n.t("checkSample.factoryBrand"),
      layout: 12,
      required: false,
    },
    customerName: {
      type: "input",
      label: $i18n.t("checkSample.customerName"),
      layout: 12,
      required: false,
    },
    contractCode: {
      type: "input",
      label: $i18n.t("checkSample.contractCode"),
      layout: 12,
      required: false,
    },
    wallThickness: {
      type: "number",
      label: $i18n.t("checkSample.wallThickness"),
      layout: 12,
      required: false,
    },
    pipeDiameter: {
      type: "number",
      label: $i18n.t("checkSample.pipeDiameter"),
      layout: 12,
      required: false,
    },
    appearance: {
      type: "input",
      label: $i18n.t("checkSample.appearance"),
      layout: 12,
      required: false,
    },
    ratio: {
      type: "input",
      label: $i18n.t("checkSample.ratio"),
      layout: 12,
      required: false,
    },
    expectFinishTime: {
      type: "datetime",
      label: $i18n.t("checkSample.expectFinishTime"),
      layout: 12,
      required: false,
      attrs: {
        "valueFormat": "yyyy-MM-dd HH:mm:ss",
      },
    },
    promiseFinishTime: {
      type: "datetime",
      label: $i18n.t("checkSample.promiseFinishTime"),
      layout: 12,
      required: false,
      attrs: {
        "valueFormat": "yyyy-MM-dd HH:mm:ss",
      },
    },
    // mainCheckerId: {
    //   type: "number",
    //   label: "主检人id（备用 委托一对多时使用）",
    //   layout: 12,
    //   required: false,
    // },
    mainCheckerName: {
      type: "input",
      label: $i18n.t("checkSample.mainCheckerName"),
      layout: 12,
      required: false,
    },
    // checkerDelegatorId: {
    //   type: "number",
    //   label: "代理检测人id",
    //   layout: 12,
    //   required: false,
    // },
    checkerDelegatorName: {
      type: "input",
      label: $i18n.t("checkSample.checkerDelegatorName"),
      layout: 12,
      required: false,
    },
    fileName: {
      type: "input",
      label: $i18n.t("checkSample.fileName"),
      layout: 12,
      required: false,
    },
    // fileUrl: {
    //   type: "input",
    //   label: "文件存放路径",
    //   layout: 12,
    //   required: false,
    // },
    // receiverId: {
    //   type: "number",
    //   label: "收样人id",
    //   layout: 12,
    //   required: false,
    // },
    receiveTime: {
      type: "datetime",
      label: $i18n.t("checkSample.receiveTime"),
      layout: 12,
      required: false,
      attrs: {
        "valueFormat": "yyyy-MM-dd HH:mm:ss",
      },
    },
    receiver: {
      type: "input",
      label: $i18n.t("checkSample.receiver"),
      layout: 12,
      required: false,
    },
    // senderId: {
    //   type: "number",
    //   label: "送样人id",
    //   layout: 12,
    //   required: false,
    // },
    senderName: {
      type: "input",
      label: $i18n.t("checkSample.senderName"),
      layout: 12,
      required: false,
    },
    senderTelephone: {
      type: "input",
      label: $i18n.t("checkSample.senderTelephone"),
      layout: 12,
      required: false,
    },
    status: {
      type: "input",
      label: $i18n.t("checkSample.status"),
      layout: 12,
      required: false,
    },
    remark: {
      type: "input",
      label: $i18n.t("checkSample.remark"),
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
