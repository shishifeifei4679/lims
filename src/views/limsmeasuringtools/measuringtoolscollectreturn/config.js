import {
  exportUrl,
  getDepartmentCodeTree
} from '@/api/limsmeasuringtools/measuringtoolscollectreturn'
import app from "@/main";
import url from "@/axios/url";
import {exportExcel} from '@/utils/judge'


// 行末按钮配置
export const rowConfig = [
  {
    name: $i18n.t("limsMeasuringToolsLedgerCollectReturn.records"),// 领用归还记录
    type: "info",
    class: "row-btn-info",
    handleName: "collectReturnRecords", //点击时返回的标识
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

  },
};

// 归还表单
export const returnFormDescDialog = {

};
