import { getUserList } from "@/api/user";

export const baseUserDialog = {
  data() {
    return {
      otherParams: {
        modelingCode: this.$store.getters.factoryCode,
        componentCode: "mes",
        status: "1"
      },
      baseUserDialogVisible: false, //表格弹框隐藏显示
      getUserList, // 获取弹框数据接口
      hasBaseUserFooter: true, // 是否需要底部按钮默认true
      baseUserSearchDialog: {
        inline: true,
        formDesc: {
          nickName: {
            type: "input",
            layout: 8,
            label: $i18n.t("equipment.nickName"),
          },
        },
      },
      baseUserDialogColumn: [
        {
          type: "selection",
        },
        {
          type: "index",
          label: $i18n.t("common.order"),
          width: 60
        },
        // {
        //   prop: "tenantCode",
        //   label: $i18n.t("equipment.tenantCode"),
        //   showOverflowTooltip: true,
        // },
        {
          prop: "jobNumber",
          label: $i18n.t("equipment.jobNumber"),
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "nickName",
          label: $i18n.t("equipment.nickName"),
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "email",
          label: $i18n.t("equipment.email"),
          showOverflowTooltip: true,
        },
        {
          prop: "mobile",
          label: $i18n.t("equipment.mobile"),
          showOverflowTooltip: true,
        },
      ],
    };
  },
  methods: {
    // 弹框表格，双击表格，或者点击确定 返回选中数据
    getSelectBaseUser(data) {
      // 调试完成记得删除控制台打印
      console.log($i18n.t("equipment.selectData"), data[0]);
      // 这里可以自定义返回字段信息
      // 第一个入参为当前表单绑定的对象，第二个入参为要修改的字段名，第三个入参为选中数据中相应信息
      console.log(this.title, "title");
      this.$set(this.formDataDialog, "administrator", data[0].jobNumber);
      this.$set(this.formDataDialog, "administratorName", data[0].nickName);
    },
  },
};
