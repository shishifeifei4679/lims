<template>
  <div class="header-pack-qiankun">
    <div class="left">
      <div class="logo">
        <div class="left">
          <img v-if="logo" style="width: 100%;" :src="logo" alt="" />
        </div>
        <transition name="el-zoom-in-center">
          <SearchMenu />
        </transition>
      </div>
    </div>
    <div class="right">
      <el-select
        class="factory"
        :value="factoryCode"
        @change="handleChange"
        :placeholder="$t('common.selectFac')"
      >
        <el-option
          v-for="item in options"
          :key="item.code"
          :label="item.name"
          :value="item.code"
        >
        </el-option>
      </el-select>
      <el-badge
        :is-dot="getUnreadNum > 0"
        class="item"
        :class="{ twinkle: getIsTwinkle }"
      >
        <img
          @click="handleMessage"
          style="width: 20px; height: 20px; cursor: pointer;"
          :src="require('@/assets/menu/xiaoxi_icon.png')"
          alt=""
        />
      </el-badge>
      <el-dropdown class="dropdown">
        <span class="el-dropdown-link">
          <el-avatar size="small" class="img"> {{ toUpperCase }}</el-avatar>
          <span>{{ $store.getters.userInfo.username }}</span>
        </span>
        <el-dropdown-menu slot="dropdown" placement="top-start">
          <el-dropdown-item
          ><p @click="$router.push('/platform/userInfo')">
            {{ $t("home.my") }}
          </p></el-dropdown-item
          >
          <el-dropdown-item
          ><p @click="logout">{{ $t("home.logOut") }}</p></el-dropdown-item
          >
          <el-dropdown-item v-btnAuths="'auth:themeAll:add'"
          ><p @click="$refs.themeAll.showThemes()">
            {{ $t("my.themes") }}
          </p></el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <messageDrawer ref="drawer" />
    <themeAll ref="themeAll"></themeAll>
  </div>
</template>
<script>
import { logout } from "@/utils/judge";
const sys = require("@/config.js");
import { getFactories, changeFactory } from "@/api/login";
import messageDrawer from "./messageDrawer.vue";
import PrimaryMenu from "@/components/primaryMenu/index";
import SearchMenu from "@/components/searchMenu/index";
import themeAll from "./themeAll.vue";

export default {
  name: "appHeader",
  components: {
    messageDrawer,
    PrimaryMenu,
    SearchMenu,
    themeAll,
  },
  props: {
    logo: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      search: "",
      name: sys.name,
      options: [],
      value: "",
      isCollapse: false,
    };
  },
  computed: {
    toUpperCase() {
      let username = this.$store.getters.userInfo.username;
      if (!username) return "";
      username.toUpperCase();
      return username.split("")[0];
    },
    menus() {
      return this.$store.getters.menus;
    },
    collapse() {
      return this.$store.getters.isShowMerge;
    },
    indexActive() {
      return this.$store.getters.indexActive;
    },
    factoryCode() {
      return this.$store.getters.factoryCode;
    },

    getIsTwinkle() {
      return this.$store.getters.isTwinkle;
    },
    getUnreadNum() {
      return this.$store.getters.unreadNum;
    },
    isShowTopMenu() {
      return this.$store.getters.isShowTopMenu;
    },
  },
  mounted() {
    this.getFactories();
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
    handlehome() {
      this.$router.push("/platform/index");
    },
    showTopMenu() {
      this.$store.commit("SET_ISSHOWTOPMENU", !this.isShowTopMenu);
    },
    handleMessage() {
      const visible = this.$refs.drawer.visible;
      this.$refs.drawer.visible = !visible;
      //取消闪烁
      this.$store.commit("SET_ISTWINKLE", false);
    },
    mouseenter() {
      this.isCollapse = true;
    },
    mouseleave() {
      this.isCollapse = false;
    },
    getFactories() {
      getFactories().then((res) => {
        this.options = (res.data.result || []).map((val) => {
          return {
            ...val,
            name: val.code + val.name,
          };
        });
        const item = res.data.result.find((val) => val.active == 1) || {};
        this.$store.commit("SET_FACTORYCODE", item.code || "");
      });
    },
    handleChange(val) {
      changeFactory(val).then(() => {
        this.$store.commit("SET_FACTORYCODE", val);
        window.location.reload();
        // this.$router.go(0);
      });
    },
    // 上方点击,渲染左侧边
    handleJump(item, index) {
      if ((item.path || "").includes("http")) {
        window.open(item.path);
      } else if (item.children.length == 0) {
        this.$message.error(this.$t("common.menuErr"));
      } else {
        this.$store.commit("SET_INDEXACTIVE", index);
        this.$store.commit("SET_LEFTMENUS", item.children);
      }
      this.mouseleave();
    },
    logout() {
      logout();
    },
  },
};
</script>
<style lang="scss" scoped>
$Width: 190px;
$headerWidth: 54px;

