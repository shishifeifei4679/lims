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
        uniqueId="limsCheckSampleTable"
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
      :title="$i18n.t('checkSample.import')"
    >
      <template v-slot:file="{ desc, data, field, formData }">
        <!-- 插槽内容有el-form-item组件包裹 -->
        <uploadNoAuto @onchange="upLoadHandleChange" ref="uploadNoAuto" />
      </template>
    </ele-form-drawer>
    <receive-dialog ref="receiveDialog" />
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
  batchReceive,
  receive,
  returnSample,
  batchReturn,
} from "@/api/limschecksample/limsCheckSample";
import { getDict } from "@/api/common";
import { returnTask } from "@/api/limsCheckTask/limsCheckTask";
import uploadNoAuto from "@/components/upload-no-auto";
import ReceiveDialog from "@/views/limschecksample/components/receiveDialog.vue";

export default {
  name: "limsCheckSample",
  components: {
    uploadNoAuto,
    ReceiveDialog,
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
          prop: "taskCode",
          label: $i18n.t("checkSample.taskCode"),
          minWidth: 180,
          showColumnSearch: true,
        },
        {
          prop: "sampleCode",
          label: $i18n.t("checkSample.sampleCode"),
          minWidth: 180,
          showColumnSearch: true,
        },
        {
          prop: "sampleName",
          label: $i18n.t("checkSample.sampleName"),
          minWidth: 160,
          showColumnSearch: true,
        },
        {
          prop: "categoryName",
          label: $i18n.t("checkSample.categoryName"),
          minWidth: 160,
        },
        {
          prop: "status",
          label: $i18n.t("checkSample.status"),
          minWidth: 120,
          // render: (h, scope) => {
          //   let cfStatus = "";

          //   if (scope.row.status == 1) {
          //     return <el-tag>{$i18n.t("checkSample.notReceived")}</el-tag>;
          //   }
          //   if (scope.row.status == 2) {
          //     return (
          //       <el-tag type="success">{$i18n.t("checkSample.arrived")}</el-tag>
          //     );
          //   }
          //   if (scope.row.status == 3) {
          //     return (
          //       <el-tag type="danger">{$i18n.t("checkSample.returned")}</el-tag>
          //     );
          //   }
          //   if (scope.row.status == 4) {
          //     return (
          //       <el-tag type="success">
          //         {$i18n.t("checkSample.received")}
          //       </el-tag>
          //     );
          //   }
          //   if (scope.row.status == 5) {
          //     return (
          //       <el-tag type="success">
          //         {$i18n.t("checkSample.testCompleted")}
          //       </el-tag>
          //     );
          //   }
          //   if (scope.row.status == 6) {
          //     return (
          //       <el-tag type="warning">
          //         {$i18n.t("checkSample.retesting")}
          //       </el-tag>
          //     );
          //   }
          //   if (scope.row.status == 7) {
          //     return (
          //       <el-tag type="info">{$i18n.t("checkSample.abolished")}</el-tag>
          //     );
          //   }
          //   if (scope.row.status == 9) {
          //     return (
          //       <el-tag type="success">
          //         {$i18n.t("checkSample.completed")}
          //       </el-tag>
          //     );
          //   }
          //   if (scope.row.status == 10) {
          //     return (
          //       <el-tag type="success">{$i18n.t("checkSample.rated")}</el-tag>
          //     );
          //   }
          // },
          // option: async (data) => {
          //   const list = [
          //     { description: $i18n.t("checkSample.notReceived"), value: 1 },
          //     { description: $i18n.t("checkSample.arrived"), value: 2 },
          //     { description: $i18n.t("checkSample.returned"), value: 3 },
          //     { description: $i18n.t("checkSample.received"), value: 4 },
          //     { description: $i18n.t("checkSample.testCompleted"), value: 5 },
          //     { description: $i18n.t("checkSample.retesting"), value: 6 },
          //     { description: $i18n.t("checkSample.abolished"), value: 7 },
          //     { description: $i18n.t("checkSample.completed"), value: 9 },
          //     { description: $i18n.t("checkSample.rated"), value: 10 },
          //   ];
          //   return list;
          // },
          optionProp: {
            value: "value",
            label: "description",
          },
          option: async (data) => {
            const list = await getDict("lims_receiving_status")
            return list.data.result
          },
          showColumnSearch: true,
          showColumnSearchConfig: {
            type: "radio",
          },
        },
        {
          prop: "sampleModel",
          label: $i18n.t("checkSample.sampleModel"),
          minWidth: 160,
        },
        {
          prop: "unit",
          label: $i18n.t("checkSample.unit"),
          minWidth: 160,
        },
        {
          prop: "receiver",
          label: $i18n.t("checkSample.receiver"),
          minWidth: 160,
        },
        {
          prop: "expectFinishTime",
          label: $i18n.t("checkSample.expectFinishTime"),
          minWidth: 180,
        },
        {
          prop: "promiseFinishTime",
          label: $i18n.t("checkSample.promiseFinishTime"),
          minWidth: 180,
        },

        {
          prop: "receiveTime",
          label: $i18n.t("checkSample.receiveTime"),
          minWidth: 180,
        },
        {
          prop: "senderName",
          label: $i18n.t("checkSample.senderName"),
          minWidth: 160,
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
      const fnc = {
        // add: () => {
        //   this.disableFields(false)
        //   this.formDataDialog = {}
        //   this.visible = true
        // },
        // batchAdd: () => {
        //   let pathParam = '/limschecksample/limsCheckSampleAdd';
        //   this.$router.push({path: pathParam});
        // },
        deleteBatch: () => {
          this.$confirm(
            $i18n.t("checkSample.deleteBatch"),
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
        returnSample: () => {
          this.$confirm(
            $i18n.t("checkSample.returnSampleConfirm"),
            $i18n.t("common.tip"),
            {
              confirmButtonText: $i18n.t("common.ok"),
              cancelButtonText: $i18n.t("common.cancel"),
              type: "warning",
            }
          ).then(() => {
            const id = data.rows[0].id;
            this.returnSample(id);
          });
        },
        returnTask: () => {
          this.$confirm(
            $i18n.t("checkSample.returnTaskConfirm"),
            $i18n.t("common.tip"),
            {
              confirmButtonText: $i18n.t("common.ok"),
              cancelButtonText: $i18n.t("common.cancel"),
              type: "warning",
            }
          ).then(() => {
            const taskCode = data.rows[0].taskCode;
            this.returnTask(taskCode);
          });
        },
        receive: () => {
          if (data.rows[0].status != 1) {
            return this.$message.warning(
              $i18n.t("checkSample.onlyNotReceivingOperate")
            );
          }
          this.$refs.receiveDialog.init(data.rows[0]);
        },
        batchReceive: () => {
          this.$confirm(
            $i18n.t("checkSample.batchReceiveConfirm"),
            $i18n.t("common.tip"),
            {
              confirmButtonText: $i18n.t("common.ok"),
              cancelButtonText: $i18n.t("common.cancel"),
              type: "warning",
            }
          ).then(() => {
            const ids = data.rows.map((val) => val.id).join(",");
            this.batchReceive(ids);
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
          // this.disableFields(true)
          // this.rowDetail(row.id)
          // this.visible = true
          this.$refs.receiveDialog.init(row, "view");
        },
        delete: () => {
          this.$confirm(
            $i18n.t("common.deleteSingle", {
              name: $i18n.t("checkSample.name"),
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

    returnSample(data) {
      this.loading = true;
      returnSample(data)
        .then((res) => {
          this.$message.success($i18n.t("checkSample.samplesAreInvalidated"));
          this.refresh();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    batchReceive(data) {
      this.loading = true;

      batchReceive(data)
        .then((res) => {
          this.$message.success($i18n.t("checkSample.batchReceipt"));
          this.refresh();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    //整单退回
    returnTask(data) {
      this.loading = true;
      returnTask(data)
        .then((res) => {
          this.$message.success($i18n.t("checkSample.returnSuccessfully"));
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
