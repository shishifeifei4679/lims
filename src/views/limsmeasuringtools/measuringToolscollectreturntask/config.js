import {
  exportUrl,
  downloadTemplateUrl,
} from '@/api/limsmeasuringtools/measuringToolscollectreturntask'
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
  {
    name: $i18n.t("common.details"),
    type: "info",
    class: "row-btn-info",
    handleName: "detail", //点击时返回的标识
  },
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
      detailList: {
        type: "table-editor",
//        label: $i18n.t("limsMeasuringToolsCollectReturnTask.selectMeasuringTools"),
        layout: 24,
        required: true,
        attrs: {
          isShowAdd: false,
          isShowDelete: false,
          columns: [
            {
              // el-table-column 的属性
              type: "index",
              align: "center",
              label: $i18n.t("common.order"),
              width: 75,
            },
            {
              // el-table-column 的属性
              prop: "measuringToolCode",
              align: "center",
              label: $i18n.t("limsMeasuringToolsCollectReturnTask.measuringToolCode"), // 量检具编码
              width: 200,
            },
            {
              prop: "measuringToolName",
              align: "center",
              label: $i18n.t("limsMeasuringToolsCollectReturnTask.measuringToolName"), // 量检具名称
              showOverflowTooltip: true,
//              width: 175,
            },
            {
              prop: "measuringToolsTypeName",
              align: "center",
              label: $i18n.t("limsMeasuringToolsCollectReturnTask.measuringToolsTypeName"), // 量检具类型
              showOverflowTooltip: true,
              width: 180,
            },
            {
              prop: "measuringToolSpecification",
              align: "center",
              label: $i18n.t("limsMeasuringToolsCollectReturnTask.measuringToolSpecification"), // 规格型号
              showOverflowTooltip: true,
              width: 250,
            },
          ],
        },
      },
      collectDepartmentName: {
        type: "input",
        label: $i18n.t("limsMeasuringToolsCollectReturnTask.collectDepartmentName"), // 领用部门
        layout: 12,
        required: false,
        vif: (data) => {
          return data.operateType == '1';//操作类型(字典：领用归还操作类型-lims_collect_return_operate_type) 1：领用 2：归还
        },
      },
      expectedReturnDate: {
        type: "input",
        label: $i18n.t("limsMeasuringToolsCollectReturnTask.expectedReturnDate"), // 预计归还日期
        layout: 12,
        required: false,
        vif: (data) => {
          return data.operateType == '1';//操作类型(字典：领用归还操作类型-lims_collect_return_operate_type) 1：领用 2：归还
        },
      },
      operateExplain: {
        type: "textarea",
        label: (data) => {
           return data.operateType == '1' ? $i18n.t("limsMeasuringToolsCollectReturnTask.operateExplain1") : $i18n.t("limsMeasuringToolsCollectReturnTask.operateExplain");//操作类型(字典：领用归还操作类型-lims_collect_return_operate_type) 1：领用 2：归还
        }, // 说明
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
