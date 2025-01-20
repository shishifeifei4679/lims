<template>
  <div class="baseRegion-modeling">
  <div>
    <!--      左边的树   -->
    <!--      :props="{ label: 'name' }" 要显示在树上的中文-->
    <ele-tree-composite-table
      v-loading="loading"
      :props="{ label: 'regionName' }"
      :formConfig="searchConfig"
      leftWidth="260px"
      :operateList="operateList"
      @handleOperateEvent="handleOperateEvent"
      :column="column"
      :getList="getList"
      ref="treeCompositeTable"
      :getParamsFromNode="getParamsFromNode"
      :treeApi="getTree"
      uniqueId="baseRegionModelingTable"
    >
    </ele-tree-composite-table>

    <ele-dialog-table
      :title="$i18n.t('equipment.userInformationQuery')"
      width="800px"
      :visible.sync="baseUserDialogVisible"
      :formConfig="baseUserSearchDialog"
      :column="baseUserDialogColumn"
      @getSelectData="getSelectBaseUser"
      :otherParam="otherParams"
      :getList="getUserList"
      :hasFooter="hasBaseUserFooter"
    ></ele-dialog-table>
    <ele-dialog-table
      :title="$i18n.t('equipment.equipmentQuery')"
      width="1200px"
      maxHeight="250"
      :visible.sync="baseEquipmentDialogVisible"
      :formConfig="baseEquipmentSearchDialog"
      :column="baseEquipmentDialogColumn"
      @getSelectData="getSelectBaseEquipment"
      :getList="getNewList"
      :hasFooter="hasBaseEquipmentFooter"
    ></ele-dialog-table>
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
      <!-- 选择设备 -->
      <template v-slot:equipmentCode>
        <!-- 插槽内容有el-form-item组件包裹 -->
        <el-input
          v-model="formDataDialog.equipmentCode"
          readonly
          :placeholder="$i18n.t('equipment.equipmentSelect')"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="baseEquipmentDialogVisible = true"
          ></el-button>
        </el-input>
      </template>
      <!-- 申请人 -->
      <!-- 下方template标签放入ele-form-drawer中, 并且需要自行修改插槽属性及绑定表单对象的属性 -->
      <template v-slot:administratorName>
        <!-- 插槽内容有el-form-item组件包裹 -->
        <el-input
          v-model="formDataDialog.administratorName"
          readonly
          :placeholder="$i18n.t('equipment.administrator')"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="baseUserDialogVisible = true"
          ></el-button>
        </el-input>
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
  getTree,
  rowCreate,
  rowUpdate,
  rowDel,
  rowDetail,
  importData,
} from "@/api/limsequipment/limsEquipment";
import uploadNoAuto from "@/components/upload-no-auto";
import { baseUserDialog } from "./userMixin";
import { baseEquipmentDialog } from "./equipmentMixin";
import { getDict } from "@/api/common";
import svgIcon from "./components/svgIcon.vue";
import treeTable from "./components/treeTable.vue";
export default {
  name: "limsEquipment",
  mixins: [baseUserDialog, baseEquipmentDialog],
  components: {
    uploadNoAuto,svgIcon, treeTable
  },
  data() {
    return {
      isShowBtn: false, //true 显示  false 不显示
      iconType: [
        { value: 2, name: $i18n.t("baseFactoryModeling.industry"), type: 5 },
        { value: 6, name: $i18n.t("baseFactoryModeling.station"), type: 4 },
        { value: 5, name: $i18n.t("baseFactoryModeling.line"), type: 3 },
        { value: 4, name: $i18n.t("common.workshopName"), type: 2 },
        { value: 3, name: $i18n.t("baseFactoryModeling.tenantCode"), type: 1 },
        { value: 99, name: $i18n.t("baseFactoryModeling.enterprise"), type: 0 },
        { value: -1, name: $i18n.t("baseFactoryModeling."), type: -1 },
      ],
      getParamsFromNode: {
        column: [{ value: "id", key: "parentCode" }],
      },

      title: null,
      visible: false,
      isLoading: false,
      loading: false,
      formDataDialog: {},
      formDescDialog, //新增修改框
      searchConfig,
      operateList,
      getList,
      getTree,
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
          prop: "equipmentCode",
          label: $i18n.t("equipment.equipmentCode"),
          minWidth: 150,
         showColumnSearch: true,
        },
        {
          prop: "equipmentName",
          label: $i18n.t("equipment.equipmentName"),
          minWidth: 150,
         showColumnSearch: true,
        },
        {
          prop: "status",
          label: $i18n.t("equipment.status"),
          minWidth: 120,
          // render: (h, scope) => {
          //   let cfStatus = "";
          //   if (scope.row.status == 0) {
          //     return (
          //       <el-tag type="success">{$i18n.t("equipment.running")}</el-tag>
          //     );
          //   }
          //   if (scope.row.status == 1) {
          //     return <el-tag type="danger">{$i18n.t("equipment.stop")}</el-tag>;
          //   }
          //   if (scope.row.status == 2) {
          //     return <el-tag>{$i18n.t("equipment.repair")}</el-tag>;
          //   }
          //   if (scope.row.status == 3) {
          //     return (
          //       <el-tag type="info">{$i18n.t("equipment.scrapped")}</el-tag>
          //     );
          //   }
          // },
          optionProp: {
            value: "value",
            label: "description",
          },
          option: async (data) => {
            const list = await getDict("lims_equipment_status")
            return list.data.result
          },
          showColumnSearch: true,
          showColumnSearchConfig: {
            type: "radio",
            // option: async (data) => {
            //   const list = [{ "description": $i18n.t("equipment.running"), "value": 0 },
            //   { "description": $i18n.t("equipment.stop"), "value": 1 },
            //   { "description": $i18n.t("equipment.repair"), "value": 2 },
            //   { "description": $i18n.t("equipment.scrapped"), "value": 3 }
            //   ];
            //   return list;
            // },
          },
        },
        {
          prop: "productionNumber",
          label: $i18n.t("equipment.productionNumber"),
          minWidth: 180,
         showColumnSearch: true,
        },
        {
          prop: "managementNumber",
          label: $i18n.t("equipment.managementNumber"),
          minWidth: 200,
          showColumnSearch: true,
        },
        {
          prop: "equipmentModel",
          label: $i18n.t("equipment.equipmentModel"),
          minWidth: 150,
          showColumnSearch: true,
        },
        // {
        //   prop: "location",
        //   label: $i18n.t("equipment.location"),
        //   minWidth: 180,
        // },
        {
          prop: "administratorName",
          label: $i18n.t("equipment.administratorName"),
          minWidth: 150,
        },
        {
          prop: "validity",
          label: $i18n.t("equipment.validity"),
          minWidth: 180,
        },
        {
          prop: "createByName",
          label: $i18n.t("equipment.createByName"),
          minWidth: 150,
        },
        {
          prop: "createTime",
          label: $i18n.t("equipment.createTime"),
          minWidth: 180,
        },
        {
          prop: "updateByName",
          label: $i18n.t("equipment.updateByName"),
          minWidth: 150,
        },
        {
          prop: "updateTime",
          label: $i18n.t("equipment.updateTime"),
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
      const fnc = {
        add: () => {
          this.disableFields(false);
          this.formDataDialog = {};
          this.visible = true;
        },
        batchAdd: () => {
          let pathParam = "/limsequipment/limsEquipmentAdd";
          this.$router.push({ path: pathParam });
        },
        deleteBatch: () => {
          this.$confirm(
            $i18n.t("common.deleteBatch", { name: $i18n.t("equipment.name") }),
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
            $i18n.t("common.deleteSingle", { name: $i18n.t("equipment.name") }),
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

      if (
        new Date(this.formDataDialog.validity) < Date.now() &&
        this.formDataDialog.status == "0"
      ) {
        this.$message.error($i18n.t("equipment.equipmentShouldBeStopped"));
        return;
      }
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
      });
    },
    //刷新表格数据
    refresh(isReset = true) {
      this.$refs.treeCompositeTable.refresh(isReset);
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
<style lang="scss" scoped>
.baseRegion-modeling {
  .flex {
    display: flex;
  }

  .tooltip {
    font-size: 12px;
    margin-left: 20px;
    line-height: 30px;
    color:#676869
  }
  /deep/.el-tree-node__content {
    align-items: start !important;
    height: auto !important;
  }
  /deep/.el-transfer-panel {
    width: 35%;
  }

  .label-pack {
    display: flex;
    align-items: center;
    span {
      display: flex;
      align-items: center;
    }

    .padd-r-5 {
      padding-right: 5px;
    }
    .tree-label {
      padding-left: 5px;
      font-size: 14px;
    }
  }
}
</style>
