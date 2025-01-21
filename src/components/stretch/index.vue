<template>
  <div class="wrap" ref="wrap" :style="{ height: height, overflowY: overflow }">
    <span class="handleName" :style="{ bottom }" @click="handleChange">{{
      handleName
    }}</span>

    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    usuallyHeight: {
      type: [Number, String],
      default: 75,
    },
    expansionHeight: {
      type: [Number, String],
      default: 235,
    },
  },
  components: {},
  created() {},
  mounted() {
    this.$refs.wrap.addEventListener("scroll", this.getScroll);
  },
  beforeDestroy() {
    this.$refs.wrap.removeEventListener("scroll", this.getScroll);
  },
  data() {
    return {
      isActive: false,
      showHandleName: true,
      bottom: "3px",
      height: "",
      overflow: "",
    };
  },
  computed: {
    self_usuallyHeight() {
      return typeof this.usuallyHeight === "string"
        ? this.usuallyHeight
        : this.usuallyHeight + "px";
    },
    self_expansionHeight() {
      return typeof this.expansionHeight === "string"
        ? this.expansionHeight
        : this.expansionHeight + "px";
    },
    handleName() {
      return !this.isActive ?$i18n.t("common.expand") : $i18n.t("common.packUp") ;
    },
  },
  methods: {
    handleChange() {
      this.isActive = !this.isActive;
      this.$nextTick(() => {});
    },
    getScroll(e) {
      this.bottom = `${0 - e.target.scrollTop}px`;
    },
  },
  watch: {
    isActive: {
      handler(val) {
        this.overflow = val ? "auto" : "hidden";
        this.$nextTick(() => {
          let isOverflow =
            this.$slots.default[this.$slots.default.length - 1]
              .componentInstance.$slots.default.length > 3;
          this.height = val
            ? !isOverflow
              ? "auto"
              : "233px"
            : this.self_usuallyHeight;

          this.$refs.wrap.scrollTop = 0;
        });
        setTimeout(() => {
          this.bottom = this.isActive ? "0px" : "3px";
        }, 0);
      },
      immediate: true,
    },
  },
};
</script>

<style scoped lang="scss">
.wrap {
  width: 100%;
  min-height: 20px;
  position: relative;
  overflow-x: hidden;
}
.handleName {
  position: absolute;
  cursor: pointer;
  left: 75%;
  color: #1890ff;
  z-index: 2;
  white-space: nowrap;
}
/deep/ .el-timeline-item__wrapper {
  padding-left: 18px;
}
</style>
