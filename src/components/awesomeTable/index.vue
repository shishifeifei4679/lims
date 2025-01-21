<template>
  <div>
    <el-row type="flex" justify="start" v-if="operateList.length !== 0" class="operateList">
      <el-button
        v-for="(item, index) in operateList"
        :key="index"
        :type="item.type"
        :icon="item.icon"
        :class="item.class"
        @click="handleOperate(item)"
      >
        {{ item.name }}
      </el-button>
    </el-row>
    <lb-table
      :column="selfTableData.column"
      :data="selfTableData.data"
      :border="border"
      align="center"
      :pagination="pagination"
      :layout="pageSet"
      :page-sizes="pageSizes"
      :pager-count="pagerCount"
      :current-page.sync="selfCurrentPage"
      :total="total"
      :page-size="selfPageSize"
      v-bind="$attrs"
      v-on="$listeners"
      highlight-current-row
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
    </lb-table>
  </div>
</template>

<script>
import lbTable from "@/components/lb-table/lb-table.vue"

export default {
  name: "awesomeTable",
  components: { lbTable },

  created() {},
  props: {
    // 操作列表数组
    operateList: {
      type: Array,
      default() {
        return []
      }
    },
    // 表格列配置、表格数据
    tableData: {
      type: Object,
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
      default: true
    },
    // 显示分页按钮的个数
    pagerCount: {
      type: Number,
      default: 5
    },
    // 分页的字段
    pageSet: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper"
    },
    // 页长备选长度
    pageSizes: {
      type: Array,
      default() {
        return [10, 50, 100, 200]
      }
    },
    // 共有多少页
    total: {
      type: [Number],
      default: 0
    },
    // 页长
    pageSize: {
      type: Number,
      default: 10
    },
    // 当前页
    currentPage: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      selfCurrentPage: 1,
      selfPageSize: 10,
      selfTableData: {},
      selectionRows: []
    }
  },

  computed: {},

  methods: {
    handleOperate(item) {
      console.log(item)
      const data = {
        ...item
      }
      // if (item.isSelect) data.rows = this.selectionRows
      if (item.isSingle && this.selectionRows.length != 1) {
        this.$message.error(this.$t("common.single"))
        return
      }
      if (item.isMultiple && this.selectionRows.length == 0) {
        this.$message.error(this.$t("common.multiple"))
        return
      }

      data.rows = JSON.parse(JSON.stringify(this.selectionRows))
      this.$emit("handleOperateEvent", data)
    },
    handleSelectionChange(rows) {
      this.selectionRows = rows
    },
    clearSelection() {
      this.$refs.multipleTable.clearSelection()
    }
  },
  watch: {
    pageSize: {
      handler(val) {
        this.selfPageSize = val
      },
      immediate: true
    },
    currentPage: {
      handler(val) {
        this.selfCurrentPage = val
      },
      immediate: true
    },
    tableData: {
      handler(val) {
        this.selfTableData = val
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.operateList {
  margin-bottom: 10px;
}
</style>
