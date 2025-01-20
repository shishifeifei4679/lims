import {
  exportUrl,
  getDepartmentCodeTree
} from '@/api/limsmeasuringtools/measuringtoolsoutsourcingcheck'
import app from "@/main";
import url from "@/axios/url";
import {exportExcel} from '@/utils/judge';
import { getDict, deleteFile } from "@/api/common";
const { adminUrl } = url();
import store from '@/store';

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
    name: $i18n.t("measuringtoolsoutsourcingcheck.submissionRegistration"),// 送检登记
    type: "primary",
    icon: "el-icon-right",
    isMultiple: true, //至少选择一条
    disabled: (data) => {
      return !(data.length > 0 && data.filter(item => item.checkStatus == "1").length < 1); //检定状态(字典：check_status)【1：送检中 2：已检定 3：待检定 4：已逾期】
    },
    handleName: "submissionRegistration", //点击时返回的标识
    auth: "auth:operlog:submissionRegistration", //权限字段
  },
  {
    name: $i18n.t("measuringtoolsoutsourcingcheck.outsourcingcheckRegistration"),// 检定登记
    type: "success",
    icon: "el-icon-s-promotion",
    isMultiple: true, //至少选择一条
    //是否可点击；
    disabled: (data) => {
      let bool = (data || []).some(ite => ite.checkStatus == 1);
      return !((data.length > 0 && data.length === 1)&&bool);
    },
    handleName: "outsourcingcheckRegistration", //点击时返回的标识
    auth: "auth:operlog:outsourcingcheckRegistration", //权限字段
  }
];
// 行末按钮配置
export const rowConfig = [
  {
    name: $i18n.t("measuringtoolsoutsourcingcheck.outsourcingcheckRegistration"),// 检定登记
    type: "info",
    class: "row-btn-info",
    handleName: "outsourcingcheckRegistrationRow", //点击时返回的标识
    auth: "auth:operlog:outsourcingcheckRegistration", //权限字段
    disabled: (data) => {
      return data.checkStatus!=1;
    },
  },
  {
    name: $i18n.t("measuringtoolsoutsourcingcheck.checkRecords"),// 检定记录
    type: "info",
    class: "row-btn-info",
    handleName: "checkRecords", //点击时返回的标识
  },
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
      label: $i18n.t("measuringtoolsoutsourcingcheck.measuringToolCode"),  // 量检具编码
      layout: 8,
      required: true,
      disabled: true
    },
    measuringToolName: {
      type: "input",
      label: $i18n.t("measuringtoolsoutsourcingcheck.measuringToolName"),  // 量检具名称
      layout: 8,
      required: true,
      disabled: true
    },
    checkType: {
      type: "select",
      label: $i18n.t("measuringtoolsoutsourcingcheck.checkType"),  // 检定方式(字典：lims_check_type)【1：委外检定 2：自检 3：厂商检定】
      layout: 8,
      required: true,
      disabled: true,
      default: '1',
      prop: {
        value: "value",
        text: "description",
      },
      options: async (data) => {
        const list = await getDict("lims_check_type");
        return list.data.result.filter(item => item.value !== "2");
      },
    },
    checkResult: {
      type: "select",
      label: $i18n.t("measuringtoolsoutsourcingcheck.checkResult"),  // 检定结果
      layout: 8,
      required: true,
      prop: {
        value: "value",
        text: "description",
      },
      options: async (data) => {
        const list = await getDict("lims_measuring_check_result");
        return list.data.result
      },
    },
    verificationFee: {
      type: "input",
      label: $i18n.t("measuringtoolsoutsourcingcheck.verificationFee"),  // 检定费用
      layout: 8,
      required: false,
    },
    verificationManufacturerName: {
      type: "date",
      label: $i18n.t("measuringtoolsoutsourcingcheck.verificationManufacturerCode"),  // 检定厂商
      layout: 8,
      required: true,
    },
    verificationCertificateCode: {
      type: "input",
      label: $i18n.t("measuringtoolsoutsourcingcheck.verificationCertificateCode"),  // 检定证书编码
      layout: 8,
      required: true,
      validator: "Encoding",
    },
    checkTime: {
      type: "date",
      label: $i18n.t("measuringtoolsoutsourcingcheck.checkTime"),  // 检定日期
      layout: 8,
      required: true,
      attrs: {
        "valueFormat": "yyyy-MM-dd",
      },
    },
    checkContent: {
      type: "textarea",
      label: $i18n.t("measuringtoolsoutsourcingcheck.checkContent"),  // 检定内容
      layout: 24,
      required: false,
    },
    checkReport: {
      type: "upload-file",
      label: $i18n.t("measuringtoolsoutsourcingcheck.checkReport"),  // 检定报告
      layout: 24,
      required: true,
      attrs: {
        limit: 1,
        fileSize: 20, // 文件大小限制 单位M
        fileType: ["jpg", "jpeg", "png", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "pdf", "zip", "rar"],
        accept: ".jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf,.zip,.rar",
  //      请上传 大小不超过 20MB 格式为 jpg/jpeg/png/doc/docx/xls/xlsx/ppt/pptx/txt/pdf/zip/rar 的文件
        action: `${adminUrl}file`,
        data: {
          bucket: "lims-template",
        },
        headers: {
          Satoken: store.getters.token,
        },
        beforeRemove: (data, list) => {
          const bucket = "lims-template"
          let filename = data.name

          return new Promise((resolve, reject) => {
            deleteFile(`${adminUrl}file`, { bucket, filename })
              .then((res) => {
                resolve(res.data)
              })
              .catch((error) => {
                reject(error)
              });
          });
        },
        // autoUpload: false,
        responseFn(response, file) {
          if (response.code === 0) {
            return {
              name: file.name,
              url: response.result.path, // 文件id
              size: file.size,
              ...response.result,
            }
          }
        },
      },
    },
    checkReason: {
      type: "textarea",
      label: $i18n.t("measuringtoolsoutsourcingcheck.checkReason"),  // 不合格说明
      layout: 24,
      required: true,
      vif: (data) => {
        return data.checkResult == '2' || data.checkResult == '3';//检定结果(字典：lims_measuring_check_result)【1：合格 2：不合格 3：降级】
      },
    },
  },
};
