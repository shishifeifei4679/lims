<!-- 主题组件 by bing -->
<template>
  <div class="theme-all">
    <el-tooltip effect="dark" content="设置主题" placement="bottom">
      <svg
        @click="drawer = true"
        data-v-2b6a720c=""
        aria-labelledby="svg-inline--fa-title-u0ry78lUzuqv"
        data-prefix="fas"
        data-icon="palette"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        class="svg"
      >
        <path
          data-v-2b6a720c=""
          fill="currentColor"
          d="M204.3 5C104.9 24.4 24.8 104.3 5.2 203.4c-37 187 131.7 326.4 258.8 306.7 41.2-6.4 61.4-54.6 42.5-91.7-23.1-45.4 9.9-98.4 60.9-98.4h79.7c35.8 0 64.8-29.6 64.9-65.3C511.5 97.1 368.1-26.9 204.3 5zM96 320c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm32-128c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128-64c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 64c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"
          class=""
        ></path>
      </svg>
    </el-tooltip>
    <el-drawer
      class="drawer"
      title="主题设置"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose"
    >
      <div class="pack">
        <h3>热门主题</h3>
        <div class="card-pack flex-j-s-b">
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
            <div class="active" v-show="ite.active"><p>已选</p></div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
//例如：import 《组件名称》 from '《组件路径》';

export default {
  name: "",
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      themeList: [
        {
          name: "芙蕖粉",
          active: 0,
          css: "./css/theme_1.css",
          img: require("./img/1.png"),
        },
        {
          name: "芙蕖粉",
          active: 0,
          css: "./css/theme_2.css",
          img: require("./img/1.png"),
        },
        {
          name: "芙蕖粉",
          active: 1,
          css: "./css/theme_1.css",
          img: require("./img/1.png"),
        },
        {
          name: "芙蕖粉",
          active: 0,
          css: "./css/theme_1.css",
          img: require("./img/1.png"),
        },
        {
          name: "芙蕖粉",
          active: 0,
          css: "./css/theme_1.css",
          img: require("./img/1.png"),
        },
      ],
      drawer: false,
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    handleClose(done) {
      done();
    },
    chekeTheme(item, i) {
      this.themeList.map((ite) => {
        ite.active = 0;
      });

      document.getElementById("theme").href = item.css;
      this.themeList[i].active = 1;
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped lang="scss">
.theme-all {
  .svg {
    vertical-align: middle;
    color: #fff;
  }
  .drawer {
    .pack {
      color: black;
      margin: 0 20px 20px 20px;

      .card-item {
        width: 46%;
        margin: 1%;
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
          box-shadow: 6px 7px 12px 9px #a0a0a0;
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
