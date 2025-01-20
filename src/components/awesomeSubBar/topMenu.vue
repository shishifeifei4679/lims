<template>
  <div class="horizontal-container">
    <div class="scroll-wrapper">
      <div class="switch-left" v-if="isShow">
        <i class="el-icon-arrow-left"></i>
      </div>
      <el-tabs
        v-model="routerIndex"
        type="card"
        ref="tabs"
        closable
        :class="{ paddingTabs: isShow }"
        @tab-remove="handledelete(topmenus[$event], $event)"
        @tab-click="handleRouter(topmenus[routerIndex], routerIndex)"
      >
        <el-tab-pane
          v-for="(item, index) in topmenus"
          :key="index"
          :name="index.toString()"
        >
          <span
            slot="label"
            class="labelslot"
            :data-index="index"
            :class="{ hideCloseIcon: hideCloseIcon(item) }"
            v-contextmenu="(el) => contextmenus(el)"
          >
            {{ getRouterName(item) }}</span
          >
        </el-tab-pane>
      </el-tabs>
      <div class="switch-right" v-if="isShow">
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
    <!-- <div class="switch-right" @click="handleRight">
      <i class="el-icon-arrow-right"></i>
    </div> -->
  </div>
</template>

<script>
import { getDefaultRouter } from "@/utils/judge";
import qs from "qs";
const sys = require("@/config.js");
export default {
  name: "topMenu",
  components: {},
  data() {
    return {
      routerIndex: "0",
      isShow: true,
    };
  },
  computed: {
    lange() {
      return this.$store.getters.language;
    },
    topmenus() {
      this.getRouterIndex();
      return this.$store.getters.topmenus; // 需要监听的数据
    },
    defTopmenus() {
      return getDefaultRouter(this.$store.getters.menus);
    },
    hideCloseIcon() {
      return function (item) {
        return item.path == "/index";
      };
    },
  },
  watch: {
    topmenus: {
      handler(val) {
        this.listenerResize();
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    window.addEventListener("resize", this.listenerResize, true);
    this.$on("hook:beforeDestroy", () => {
      window.removeEventListener("resize", this.listenerResize);
    });
  },
  methods: {
    getRouterName(item) {
      if (this.lange == "en") {
        return item.name && $i18n.t("router")[item.name]
          ? $i18n.t("router")[item.name]
          : item.title;
      } else {
        // 对item的path进行匹配，如果是微应用，比如说mes，在tab选项卡上加上前缀
        const pre =
          ["mes-", "wms-"].find((str) =>
            item.path.includes(`/component/${str.slice(0, -1)}/`)
          ) || "";
        return pre + item.title;
      }
    },
    listenerResize() {
      setTimeout(() => {
        const scrollable = this.$refs.tabs.$refs.nav.scrollable;
        this.isShow = scrollable ? false : true;
      }, 20);
    },
    contextmenus(el) {
      // 通过el.dataset来获取动态的值
      const list = this.$store.getters.topmenus;
      const _this = this;
      const index = el.dataset.index;
      const defList = [
        {
          text: this.$t("common.closeL"),
          action: () => {
            _this.setTopMeuns(1, index);
          },
          icon: "el-icon-back",
        },
        {
          text: this.$t("common.closeR"),
          icon: "el-icon-right",
          action: () => {
            _this.setTopMeuns(2, index);
          },
        },
        {
          text: this.$t("common.closeO"),
          icon: "el-icon-close",
          action: () => {
            _this.setTopMeuns(3, index);
          },
        },
        {
          text: this.$t("common.closeA"),
          icon: "el-icon-error",
          action: () => {
            _this.setTopMeuns(4, index);
          },
        },
      ];
      // 你可以在这里通过 return null 来禁用右键菜单
      // return null
      if (list.length == 1) {
        // 只有一个
        return [defList[3]];
      } else if (index == 0) {
        return [defList[1], defList[2], defList[3]];
      } else if (list.length == Number(index) + 1) {
        return [defList[0], defList[2], defList[3]];
      } else {
        return defList;
      }
    },
    setTopMeuns(type, index) {
      const list = JSON.parse(JSON.stringify(this.$store.getters.topmenus));
      if (type == 1) {
        const data = this.filterIndexPage(list.slice(index));
        this.$store.commit("SET_TOPMENUS", data);
        this.changeKeepAlive(data);
        // 关闭左侧
      } else if (type == 2) {
        // 关闭右侧
        const data = this.filterIndexPage(list.slice(0, Number(index) + 1));
        this.$store.commit("SET_TOPMENUS", data);
        this.changeKeepAlive(data);
      } else if (type == 3) {
        const data = this.filterIndexPage([list[index]]);
        this.$store.commit("SET_TOPMENUS", data);
        this.changeKeepAlive(data);
        // 关闭其他
      } else if (type == 4) {
        const data = this.filterIndexPage([]);
        this.$store.commit("SET_TOPMENUS", data);
        this.$store.commit("CLEAR_KEEPALIVE");
        this.handleRouter(data[0], 0);

        // 关闭全部
      }
    },
    getRouterIndex() {
      const { meta, query } = this.$route;
      if (meta.iframe) {
        const index = this.$store.getters.topmenus.findIndex(
          (item) => item.query.url === query.url
        );
        this.routerIndex = `${index}`;
      } else {
        const index = this.$store.getters.topmenus.findIndex(
          (item) => item.path === this.$route.path
        );
        this.routerIndex = `${index}`;
      }
    },

    handleRouter(item, index) {
      this.routerIndex = `${index}`;
      const params = qs.stringify(item.query);
      params
        ? this.$router.push(`${item.path}?${params}`)
        : this.$router.push(item.path);
    },
    handledelete(item, index) {
      this.$store.commit("SET_DELETE", item.name);
      const currentPath = this.$route.path;
      this.$store.commit("SET_DELTOPMENUS", item);
      //如果关闭的tab正在使用 关闭时需要跳转他左边的一个,左边没有的话调跳转右边的，左右都没有不做跳转
      if (currentPath == item.path) {
        if (this.topmenus.length === 0) return;
        if (index == 0) {
          const futurepath = this.topmenus[index];
          this.handleRouter(futurepath, index);
        } else {
          const data = this.topmenus[index - 1];
          this.handleRouter(data, index - 1);
        }
      }
    },
    //清除缓存
    changeKeepAlive(data = []) {
      this.$store.commit("CLEAR_KEEPALIVE");
      data.forEach((item) => {
        const { noAddMenu, noKeepAlive, name } = item;
        if (!noAddMenu && !noKeepAlive) this.$store.commit("SET_ALIVE", name); // keepAlive 是否缓存的字段
      });
    },
    filterIndexPage(data = []) {
      const list = this.$store.getters.topmenus;
      const homePage = list.find((val) => val.path == "/index");
      const isExectHomePage = data.some((val) => val.path == "/index");
      return isExectHomePage ? data : [homePage, ...data];
    },
  },
};
</script>
<style lang="scss" scoped>
$height: 52px;
.horizontal-container {
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;

  .switch-left,
  .switch-right {
    width: 20px;
    height: $height;
    line-height: $height;
    box-sizing: border-box;
    font-size: 15px;
    color: #8c8c8c;
    cursor: pointer;
    position: absolute;
    z-index: 3;
  }
  .switch-left {
    left: 0px;
  }
  .switch-right {
    top: 0;
    right: 0px;
  }
  .scroll-wrapper {
    position: relative;
    width: 100%;
    height: $height;
    overflow: hidden;
  }
  .paddingTabs {
    padding: 0 20px;
    box-sizing: border-box;
  }
  /deep/ .el-tabs__header {
    margin: 0;
  }
  /deep/ .el-tabs {
    margin-top: 10px;
  }
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
    background: #fff;
    padding: 0;
  }
  /deep/
    .el-tabs--card
    > .el-tabs__header
    .el-tabs__item.is-active.is-closable {
    background: #fff;
    color: #0066ff;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #0066ff;
  }
  /deep/.el-tabs--card .el-icon-close {
    width: 14px;
    position: relative;
    z-index: 2;
    right: 30px;
  }
  /deep/ .el-tabs__item {
    padding: 0 10px;
    margin: 0 2.5px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #333333;
  }

  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item,
  /deep/.el-tabs--card > .el-tabs__header,
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav,
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    border: none;
  }
  /deep/.el-tabs__nav-next,
  /deep/.el-tabs__nav-prev {
    position: absolute;
    cursor: pointer;
    line-height: 32px;
    color: #8c8c8c;
  }
  /deep/ .el-tabs__content {
    display: none;
  }

  .labelslot {
    display: inline-block;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 12px;
  }
}
</style>
<style>
.horizontal-container .hideCloseIcon + .el-icon-close {
  display: none;
}
</style>
