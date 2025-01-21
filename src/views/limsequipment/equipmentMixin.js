import { getNewList } from "@/api/common";

export const baseEquipmentDialog = {
    data() {
        return {
            baseEquipmentDialogVisible: false, //表格弹框隐藏显示
          getNewList,
            hasBaseEquipmentFooter: true, // 是否需要底部按钮默认true
            baseEquipmentSearchDialog: {
                inline: true,
                formDesc: {
                  device_code: {
                        type: "input",
                        label: $i18n.t("equipment.equipmentCode"),
                    },
                  device_name: {
                        type: "input",
                        label: $i18n.t("equipment.equipmentName"),
                    },
                  device_mode: {
                        type: "input",
                        label: $i18n.t("equipment.modelCode"),
                    },
                    modelName: {
                        type: "input",
                        label: $i18n.t("equipment.modelName"),
                    },
                },
            },
            baseEquipmentDialogColumn: [
                {
                    type: "selection",
                },
                {
                    type: "index",
                    label: $i18n.t("common.order"),
                    width: 60,
                },
                {
                    prop: "device_code",
                    label: $i18n.t("equipment.equipmentCode"),
                    minWidth: 180,
                    showOverflowTooltip: true,
                    showColumnSearch: true,
                },
                {
                    prop: "device_name",
                    label: $i18n.t("equipment.equipmentName"),
                    minWidth: 180,
                    showOverflowTooltip: true,
                    showColumnSearch: true,
                },
                {
                    prop: "device_mode",
                    label: $i18n.t("equipment.modelCode"),
                    minWidth: 180,
                    showOverflowTooltip: true,
                    showColumnSearch: true,
                },
                {
                    prop: "modelName",
                    label: $i18n.t("equipment.modelName"),
                    minWidth: 180,
                    showOverflowTooltip: true,
                    showColumnSearch: true,
                },
                {
                    prop: "device_type_name",
                    label: $i18n.t("equipment.typeLabel"),
                    minWidth: 180,
                    showOverflowTooltip: true,
                },
                {
                    prop: "device_status",
                    label: $i18n.t("equipment.equipmentStatus"),
                    width: 100,
                    // status todo
                    render: (h, scope) => {
                        let cfStatus = "";
                        if (scope.row.equipmentStatus == 1) {
                            cfStatus = $i18n.t("equipment.enabled");
                            return <el-tag type="success">{cfStatus}</el-tag>;
                        }
                        if (scope.row.equipmentStatus == 0) {
                            cfStatus = $i18n.t("equipment.disabled");
                            return <el-tag type="info">{cfStatus}</el-tag>;
                        }
                        if (scope.row.equipmentStatus == 2) {
                            cfStatus = $i18n.t("equipment.scrapped");
                            return <el-tag type="danger">{cfStatus}</el-tag>;
                        }
                    },
                },
            ],
        };
    },
    methods: {
        // 弹框表格，双击表格，或者点击确定 返回选中数据
        getSelectBaseEquipment(data) {
            // 这里可以自定义返回字段信息
            // 第一个入参为当前表单绑定的对象，第二个入参为要修改的字段名，第三个入参为选中数据中相应信息
            this.$set(this.formDataDialog, "equipmentCode", data[0].device_code);
            this.$set(this.formDataDialog, "equipmentName", data[0].device_name);
        },
    },
};
