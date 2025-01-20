<!-- 主题设置 -->
<template>
  <el-drawer
    v-loading="loading"
    class="theme-all"
    :title="$t('my.themes')"
    :visible.sync="visibleThemes"
    size="50%"
    :before-close="
      () => {
        visibleThemes = false;
        init();
      }
    "
  >
    <div class="content">
      <div class="pack">
        <h3 class="p-10-20 b-b">{{ $t("my.hotTopics") }}</h3>
        <div class="card-pack flex-j-s-b p-10-20">
          <div
            class="card-item cursor"
            :key="i"
            v-for="(ite, i) in themeList"
            @click="chekeTheme(ite, i)"
          >
            <div class="wid-100">
              <!-- <div class="hover"></div> -->
              <el-image
                :src="ite.img"
                class="image"
                :class="ite.active ? 'imagehover' : ''"
                fit="contain"
              ></el-image>
            </div>
            <p class="tit">{{ ite.name }}</p>
            <div class="active" v-show="ite.active">
              <p>{{ $i18n.t("my.selected") }}</p>
            </div>
          </div>
          <div
            class="card-item cursor"
            :key="'o' + i"
            v-for="(ite, i) in Array(3).fill(1)"
          ></div>
        </div>

        <h3 class="p-10-20 b-t">{{ $i18n.t("my.colorPanel") }}</h3>
        <div class="item-pack p-10-20">
          <div :key="i" v-for="(ite, i) in colorList" class="item">
            <el-popover
              placement="top-start"
              trigger="hover"
              :title="$t('my.tit1')"
              :content="$t('my.msg6')"
            >
              <el-switch slot="reference" class="switch" v-model="ite.isBool">
              </el-switch>
            </el-popover>

            <p class="p-b-10">
              {{ ite.name }}

              <el-popover
                placement="top-start"
                :title="`${ite.name}:`"
                width="200"
                trigger="hover"
                :content="ite.msg"
              >
                <i
                  style="color: #8b8888; font-size: 12px;"
                  slot="reference"
                  class="el-icon-question"
                ></i>
              </el-popover>
            </p>

            <el-input
              @blur="(e) => colorChange(ite.value, ite, i, ite.isBool)"
              v-if="ite.isBool"
              v-model="ite.value"
            ></el-input>

            <el-color-picker
              v-else
              v-model="ite.value"
              color-format="hex"
              size="medium "
              show-alpha
              @change="(e) => colorChange(e, ite, i)"
              :predefine="predefineColors"
            >
            </el-color-picker>
          </div>
        </div>
      </div>
      <div class="footer">
        <el-button
          size="medium "
          @click="
            showThemes(false);
            init();
          "
          >{{ $i18n.t("common.cancel") }}</el-button
        >
        <el-button size="medium" type="primary" @click="saveSumbit">{{
          $i18n.t("common.save")
        }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
//例如：import 《组件名称》 from '《组件路径》';
import { getDict, putAuthDictItem } from "@/api/common.js";
export default {
  name: "",
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      visibleThemes: false, //设置主题的弹窗
      loading: false,
      // 默认配置项
      colorList: [
        {
          name: $i18n.t("my.background"), //"背景色",
          key: "--header-bkColor",
          value: "#2f394e", ////#2f394e
          msg: $i18n.t("my.msg1"), // "用于配置侧边栏的背景颜色配置",
          isBool: false,
        },
        {
          name: $i18n.t("my.fontColor"), // "默认字体颜色",
          key: "--header-fontColor",
          value: "#7191b0", ////#7191b0
          msg: $i18n.t("my.msg2"), //  "用于配置侧边栏的默认字体颜色",
          isBool: false,
        },
        {
          name: $i18n.t("my.hoverBackground"), //"移入时的背景色",
          key: "--header-bkColor-hover",
          value: "#252d3e", // //#252d3e
          msg: $i18n.t("my.msg3"), // "用于配置鼠标移入与点击时候,侧边栏的背景颜色",
          isBool: false,
        },
        {
          name: $i18n.t("my.hoverFontColor"), //"移入时的字体颜色",
          key: "--header-fontColor-hover",
          value: "#fff", // //#7191b0
          msg: $i18n.t("my.msg4"), //  "用于配置鼠标移入与点击时候,侧边栏的字体颜色",
          isBool: false,
        },
        {
          name: $i18n.t("my.topBackground"), //"背景色",
          key: "--header-topBkColor",
          value: "#2f394e", ////#2f394e
          msg: $i18n.t("my.msg5"), // "用于配置侧边栏的背景颜色配置",
          isBool: false,
        },
      ],
      // 颜色选择工具默认颜色
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "rgba(255, 69, 0, 0.68)",
        "rgb(255, 120, 0)",
        "hsv(51, 100, 98)",
        "hsva(120, 40, 94, 0.5)",
        "hsl(181, 100%, 37%)",
        "hsla(209, 100%, 56%, 0.73)",
        "#c7158577",
      ],

      // 顶部主题
      themeList: [
        {
          name: $i18n.t("my.classics"),
          active: 0,
          css: "",
          img: "http://60.209.248.238:8182/service/theme1.png",
          colorList: [
            { key: "--header-bkColor", value: "#2f394e" },
            {
              key: "--header-fontColor",
              value: "#7191b0", ////#7191b0
            },
            {
              key: "--header-bkColor-hover",
              value: "#252d3e", // //#252d3e
            },
            {
              key: "--header-fontColor-hover",
              value: "#fff", // //#7191b0
            },
            {
              key: "--header-topBkColor",
              value: "#2f394e", // //#7191b0
            },
          ],
        },
        {
          name: $i18n.t("my.fresh"), // "清新款式",
          active: 0,
          css: "",
          img: "http://60.209.248.238:8182/messervice/清新.png",
          colorList: [
            { key: "--header-bkColor", value: "rgba(243, 245, 251, 1)" },
            {
              key: "--header-fontColor",
              value: "rgba(90, 111, 130, 1)", ////#7191b0
            },
            {
              key: "--header-bkColor-hover",
              value: "rgba(220, 238, 255, 1)", // //#252d3e
            },
            {
              key: "--header-fontColor-hover",
              value: "rgba(0, 102, 255, 1)", // //#7191b0
            },
            {
              key: "--header-topBkColor",
              value: "linear-gradient(270deg, #61C1FF 0%, #1881FF 100%)", // //#7191b0
              isBool: true,
            },
          ],
        },
      ],
    };
  },
  //方法集合
  methods: {
    //获取颜色配置
    async init() {
      let res = await getDict("themeAll");
      let colorList = res.data.result;
      colorList.map((ite) => {
        let index = this.colorList.findIndex(
          (item) => item.key == ite.description
        );

        if (index != -1) {
          this.colorList[index].value = ite.value;
          this.colorList[index].id = ite.id;
          this.colorList[index].description = ite.description;
        }
        if (ite.description == "isShowTopMenu") {
          this.$store.commit(
            "SET_ISSHOWTOPMENU",
            ite.value == 1 ? true : false
          );
        }
      });

      this.setColor();
    },

    //保存
    saveSumbit() {
      try {
        this.loading = true;

        this.colorList.map(async (item) => {
          await putAuthDictItem(item);
        });

        this.loading = false;
        this.showThemes(false);
      } catch (error) {
        this.loading = false;
        this.showThemes(false);
      }
    },
    //打开弹窗
    showThemes(bool = true) {
      this.visibleThemes = bool;
    },
    colorChange(e, data, i, isBool) {
      let app = document.querySelector("body");
      app.style.setProperty(data.key, e);
      this.colorList[i].value = e;
      this.colorList[i].isBool = isBool || false;
    },
    // 选择主题
    chekeTheme(item, i) {
      this.themeList.map((ite) => {
        ite.active = 0;
      });
      item.active = 1;
      item.colorList.map((ite) => {
        this.colorChange(
          ite.value,
          ite,
          this.colorList.findIndex((item) => item.key == ite.key),
          ite.isBool
        );
      });
    },
    //设置全部css颜色
    setColor() {
      let app = document.querySelector("body");
      this.colorList.map((ite) => {
        app.style.setProperty(ite.key, ite.value);
      });
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.init();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
};
</script>
<style scoped lang="scss">
$color: #f5f3f3;
.theme-all {
  .content {
    padding: 20px;

    .footer {
      width: 100%;
      text-align: center;
      padding-top: 20px;
    }
    .p-10-0 {
      padding: 10px 0;
    }
    .item-pack {
      display: flex;
      padding-top: 0px;
      flex-wrap: wrap;
      .item {
        width: 33%;
        padding: 3.5%;
        text-align: center;
        box-sizing: border-box;
        border: 1px solid $color;
        position: relative;
        .switch {
          position: absolute;
          right: 5px;
          bottom: 5px;
        }
      }
    }
  }
  .p-10-20 {
    padding: 10px 20px;
  }
  .p-b-10 {
    padding-bottom: 10px;
  }
  .b-b {
    border-bottom: 1px solid #ececec;
  }

  .b-t {
    border-top: 1px solid #ececec;
  }
  .pack {
    color: black;
    // padding: 20px;
    border: 1px solid #ececec;
    .card-item {
      width: 30%;
      //   margin: 1%;
      position: relative;
      .tit {
        text-align: center;
      }
      .hover {
        display: none;
      }
      .image {
        //  border: 5px solid rgba(0, 0, 0, 0);
        border-radius: 5px;
      }
      .image:hover {
        box-sizing: border-box;
        // box-shadow: 10px 0px 20px 0px #a0a0a0 inset;
        box-shadow: 9px 10px 11px 0px #3c4349;
        border-radius: 5px;
        // border: 1px solid rgb(207, 31, 31);
        //position: relative;
      }
      .imagehover {
        border: 4px solid rgb(207, 31, 31);
      }

      .active {
        position: absolute;
        right: 0;
        top: 0;
        width: 0;
        height: 0;
        border-top: 50px solid rgb(207, 31, 31);
        border-left: 50px solid transparent;
        p {
          position: absolute;
          /* display: block; */
          top: -40px;
          width: 35px;
          left: -30px;
          transform: rotate(44deg);
          font-size: 0.9rem;
          color: white;
        }
      }
    }
    .card-item:hover .hover {
      position: absolute;
      z-index: 999;
      top: 0;
      width: 100%;
      height: 100%;
      background: #4e4c4cb3;
      display: block;
    }
  }

  .flex {
    display: flex;
  }
  .flex-j-s-b {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .cursor {
    cursor: pointer;
  }
  .wid-100 {
    width: 100%;
    // height: 100%;
  }
}
</style>
