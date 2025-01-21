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
        uniqueId="limsCheckTaskTable"
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
      :title="$i18n.t('checkTask.import')"
    >
      <template v-slot:file="{ desc, data, field, formData }">
        <!-- 插槽内容有el-form-item组件包裹 -->
        <uploadNoAuto @onchange="upLoadHandleChange" ref="uploadNoAuto" />
      </template>
    </ele-form-drawer>
    <add-or-view-dialog ref="addOrViewDialog" />
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
  setStatus,
} from "@/api/limsCheckTask/limsCheckTask";
import uploadNoAuto from "@/components/upload-no-auto";
import AddOrViewDialog from "@/views/limschecktask/components/addOrViewDialog.vue";
import { getAllUserList } from "@/api/user";
import { getDict } from "@/api/common";

export default {
  name: "limsCheckTask",
  components: {
    uploadNoAuto,
    AddOrViewDialog,
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
          prop: "code",
          label: $i18n.t("checkTask.code"),
          minWidth: 160,
          fixed: "left",
          showColumnSearch: true,
        },
        {
          prop: "deptName",
          label: $i18n.t("checkTask.deptName"),
          minWidth: 160,
        },
        {
          prop: "expectFinishTime",
          label: $i18n.t("checkTask.expectFinishTime"),
          minWidth: 180,
          showColumnSearch: true,
          showColumnSearchConfig: {
            type: "datePicker",
            dateType: "daterange",
            valueFormat: "yyyy-MM-dd",
          },
        },
        {
          prop: "entrustId",
          label: $i18n.t("checkTask.entrustName"),
          minWidth: 120,
          optionProp: {
            value: "jobNumber",
            label: "nickName",
          },
          option: async (data) => {
            const list = await getAllUserList();
            return list.data.result;
          },
          showColumnSearch: true,
          showColumnSearchConfig: {
            type: "radio",
          },
        },
        {
          prop: "senderId",
          label: $i18n.t("checkTask.senderName"),
          minWidth: 120,
          optionProp: {
            value: "jobNumber",
            label: "nickName",
          },
          option: async (data) => {
            const list = await getAllUserList();
            return list.data.result;
          },
          showColumnSearch: true,
          showColumnSearchConfig: {
            type: "radio",
          },
        },
        {
          prop: "status",
          label: $i18n.t("checkTask.status"),
          minWidth: 120,
          // render: (h, scope) => {
          //   let cfStatus = "";
          //   if (scope.row.status == 1) {
          //     cfStatus = $i18n.t("checkTask.draft");
          //     return <el-tag type="info">{cfStatus}</el-tag>;
          //   }
          //   if (scope.row.status == 2) {
          //     cfStatus = $i18n.t("checkTask.toBeReviewed");
          //     return <el-tag type="">{cfStatus}</el-tag>;
          //   }
          //   if (scope.row.status == 3) {
          //     cfStatus = $i18n.t("checkTask.returned");
          //     return <el-tag type="danger">{cfStatus}</el-tag>;
          //   }
          //   if (scope.row.status == 4) {
          //     cfStatus = $i18n.t("checkTask.toBeAssigned");
          //     return <el-tag type="">{cfStatus}</el-tag>;
          //   }
          //   if (scope.row.status == 5) {
          //     cfStatus = $i18n.t("checkTask.checking");
          //     return <el-tag type="warning">{cfStatus}</el-tag>;
          //   }
          //   if (scope.row.status == 6) {
          //     cfStatus = $i18n.t("checkTask.testComplete");
          //     return <el-tag type="success">{cfStatus}</el-tag>;
          //   }
          //   if (scope.row.status == 7) {
          //     cfStatus = $i18n.t("checkTask.toBeReleased");
          //     return <el-tag type="success">{cfStatus}</el-tag>;
          //   }
          //   if (scope.row.status == 8) {
          //     cfStatus = $i18n.t("checkTask.retest");
          //     return <el-tag type="warning">{cfStatus}</el-tag>;
          //   }
          //   if (scope.row.status == 9) {
          //     cfStatus = $i18n.t("checkTask.completed");
          //     return <el-tag type="success">{cfStatus}</el-tag>;
          //   }
          //   if (scope.row.status == 10) {
          //     cfStatus = $i18n.t("checkTask.appraisal");
          //     return <el-tag type="success">{cfStatus}</el-tag>;
          //   }
          //   if (scope.row.status == 11) {
          //     cfStatus = $i18n.t("checkTask.abolished");
          //     return <el-tag type="danger">{cfStatus}</el-tag>;
          //   }
          // },
          optionProp: {
            value: "value",
            label: "description",
          },
          option: async (data) => {
            const list = await getDict("lims_check_task_status")
            return list.data.result
          },
          // option: async (data) => {
          //   const list = [
          //     { description: $i18n.t("checkTask.draft"), value: 1 },
          //     { description: $i18n.t("checkTask.toBeReviewed"), value: 2 },
          //     { description: $i18n.t("checkTask.returned"), value: 3 },
          //     { description: $i18n.t("checkTask.toBeAssigned"), value: 4 },
          //     { description: $i18n.t("checkTask.checking"), value: 5 },
          //     { description: $i18n.t("checkTask.testComplete"), value: 6 },
          //     { description: $i18n.t("checkTask.toBeReleased"), value: 7 },
          //     { description: $i18n.t("checkTask.retest"), value: 8 },
          //     { description: $i18n.t("checkTask.completed"), value: 9 },
          //     { description: $i18n.t("checkTask.appraisal"), value: 10 },
          //     { description: $i18n.t("checkTask.abolished"), value: 11 },
          //   ];
          //   return list;
          // },
          showColumnSearch: true,
          showColumnSearchConfig: {
            type: "radio",
          },
        },
        {
          prop: "createByName",
          label: $i18n.t("common.createByName"),
          minWidth: 120,
        },
        {
          prop: "createTime",
          label: $i18n.t("common.createTime"),
          minWidth: 180,
        },
        {
          prop: "updateByName",
          label: $i18n.t("common.updateByName"),
          minWidth: 120,
        },
        {
          prop: "updateTime",
          label: $i18n.t("common.updateTime"),
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
    };
  },
  computed: {},
  methods: {
    //表格顶部按钮操作事件
    handleOperateEvent(data) {
      this.title = data.name;
      let rows = data.rows;
      const fnc = {
        add: () => {
          // this.disableFields(false)
          // this.formDataDialog = {}
          // this.visible = true
          this.$refs.addOrViewDialog.init("add");
        },
        submitBatch: () => {
          for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            if (!["1"].includes(row.status)) {
              return this.$message.warning(
                $i18n.t("checkTask.submitDraftStatusDocuments")
              );
            }
          }
          this.$confirm(
            $i18n.t("checkTask.batchSubmit"),
            $i18n.t("common.tip"),
            {
              confirmButtonText: $i18n.t("common.ok"),
              cancelButtonText: $i18n.t("common.cancel"),
              type: "warning",
            }
          ).then(() => {
            const ids = rows.map((val) => val.id).join(",");
            this.handleSetStatus(ids, "2", $i18n.t("common.submitSuccess"));
          });
        },
        auditBatch: () => {
          if (rows[0].status !== "2") {
            return this.$message.warning(
              $i18n.t("checkTask.onlyAllowedToReview")
            );
          }
          // this.$confirm("此操作将批量提交委托检测任务表, 是否继续?", $i18n.t("common.tip"), {
          //   confirmButtonText: $i18n.t("common.ok"),
          //   cancelButtonText: $i18n.t("common.cancel"),
          //   type: "warning",
          // }).then(() => {
          //   const ids = rows.map((val) => val.id).join(',');
          //   this.handleSetStatus(ids, '4', '审核成功！');
          // });

          this.$refs.addOrViewDialog.init("audit", rows[0]);
        },
        deleteBatch: () => {
          for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            if (!["1"].includes(row.status)) {
              return this.$message.warning(
                $i18n.t("checkTask.allowedToDeleteTheStateOfDraft")
              );
            }
          }
          this.$confirm(
            $i18n.t("checkTask.deleteBatch"),
            $i18n.t("common.tip"),
            {
              confirmButtonText: $i18n.t("common.ok"),
              cancelButtonText: $i18n.t("common.cancel"),
              type: "warning",
            }
          ).then(() => {
            const ids = rows.map((val) => val.id).join(",");
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
          if (["1"].includes(row.status)) {
            // this.disableFields(false)
            // this.rowDetail(row.id)
            // this.visible = true
            this.$refs.addOrViewDialog.init("edit", row);
          } else {
            return this.$message.warning(
              $i18n.t("checkTask.modifiedToModifyTheStateOfDraft")
            );
          }
        },
        detail: () => {
          // this.disableFields(true)
          // this.rowDetail(row.id)
          // this.visible = true
          this.$refs.addOrViewDialog.init("view", row);
        },
        delete: () => {
          if (!["1"].includes(row.status)) {
            return this.$message.warning(
              $i18n.t("checkTask.allowedToDeleteTheStateOfDraft")
            );
          }
          this.$confirm(
            $i18n.t("checkTask.deleteSingle"),
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
      const params = this.formDataDialog.id
        ? { title: $i18n.t("common.editSuccess"), api: rowUpdate, data }
        : { title: $i18n.t("common.addSuccess"), api: rowCreate, data };
      this.doSubmit(params);
    },
    // 批量处理状态
    handleSetStatus(ids, status, title) {
      this.loading = true;
      setStatus({ ids: ids, status: status, remark: "3" })
        .then((res) => {
          const message = res.data.message;
          this.$message.success(message || title);
          this.refresh();
        })
        .finally(() => {
          this.loading = false;
        });
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
