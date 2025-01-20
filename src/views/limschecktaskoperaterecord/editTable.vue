<template>
  <div>
    <div style="position: relative">
      <el-button
        type="primary"
        style="top: 0px; right: 0; position: absolute"
        @click="handleSubmit"
      >
        {{ $i18n.t("checkTaskOperateRecord.submit") }}
      </el-button>
    </div>
    <div class="layoutTable direction">
    <!--  -->

      <div class="right">
        <ele-table-batch-editor
          ref="table"
          :column="columns"
          v-model="tableData"
          :operateList="operateList"
          :isShowAddBtn="true"
          @handleOperateEvent="handleOperateEvent"
        >
          <template v-slot:tableTitle>
            <h3>{{ $i18n.t("checkTaskOperateRecord.detailList") }}</h3>
          </template>
        </ele-table-batch-editor>
      </div>
    </div>
  </div>
</template>
<script>
import {
  editTableRowConfig,
} from "./config";
import {
  rowBatchCreate,
} from '@/api/limschecktaskoperaterecord/limsCheckTaskOperateRecord'

export default {
  data() {
    return {
      formData: {},
      editTableFormDesc,
      isLoading: false,
      // 列表头按钮配置
      operateList: [
        {
          name: $i18n.t("common.add"),
          type: "primary",
          icon: "el-icon-circle-plus-outline",
          handleName: "add", //点击时返回的标识
        },
      ],
      // 表格数据
      tableData: [],

      // 表格列
      columns: [
        {
          type: "index",
        },
        {
          prop: "operate",
          label: $i18n.t("common.operation"),
          width: 100,
          render: (h, scope) => {
            return (
              <ele-row-operation
                scope={scope}
                rowConfig={editTableRowConfig}
                onRowOperate={this.rowOperate}
              />
            );
          },
        },
      ],
    };
  },

  methods: {
    //顶部操作按钮事件
    handleOperateEvent(data) {
      const fnc = {
        add: () => {
          this.tableData = [...this.tableData, {}];
        },
        deleteBatch: () => {
          console.log(data, this.tableData);
        },
      };
      fnc[data.handleName]();
    },
    //行操作事件
    rowOperate(data) {
      console.log(data);
      this.tableData.splice(data.$index, 1);
    },
    //提交事件
    handleSubmit() {
      //如果表单有必填项 使用 validate() 检验，如果没有校验可直接提交
      //表单的校验需开发者自己做循环校验
      const data = this.tableData.map(d => d = {...d, ...this.formData})
      rowBatchCreate(data)
        .then(res => {
          const message = res.data.message
          this.$message.success(message || $i18n.t("common.addSuccess"))
          this.clear();
        })
    },
    clear() {
      // this.formData = {};
      this.tableData = [];
      this.$refs.form.resetForm();
    }
  },
};
</script>
<style lang="scss" scoped>
.direction {
  flex-direction: column;
}
.layoutTable {
  display: flex;
  .top {
    width: 100%;
  }
  .left {
    width: 300px;
  }
  .right {
    flex: 1;
  }
}
</style>
