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
        uniqueId="limsSampleCategoryTable"
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
      :title="$i18n.t('sampleCategory.import')"
    >
      <template v-slot:file="{ desc, data, field, formData }">
        <!-- 插槽内容有el-form-item组件包裹 -->
        <uploadNoAuto @onchange="upLoadHandleChange" ref="uploadNoAuto" />
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
} from "./config";
import {
  getList,
  rowCreate,
  rowUpdate,
  rowDel,
  rowDetail,
  importData,
} from "@/api/limssamplecategory/limsSampleCategory";
import uploadNoAuto from "@/components/upload-no-auto";
import { getDict, getBaseCodeStrategy } from "@/api/common";

export default {
  name: "limsSampleCategory",
  components: {
    uploadNoAuto,
  },
  data() {
    return {
      title: null,
      visible: false,
      isLoading: false,
      loading: false,
      codeStrategy: "",
      formDataDialog: {},
      formDescDialog, //新增修改框
      searchConfig,
      operateList,
      getList,
      isLoadingImport: false, // 导入数据loading
      importData: {}, //导入数据
      importVisible: false,
      importFormDescDialog, // 导入字段配置
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
          prop: "categoryCode",
          label: $i18n.t("sampleCategory.categoryCode"),
          minWidth: 160,
          showColumnSearch: true,
        },
        {
          prop: "categoryName",
          label: $i18n.t("sampleCategory.categoryName"),
          minWidth: 160,
          showColumnSearch: true,
        },
        {
          prop: "status",
          label: $i18n.t("sampleCategory.status"),
          minWidth: 120,
          // render: (h, scope) => {
          //   if(scope.row.status == 1){
          //     return  <el-tag type="success">{ $i18n.t('sampleCategory.available') }</el-tag>;
          //   }else{
          //     return  <el-tag type="danger">{ $i18n.t('sampleCategory.disable') }</el-tag>;
          //   }
          // },
          // status todo
          // option: async (data) => {
          //   const list = [
          //     { description: $i18n.t("sampleCategory.available"), value: 1 },
          //     { description: $i18n.t("sampleCategory.disable"), value: 0 },
          //   ];
          //   return list;
          // },
          optionProp: {
            value: "value",
            label: "description",
          },
          option: async (data) => {
            const list = await getDict("lims_standard_items_status")
            return list.data.result
          },
          showColumnSearch: true,
          showColumnSearchConfig: {
            type: "radio",
          },
        },
        {
          prop: "createByName",
          label: $i18n.t("sampleCategory.createByName"),
          minWidth: 160,
        },
        {
          prop: "createTime",
          label: $i18n.t("sampleCategory.createTime"),
          minWidth: 180,
        },
        {
          prop: "updateByName",
          label: $i18n.t("sampleCategory.updateByName"),
          minWidth: 160,
        },
        {
          prop: "updateTime",
          label: $i18n.t("sampleCategory.updateTime"),
          minWidth: 180,
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
            );
          },
        },
      ],
      limsFieldsDic: [],
    };
  },
  computed: {},
  async created() {
    this.getBaseCodeStrategy();
    this.limsFieldsDic = (await getDict("lims_fields")).data.result || [];
  },
  methods: {
    getBaseCodeStrategy() {
      getBaseCodeStrategy({
        code: "limscategorycode",
        system: "default",
        strategyStatus: "1",
      }).then((res) => {
        // console.log("判断是否存在编码规则", res);
        const result = res.data.result;

        this.formDataDialog.codeStrategy =
          Array.isArray(result) && result.length > 0 ? result[0].code : "";
        this.formDescDialog.formDesc.categoryCode.required =
          !this.formDataDialog.codeStrategy;
        this.formDescDialog.formDesc.categoryCode.disabled =
          this.formDataDialog.codeStrategy != "" &&
          null != this.formDataDialog.codeStrategy;
        console.log("1111111111" + this.formDataDialog.codeStrategy);
        this.codeStrategy = this.formDataDialog.codeStrategy;
      });
    },
    //表格顶部按钮操作事件
    handleOperateEvent(data) {
      this.title = data.name;
      const fnc = {
        add: () => {
          this.disableFields(false);
          this.formDataDialog = {};
          this.visible = true;
        },
        deleteBatch: () => {
          this.$confirm(
            $i18n.t("common.deleteBatch", {
              name: $i18n.t("sampleCategory.name"),
            }),
            $i18n.t("common.tip"),
            {
              confirmButtonText: $i18n.t("common.ok"),
              cancelButtonText: $i18n.t("common.cancel"),
              type: "warning",
            }
          ).then(() => {
            const ids = data.rows.map((val) => val.id).join(",");
            this.rowDel(ids);
          });
        },
        import: () => {
          this.importDialogData = {};
          this.importVisible = true;
        },
      };
      fnc[data.handleName]();
    },
    //表格行操作事件
    rowOperate({ handleName, name, row }) {
      this.title = name;
      const fnc = {
        edit: () => {
          this.disableFields(false);
          this.rowDetail(row.id);
          this.visible = true;
        },
        detail: () => {
          this.disableFields(true);
          this.rowDetail(row.id);
          this.visible = true;
        },
        delete: () => {
          this.$confirm(
            $i18n.t("common.deleteSingle", {
              name: $i18n.t("sampleCategory.name"),
            }),
            $i18n.t("common.tip"),
            {
              confirmButtonText: $i18n.t("common.ok"),
              cancelButtonText: $i18n.t("common.cancel"),
              type: "warning",
            }
          ).then(() => {
            this.rowDel(row.id);
          });
        },
      };
      fnc[handleName]();
    },
    doSubmit({ title, api, data }) {
      this.isLoading = true;
      api(data)
        .then((res) => {
          const message = res.data.message;
          this.$message.success(message || title);
          this.visible = false;
          this.refresh();
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    //弹框提交事件
    handleSubmit(data) {
      if (this.isLoading) return; // 判断状态
      delete data.userDefined1; // 删除不需要修改的非主键字段
      delete data.userDefined2; // 删除不需要修改的非主键字段
      delete data.userDefined3; // 删除不需要修改的非主键字段
      delete data.userDefined4; // 删除不需要修改的非主键字段
      delete data.userDefined5; // 删除不需要修改的非主键字段
      delete data.createBy; // 删除不需要修改的非主键字段
      delete data.createByName; // 删除不需要修改的非主键字段
      delete data.createTime; // 删除不需要修改的非主键字段
      delete data.updateBy; // 删除不需要修改的非主键字段
      delete data.updateByName; // 删除不需要修改的非主键字段
      delete data.updateTime; // 删除不需要修改的非主键字段
      delete data.activeFlag; // 删除不需要修改的非主键字段

      data.categoryFields = JSON.stringify(
        this.limsFieldsDic
          .filter((i) => data.categoryFields.includes(i.value))
          .map((i) => ({ code: i.value, name: i.description }))
      );
      data.codeStrategy = this.codeStrategy;
      const params = this.formDataDialog.id
        ? { title: $i18n.t("common.editSuccess"), api: rowUpdate, data }
        : { title: $i18n.t("common.addSuccess"), api: rowCreate, data };
      this.doSubmit(params);
    },
    //删除
    rowDel(data) {
      this.loading = true;
      rowDel(data)
        .then((res) => {
          const message = res.data.message;
          this.$message.success(message || $i18n.t("common.deleteSuccess"));
          this.refresh();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    disableFields(flag) {
      this.formDescDialog.disabled = flag;
      this.formDescDialog.isShowSubmitBtn = !flag;
    },
    rowDetail(id) {
      rowDetail(id).then((res) => {
        this.formDataDialog = res.data.result;
        this.formDataDialog.categoryFields = JSON.parse(
          res.data.result?.categoryFields ?? []
        ).map((i) => i.code);
      });
    },
    //刷新表格数据
    refresh(isReset = true) {
      this.$refs.eleTable.refresh(isReset);
    },
    //数据文件上传
    upLoadHandleChange(file) {
      this.$set(this.importData, "file", file);
    },
    // 提交导入信息
    handleSubmitImport() {
      if (!this.importData.file) {
        this.$message.error($i18n.t("common.uploadMsg"));
        return;
      }
      const formData = new FormData();
      formData.append("file", this.importData.file.get("file"));
      this.isLoadingImport = true;
      importData(formData)
        .then((res) => {
          this.$message.success($i18n.t("common.importSuccess"));
          this.isLoadingImport = false;
          this.importVisible = false;
          this.refresh();
        })
        .catch((error) => {
          console.log($i18n.t("common.error"), error);
          this.$set(this.importData, "file", null);
        })
        .finally(() => {
          this.isLoadingImport = false;
          this.$refs.uploadNoAuto.clearFiles();
        });
    },
  },
};
</script>
