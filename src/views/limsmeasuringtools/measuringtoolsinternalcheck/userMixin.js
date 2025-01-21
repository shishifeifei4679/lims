import {
  getUserList  as getBaseUserList
} from "@/api/limsmeasuringtools/measuringtoolsinternalcheck";
export const baseUserDialog = {
  data() {
    return {
      baseUserDialogVisible: false, //表格弹框隐藏显示
      getBaseUserList, // 获取弹框数据接口
      hasBaseUserFooter: true, // 是否需要底部按钮默认true
      baseUserSearchDialog: {
        inline: true,
        formDesc: {
          nickName: {
            type: "input",
            layout: 8,
            label: $i18n.t('measuringtoolsinternalcheck.nickName'),
          },
        },
      },
      baseUserDialogColumn: [
        {
          type: "selection",
        },
        {
          type: "index",
          label: $i18n.t('common.order'),
          width: 60,
        },
        {
          prop: "jobNumber",
          label: $i18n.t('measuringtoolsinternalcheck.jobNumber'),
          width: 100,
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "nickName",
          label: $i18n.t('measuringtoolsinternalcheck.nickName'),
          width: 100,
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "email",
          label: $i18n.t('measuringtoolsinternalcheck.email'),
          width: 150,
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "mobile",
          label: $i18n.t('measuringtoolsinternalcheck.mobile'),
          width: 100,
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "deptName",
          label: $i18n.t('measuringtoolsoutsourcingcheck.departmentCode'),
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
      ],
    };
  },
  methods: {
    // 弹框表格，双击表格，或者点击确定 返回选中数据
    getSelectBaseUser(data) {
      // 调试完成记得删除控制台打印
      console.log("选中数据", data[0]);
      // 这里可以自定义返回字段信息
      // 第一个入参为当前表单绑定的对象，第二个入参为要修改的字段名，第三个入参为选中数据中相应信息
      this.$set(this.formDataDialog, "checkCode", data[0].jobNumber);
      this.$set(this.formDataDialog, "checkName", data[0].nickName);
      this.$set(this.formDataDialog, "checkDepartmentCode", data[0].deptCode);
    },
  },
};