$activeMenu: $header-bkColor-hover;
.header-pack-qiankun {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  /deep/.el-header {
    padding: 0 !important;
  }
  .center {
    margin-left: 10px;
    flex: 1;
    width: calc(100% - 120px - 350px);
  }
  .collapsemenus {
    position: absolute;
    width: 100%;
    top: $headerWidth;
    background: $activeMenu;
    display: block;
    overflow: hidden;
    padding-bottom: 20px;
    box-sizing: border-box;
  }
  .menusList {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: center;
    overflow: hidden;
  }
  .show-menu {
    // height: 260px;
    // display: block;
    transition: opacity 0.5s;
    opacity: 1;
    z-index: 10000;
  }
  .hid-menu {
    opacity: 0;
    transition: all 0.5s;
    z-index: -10;
  }

  .common {
    height: 95px;
    font-size: 14px;
    cursor: pointer;
    padding: 0 50px;
    text-align: center;
    display: flex;
    color: #ffffff;
    align-items: center;
    margin-top: 20px;
    i {
      font-size: 40px;
    }
  }

  .left {
    color: #ffffff;
    display: flex;
    height: $headerWidth;
    align-items: center;
    width: 128px;
    // overflow: hidden;
    .logo {
      height: 100%;
      padding-left: 3px;
      display: flex;
      align-items: center;
      .left {
        width: 110px;
        display: flex;
        justify-content: center;
        padding-left: 10px;
        padding-right: 10px;
        // box-sizing: border-box;
      }
      .right {
        display: flex;
        justify-content: left;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 45px;

        p {
          padding-left: 5px;
          font-weight: bold;
        }
      }
      .menusIcon {
        width: 48px;
        height: $headerWidth;
        // background: $app-color-header;
        background: transparent;
        line-height: $headerWidth;
        text-align: center;
      }
      .menusIconActive {
        background: $activeMenu;
      }
      .search {
        width: 260px;
        margin-left: 10px;
        /deep/ .el-input__inner {
          height: 32px;
          line-height: 32px;
          background: $app-color-header;
          border: 1px solid #8694856e;
          border-radius: 4px;
          color: $header-fontColor;
          &::placeholder {
            font-weight: 400;
            color: #bbbbbb;
          }
        }
      }

      i {
        cursor: pointer;
        font-size: 21px;
      }
    }

    span {
      float: left;
      font-size: 18px;
      line-height: $headerWidth;
      margin-left: 20px;
    }
    /deep/ .el-divider--vertical {
      background: #71a6fa;
      height: $headerWidth;
      margin: 0 20px;
    }

    .iconSize {
      font-size: 20px;
      line-height: $headerWidth;
      margin-right: 15px;
    }
  }
  .right {
    color: #ffffff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: $headerWidth;

    .factory {
      width: 200px;
      /deep/ .el-input__inner {
        background: transparent;
        color: #fff;
        border: none;
        font-size: 14px;
        text-align: right;
        &::placeholder {
          font-weight: 400;
          color: #fff;
        }
      }

      /deep/.el-select__caret {
        color: #fff !important;
      }
    }
    .icon-padding {
      padding: 0 10px;
    }
    i {
      cursor: pointer;
    }
    overflow: hidden;
    .search {
      width: 180px;
      margin-right: 30px;

      /deep/ .el-input__inner {
        border-radius: 15px;
        background: #13173d;
        color: #ffffff;
      }
    }
    .item {
      margin-right: 13px;
      margin-left: 5px;
      display: flex;
      align-items: center;
    }
    .homeIcon {
      margin-right: 13px;
      font-size: 24px;
      margin-top: -4px;
    }
    .twinkle {
      animation: twinkleColor 1s ease infinite alternate;
    }
    @keyframes twinkleColor {
      0% {
        opacity: 0;
        filter: alpha(opacity=0);
      }
      100% {
        opacity: 1;
        filter: alpha(opacity=100);
      }
    }
    i {
      font-size: 22px;
    }

    /deep/ .el-avatar--small {
      width: 32px;
      height: 32px;
      line-height: 32px;
      background: #1890ff;
    }
    .el-dropdown-link {
      display: flex;
      align-items: center;
      color: #ffffff;
      cursor: pointer;
      font-weight: 300;
      padding-right: 10px;
      box-sizing: border-box;
      .img {
        margin-right: 5px;
        font-family: cursive;
      }
      i {
        margin-left: 5px;
        font-size: 13px;
      }
    }
  }
}
.header-pack {
  .collapsemenus {
    .menusList {
      .common p {
        color: $header-fontColor;
        font-size: 14px;
        font-weight: bolder;
      }
      .common:hover p {
        color: $header-fontColor-hover;
      }
      /deep/ .common:hover .el-image .el-image__inner {
        -webkit-animation: shake 1.5s both infinite;
        -moz-animation: shake 1.5s both infinite;
        -ms-animation: shake 1.5s both infinite;
        animation: shake 1.5s both infinite;
      }
    }
  }
}

