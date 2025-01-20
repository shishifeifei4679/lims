<template>
  <div style="background: #fff" class="containerBag">
    <div class="main-pack">
      <div
        v-if="!isMicro"
        class="qiankun-left"
        :class="!isShowTopMenu ? 'qiankun-left-k' : 'qiankun-left-b'"
      >
        <div class="left-menu">
          <div class="left-icon">
            <div class="menusList">
              <!-- 999{{ indexActive }} -->
              <div
                class="common"
                @click="handleJump(item, index)"
                :key="index"
                v-for="(item, index) in menus"
              >
                <div class="item" :class="indexActive == index ? 'active' : ''">
                  <el-image
                    class="hover"
                    style="width: 20px; height: 20px"
                    :src="URL(item.icon, '_h')"
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
                      "
                    >
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                  <!--     class="def" -->
                  <el-image
                    class="def"
                    style="width: 20px; height: 20px"
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
                      "
                    >
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                  <p class="b-p" :title="item.shortName">
                    {{ item.shortName }}
                  </p>
                </div>
              </div>

              <div class="item icon-bk" @click="showTopMenu()">
                <img
                  :class="!isShowTopMenu ? 'left' : 'right'"
                  style="width: 20px; height: 20px"
                  :src="require('@/assets/menu/left.png')"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <el-scrollbar
          class="scrollbar"
          :class="isShowTopMenu ? 'show-menu-none' : 'show-menu-b'"
        >
          <!-- <transition name="el-fade-in">
            <SearchMenu
              style="width: 120px; margin: 0 auto 5px;"
              v-if="$store.getters.isShowTopMenu"
            />
          </transition> -->

          <div class="show-menu">
            <!-- <img
              class="recommend"
              :src="recommend"
              alt=""
              v-if="likeList.length != 0"
            /> -->

            <div class="left-top">
              <p>{{ twoTitle }}</p>
            </div>
            <!-- <menuItem
              v-for="menu in likeList"
              :key="menu.id"
              :menu="menu"
              class="likeMenu"
            >
            </menuItem> -->
            <menuItem
              v-for="menu in $store.getters.leftMenus"
              :key="menu.id"
              :menu="menu"
            >
            </menuItem>
          </div>
        </el-scrollbar>
      </div>
      <!-- :style="{ '--bkColor': bkColor }" -->
      <div
        class="qiankun-right"
        :class="isMicro ? 'width-100' : isShowTopMenu ? 'qiankun-right-k' : ''"
      >
        <topMenu v-if="!isMicro" />
        <div>
          <el-scrollbar class="scrollbar-main" id="scrollbar-main" :key="$store.getters.refreshKey">
            <div :class="['page', { 'padding-10': !isMicro }]" v-if="!showPage">
              <qiankun-keep-alive :include="$store.getters.keepAlive">
                <router-view ref="sysPage" id="appPage" />
              </qiankun-keep-alive>
              <!--              <vue-page-transition name="fade-in-left">-->
              <!--                <keep-alive :include="$store.getters.keepAlive">-->
              <!--                  <router-view ref="sysPage" id="appPage" />-->
              <!--                </keep-alive>-->
              <!--              </vue-page-transition>-->
            </div>
            <div
              class="page"
              v-for="item in filterIfameList"
              :key="item.path"
              v-show="showIframe(item)"
            >
              <iframe
                :src="getUrl(item)"
                name="topFrame"
                scrolling="auto"
                frameborder="0"
                class="topFrame"
              ></iframe>
            </div>
          </el-scrollbar>
        </div>

        <!-- <div class="footer">
          <p class="footer-left">
            <img
              style="width: 10px; height: 10px;"
              :src="require('@/assets/menu/footer-icon.png')"
              alt=""
            />

            {{ $store.getters.userInfo.username }}

            上次登录时间：2023.8.7 15:20
          </p>
          &nbsp; &nbsp; &nbsp;
          <p>版权所有 © 卡奥斯<span>COSMO</span> Plat 2023</p>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import menuItem from "./menuItem";
import topMenu from "./topMenu.vue";
import { resourceCommonly } from "@/api/login";
const recommend = require("@/assets/images/recommend.png");
import iframes from "@/router/iframe";
import SearchMenu from "@/components/searchMenu/index";
import QiankunKeepAlive from "@/utils/qiankunKeepAlive";

