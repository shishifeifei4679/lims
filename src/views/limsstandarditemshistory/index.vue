<template>
  <div>
    <div>
      <ele-page
        v-loading="loading"
        :formConfig="searchConfig"
        ref="eleTable"
        :operateList="operateList"
        @handleOperateEvent="handleOperateEvent"
        :column="column"
        :getList="getList"
        uniqueId="limsStandardItemsHistoryTable"
      >
      </ele-page>
    </div>
    <ele-form-drawer
      class="dialog-pack"
      :isLoading="isLoading"
      v-model="formDataDialog"
      v-bind="formDescDialog"
      :request-fn="handleSubmit"
      :visible.sync="visible"
      :title="title"
      size="850px"
    >
    </ele-form-drawer>
      <!-- 导入弹框 -->
      <ele-form-drawer
              size="30%"
              :isLoading="isLoadingImport"
              v-model="importData"
              v-bind="importFormDescDialog"
              :request-fn="handleSubmitImport"
              :visible.sync="importVisible"
              :destroyOnClose="true"
              :title="$i18n.t('standardItemsHistory.import')"
      >
          <template v-slot:file="{ desc, data, field, formData }">
              <!-- 插槽内容有el-form-item组件包裹 -->
              <uploadNoAuto @onchange="upLoadHandleChange" ref="uploadNoAuto"/>
          </template>
      </ele-form-drawer>
  </div>
</template>

<script>
import {
  operateList,
  searchConfig,
  importFormDescDialog,
  formDescDialog,
  rowConfig,
} from './config'
import {
  getList,
  rowCreate,
  rowUpdate,
  rowDel,
  rowDetail,
  importData,
} from '@/api/limsStandardItemsHistory/limsStandardItemsHistory'
import uploadNoAuto from "@/components/upload-no-auto";
import {getLimsUnitList, getParentTypeList} from "@/api/limsStandardItems/limsStandardItems";
import {getAllUserList} from "@/api/user";
import {getUnit} from "@/api/common";