/* 缩小抖动 */
@keyframes shake {
  0% {
    transform: scale(1);
    transform: scale(1);
  }
  50%,
  55% {
    transform: scale(0.9) rotate(-3deg);
    transform: scale(0.9) rotate(-3deg);
  }
  62%,
  71%,
  83%,
  95% {
    transform: scale(1.1) rotate(3deg);
    transform: scale(1.1) rotate(3deg);
  }
  66%,
  78%,
  88% {
    transform: scale(1.1) rotate(-3deg);
    transform: scale(1.1) rotate(-3deg);
  }
  100% {
    transform: scale(1) rotate(0);
    transform: scale(1) rotate(0);
  }
}
/* Firefox */
@-moz-keyframes shake {
  0% {
    transform: scale(1);
    transform: scale(1);
  }
  50%,
  55% {
    transform: scale(0.9) rotate(-3deg);
    transform: scale(0.9) rotate(-3deg);
  }
  62%,
  71%,
  83%,
  95% {
    transform: scale(1.1) rotate(3deg);
    transform: scale(1.1) rotate(3deg);
  }
  66%,
  78%,
  88% {
    transform: scale(1.1) rotate(-3deg);
    transform: scale(1.1) rotate(-3deg);
  }
  100% {
    transform: scale(1) rotate(0);
    transform: scale(1) rotate(0);
  }
}
/* Safari 和 Chrome */
@-webkit-keyframes shake {
  0% {
    transform: scale(1);
    transform: scale(1);
  }
  50%,
  55% {
    transform: scale(0.9) rotate(-3deg);
    transform: scale(0.9) rotate(-3deg);
  }
  62%,
  71%,
  83%,
  95% {
    transform: scale(1.1) rotate(3deg);
    transform: scale(1.1) rotate(3deg);
  }
  66%,
  78%,
  88% {
    transform: scale(1.1) rotate(-3deg);
    transform: scale(1.1) rotate(-3deg);
  }

  100% {
    transform: scale(1) rotate(0);
    transform: scale(1) rotate(0);
  }
}
/* Opera */
@-o-keyframes shake {
  0% {
    transform: scale(1);
    transform: scale(1);
  }
  50%,
  55% {
    transform: scale(0.9) rotate(-3deg);
    transform: scale(0.9) rotate(-3deg);
  }
  62%,
  71%,
  83%,
  95% {
    transform: scale(1.1) rotate(3deg);
    transform: scale(1.1) rotate(3deg);
  }
  66%,
  78%,
  88% {
    transform: scale(1.1) rotate(-3deg);
    transform: scale(1.1) rotate(-3deg);
  }
  100% {
    transform: scale(1) rotate(0);
    transform: scale(1) rotate(0);
  }
}
</style>
