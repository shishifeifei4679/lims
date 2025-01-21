<template>
  <div>
    <slot name="tableTitle"></slot>
    <el-row ref="operateList" type="flex" :justify="justify" class="operateList">
      <div v-if="operateList.length !== 0" class="btn-pack">
        <span v-for="(item, index) in operateList" :key="index" class="btn">
          <el-button
            :type="item.type"
            :icon="item.icon"
            :class="item.class"
            @click="handleOperate(item)"
            :disabled="isDisabled(item)"
            v-btnAuths="item.auth"
            v-show="isShow(item)"
          >
            {{ item.name }}
          </el-button>
        </span>
      </div>
    </el-row>
    <lb-table
      :column="selfColumn"
      :data="value"
      :border="border"
      :align="align"
      :pagination="pagination"
      v-bind="$attrs"
      v-on="$listeners"
      highlight-current-row
      background
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      :size="size"
      :stripe="true"
    >
    </lb-table>
  </div>
</template>

<script>
import lbTable from "@/components/lb-table/lb-table"
export default {
  name: "eleTableEditor",
  components: { lbTable },
  props: {
    align: {
      type: String,
      default: "center"
    },
    value: {
      type: Array,
      required: true,
      default: () => []
    },
    // 操作列表数组
    operateList: {
      type: Array,
      default() {
        return []
      }
    },
    // 列数据
    column: {
      type: Array,
      default() {
        return []
      },
      required: true
    },
    // 是否有边框
    border: {
      type: Boolean,
      default: true
    },
    // 是否要分页
    pagination: {
      type: Boolean,
      default: false
    },
    // 按钮组的位置
    justify: {
      type: String,
      default: "start"
    }
  },
  data() {
    return {
      selfdata: [], // 表格数据
      multipleSelection: [],
      size: "small",
      selfColumn: []
    }
  },
  mounted() {},
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
  methods: {
    // 按钮事件处理
    handleOperate(item) {
      const data = {
        ...item
      }
      if (item.isSingle && this.multipleSelection.length != 1) {
        this.$message.error(this.$t("common.single"))
        return
      }
      if (item.isMultiple && this.multipleSelection.length == 0) {
        this.$message.error(this.$t("common.multiple"))
        return
      }

      data.rows = JSON.parse(JSON.stringify(this.multipleSelection))

      this.$emit("handleOperateEvent", data)
    },

    handleSelectionChange(rows) {
      this.multipleSelection = rows
    },
    clearSelection() {
      this.$refs.multipleTable.clearSelection()
    },
    doLayout() {
      this.$refs.multipleTable.doLayout()
    }
  },
  watch: {
    column: {
      handler(val) {
        if (!val) return
        this.selfColumn = val
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-pack {
  display: flex;
  flex-wrap: wrap;
}
.btn {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