export default {
  name: "awesomeSubBar",
  components: {
    menuItem,
    topMenu,
    SearchMenu,
    QiankunKeepAlive,
  },
  data() {
    return {
      // bkColor: "#ffffff",
      // isMicro: false,
      likeList: [],
      recommend,
      iframes,
      // isShowTopMenu,
      itemList: {},
    };
  },
  computed: {
    indexActive() {
      return this.$store.getters.indexActive;
    },
    isShowTopMenu() {
      return this.$store.getters.isShowTopMenu;
    },

    twoTitle() {
      return this.$store.getters.twoTitle.name || "";
    },
    filterIfameList() {
      const topmenus = this.$store.getters.topmenus;
      const filterIfameList = iframes.filter((item) =>
        topmenus.some((val) => val.path == item.path)
      );
      return filterIfameList;
    },
    menus() {
      return this.$store.getters.menus;
    },
    showIframe() {
      return function (item) {
        if (!item) return false;
        const path = this.$route.path;
        return item.path === path;
      };
    },
    getUrl() {
      return function (item) {
        const url = item.meta.url;
        const token = this.$store.getters.token;
        const pathUrl = url.includes("?")
          ? `${url}&token=${token}`
          : `${url}?token=${token}`;

        return pathUrl;
      };
    },
    showPage() {
      const path = this.$route.path;
      // return this.filterIfameList.some((val) => val.path == path)
      return false;
    },
  },

  created() {
    this.resourceCommonly();
  },
  methods: {
    showTopMenu() {
      this.$store.commit("SET_ISSHOWTOPMENU", !this.isShowTopMenu);
    },
    URL(url, str = "") {
      try {
        let pathname = new URL(url).pathname;

        if (str) {
          pathname = pathname.slice(0, -4) + str + ".png";
        }
        return require(`@/assets${pathname}`);
      } catch (err) {
        return "";
      }
    },

    isLeft() {},
    // 上方点击,渲染左侧边
    handleJump(item, index) {
      this.itemList = item;
      if ((item.path || "").includes("http")) {
        window.open(item.path);
      } else if (item.children.length == 0) {
        this.$message.error(this.$t("common.menuErr"));
      } else {
        this.$store.commit("SET_INDEXACTIVE", index);
        this.$store.commit("SET_LEFTMENUS", item.children);
        this.$store.commit("SET_TWOTITLE", item);
        // this.$store.commit("SET_ISSHOWTOPMENU", true);
        setTimeout(() => {
          this.$store.commit("SET_ISSHOWTOPMENU", false);
        }, 0);
      }
      // this.mouseleave();
    },
    resourceCommonly() {
      resourceCommonly().then((res) => {
        res.data.result.forEach((val) => {
          val.name = val.resourceName;
        });
        this.likeList = [
          {
            icon: "el-icon-star-on",
            name: $i18n.t("common.commonMenus"),
            children: res.data.result,
          },
        ];
      });
    },
  },
};
</script>
<style lang="scss" scoped>
$maxWidth: 185px;
$minWidth: 60px;

.containerBag {
  .left-menu {
    .left-icon {
      transition: all 0.5s;
    }
    ::-webkit-scrollbar {
      width: 0px;
      transition: all 1s;
    }
  }
  .left-menu:hover {
    .left-icon {
      transition: all 0.5s;
      box-shadow: 5px 5px 30px #afaeae;
    }
    ::-webkit-scrollbar {
      width: 1px;
    }
  }
  .padding-10 {
    padding: 10px;
  }
  .micro-right {
    width: 100%;
    padding: 0px;
  }
  .flex-left {
    font-size: 22px;

    i {
      cursor: pointer;
    }
  }
  .footer {
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 14px;
    justify-content: center;
    height: 48px;
    margin-top: 14px;
    background: #fff;
    color: #5a6f82;
    font-weight: 500;
    // margin-top: 16px;
    .footer-left {
      background: #f4f6f8;
      border-radius: 8px 8px 8px 8px;
      padding: 5px 10px;
    }
    span {
      color: #5a6f82;
      font-weight: 900;
    }
  }
  .qiankun-left-k {
    width: $maxWidth;
    transition: all 0.5s;
  }
  .qiankun-left-b {
    width: 48px;
    transition: all 0.5s;
  }
  // .right {
  //   transform: rotate(180deg);
  //   transition: all 0.5s;
  // }

  // .left {
  //   transform: rotate(0deg);
  //   transition: all 0.5s;
  // }
  .menusList {
    // height: calc(100vh - 54px - 70px);
    .active {
      background: #0066ff;
      .b-p {
        color: #fff !important;
      }

      .def {
        display: none !important;
      }
      .hover {
        display: block !important;
      }
    }
    .item {
      cursor: pointer;
      padding: 10px 0;

      display: flex;
      flex-direction: column;
      align-items: center;
      .b-p {
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 500;
        color: #0066ff;
        padding-top: 5px;
        text-align: center;
      }

      .def {
        display: block;
      }
      .hover {
        display: none;
      }
    }

    .item:hover .b-p {
      color: #fff;
    }

    .item:hover .def {
      display: none;
    }
    .item:hover .hover {
      display: block;
    }
    .item:hover {
      background: #0066ff;
    }
  }
  .show-flex-left {
    width: 100%;
    text-align: right;
    background-color: rgba(235, 232, 232, 0.867);

    & > i {
      padding-right: 20px;
    }
  }

  .hid-flex-left {
    text-align: center;
  }

  .main-pack {
    display: flex;
    width: 100%;
  }

  .disp-none {
    display: none;
  }

  .icon-pack {
    font-weight: 500;
    padding-right: 10px;
  }

  /deep/.el-menu-item.is-active {
    background: $menu-active-background;
    box-sizing: border-box;
  }

  /deep/.el-menu-item {
    height: 52px;
    line-height: 52px;
  }

  /deep/.el-menu {
    border-right-width: 0px;
  }
}