export default {
  name: "limsStandardItemsHistory",
  components:{
    uploadNoAuto
  },
  data() {
    return {
      title: null,
      visible: false,
      isLoading: false,
      loading: false,
      formDataDialog: {},
      formDescDialog, //新增修改框
      searchConfig,
      operateList,
      getList,
      isLoadingImport: false,  // 导入数据loading
      importData: {},  //导入数据
      importVisible: false,
      importFormDescDialog,  // 导入字段配置
      // 列表页字段的绑定配置
      column: [
        {
          type: "index",
          label: $i18n.t("common.order"),
          fixed: "left",
          width: 60,
        },
        {
          prop: "itemsCode",
          label: $i18n.t("standardItemsHistory.itemsCode"),
          width: 150,
          showColumnSearch: true,
        },
        {
          prop: "itemsName",
          label: $i18n.t("standardItemsHistory.itemsName"),
          width: 200,
          showColumnSearch: true,
        },
        {
          prop: "aliasName",
          label: $i18n.t("standardItemsHistory.aliasName"),
          width: 200,
        },

        {
          prop: "parentCode",
          label: $i18n.t("standardItemsHistory.parentCode"),
          optionProp: {
            value: 'value',
            label: 'description'
          },
          option: async (data) => {
            const list = await getParentTypeList()
            return list.data.result
          },
          showColumnSearch: true,
          showColumnSearchConfig: {
            type: "radio",
          },
          width:200
        },
        {
          prop: "standardName",
          label: $i18n.t("standardItemsHistory.standardName"),
          width: 200,
        },
        {
          prop: "referenceValue",
          label: $i18n.t("standardItemsHistory.referenceValue"),
          width: 80,
        },
        {
          prop: "version",
          label: $i18n.t("standardItemsHistory.version"),
          width: 120,
        },
        {
          prop: "unit",
          label: $i18n.t("standardItemsHistory.unit"),
          width: 80,
          optionProp: {
            value: 'value',
            label: 'description'
          },
          option: async (data) => {
            const list = await getUnit()
            return list.data.result
          }
        },
        // {
        //   prop: "defaultCheckerId",
        //   label: "默认检测人",
        //   width: 120,
        //   optionProp: {
        //     value: 'jobNumber',
        //     label: 'nickName'
        //   },
        //   option: async (data) => {
        //     const list = await getAllUserList()
        //     return list.data.result
        //   },
        // },
        // {
        //   prop: "expirationDate",
        //   label: "有效期",
        //   width: 180,
        // },

        // {
        //   prop: "remark",
        //   label: "备注",
        //   width: 120,
        // },
        {
          prop: "updateByName",
          label: $i18n.t("common.updateByName"),
          width: 120,
        },
        {
          prop: "updateTime",
          label: $i18n.t("common.updateTime"),
          width: 180,
        },
        {
          prop: "operate",
          label: $i18n.t("common.operation"),
          width: 80,
          fixed: "right",
          render: (h, scope) => {
            return (
              <ele-row-operation
                scope={scope}
                rowConfig={rowConfig}
                onRowOperate={this.rowOperate}
              />
            )
          },
        },
      ],
    }
  },
  computed: {
  },
  methods: {
    //表格顶部按钮操作事件
    handleOperateEvent(data) {
      this.title = data.name
      const fnc = {
        add: () => {
          this.disableFields(false)
          this.formDataDialog = {}
          this.visible = true
        },
        deleteBatch: () => {
          this.$confirm($i18n.t("common.deleteBatch", { name: $i18n.t("standardItemsHistory.name") }), $i18n.t("common.tip"), {
            confirmButtonText: $i18n.t("common.ok"),
            cancelButtonText: $i18n.t("common.cancel"),
            type: "warning",
          }).then(() => {
            const ids = data.rows.map((val) => val.id).join(',');
            this.rowDel(ids);
          });
        },
        import: () => {
          this.importDialogData = {};
          this.importVisible = true;
        }
      }
      fnc[data.handleName]()
    },
    //表格行操作事件
    rowOperate({ handleName, name, row }) {
      this.title = name
      const fnc = {
        edit: () => {
          this.disableFields(false)
          this.rowDetail(row.id)
          this.visible = true
        },
        detail: () => {
          this.disableFields(true)
          this.rowDetail(row.id)
          this.visible = true
        },
        delete: () => {
          this.$confirm($i18n.t("common.deleteSingle", { name: $i18n.t("standardItemsHistory.name") }), $i18n.t("common.tip"), {
            confirmButtonText: $i18n.t("common.ok"),
            cancelButtonText: $i18n.t("common.cancel"),
            type: "warning",
          }).then(() => {
            this.rowDel(row.id)
          })
        },
      }
      fnc[handleName]()
    },
    doSubmit({ title, api, data}) {
      this.isLoading = true
      api(data)
        .then((res) => {
          const message = res.data.message
          this.$message.success(message || title)
          this.visible = false
          this.refresh()
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    //弹框提交事件
    handleSubmit(data) {
      if (this.isLoading) return // 判断状态
    delete data.userDefined1 // 删除不需要修改的非主键字段
    delete data.userDefined2 // 删除不需要修改的非主键字段
    delete data.userDefined3 // 删除不需要修改的非主键字段
    delete data.userDefined4 // 删除不需要修改的非主键字段
    delete data.userDefined5 // 删除不需要修改的非主键字段
    delete data.createBy // 删除不需要修改的非主键字段
    delete data.createByName // 删除不需要修改的非主键字段
    delete data.createTime // 删除不需要修改的非主键字段
    delete data.updateBy // 删除不需要修改的非主键字段
    delete data.updateByName // 删除不需要修改的非主键字段
    delete data.updateTime // 删除不需要修改的非主键字段
    delete data.activeFlag // 删除不需要修改的非主键字段
      const params = this.formDataDialog.id
        ? { title: $i18n.t("common.editSuccess"), api: rowUpdate, data}
        : { title: $i18n.t("common.addSuccess"), api: rowCreate, data}
      this.doSubmit(params)
    },
    //删除
    rowDel(data) {
      this.loading = true
      rowDel(data)
        .then((res) => {
          const message = res.data.message
          this.$message.success(message || $i18n.t("common.deleteSuccess"))
          this.refresh()
        })
        .finally(() => {
          this.loading = false
        })
    },
    disableFields(flag) {
      this.formDescDialog.disabled = flag
      this.formDescDialog.isShowSubmitBtn = !flag
    },
    rowDetail(id) {
      rowDetail(id)
        .then((res) => {
          this.formDataDialog = res.data.result;
        })
    },
    //刷新表格数据
    refresh(isReset = true) {
      this.$refs.eleTable.refresh(isReset)
    },
    //数据文件上传
    upLoadHandleChange(file){
      this.$set(this.importData,"file",file)
    },
      // 提交导入信息
    handleSubmitImport () {
      if(!this.importData.file){
          this.$message.error($i18n.t("common.uploadMsg"))
          return;
      }
      const formData = new FormData();
      formData.append('file', this.importData.file.get('file'));
      this.isLoadingImport = true;
      importData(formData).then((res) => {
          this.$message.success($i18n.t("common.importSuccess"));
          this.isLoadingImport = false;
          this.importVisible = false;
          this.refresh();
      }).catch((error) => {
          console.log($i18n.t("common.error"),error)
          this.$set(this.importData,"file",null)
      }).finally(() => {
          this.isLoadingImport = false;
          this.$refs.uploadNoAuto.clearFiles()
      })
    },
  },
}
</script>
