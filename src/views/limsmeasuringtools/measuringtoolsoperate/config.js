import {
  exportUrl,
  getDepartmentCodeTree
} from '@/api/limsmeasuringtools/measuringtoolsoperate'
import app from "@/main";
import url from "@/axios/url";
import {exportExcel} from '@/utils/judge'
import { deleteFile } from "@/api/common";
const { generalUrl, adminUrl } = url();
import store from '@/store'

// 列表头按钮配置
export const operateList = [
  {
    name: $i18n.t('common.export'),
    type: "primary",
    icon: "el-icon-download",
    handleName: "export", //点击时返回的标识
    url: exportUrl,
    //auth: "auth:operlog:export", //权限字段
  },
  {
    name: $i18n.t("measuringtoolsoperate.operateEnable"),// 启用
    type: "primary",
    icon: "el-icon-download",
    isMultiple: true, //至少选择一条
    disabled: (data) => {
      return !data.length > 0;
    },
    handleName: "operateEnable", //点击时返回的标识
    auth: "auth:operlog:operateEnable", //权限字段
  },
  {
    name: $i18n.t("measuringtoolsoperate.operateDeactivate"),// 停用
    type: "success",
    icon: "el-icon-s-promotion",
    isMultiple: true, //至少选择一条
    //是否可点击；
    disabled: (data) => {
      return !data.length > 0;
    },
    handleName: "operateDeactivate", //点击时返回的标识
    auth: "auth:operlog:operateDeactivate", //权限字段
  },
  {
    name: $i18n.t("measuringtoolsoperate.operateSealUpForSafekeeping"),// 封存
    type: "success",
    icon: "el-icon-s-promotion",
    isMultiple: true, //至少选择一条
    //是否可点击；
    disabled: (data) => {
      return !data.length > 0;
    },
    handleName: "operateSealUpForSafekeeping", //点击时返回的标识
    auth: "auth:operlog:operateSealUpForSafekeeping", //权限字段
  },
  {
    name: $i18n.t("measuringtoolsoperate.operateScrap"),// 报废
    type: "success",
    icon: "el-icon-s-promotion",
    isMultiple: true, //至少选择一条
    //是否可点击；
    disabled: (data) => {
      return !data.length > 0;
    },
    handleName: "operateScrap", //点击时返回的标识
    auth: "auth:operlog:operateScrap", //权限字段
  },
  {
    name: $i18n.t("measuringtoolsoperate.operateLoss"),// 丢失
    type: "success",
    icon: "el-icon-s-promotion",
    isMultiple: true, //至少选择一条
    //是否可点击；
    disabled: (data) => {
      return !data.length > 0;
    },
    handleName: "operateLoss", //点击时返回的标识
    auth: "auth:operlog:operateLoss", //权限字段
  }
];
// 行末按钮配置
export const rowConfig = [
//  {
//    name: $i18n.t("measuringtoolsoperate.operateViewApprovalProcess"),// 查看审批流
//    type: "info",
//    class: "row-btn-info",
//    handleName: "operateViewApprovalProcess", //点击时返回的标识
//    auth: "auth:operlog:operateViewApprovalProcess", //权限字段
//  },
  {
    name: $i18n.t("common.edit"),// 修改
    type: "info",
    class: "row-btn-info",
    handleName: "edit", //点击时返回的标识
  },
  {
    name: $i18n.t("measuringtoolsoperate.operateInfo"),// 详情
    type: "info",
    class: "row-btn-info",
    handleName: "operateInfo", //点击时返回的标识
  },
//  {
//    name: $i18n.t("measuringtoolsoperate.operateLog"),// 操作记录
//    type: "info",
//    class: "row-btn-info",
//    handleName: "operateLog", //点击时返回的标识
//  },
];
// 搜索条件配置
export const searchConfig = {
  data () {
    const _this = this;
    return {
      searchConfig: {
        inline: true,
        formDesc: {

        },
      }
    }
  }
};

