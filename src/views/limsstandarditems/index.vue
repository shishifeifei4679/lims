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
        uniqueId="limsStandardItemsTable"
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
      <!-- 申请人 -->
      <!-- 下方template标签放入ele-form-drawer中, 并且需要自行修改插槽属性及绑定表单对象的属性 -->
      <template v-slot:defaultChecker>
        <!-- 插槽内容有el-form-item组件包裹 -->
        <el-input v-model="formDataDialog.defaultChecker" readonly :placeholder="$i18n.t('standardItems.detector')">
          <el-button slot="append" icon="el-icon-search" @click="baseUserDialogVisible = true"></el-button>
        </el-input>
      </template>
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
      :title="$i18n.t('standardItems.import')"
    >
      <template v-slot:file="{ desc, data, field, formData }">
        <!-- 插槽内容有el-form-item组件包裹 -->
        <uploadNoAuto @onchange="upLoadHandleChange" ref="uploadNoAuto"/>
      </template>
    </ele-form-drawer>

    <ele-dialog-table
      :title="$i18n.t('standardItems.userInformationQuery')"
      width="800px"
      :visible.sync="baseUserDialogVisible"
      :formConfig="baseUserSearchDialog"
      :column="baseUserDialogColumn"
      @getSelectData="getSelectBaseUser"
      :getList="getBaseUserList"
      :hasFooter="hasBaseUserFooter"
    ></ele-dialog-table>
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
  getParentTypeList, getLimsUnitList,
} from '@/api/limsStandardItems/limsStandardItems'
import uploadNoAuto from "@/components/upload-no-auto";
import {getAllUserList} from "@/api/user";
import { baseUserDialog } from "./userMixin";
import {getUnit} from "@/api/common";
import { getBaseCodeStrategy } from "@/api/common";
export default {
  name: "limsStandardItems",
  components: {
    uploadNoAuto
  },
  mixins: [
    baseUserDialog,
  ],
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
          type: "selection",
        },
        {
          type: "index",
          label: $i18n.t("common.order"),
          fixed: "left",
          width: 60,
        },
        {
          prop: "itemsCode",
          label: $i18n.t("standardItems.itemsCode"),
          width: 150,
          showColumnSearch: true,
        },
        {
          prop: "itemsName",
          label: $i18n.t("standardItems.itemsName"),
          width: 200,
          showColumnSearch: true,
        },
        {
          prop: "aliasName",
          label: $i18n.t("standardItems.aliasName"),
          width: 200,
        },
        {
          prop: "parentCode",
          label: $i18n.t("standardItems.parentCode"),
          width: 200,
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
        },
        {
          prop: "standardName",
          label: $i18n.t("standardItems.standardName"),
          width: 200,
        },
        {
          prop: "referenceValue",
          label: $i18n.t("standardItems.referenceValue"),
          width: 80,
        },
        {
          prop: "version",
          label: $i18n.t("standardItems.version"),
          width: 120,
        },
        {
          prop: "unit",
          label: $i18n.t("standardItems.unit"),
          width: 80,
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
          prop: "createByName",
          label: $i18n.t("common.createByName"),
          width: 120,
        },
        {
          prop: "createTime",
          label: $i18n.t("common.createTime"),
          width: 180,
        },
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
          width: 160,
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
  computed: {},
  created() {
    this.getBaseCodeStrategy();
  },
  methods: {
    getBaseCodeStrategy() {
      getBaseCodeStrategy({
        code: "limscheckitemcode",
        system: "default",
        strategyStatus: "1",
      }).then((res) => {
        // console.log("判断是否存在编码规则", res);
        const result = res.data.result;
        this.formDataDialog.codeStrategy =
          Array.isArray(result) && result.length > 0 ? result[0].code : "";
          this.formDescDialog.formDesc.itemsCode.required = !this.formDataDialog.codeStrategy;
      });
    },

    //表格顶部按钮操作事件
    handleOperateEvent(data) {
      this.title = data.name
      const { codeStrategy } = this.formDataDialog;
      const fnc = {
        add: () => {
          this.disableFields(false)
          this.formDataDialog = { codeStrategy: codeStrategy };
          this.formDataDialog.version = '1.0.1'
          this.visible = true
        },
        deleteBatch: () => {
          this.$confirm($i18n.t("common.deleteBatch", { name: $i18n.t("standardItems.name") }), $i18n.t("common.tip"), {
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
    rowOperate({handleName, name, row}) {
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
          this.$confirm($i18n.t("common.deleteSingle", { name: $i18n.t("standardItems.name") }), $i18n.t("common.tip"), {
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
    doSubmit({title, api, data}) {
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
      console.log('data', data)
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
      let file = data.fileList
      if (file && file.length > 0) {
        data.fileUrl = file[0].url
        data.fileName = file[0].name
        delete data.fileList
        console.log(data)
      }
      const params = this.formDataDialog.id
        ? {title: $i18n.t("common.editSuccess"), api: rowUpdate, data}
        : {title: $i18n.t("standardItems.addedSuccessfully"), api: rowCreate, data}
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
    upLoadHandleChange(file) {
      this.$set(this.importData, "file", file)
    },
    // 提交导入信息
    handleSubmitImport() {
      if (!this.importData.file) {
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
        console.log($i18n.t("common.error"), error)
        this.$set(this.importData, "file", null)
      }).finally(() => {
        this.isLoadingImport = false;
        this.$refs.uploadNoAuto.clearFiles()
      })
    },
  },
}
</script>
