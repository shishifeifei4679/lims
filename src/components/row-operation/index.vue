<template>
  <div class="row-operation">
    <span v-for="(item, index) in sliceArray(0, 2)" :key="index">
      <el-button
        class="commonBtn"
        size="mini"
        plain
        :type="item.type"
        :class="item.class"
        @click.native.stop="handleOperate(item)"
        :disabled="isDisabled(item)"
        v-btnAuths="item.auth"
        v-show="isShow(item)"
      >
        {{ item.name }}
      </el-button>
    </span>
    <el-dropdown
      v-if="filterAuth.length > 2"
      size="mini"
      trigger="click"
      @command="handleOperate"
    >
      <span class="el-dropdown-link">
        <i class="el-icon-more" style="color: #557cf8"></i>
      </span>
      <el-dropdown-menu
        slot="dropdown"
        style="text-align: center; min-width: 90px; margin-top: 5px"
      >
        <el-dropdown-item
          v-for="(item, index) in sliceArray(2, filterAuth.length)"
          :key="item.handleName"
          :command="item"
          :divided="index != 0"
          :disabled="isDisabled(item)"
          v-btnAuths="item.auth"
          v-show="isShow(item)"
          >{{ item.name }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
export default {
  name: "rowOperation",
  props: {
    rowConfig: {
      type: Array,
      default: () => [],
    },
    scope: Object,
  },
  data() {
    return {
      filterAuth: [],
    };
  },
  watch: {
    rowConfig: {
      handler(val) {
        const btnAuths = this.$store.getters.btnAuths || [];
        this.filterAuth = val.filter(
          (item) => !item.auth || btnAuths.includes(item.auth)
        );
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    sliceArray() {
      return function (start = 0, end) {
        return this.filterAuth.slice(start, end);
      };
    },
    // 按钮是否可点击
    isDisabled() {
      return function (item) {
        if (!item.disabled) return false;
        const row = this.scope ? this.scope.row : {};
        const disabled = item.disabled(row);
        return disabled;
      };
    },
    // 按钮是否隐藏显示
    isShow() {
      return function (item) {
        const btnAuths = this.$store.getters.btnAuths || [];
        if (!item.auth || btnAuths.includes(item.auth)) {
          if (!item.show) return true;
          const row = this.scope ? this.scope.row : {};
          const show = item.show(row);
          return show;
        } else {
          return false;
        }
      };
    },
  },
  methods: {
    handleOperate(data) {
      this.$emit("rowOperate", { ...data, ...this.scope });
    },
  },
};
</script>
<style lang="scss" scoped>
.row-operation {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.commonBtn {
  padding: 2px 10px;
  font-size: 11px;
}
</style>
