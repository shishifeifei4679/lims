<template>
  <el-dialog
    class="ele-form-dialog"
    top="2vh"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogVisible"
    v-bind="$attrs"
    v-on="$listeners"
    @close="close"
  >
    <div>
      <div v-if="formSearchShow && Object.keys(formConfig).length > 0">
        <ele-form v-bind="formConfig" v-model="formData">
          <template v-slot:form-btn>
            <el-button icon="el-icon-refresh" @click="handleReset">{{ $t("common.reset") }}</el-button>
            <el-button type="primary" @click="handleSearch" icon="el-icon-search">{{ $t("common.search") }}</el-button>
          </template>
        </ele-form>
      </div>
      <ele-table
        v-if="column.length > 0"
        :apiImmediate="false"
        ref="eleTable"
        v-bind="$attrs"
        v-on="$listeners"
        :maxHeight="maxHeight"
        :formData="queryParam"
        :column="column"
        :getList="getList"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleDblclick"
        :initForm="initForm"
      >
      </ele-table>
      <slot></slot>
    </div>
    <div slot="footer" v-if="hasFooter">
      <template v-if="footer">
        <span v-for="(item, index) in costomBtns" :key="index" class="footBtn">
          <el-button
            :type="item.type"
            :class="item.class"
            @click="handleOperate(item)"
            :disabled="isDisabled(item)"
            v-show="isShow(item)"
            :loading="loading"
          >
            {{ item.name }}
          </el-button>
        </span>
      </template>
      <template v-else>
        <el-button @click="handleCancel">{{ $t("common.cancel") }}</el-button>
        <el-button type="primary" @click="handelConfirm">{{ submitText || $t("common.submit") }}</el-button>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import { searchArrKey } from "@/mixins/searchArrKey"

export default {
  name: "ele-dialog-table",
  mixins: [searchArrKey],
  props: {
    title: {
      type: String,
      default: ""
    },

    submitText: {
      type: String,
      default: ""
    },
    // 弹框隐藏
    visible: {
      type: Boolean,
      default: false
    },
    // 是否需要底部按钮，
    hasFooter: {
      type: Boolean,
      default: true
    },
    // 最大高度
    maxHeight: {
      type: [Number, String],
      default: 350
    },
    column: {
      type: Array,
      default: () => []
    },
    // 表单搜索配置项
    formConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表格Api
    getList: {
      type: Function
    },
    // 点击确定的回调，某些时候点确定会有请求情况，会返回次组件的实例，需手动关闭弹框 ，
    submitCb: {
      type: Function
    },
    initForm: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 其他参数
    otherParam: {
      type: Object,
      default: () => {
        return {}
      }
    },
    footer: {
      type: Array
    }
  },
  data() {
    return {
      dialogVisible: false,
      formData: {},
      queryParam: {},
      multipleSelection: [],
      costomBtns: [],
      loading: false,
      formSearchShow: true, // 如果column中有一列启用了，列搜索，便隐藏顶部搜索
    }
  },
  computed: {
    // 按钮是否可点击
    isDisabled() {
      return function (item) {
        if (!item.disabled) return false
        const disabled = item.disabled(this.multipleSelection)
        return disabled
      }
    },
    // 按钮是否隐藏显示
    isShow() {
      return function (item) {
        if (!item.show) return true
        const show = item.show(this.multipleSelection)
        return show
      }
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.dialogVisible = val
        this.$nextTick(() => {
          if (val && this.getList) {
            this.formData = JSON.parse(JSON.stringify(this.initForm))
            this.mergeConfig()
            this.$nextTick(() => {
              const eleTable = this.$refs.eleTable
              eleTable.selfCurrentPage = 1
              eleTable.getTableData()
            })
          }
        })
      },
      immediate: true
    },
    footer: {
      handler(val) {
        this.costomBtns = Array.isArray(val) ? val : []
      },
      immediate: true
    }
  },
  created() {
    if (this.column && Array.isArray(this.column) && this.column.length > 0) {
      this.column.forEach(item => {
        if (item.showColumnSearch) {
          this.formSearchShow = false
        }
      })
    }
  },
  methods: {
    mergeConfig() {
      this.queryParam = {
        ...this.otherParam,
        ...this.getArrtoMap(this.formData)
      }
    },

    // 搜索
    handleSearch() {
      this.mergeConfig()
      this.getTableData(true)
    },
    // 重置
    handleReset() {
      this.formData = {}
      this.queryParam = { ...this.otherParam }
      this.getTableData(true)
    },

    // 取消按钮
    handleCancel() {
      this.updateVisible()
    },
    // 确定
    handelConfirm() {
      if (this.submitCb) {
        this.submitCb(this)
      } else {
        const findSelection = this.column.some((val) => val.type === "selection")
        if (findSelection && this.multipleSelection.length === 0) {
          this.$message.error(this.$t("common.multiple"))
          return
        }
        this.$emit("getSelectData", this.multipleSelection)
        this.close()
      }
    },
    // 按钮事件
    handleOperate(item) {
      if (item.isSingle && this.multipleSelection.length != 1) {
        this.$message.error(this.$t("common.single"))
        return
      }
      if (item.isMultiple && this.multipleSelection.length == 0) {
        this.$message.error(this.$t("common.multiple"))
        return
      }
      this.loading = true
      this.$emit("customEvent", {
        loading: this.loadingHidden, // 关闭loading
        rows: this.multipleSelection,
        close: this.close,
        ...item
      })
    },
    loadingHidden() {
      this.loading = false
    },
    getTableData(reset = false) {
      this.$nextTick(() => {
        this.$refs.eleTable.getTableData(reset)
      })
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 双击表格
    handleDblclick(row) {
      this.$emit("getSelectData", [row])
      this.close()
    },
    // 关闭弹框的回调
    close() {
      this.$refs.eleTable.searchFormReset(false) // 重置列搜索的搜索条件
      this.loadingHidden()
      this.multipleSelection = []
      this.formData = {}
      this.queryParam = {}
      this.updateVisible()
    },
    updateVisible() {
      this.$emit("update:visible", false)
    }
  }
}
</script>

<style lang="scss" scoped>
.footBtn {
  margin-right: 10px;
}
</style>
