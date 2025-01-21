<template>
  <div class="configColumn">
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{
      $t("common.checkAll")
    }}</el-checkbox>
    <div style="margin: 15px 0"></div>
    <el-scrollbar style="height: 200px">
      <el-checkbox-group v-model="checkedColumn" @change="handleChecked">
        <el-checkbox
          style="display: block"
          v-for="item in filterColumn"
          :label="item.prop"
          :key="item.columnKey || item.prop"
          >{{ item.label }}</el-checkbox
        >
      </el-checkbox-group>
    </el-scrollbar>
  </div>
</template>
<script>
export default {
  name: "configColumn",
  props: {
    column: {
      type: Array,
      default: () => []
    },
    uniqueId: String
  },
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      checkedColumn: []
    }
  },

  mounted() {
    const checkedColumn = this.getValueToLocalStorage()
    if (this.uniqueId && checkedColumn && checkedColumn.length > 0) {
      this.checkedColumn = checkedColumn
    } else {
      this.checkedColumn = this.filterColumn.map((val) => val.prop)
    }
    this.checkAll = this.checkedColumn.length === this.filterColumn.length
    this.$emit("changeColumn", this.getChangeColumn)
  },
  computed: {
    filterColumn() {
      // 过滤掉操作与type列
      const columns = this.column
      const items = columns.filter((val) => val.label != this.$t("common.operation") && !val.type)
      return items
    },
    getChangeColumn() {
      // 获取展示的列
      const column = this.column.filter(
        (val) => val.label == this.$t("common.operation") || val.type || this.checkedColumn.includes(val.prop)
      )
      return column
    }
  },
  methods: {
    // 点击全选
    handleCheckAllChange(val) {
      const items = this.filterColumn.map((val) => val.prop)
      this.checkedColumn = val ? items : []
      this.isIndeterminate = false
      this.saveToLocalStorage(this.checkedColumn)
      if (!val) return this.$emit("changeColumn", [])
      this.$emit("changeColumn", this.getChangeColumn)
    },
    // 点击checkbox
    handleChecked(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.filterColumn.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.filterColumn.length
      this.saveToLocalStorage(this.checkedColumn)
      if (value.length < 1) return this.$emit("changeColumn", [])
      this.$emit("changeColumn", this.getChangeColumn)
    },
    // 存储到localStorage
    saveToLocalStorage(data = []) {
      if (this.uniqueId) {
        const path = this.$route.path
        localStorage.setItem(`${path}-${this.uniqueId}`, data.join(","))
      }
    },
    // 从localStorage取值
    getValueToLocalStorage() {
      let value

      if (this.uniqueId) {
        const path = this.$route.path
        const getValue = localStorage.getItem(`${path}-${this.uniqueId}`)
        value = getValue ? getValue.split(",") : []
      }
      return value
    }
  }
}
</script>
<style lang="scss">
.configColumn {
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
