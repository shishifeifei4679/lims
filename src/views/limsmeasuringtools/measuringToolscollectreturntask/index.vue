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
        uniqueId="limsMeasuringToolsCollectReturnTaskTable"
      >
      </ele-page>
    </div>

    <!-- 新增、修改、详情侧抽 -->
    <ele-form-drawer
      class="dialog-pack"
      :isLoading="isLoading"
      v-model="formDataDialog"
      v-bind="formDescDialog"
      :request-fn="handleSubmit"
      :visible.sync="visible"
      :title="title"
      size="50%"
    >
    </ele-form-drawer>

    <!-- 导入侧抽 -->
    <ele-form-drawer
      size="30%"
      :isLoading="isLoadingImport"
      v-model="importData"
      v-bind="importFormDescDialog"
      :request-fn="handleSubmitImport"
      :visible.sync="importVisible"
      :destroyOnClose="true"
      :title="$i18n.t('common.import')"
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
  getSystemList,
  getDepartmentCodeTree
} from '@/api/limsmeasuringtools/measuringToolscollectreturntask'
import uploadNoAuto from "@/components/upload-no-auto";
import {
    getDict // 字典查询
} from '@/api/common';
export default {
  name: "limsMeasuringToolsCollectReturnTask",
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
          type: "selection",
        },
        {
          type: "index",
          label: $i18n.t("common.order"), // 序号
          fixed: "left",
        },
        {
          prop: "orderNo",
          label: $i18n.t('limsMeasuringToolsCollectReturnTask.orderNo'),  // 申请编码
          width: '120',
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: { // 非必填 对象{} 不设置，就是默认模糊搜索
            //type: 'radio', //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
          },
        },
        {
          prop: "operateType",
          label: $i18n.t('limsMeasuringToolsCollectReturnTask.operateType'),  // 操作类型(字典：领用归还操作类型-lims_collect_return_operate_type) 1：领用 2：归还
          width: '120',
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: {
            // 非必填 对象{} 不设置，就是默认模糊搜索
            type: "radio", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
            specifySearchKey: 'operateType',
          },
          optionProp: {
            value: "value",
            label: "description",
          },
          option: async (data) => {
            const list = await getDict("lims_collect_return_operate_type");
            return list.data.result;
          },
        },
        {
          prop: "collectDepartmentName",
          label: $i18n.t("limsMeasuringToolsCollectReturnTask.collectDepartmentName"), // 领用部门
          width: "120",
          showColumnSearch: true,
          optionProp: {
            value: "deptCode",
            label: "name",
          },
          showColumnSearchConfig: {
            // 非必填 对象{} 不设置，就是默认模糊搜索
            type: "tree", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
            specifySearchKey: "collectDepartmentCode",
            option: async (data) => {
              const list = await getDepartmentCodeTree();
              return list.data.result;
            },
          },
//          render: (h, scope) => {
//            // scope列表上选择的数据
//            return (
//              <span>{scope.row.collectDepartmentName || '/'}</span>
//            );
//          },
        },
        {
          prop: "createByName",
          label: $i18n.t('limsMeasuringToolsCollectReturnTask.createByName'),  // 创建人
          width: '120',
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: { // 非必填 对象{} 不设置，就是默认模糊搜索
            //type: 'radio', //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
          },
        },
        {
          prop: "createTime",
          label: $i18n.t('limsMeasuringToolsCollectReturnTask.createTime'),  // 创建时间
          width: 160,
          showOverflowTooltip: true,
          showColumnSearch: true,
          showColumnSearchConfig: {
            type: "dateTimePicker", //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单） 'radio'单选（对应原下拉菜单）
            // defaultValue: ['2024-08-03 00:00:00', '2024-08-16 23:59:59'],
          },
        },
        {
          prop: 'operate',
          label: $i18n.t('common.operation'),
          width: 80,
          fixed: 'right',
          showOverflowTooltip: false,
          render: (h, scope) => {
            return <ele-row-operation scope={scope} rowConfig={rowConfig} onRowOperate={this.rowOperate} />
          }
        }
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
          this.$confirm($i18n.t("common.deleteConfirm"), $i18n.t("common.tip"), {
            confirmButtonText:  $i18n.t("common.submit"),
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
          this.rowDetail(row)
          this.visible = true
        },
        delete: () => {
          this.$confirm($i18n.t("common.deleteConfirm"), $i18n.t("common.tip"), {
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
      if(data.contractPath) {
        data.contractPath = data.contractPath.map(r => r.url).join(",")
      }else{
        data.contractPath = ''
      }
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
    rowDetail(row) {
      //操作类型(字典：领用归还操作类型-lims_collect_return_operate_type) 1：领用 2：归还
      if (row.operateType === '1') {
        this.title = $i18n.t("limsMeasuringToolsCollectReturnTask.collectInfo"); //领用详情

      } else {
        this.title = $i18n.t("limsMeasuringToolsCollectReturnTask.returnInfo"); //归还详情
      }

      rowDetail(row.orderNo)
        .then((res) => {
          this.formDataDialog = {
            ...res.data.result
          }
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
          console.log("错误",error)
          this.$set(this.importData,"file",null)
      }).finally(() => {
          this.isLoadingImport = false;
          this.$refs.uploadNoAuto.clearFiles()
      })
    },
  },
}
</script>
