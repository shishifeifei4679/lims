import {
  getList as getLimsStandardItemsList, getParentTypeList,
} from '@/api/limsStandardItems/limsStandardItems'
import {getUnit} from "@/api/common";

export const limsStandardItemsDialog = {
  data () {
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
            label: $i18n.t("checkItems.testingItemName"),
          },
          itemsCode: {
            type: "input",
            layout: 8,
            label: $i18n.t("checkItems.testingItemCode"),
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
          prop: "itemsCode",
          label: $i18n.t("checkItems.itemsCode"),
          minWidth:"150px",
          showColumnSearch: true,
        },
        {
          prop: "itemsName",
          label: $i18n.t("checkItems.itemsName"),
          minWidth:"150px",
          showColumnSearch: true,
        },
        {
          prop: "aliasName",
          label: $i18n.t("checkItems.aliasName"),
          minWidth:"100px",
        },
       
        {
          prop: "parentCode",
          label: $i18n.t("checkItems.parentCode"),
          minWidth:"180px",
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
          label: $i18n.t("checkItems.standardName"),
          minWidth:"150px",
        },
        {
          prop: "referenceValue",
          label: $i18n.t("checkItems.referenceValue"),
          minWidth:"120px",
        },
        {
          prop: "unit",
          label: $i18n.t("checkItems.unit"),
          minWidth:"150px",
          // optionProp: {
          //   value: 'value',
          //   label: 'description'
          // },
          // option: async (data) => {
          //   const list = await getUnit()
          //   return list.data.result
          // }
        },
      ]
    }
  },
  methods: {
    // 弹框表格，双击表格，或者点击确定 返回选中数据
    getSelectLimsStandardItems(data) {
      // 调试完成记得删除控制台打印
      console.log($i18n.t("checkItems.selectData"), data);
      for (let i = 0; i < data.length; i++) {
        if(this.resultEntryForm?.itemsList?.length){
          for (let j = 0; j < this.resultEntryForm.itemsList.length; j++) {
            if (this.resultEntryForm.itemsList[j].itemsId === data[i].id) {
              return this.$message.warning($i18n.t("checkItems.onlyBeAddedOnce"));
            }
          }
        }
      }
      // 这里可以自定义返回字段信息
      let list = [
        ...(this.resultEntryForm?.itemsList ?? []),
        ...data.map((ite) => {
          return {
            //            ...ite,
            itemsName: ite.itemsName,
            itemsCode: ite.itemsCode,
            referenceValue: ite.referenceValue,
            version: ite.version,
            unit: ite.unit,
            standardName:ite.standardName,
            parentCode: ite.parentCode,
            itemsId: ite.id,
            checkerName: ite.checkerName ?? this.$store.getters.userInfo.username ?? "",
            checkerId:ite.checkerId ?? this.$store.getters.userInfo.userId ?? ""
          }
        })
      ]
      // 第一个入参为当前表单绑定的对象，第二个入参为要修改的字段名，第三个入参为选中数据中相应信息
      this.$set(this.resultEntryForm, "itemsList",list);
    },
  }
}
