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
        uniqueId="limsCheckItemsTable"
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
      :title="$i18n.t('checkItems.import')"
    >
      <template v-slot:file="{ desc, data, field, formData }">
        <!-- 插槽内容有el-form-item组件包裹 -->
        <uploadNoAuto @onchange="upLoadHandleChange" ref="uploadNoAuto" />
      </template>
    </ele-form-drawer>

    <el-dialog
      :title="$i18n.t('checkItems.entireOrderReturned')"
      :visible.sync="backAllDialog"
      v-if="backAllDialog"
      append-to-body
      :close-on-click-modal="false"
      width="650px"
    >
      <el-row>
        <el-col :span="24">
          <el-form
            @submit.native.prevent
            :model="backAllForm"
            ref="form"
            label-width="80px"
          >
            <el-form-item :label="$i18n.t('checkItems.returnReason')">
              <el-radio-group v-model="backAllForm.reason">
                <el-radio :label="backAllForm.radio_1">{{
                  backAllForm.radio_1
                }}</el-radio>
                <el-radio :label="backAllForm.radio_2">{{
                  backAllForm.radio_2
                }}</el-radio>
                <el-radio :label="backAllForm.radio_3">{{
                  backAllForm.radio_3
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="">
              <el-input
                type="textarea"
                style="width: 80%"
                v-model="backAllForm.details"
                :maxlength="500"
                show-word-limit
                :placeholder="$i18n.t('checkItems.hintInputReason')"
                :rows="4"
                ref="input"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-row style="margin: 20px; text-align: center">
          <el-button
            type="primary"
            :loading="loading"
            @click="handleBack('1')"
            >{{ $i18n.t("common.ok") }}</el-button
          >
          <el-button type="" :loading="loading" @click="handleBack('2')">{{
            $i18n.t("common.cancel")
          }}</el-button>
        </el-row>
      </span>
    </el-dialog>
    <result-entry-dialog ref="resultEntryDialog" />
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
  rowCreate,
  rowUpdate,
  rowDel,
  rowDetail,
  importData,
  getList,
} from "@/api/limscheckitems/limsCheckItems";
import uploadNoAuto from "@/components/upload-no-auto";
import { getDict } from "@/api/common";
import { setStatus } from "@/api/limsCheckTask/limsCheckTask";
import ResultEntryDialog from "@/views/limscheckitems/components/resultEntryDialog.vue";

export default {
  name: "limsCheckItems",
  components: {
    uploadNoAuto,
    ResultEntryDialog,
  },
  data() {
    return {
      backAllDialog: false,
      backAllForm: {
        reason: $i18n.t("checkItems.conditionsNotAvailable"),
        radio_1: $i18n.t("checkItems.conditionsNotAvailable"),
        radio_2: $i18n.t("checkItems.testRequirementsUnknown"),
        radio_3: $i18n.t("checkItems.other"),
        details: "",
      },
      radio: 1,
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
        },
        // {
        //   prop: "taskId",
        //   label: "委托单任务表id",
        // },
        {
          prop: "taskCode",
          label: $i18n.t("checkItems.taskCode"),
          width: 180,
          showColumnSearch: true,
        },
        {
          prop: "sampleCode",
          label: $i18n.t("checkItems.sampleCode"),
          width: 180,
        },
        // {
        //   prop: "sampleNo",
        //   label: "样品序号",
        // },
        {
          prop: "sampleName",
          label: $i18n.t("checkItems.sampleName"),
          width: 150,
          showColumnSearch: true,
        },
        {
          prop: "categoryName",
          label: $i18n.t("checkItems.categoryName"),
          width: 150,
        },
        {
          prop: "sampleModel",
          label: $i18n.t("checkItems.sampleModel"),
          width: 150,
        },
        // {
        //   prop: "sampleColor",
        //   label: "样品颜色",
        // },
        // {
        //   prop: "sampleQty",
        //   label: "样品数量",
        // },
        {
          prop: "unit",
          label: $i18n.t("checkItems.unit"),
          width: 100,
        },
        {
          prop: "status",
          label: $i18n.t("checkItems.status"),
          width: 120,
          // render: (h, scope) => {
          //   let cfStatus = "";

          //   if (scope.row.status == 1) {
          //     return <el-tag>{$i18n.t("checkItems.notReceived")}</el-tag>;
          //   }
          //   if (scope.row.status == 2) {
          //     return (
          //       <el-tag type="success">{$i18n.t("checkItems.arrived")}</el-tag>
          //     );
          //   }
          //   if (scope.row.status == 3) {
          //     return (
          //       <el-tag type="danger">{$i18n.t("checkItems.returned")}</el-tag>
          //     );
          //   }
          //   if (scope.row.status == 4) {
          //     return <el-tag>{$i18n.t("checkItems.received")}</el-tag>;
          //   }
          //   if (scope.row.status == 5) {
          //     return (
          //       <el-tag type="success">
          //         {$i18n.t("checkItems.testCompleted")}
          //       </el-tag>
          //     );
          //   }
          //   if (scope.row.status == 6) {
          //     return (
          //       <el-tag type="warning">
          //         {$i18n.t("checkItems.retesting")}
          //       </el-tag>
          //     );
          //   }
          //   if (scope.row.status == 7) {
          //     return (
          //       <el-tag type="info">{$i18n.t("checkItems.abolished")}</el-tag>
          //     );
          //   }
          //   if (scope.row.status == 9) {
          //     return (
          //       <el-tag type="success">
          //         {$i18n.t("checkItems.completed")}
          //       </el-tag>
          //     );
          //   }
          //   if (scope.row.status == 10) {
          //     return (
          //       <el-tag type="success">{$i18n.t("checkItems.rated")}</el-tag>
          //     );
          //   }
          // },
          // option: async (data) => {
          //   const list = [
          //     { description: $i18n.t("checkItems.notReceived"), value: 1 },
          //     { description: $i18n.t("checkItems.arrived"), value: 2 },
          //     { description: $i18n.t("checkItems.returned"), value: 3 },
          //     { description: $i18n.t("checkItems.received"), value: 4 },
          //     { description: $i18n.t("checkItems.testCompleted"), value: 5 },
          //     { description: $i18n.t("checkItems.retesting"), value: 6 },
          //     { description: $i18n.t("checkItems.abolished"), value: 7 },
          //     { description: $i18n.t("checkItems.completed"), value: 9 },
          //     { description: $i18n.t("checkItems.rated"), value: 10 },
          //   ];
          //   return list;
          // },
          optionProp: {
            value: "value",
            label: "description",
          },
          option: async (data) => {
            const list = await getDict("lims_check_sample_status")
            return list.data.result
          },
          showColumnSearch: true,
          showColumnSearchConfig: {
            type: "radio",
          },
        },
        // {
        //   prop: "factoryBrand",
        //   label: "厂家及品牌",
        // },
        // {
        //   prop: "customerName",
        //   label: "客户名称",
        // },
        // {
        //   prop: "contractCode",
        //   label: "合同条码编号",
        // },
        // {
        //   prop: "wallThickness",
        //   label: "壁厚",
        // },
        // {
        //   prop: "pipeDiameter",
        //   label: "管径",
        // },
        // {
        //   prop: "appearance",
        //   label: "外观",
        // },
        // {
        //   prop: "ratio",
        //   label: "比例",
        // },
        {
          prop: "expectFinishTime",
          label: $i18n.t("checkItems.expectFinishTime"),
          width: 180,
        },
        {
          prop: "promiseFinishTime",
          label: $i18n.t("checkItems.promiseFinishTime"),
          width: 180,
        },
        // {
        //   prop: "mainCheckerId",
        //   label: "主检人id（备用 委托一对多时使用）",
        // },
        {
          prop: "mainCheckerName",
          label: $i18n.t("checkItems.mainCheckerName"),
          width: 150,
        },
        // {
        //   prop: "checkerDelegatorId",
        //   label: "代理检测人id",
        // },
        // {
        //   prop: "checkerDelegatorName",
        //   label: "代理检测人名称",
        // },
        // {
        //   prop: "fileName",
        //   label: "文件名称",
        // },
        // {
        //   prop: "fileUrl",
        //   label: "文件存放路径",
        // },
        // {
        //   prop: "receiverId",
        //   label: "收样人id",
        // },
        {
          prop: "receiveTime",
          label: $i18n.t("checkItems.receiveTime"),
          width: 180,
        },
        {
          prop: "receiver",
          label: $i18n.t("checkItems.receiver"),
          width: 150,
        },
        // {
        //   prop: "senderId",
        //   label: "送样人id",
        // },
        {
          prop: "senderName",
          label: $i18n.t("checkItems.senderName"),
          width: 150,
        },
        // {
        //   prop: "senderTelephone",
        //   label: "送样人联系方式",
        // },

        {
          prop: "remark",
          label: $i18n.t("checkItems.remark"),
          width: 150,
        },
        // {
        //   prop: "createByName",
        //   label: "创建人名称",
        // },
        // {
        //   prop: "createTime",
        //   label: "创建时间",
        //   width: 180,
        // },
        // {
        //   prop: "updateByName",
        //   label: "更新人名称",
        // },
        // {
        //   prop: "updateTime",
        //   label: "更新时间",
        //   width: 180,
        // },
        // {
        //   prop: "factoryCode",
        //   label: "工厂编码",
        // },
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
        add: () => {
          this.disableFields(false);
          this.formDataDialog = {};
          this.visible = true;
        },
        deleteBatch: () => {
          this.$confirm(
            $i18n.t("common.deleteBatch", { name: $i18n.t("checkItems.name") }),
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
        //整单退回
        handleBackAll: () => {
          // for (let i = 0; i < data.rows.length; i++) {
          //   let row = data.rows[i]
          //   if (!['4'].includes(row.status)) {
          //     return this.$message.warning($i18n.t("checkItems.testedNotBeOperated"))
          //   }
          // }
          this.backAllForm.taskIds = data.rows
            .map((val) => val.taskId)
            .join(",");
          this.backAllDialog = true;
        },
        //检测结果录入
        resultEntry: () => {
          for (let i = 0; i < data.rows.length; i++) {
            debugger;
            let row = data.rows[i];
            if (![4].includes(row.status)) {
              return this.$message.warning(
                $i18n.t("checkItems.testedNotBeOperated")
              );
            }
          }
          this.$refs.resultEntryDialog.init("edit", data.rows[0]);
        },
      };
      fnc[data.handleName]();
    },
    //表格行操作事件
    rowOperate({ handleName, name, row }) {
      this.title = name;
      const fnc = {
        edit: () => {
          // this.disableFields(false)
          // this.rowDetail(row.id)
          this.visible = true;
        },
        detail: () => {
          // this.disableFields(true)
          // this.rowDetail(row.id)
          this.$refs.resultEntryDialog.init("view", row);
        },
        delete: () => {
          this.$confirm(
            $i18n.t("common.deleteSingle", {
              name: $i18n.t("checkItems.name"),
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
    handleBack(flag) {
      if (flag === "1") {
        this.loading = true;
        let reason = "";
        if (this.backAllForm.details) {
          reason = this.backAllForm.reason + "," + this.backAllForm.details;
        } else {
          reason = this.backAllForm.reason;
        }
        let params = {
          ids: this.backAllForm.taskIds,
          status: "3",
          remark: "3",
          userDefined1: reason,
        };
        // console.log(params)
        setStatus(params)
          .then((res) => {
            const message = res.data.message;
            this.$message.success(message || title);
          })
          .finally(() => {
            this.loading = false;
          });
        this.refresh();
      }
      this.backAllForm = {
        reason: $i18n.t("checkItems.conditionsNotAvailable"),
        radio_1: $i18n.t("checkItems.conditionsNotAvailable"),
        radio_2: $i18n.t("checkItems.testRequirementsUnknown"),
        radio_3: $i18n.t("checkItems.other"),
        details: "",
      };
      this.backAllDialog = false;
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
        : { title: $i18n.t("checkItems.addedSuccess"), api: rowCreate, data };
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
