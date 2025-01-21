<template>
  <div class="breadcrumb">
    <!--   @click.native="goBack(index)" -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item, index) in list" :key="index">
        <span :style="{ cursor: index === 0 ? 'pointer' : null }">{{
          item
        }}</span></el-breadcrumb-item
      >
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "breadCrumb",
  watch: {
    $route: {
      handler(val) {
        if (!["/", null].includes(val.path)) this.getBreadCrumb(val);
      },
      immediate: true,
      // 深度观察监听
      deep: true,
    },
  },
  data() {
    return {
      list: [],
      menusList: [],
    };
  },
  created() {
    this.menusList = this.flatMenus();
  },
  methods: {
    flatMenus() {
      const flatMenus = [];
      const menus = this.$store.getters.menus;
      const getRouter = (data) => {
        data.forEach((val) => {
          const item = JSON.parse(JSON.stringify(val));
          delete item.children;
          flatMenus.push(item);
          if (val.children) {
            getRouter(val.children);
          }
        });
      };
      getRouter(menus);
      return flatMenus;
    },
    getBreadCrumb({ path }) {
      this.$nextTick(() => {
        const currentmenu = this.menusList.find((val) => val.href === path);
        if (!currentmenu) return;
        const parentId = currentmenu.parentId;

        if (parentId == 0) {
          this.list = [currentmenu.resourceName];
        } else {
          const parentItem = this.menusList.find((val) => val.id === parentId);
          this.list = [parentItem.resourceName, currentmenu.resourceName];
        }
      });
    },
    goBack(index) {
      if (index === 0) this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.breadcrumb {
  height: 50px;
  background: #ffffff;
  display: flex;
  align-items: center;
  padding-left: 20px;
  box-sizing: border-box;
  /deep/ .el-breadcrumb__inner {
    color: #666666 !important;
    font-weight: inherit !important;
  }
}
</style>