// 新增/删除表单配置
export const formDescDialog = {
  span: 24,
  disabled: false,
  isShowSubmitBtn: true,
  formDesc: {
    measuringToolCode: {
      type: "input",
      label: $i18n.t("measuringtoolsoperate.measuringToolCode"),  // 量检具编码
      layout: 8,
      required: true,
      disabled: true,
      validator:"Encoding"
    },
    measuringToolName: {
      type: "input",
      label: $i18n.t("measuringtoolsoperate.measuringToolName"),  // 量检具名称
      layout: 8,
      required: true,
      disabled: true,
    },
    exFactoryCode: {
      type: "input",
      label: $i18n.t("measuringtoolsoperate.exFactoryCode"),  // 出厂编码
      layout: 8,
      required: false,
      disabled: true,
    },
    status: {
      type: "select",
      label: $i18n.t("measuringtoolsoperate.status"),  // 状态(字典：common_measuring_tool_status)【1：使用中 2：封存 3：报废 4：停用 5：丢失】
      layout: 8,
      required: false,
      disabled: true,
      default: '1',
      prop: {
        value: "value",
        text: "description",
      },
      options: async (data) => {
        const list = await getStatusList()
        return list.data.result
      },
    },
    measuringToolsTypeCode: {
      type: "tree-select",
      label: $i18n.t("measuringtoolsoperate.measuringToolsTypeCode"),  // 类型编码
      layout: 8,
      required: true,
      disabled: true,
      attrs: {
        normalizer(node) {
          return node;
        },
      },
      options: async (data) => {
        const list = await getMeasuringToolsTypeCodeTree()
        return list.data.result
      },
    },
    measuringToolSpecification: {
      type: "input",
      label: $i18n.t("measuringtoolsoperate.measuringToolSpecification"),  // 规格型号
      layout: 8,
      required: false,
      disabled: true,
    },
    accuracyLevelCode: {
      type: "select",
      label: $i18n.t("measuringtoolsoperate.accuracyLevelCode"),  // 精度等级编码
      layout: 8,
      required: false,
      disabled: true,
      optionsLinkageFields: ["measuringToolsTypeCode"],
      prop: {
        value: "accuracyLevelCode",
        text: "accuracyLevelName",
      },
      options: async (data) => {
        if (!!data.measuringToolsTypeCode) {
          const list = await getAccuracyLevelCodeList({ parentTypeCode: data.measuringToolsTypeCode })
          return list.data.result
        }
        return []
      },
    },
    measuringRangeCode: {
      type: "input",
      label: $i18n.t("measuringtoolsoperate.measuringRangeCode"),  // 测量范围
      layout: 8,
      required: false,
      disabled: true,
    },
    manufactureDate: {
      type: "date",
      label: $i18n.t("measuringtoolsoperate.manufactureDate"),  // 生产日期
      layout: 8,
      required: false,
      disabled: true,
      attrs: {
        "valueFormat": "yyyy-MM-dd",
      },
    },
    purchaseDate: {
      type: "date",
      label: $i18n.t("measuringtoolsoperate.purchaseDate"),  // 采购日期
      layout: 8,
      required: false,
      disabled: true,
      attrs: {
        "valueFormat": "yyyy-MM-dd",
      },
    },
    enableDate: {
      type: "date",
      label: $i18n.t("measuringtoolsoperate.enableDate"),  // 启用日期
      layout: 8,
      required: false,
      disabled: true,
      attrs: {
        "valueFormat": "yyyy-MM-dd",
      },
    },
    validDate: {
      type: "number",
      label: $i18n.t("measuringtoolsoperate.validDate"),  // 有效期
      layout: 8,
      required: false,
      disabled: true,
    },
    // validDateUnit: {
    //   type: "select",
    //   label: $i18n.t("measuringtoolsoperate.validDateUnit"),  // 有效期单位(字典：cycle_type )【day：天 week：周 month：月 year：年】
    //   layout: 8,
    //   required: false,
    //   prop: {
    //     value: "value",
    //     text: "description",
    //   },
    //   options: async (data) => {
    //     const list = await getValidDateUnitList()
    //     return list.data.result
    //   },
    // },
    scrapDate: {
      type: "date",
      label: $i18n.t("measuringtoolsoperate.scrapDate"),  // 报废日期
      layout: 8,
      required: false,
      disabled: true,
      attrs: {
        "valueFormat": "yyyy-MM-dd",
      },
    },
    supplierName: {
      type: "input",
      label: $i18n.t("measuringtoolsoperate.supplierCode"),  // 供应商编码
      layout: 8,
      required: false,
      disabled: true,
//      prop: {
//        value: "value",
//        text: "description",
//      },
//      options: async (data) => {
//        const list = await getSupplierCodeList()
//        return list.data.result
//      },
    },
    instrumentCategory: {
      type: "select",
      label: $i18n.t("measuringtoolsoperate.instrumentCategory"),  // 仪器类别(字典：common_instrument_category_type)【1：内部检定 2：送检设备 3：厂商检定 4：不需检定】
      layout: 8,
      required: true,
      prop: {
        value: "value",
        text: "description",
      },
      options: async (data) => {
        const list = await getInstrumentCategoryList()
        return list.data.result
      },
    },
    recentlyTestedDate: {
      type: "date",
      label: $i18n.t("measuringtoolsoperate.recentlyTestedDate"),  // 最近检定日期
      layout: 8,
      required: false,
      attrs: {
        "valueFormat": "yyyy-MM-dd",
      },
    },
    verificationCycle: {
      type: "number",
      label: $i18n.t("measuringtoolsoperate.verificationCycle"),  // 检定周期
      layout: 8,
      required: false,
    },
    // verificationCycleUnit: {
    //   type: "select",
    //   label: $i18n.t("measuringtoolsoperate.verificationCycleUnit"),  // 检定周期单位(字典：cycle_type )【day：天 week：周 month：月 year：年】
    //   layout: 8,
    //   required: false,
    //   prop: {
    //     value: "value",
    //     text: "description",
    //   },
    //   options: async (data) => {
    //     const list = await getVerificationCycleUnitList()
    //     return list.data.result
    //   },
    // },
    reminderTime: {
      type: "number",
      label: $i18n.t("measuringtoolsoperate.reminderTime"),  // 提醒时间
      layout: 8,
      required: false,
    },
//    reminderTimeUnit: {
//      type: "select",
//      label: $i18n.t("measuringtoolsoperate.reminderTimeUnit"),  // 提醒时间单位(字典：cycle_type )【day：天 week：周 month：月 year：年】
//      layout: 8,
//      required: false,
//      prop: {
//        value: "value",
//        text: "description",
//      },
//      options: async (data) => {
//        const list = await getReminderTimeUnitList()
//        return list.data.result
//      },
//    },
    departmentCode: {
      type: "tree-select",
      label: $i18n.t("measuringtoolsoperate.departmentCode"),  // 部门编码
      layout: 8,
      required: true,
      attrs: {
        normalizer(node) {
          return {
                    id: node.deptCode,
                    label: node.name,
                    children: node.children,
                  };
        },
      },
      options: async (data) => {
        const list = await getDepartmentCodeTree()
        return list.data.result
      },
    },
    directorName: {
      type: "input",
      label: $i18n.t("measuringtoolsoperate.directorCode"),  // 负责人编码
      layout: 8,
      required: true,
    },
//    remark: {
//      type: "textarea",
//      label: $i18n.t("measuringtoolsoperate.remark"),  // 用途说明
//      layout: 24,
//      required: false,
//    },
//    measuringToolPicPath: {
//      type: "image-uploader",
//      label: $i18n.t("measuringtoolsoperate.measuringToolPicPath"),
//      layout: 24,
//      required: false,
////      disabled: (row) => {
////        return row.title == $i18n.t('common.details');
////      },
//      attrs: {
//        limit: 1,
//        fileSize: 3, // 文件大小限制 单位M
//        multiple: true, // 是否支持多选
//        size: 80, // 图片显示大小
//        action: `${adminUrl}file`,
//        data: {
//          bucket: "general-template",
//        },
//        headers: {
//          Satoken: store.getters.token,
//        },
//        accept:".png,.jpg,.jpeg",
//        fileType: ["png", "jpg", "jpeg"],
//        beforeRemove: (data, list) => {
//          const bucket = "general-template";
//          let filename = data.title;
//
//          return new Promise((resolve, reject) => {
//            deleteFile(`${adminUrl}file`, {
//              bucket,
//              filename,
//            })
//              .then((res) => {
//                resolve(res.data);
//              })
//              .catch((error) => {
//                reject(error);
//              });
//          });
//        },
//        responseFn(response, file) {
//          return {
//            src: response.result.path,
//            title: response.result.object,
//            ...response.result,
//          };
//        },
//      },
//    },
//    measuringToolFilePath: {
//      type: "upload-file",
//      label: $i18n.t("measuringtoolsoperate.measuringToolFilePath"),  // 文档
//      layout: 24,
//      required: false,
//      attrs: {
//        limit: 1,
//        action: `${adminUrl}file`,
//        data: {
//          bucket: "general-template",
//        },
//        headers: {
//          Satoken: store.getters.token,
//        },
//        beforeRemove: (data, list) => {
//          const bucket = "general-template"
//          let filename = data.name
//
//          return new Promise((resolve, reject) => {
//            deleteFile(`${adminUrl}file`, { bucket, filename })
//              .then((res) => {
//                resolve(res.data)
//              })
//              .catch((error) => {
//                reject(error)
//              });
//          });
//        },
//        // autoUpload: false,
//        responseFn(response, file) {
//          if (response.code === 0) {
//            return {
//              name: file.name,
//              url: response.result.path, // 文件id
//              size: file.size,
//              ...response.result,
//            }
//          }
//        },
//      },
//    },
  },
}
