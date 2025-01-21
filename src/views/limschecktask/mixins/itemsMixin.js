import {
  getList as getLimsStandardItemsList, getParentTypeList,
} from '@/api/limsStandardItems/limsStandardItems'
import { getUnit } from "@/api/common";

export const limsStandardItemsDialog = {
  data() {
    return {
      limsStandardItemsDialogVisible: false, //表格弹框隐藏显示
      getLimsStandardItemsList, // 获取弹框数据接口
      hasLimsStandardItemsFooter: true, // 是否需要底部按钮默认true
      limsStandardItemsSearchDialog: {
        inline: true,
        formDesc: {
          itemsName: {
            type: "input",
            layout: 8,
            label: $i18n.t("checkTask.testingItemName"),
          },
          itemsCode: {
            type: "input",
            layout: 8,
            label: $i18n.t("checkTask.testingItemCode"),
          },
        }
      },
      limsStandardItemsDialogColumn: [
        {
          type: "selection",
        },
        {
          type: "index",
          label: $i18n.t("common.order"),
        },
        {
          prop: "itemsName",
          label: $i18n.t("checkTask.itemsName"),
          minWidth: "130",
          showColumnSearch: true,
        },
        {
          prop: "aliasName",
          label: $i18n.t("checkTask.aliasName"),
          minWidth: "100",
        },
        {
          prop: "itemsCode",
          label: $i18n.t("checkTask.itemsCode"),
          minWidth: "130",
          showColumnSearch: true,
        },
        {
          prop: "parentCode",
          label: $i18n.t("checkTask.parentCode"),
          minWidth: "180",
          optionProp: {
            value: 'value',
            label: 'description'
          },
          option: async (data) => {
            const list = await getParentTypeList()
            return list.data.result
          }
        },
        {
          prop: "standardName",
          label: $i18n.t("checkTask.standardName"),
          minWidth: "150",
        },
        {
          prop: "referenceValue",
          label: $i18n.t("checkTask.referenceValue"),
          minWidth: "150",
        },
        {
          prop: "unit",
          label: $i18n.t("checkTask.unit"),
          minWidth: "100",
          optionProp: {
            value: 'value',
            label: 'description'
          },
          option: async (data) => {
            const list = await getUnit()
            return list.data.result
          }
        },
      ]
    }
  },
  methods: {
    // 弹框表格，双击表格，或者点击确定 返回选中数据
    getSelectLimsStandardItems(data) {
      // 调试完成记得删除控制台打印
      console.log($i18n.t("checkTask.selectData"), data);
      for (let i = 0; i < data.length; i++) {
        if (this.form?.itemsList?.length) {
          for (let j = 0; j < this.form.itemsList.length; j++) {
            if (this.form.itemsList[j].itemsId === data[i].id) {
              return this.$message.warning($i18n.t("checkTask.onlyBeAddedOnce"));
            }
          }
        }
      }
      // 这里可以自定义返回字段信息
      let list = [
        ...(this.form?.itemsList ?? []),
        ...data.map((ite) => {
          return {
            //            ...ite,
            itemsName: ite.itemsName,
            itemsCode: ite.itemsCode,
            referenceValue: ite.referenceValue,
            version: ite.version,
            unit: ite.unit,
            standardName: ite.standardName,
            parentCode: ite.parentCode,
            itemsId: ite.id
          }
        })
      ]
      // 第一个入参为当前表单绑定的对象，第二个入参为要修改的字段名，第三个入参为选中数据中相应信息
      this.$set(this.form, "itemsList", list);
    },
  }
}
