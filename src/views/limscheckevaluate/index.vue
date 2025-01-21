<template>
  <div>
    <div>
      <ele-page v-loading="loading" :formConfig="searchConfig" ref="eleTable" :operateList="operateList"
        @handleOperateEvent="handleOperateEvent" :column="column" :getList="getReportList"
        uniqueId="limsCheckEvaluateTable">
      </ele-page>
    </div>
    <ele-form-drawer class="dialog-pack" :isLoading="isLoading" v-model="formDataDialog" v-bind="formDescDialog"
      :request-fn="handleSubmit" :visible.sync="visible" :title="title">
    </ele-form-drawer>
    <!-- 导入弹框 -->
    <ele-form-drawer size="30%" :isLoading="isLoadingImport" v-model="importData" v-bind="importFormDescDialog"
      :request-fn="handleSubmitImport" :visible.sync="importVisible" :destroyOnClose="true"
      :title="$i18n.t('checkEvaluate.import')">
      <template v-slot:file="{ desc, data, field, formData }">
        <!-- 插槽内容有el-form-item组件包裹 -->
        <uploadNoAuto @onchange="upLoadHandleChange" ref="uploadNoAuto" />
      </template>
    </ele-form-drawer>
    <score-dialog ref="scoreDialog" />
    <review-dialog ref="reviewDialog" />
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
  rowCreate,
  rowUpdate,
  rowDel,
  rowDetail,
  importData,
  downloadPDF,
} from '@/api/limscheckevaluate/limsCheckEvaluate'
import uploadNoAuto from "@/components/upload-no-auto";
import ScoreDialog from "@/views/limscheckevaluate/components/scoreDialog.vue";
import ReviewDialog from "@/views/limscheckevaluate/components/reviewDialog.vue";
import {
  getList,
  getReportList
} from '@/api/limsCheckTask/limsCheckTask'
import { getDict } from "@/api/common";
import { getAllUserList } from "@/api/user";
import { exportExcel } from "@/utils/judge";

export default {
  name: "limsCheckEvaluate",
  components: {
    uploadNoAuto,
    ScoreDialog,
    ReviewDialog
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
      getReportList,
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
        },
        {
          prop: "code",
          label: $i18n.t("checkEvaluate.code"),
          width: 160,
          fixed: "left",
          showColumnSearch: true,
        },
        {
          prop: "deptName",
          width: 160,
          label: $i18n.t("checkEvaluate.deptName"),
        },
        {
          prop: "entrustId",
          label: $i18n.t("checkEvaluate.entrustId"),
          width: 120,
          optionProp: {
            value: 'jobNumber',
            label: 'nickName'
          },
          option: async (data) => {
            const list = await getAllUserList()
            return list.data.result
          },
        },
        /*{
          prop: "entrustTelephone",
          label: "委托人联系方式",
          width: 120,
        },
        {
          prop: "senderId",
          label: "送样人",
          width: 120,
          optionProp: {
            value: 'jobNumber',
            label: 'nickName'
          },
          option: async (data) => {
            const list = await getAllUserList()
            return list.data.result
          },
        },
        {
          prop: "senderTelephone",
          label: "送样人联系方式",
          width: 120,
        },*/
        {
          prop: "status",
          label: $i18n.t("checkEvaluate.status"),
          width: 120,
          showColumnSearch: true,
          showColumnSearchConfig: {
            type: "radio"
          },
          optionProp: {
            value: "value",
            label: "description"
          },
          option: async (data) => {
            const list = await getDict("lims_check_task_status");
            return list.data.result
          }
        },
       
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
  computed: {
  },
  methods: {
    //表格顶部按钮操作事件
    handleOperateEvent(data) {
      this.title = data.name
      const fnc = {
        evaluate: () => {
          // this.disableFields(false)
          // this.formDataDialog = {}
          // this.visible = true
          if (data.rows[0].status != 9) {
            return this.$message.warning($i18n.t("checkEvaluate.completeStateOperated"))
          }
          this.$refs.scoreDialog.init(data.rows[0])
        },
        review: () => {
          if (data.rows[0].status != 6) {
            return this.$message.warning($i18n.t("checkEvaluate.detectCompleteStateOperated"))
          }
          this.$refs.reviewDialog.init(data.rows[0], 'review')
        },
        downloadPDF: () => {
          var rowdate = data.rows[0];
          if (rowdate.status == 9 || rowdate.status == 10) {
            exportExcel(downloadPDF(data.rows[0].id), {}, 'application/pdf;charset=utf-8')
          } else {
            this.$message.warning($i18n.t("checkEvaluate.onlyDownloadPdf"))
          }

        }
      }
      fnc[data.handleName]()
    },
    //表格行操作事件
    rowOperate({ handleName, name, row }) {
      this.title = name
      const fnc = {
        view: () => {
          this.$refs.reviewDialog.init(row, 'view')
        },
      }
      fnc[handleName]()
    },
    doSubmit({ title, api, data }) {
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
        ? { title: $i18n.t("common.editSuccess"), api: rowUpdate, data }
        : { title: $i18n.t("common.addSuccess"), api: rowCreate, data }
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
