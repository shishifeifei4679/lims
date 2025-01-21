<template>
  <div class="lb-table">
    <el-table
      ref="elTable"
      v-bind="$attrs"
      v-on="$listeners"
      :data="data"
      :span-method="this.merge ? this.mergeMethod : this.spanMethod"
    >
      <lb-column
        ref="lbColumn"
        v-bind="$attrs"
        v-for="(item, index) in column"
        :key="`${index + (item.prop || item.type)}`"
        :column="item"
        @column-search="columnSearch"
        @column-value-change="columnValueChange"
      >
      </lb-column>
    </el-table>
    <el-pagination
      class="lb-table-pagination"
      v-if="pagination"
      v-bind="$attrs"
      v-on="$listeners"
      @current-change="paginationCurrentChange"
      :style="{ 'margin-top': paginationTop, 'text-align': paginationAlign }"
    >
    </el-pagination>
  </div>
</template>

<script>
import LbColumn from "./lb-column";
export default {
  props: {
    column: Array,
    data: Array,
    spanMethod: Function,
    pagination: {
      type: Boolean,
      default: false,
    },
    paginationTop: {
      type: String,
      default: "15px",
    },
    paginationAlign: {
      type: String,
      default: "right",
    },
    merge: Array,
  },
  components: {
    LbColumn,
  },
  data() {
    return {
      mergeLine: {},
      mergeIndex: {},
    };
  },
  created() {
    this.getMergeArr(this.data, this.merge);
  },
  computed: {
    dataLength() {
      return this.data.length;
    },
  },
  methods: {
    /**
     * @description lb-column中的搜索表单值变动时候，emit回调到ele-table组件，用于判断有没有级联搜索，触发级联操作
     */
    columnValueChange(item) {
      item.associatedQueryColumnProp.forEach((itemProp) => {
        this.$refs.lbColumn.forEach((itemColumn, indexColumn) => {
          if (
            itemColumn.searchForm &&
            itemProp.refreshKey == itemColumn.searchForm.columnProp
          ) {
            itemColumn.refreshColumnOption(item);
          }
        });
      });
    },

    /**
     * @description 每列header上的自定义搜索
     */
    columnSearch(data, refresh = true) {
      this.$emit('column-search', data, refresh)
    },

    clearSelection() {
      this.$refs.elTable.clearSelection();
    },
    toggleRowSelection(row, selected) {
      this.$refs.elTable.toggleRowSelection(row, selected);
    },
    toggleAllSelection() {
      this.$refs.elTable.toggleAllSelection();
    },
    toggleRowExpansion(row, expanded) {
      this.$refs.elTable.toggleRowExpansion(row, expanded);
    },
    setCurrentRow(row) {
      this.$refs.elTable.setCurrentRow(row);
    },
    clearSort() {
      this.$refs.elTable.clearSort();
    },
    clearFilter(columnKey) {
      this.$refs.elTable.clearFilter(columnKey);
    },
    doLayout() {
      this.$nextTick(() => {
        this.$refs.elTable && this.$refs.elTable.doLayout();
      });
    },
    sort(prop, order) {
      this.$refs.elTable.sort(prop, order);
    },
    paginationCurrentChange(val) {
      this.$emit("p-current-change", val);
    },
    getMergeArr(tableData, merge) {
      if (!merge) return;
      this.mergeLine = {};
      this.mergeIndex = {};
      merge.forEach((item, k) => {
        tableData.forEach((data, i) => {
          if (i === 0) {
            this.mergeIndex[item] = this.mergeIndex[item] || [];
            this.mergeIndex[item].push(1);
            this.mergeLine[item] = 0;
          } else {
            if (data[item] === tableData[i - 1][item]) {
              this.mergeIndex[item][this.mergeLine[item]] += 1;
              this.mergeIndex[item].push(0);
            } else {
              this.mergeIndex[item].push(1);
              this.mergeLine[item] = i;
            }
          }
        });
      });
    },
    mergeMethod({ row, column, rowIndex, columnIndex }) {
      const index = this.merge.indexOf(column.property);
      if (index > -1) {
        const _row = this.mergeIndex[this.merge[index]][rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
  },
  watch: {
    merge() {
      this.getMergeArr(this.data, this.merge);
    },
    dataLength() {
      this.getMergeArr(this.data, this.merge);
    },
  },
};
</script>
