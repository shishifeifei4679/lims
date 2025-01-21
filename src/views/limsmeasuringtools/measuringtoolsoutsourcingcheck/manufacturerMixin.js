import {
  getManufacturerCodeList  as getManufacturerCodeList
} from '@/api/limsmeasuringtools/measuringtoolsoutsourcingcheck';

export const supplierDialog = {
  data() {
    return {
      manufacturerCodeDialogVisible: false, //表格弹框隐藏显示
      getManufacturerCodeList, // 获取弹框数据接口
      hasManufacturerCodeFooter: true, // 是否需要底部按钮默认true
      manufacturerCodeSearchDialog: {
        inline: true,
        formDesc: {
          manufacturerCode: {
            type: "input",
            layout: 8,
            label: $i18n.t('measuringtoolsoutsourcingcheck.manufacturerCode'),// 厂商编码
          },
        },
      },
      manufacturerCodeDialogColumn: [
        {
          type: "selection",
        },
        {
          type: "index",
          label: $i18n.t('common.order'),
          width: 60,
        },
        {
          prop: "manufacturerCode",
          label: $i18n.t('measuringtoolsoutsourcingcheck.manufacturerCode'),// 厂商编码
          width: '120',
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "manufacturerName",
          label: $i18n.t('measuringtoolsoutsourcingcheck.manufacturerName'),// 厂商名称
          width: '150',
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "contacts",
          label: $i18n.t('measuringtoolsoutsourcingcheck.contacts'),// 联系人
          width: '120',
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "mobilePhone",
          label: $i18n.t('measuringtoolsoutsourcingcheck.mobilePhone'),// 手机
          width: '110',
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "telephone",
          label: $i18n.t('measuringtoolsoutsourcingcheck.telephone'),// 固定电话
          width: '110',
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
      ],
    };
  },
  methods: {
    // 弹框表格，双击表格，或者点击确定 返回选中数据
    getSelectManufacturerCode(data) {
      // 调试完成记得删除控制台打印
      console.log("选中数据", data[0]);
      // 这里可以自定义返回字段信息
      // 第一个入参为当前表单绑定的对象，第二个入参为要修改的字段名，第三个入参为选中数据中相应信息
      this.$set(this.formDataDialog, "verificationManufacturerCode", data[0].manufacturerCode);
      this.$set(this.formDataDialog, "verificationManufacturerName", data[0].manufacturerName);
    },
  },
};
