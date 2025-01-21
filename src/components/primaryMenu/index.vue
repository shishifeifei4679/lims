<template>
  <el-tabs
    v-model="activeName"
    @tab-click="handleClick"
    type="border-card"
    class="primaryMenu"
  >
    <el-tab-pane
      v-for="(item, index) in menus"
      :label="item.name"
      :name="index.toString()"
      :key="index"
    >
      <div
        slot="label"
        class="tab-image"
        :class="[URL(item.icon) ? '' : 'tab-image-top']"
      >
        <el-image
          style="width: 30px; height: 30px"
          :src="URL(item.icon)"
          fit="contain"
        >
          <div
            slot="error"
            class="image-slot"
            style="
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #2f394e;
            "
          >
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <p>{{ item.name }}</p>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
  name: "primaryMenu",
  data() {
    return {
      activeName: "0",
    };
  },
  computed: {
    menus() {
      return this.$store.getters.menus;
    },
  },
  created() {
    this.activeName = this.$store.getters.indexActive.toString();
  },
  methods: {
    URL(url) {
      try {
        let { pathname } = new URL(url);
        return require(`@/assets${pathname}`);
      } catch (err) {
        return "";
      }
    },
    handleClick() {
      const item = this.menus[this.activeName];

      if ((item.path || "").includes("http")) {
        window.open(item.path);
      } else if (item.children.length == 0) {
        this.$message.error(this.$t("common.menuErr"));
      } else {
        this.$store.commit("SET_INDEXACTIVE", this.activeName);
        this.$store.commit("SET_LEFTMENUS", item.children);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.primaryMenu {
  background: #2f394e;
  border: none;
  box-shadow: none;
  width: 100%;
  /deep/ .el-tabs__content,
  /deep/ .el-tabs__active-bar {
    display: none;
  }
  /deep/ .el-tabs__item {
    color: #7f99bc !important;
    font-size: 14px;
    height: 60px;
  }
  /deep/ .el-tabs__nav-next,
  /deep/.el-tabs__nav-prev {
    line-height: 60px;
    font-size: 12px;
    color: #7f99bc;
  }
  /deep/ .el-tabs__header {
    background-color: #2f394e;
    border-bottom: none;
    margin: 0;
  }
  /deep/ .is-active {
    color: #3c7fcd !important;
    background-color: #252d3e !important;
    border-right-color: #252d3e !important;
    border-left-color: #252d3e !important;
  }
  .tab-image {
    margin-top: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    line-height: 20px;
    p {
      padding: 0;
      margin: 0;
    }
  }
  .tab-image-top {
    margin-top: 0px !important;
  }
}
</style>
