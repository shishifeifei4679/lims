import {
  exportUrl,
  downloadTemplateUrl,
} from '@/api/limsmeasuringtools/measuringToolscollectreturndetail'
import {exportExcel} from '@/utils/judge'
import { deleteFile } from "@/api/common";
import app from "@/main";
import url from "@/axios/url";
import store from '@/store'
const { generalUrl, adminUrl } = url();

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
//  {
//    name: $i18n.t("common.add"),
//    type: "primary",
//    icon: "el-icon-circle-plus-outline",
//    handleName: "add", //点击时返回的标识
//    auth: "auth:commonMeasuringToolsVerificationManufacturer:add", //权限字段
//  },
//  {
//    name: $i18n.t("common.delete"),
//    type: "danger",
//    icon: "el-icon-delete",
//    handleName: "deleteBatch", //点击时返回的标识
//    disabled: (data) => {
//      return !data.length > 0;
//    },
//    isMultiple: true, // isSingle 表示必须选择一项//isMultiple: true, // 表示必须多选
//    auth: "auth:commonMeasuringToolsVerificationManufacturer:delete", //权限字段
//  },
////  {
////    name: $i18n.t("common.import"),
////    type: "primary",
////    icon: "el-icon-circle-plus-outline",
////    handleName: "import", //点击时返回的标识
////  },
//    {
//      render: (h, scope) => {
//        // scope列表上选择的数据
//        return (
//          <ele-import-drawer
//            auth="auth:commonMeasuringToolsVerificationManufacturer:import"//权限字段
//            importAction={generalUrl + 'excelCommon/import'}//*重要,如果不配置默认走platform的服务
//            on={{
//              success: () => {
//                this.refresh();
//              },
//            }}
//          />
//        );
//      },
//    }
]
// 行末按钮配置
export const rowConfig = [
//  {
//    name: $i18n.t("common.edit"),
//    type: "primary",
//    class: "row-btn-primary",
//    handleName: "edit", //点击时返回的标识
//    auth: "auth:commonMeasuringToolsVerificationManufacturer:edit", //权限字段
//  },
//  {
//    name: $i18n.t("common.details"),
//    type: "info",
//    class: "row-btn-info",
//    handleName: "detail", //点击时返回的标识
//  },
//  {
//    name: $i18n.t("common.delete"),
//    type: "danger",
//    class: "row-btn-danger",
//    handleName: "delete", //点击时返回的标识
//    auth: "auth:commonMeasuringToolsVerificationManufacturer:delete", //权限字段
//  },
]
// 搜索条件配置
export const searchConfig = {
  inline: true,
  formDesc: {

  },
}
// 新增/删除表单配置
export const formDescDialog = {
  span: 24,
  disabled: false,
  isShowSubmitBtn: true,
  formDesc: {

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
            title: $i18n.t("common.downloadTemplate"), // 下载模板
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
            label:$i18n.t("common.chooseFile"),
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