.qiankun-left {
  box-shadow: 5px 0 10px -5px rgba(0, 21, 41, 0.3);
  z-index: 1;
  width: $maxWidth;
  display: flex;
  /deep/ i {
    margin-right: 5px;
    color: $header-fontColor;
  }
  .left-icon {
    width: 48px;
    overflow: auto;
    height: calc(100vh - 54px - 50px);
    background: #fff;
    position: relative;
    z-index: 99;
    .icon-bk {
      position: fixed;
      bottom: 0px;
      height: 20px;
      width: 48px;
      text-align: center;
      background: #fff;
      padding-bottom: 20px;
      transition: all 0.5s;
      & > img {
        transition: all 0.5s;
      }

      .right {
        transform: rotate(180deg);
      }

      .left {
        transform: rotate(0deg);
      }
    }

    .icon-bk:hover {
      background: #fff;
    }
  }
  .scrollbar {
    background-color: $app-color-header;
    display: flex;
  }
  .show-menu-none {
    width: 0px !important;
    transition: all 0.5s;
    transform: translateX(-137px) !important;
    overflow: hidden;
  }

  .show-menu-b {
    // width: 0px !important;
    transition: all 0.5s;
    width: calc(#{$maxWidth} - 48px);
    transform: translateX(0px);
    overflow: hidden;
  }
  .show-menu {
    // animation: showMenu 0.5s;
    width: calc(#{$maxWidth} - 48px);
    position: relative;
    .left-top {
      font-size: 14px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      text-align: center;
      height: 48px;
      display: flex;
      color: #5a6f82;
      align-items: center;
      justify-content: center;
    }
    .recommend {
      position: absolute;
      width: 15px;
      object-fit: contain;
      right: 0px;
      top: 0px;
    }
  }

  @keyframes showMenu {
    from {
      width: $minWidth;
    }

    to {
      width: $maxWidth;
    }
  }
}

.qiankun-right-k {
  width: calc(100vw - #{$maxWidth} + 137px) !important;
}
.qiankun-right {
  width: calc(100vw - #{$maxWidth});
  //padding: 0 15px;
  box-sizing: border-box;
  //background: #eff2fb;
  transition: width 0.5s;
}

.scrollbar {
  height: calc(100vh - 60px);
  box-sizing: border-box;
  background-color: #ffffff;
}

.scrollbar-main {
  width: 100%;
  // height: calc(100vh - 112px - 56px);
  height: calc(100vh - 112px);
  // padding-right: 10px;
  box-sizing: border-box;
  overflow-x: hidden;
}

/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}

.qiankun-page {
  // min-height: calc(100vh - 112px - 56px);
  min-height: calc(100vh - 112px);
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  padding-bottom: 0;
  background-color: #ffffff;
  // background: var(--bkColor);
}
.width-100 {
  width: 100%;
}
// .iframePage {
//   min-height: calc(100vh - 112px - 56px);
//   padding: 10px;
//   padding-right: 0;
//   box-sizing: border-box;
//   overflow: hidden;
//   background: #ffffff;
// }
.topFrame {
  width: 100%;
  height: calc(100vh - 140px);
  //   overflow: auto;
}
</style>
<style lang="scss">
.likeMenu {
  border-bottom: 1px solid $header-bkColor-hover;
  border-top: 1px solid $header-bkColor-hover;
}
</style>
