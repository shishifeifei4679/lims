import { getContractList } from "@/api/limsCheckTask/limsCheckTask";


export const contractrDialog = {
  data () {
    return {
      contractVisible: false, //表格弹框隐藏显示
      getContractList, // 获取弹框数据接口
      hasContractFooter: true, // 是否需要底部按钮默认true
      contractSearchDialog: {
        inline: true,
        formDesc: {
          contractNo: {
            type: "input",
            layout: 8,
            label: $i18n.t("checkTask.contractCode"),
          },
          purchaseNo: {
            type: "input",
            layout: 8,
            label: $i18n.t("checkTask.purchaseNo"),
          },
        },
      },
      contractDialogColumn: [
        {
          type: "selection",
          width: 50
        },
        {
          prop: "contractNo",
          label: $i18n.t("checkTask.contractNo"),
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "purchaseNo",
          label: $i18n.t("checkTask.purchaseNo"),
          showOverflowTooltip: true,
          showColumnSearch: true,
        },
        {
          prop: "saleDate",
          label: $i18n.t("checkTask.saleDate"),
          showOverflowTooltip: true,
        },
        {
          prop: "saler",
          label: $i18n.t("checkTask.saler"),
          showOverflowTooltip: true,
        },
        {
          prop: "userDefined1",
          label: $i18n.t("checkTask.userDefined1"),
          showOverflowTooltip: true,
        },
      ],
    };
  },
  methods: {
    // 弹框表格，双击表格，或者点击确定 返回选中数据
    // handleSelectionChange(data) {
    //   // 调试完成记得删除控制台打印
    //   console.log("选中数据", data[0]);
    // },
  },
};
