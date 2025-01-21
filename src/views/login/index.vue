<template>
  <div class="container" id="container">
    <div class="header slideInDown animated">
      <img
        :src="getLogos.customerLoginPageLogoImage"
        v-if="getLogos.customerLoginPageLogoImage"
      />
      <el-divider
        direction="vertical"
        class="divider"
        v-if="getLogos.customerLoginPageLogoImage"
      ></el-divider>
      <img
        :src="getLogos.systemLoginPageLogoImage"
        v-if="getLogos.systemLoginPageLogoImage"
      />
      <el-divider
        direction="vertical"
        class="divider"
        v-if="getLogos.systemLoginPageLogoImage"
      ></el-divider>
      <h3>{{ sysName }}</h3>
    </div>
    <el-breadcrumb
      v-if="model"
      class="language slideInDown animated"
      separator="/"
    >
      <el-breadcrumb-item
        :class="{ 'language-item': language == item.value }"
        v-for="item in options"
        :key="item.value"
      >
        <span @click="changeLanguage(item)">{{
            item.label
          }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="login animated fadeInRight">
      <div class="right">
        <div class="login-pack">
          <el-tabs v-model="active">
            <el-tab-pane
              :label="$i18n.t('login.userLogin')"
              name="2"
            ></el-tab-pane>
          </el-tabs>
          <el-form
            ref="ruleForm"
            :model="ruleForm"
            :rules="rules"
            class="form-pack"
          >
            <el-form-item label prop="account" class="account">
              <el-input
                type="text"
                clearable
                v-model="ruleForm.account"
                autocomplete="off"
                :placeholder="$t('login.account')"
                @keyup.enter.native="submitForm"
              >
              </el-input>
            </el-form-item>
            <el-form-item label prop="password" class="password">
              <el-input
                ref="password"
                v-model="ruleForm.password"
                autocomplete="off"
                :placeholder="$t('login.password')"
                :type="passwordType"
                @keyup.enter.native="submitForm"
              >
                <div slot="suffix" class="show-pwd" @click="showPwd">
                  <div>
                    <svg
                      v-if="passwordType != 'password'"
                      t="1692091435838"
                      class="icon cursor"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="1611"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M0 0h1024v1024H0z"
                        fill="#FFFFFF"
                        fill-opacity="0"
                        p-id="1612"
                      ></path>
                      <path
                        d="M512 204.8C192.8192 204.8 0 542.7712 0 542.7712S222.72 870.4 512 870.4s512-327.6288 512-327.6288S831.1808 204.8 512 204.8z m329.1648 462.1312c-106.3936 93.1328-219.4432 151.7568-332.4928 151.7568s-226.0992-55.1936-332.4416-151.7568c-36.608-34.5088-73.1648-68.9664-103.0656-106.9056-6.656-6.912-9.984-13.824-16.64-20.6848 3.328-6.912 9.984-13.824 13.312-20.6848 26.624-37.9392 59.8016-75.8784 96.4096-110.3872 103.0656-96.5632 216.064-155.1872 342.4256-155.1872s239.36 58.624 342.4256 155.1872c36.608 34.5088 66.56 72.448 96.4096 110.3872 3.328 6.8608 9.984 13.7728 13.312 20.6848-3.328 6.8608-9.984 13.824-16.5888 20.6848-29.952 34.4576-63.1808 72.3968-103.0656 106.9056z"
                        fill="#999999"
                        p-id="1613"
                      ></path>
                      <path
                        d="M508.672 335.872c-99.7376 0-176.1792 82.7392-176.1792 182.784 0 103.424 79.7696 182.784 176.1792 182.784 99.7376 0 176.2304-82.7904 176.2304-182.784 0-100.0448-79.8208-182.784-176.2304-182.784z m0 317.2352c-69.8368 0-126.3104-58.624-126.3104-131.072 0-72.3968 56.4736-131.0208 126.3104-131.0208s126.3616 58.624 126.3616 131.072c0 68.9664-56.5248 131.072-126.3616 131.072z"
                        fill="#999999"
                        p-id="1614"
                      ></path>
                    </svg>
                    <svg
                      v-else
                      t="1692091501721"
                      class="icon cursor"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="1751"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M0 0h1024v1024H0z"
                        fill-opacity="0"
                        p-id="1752"
                      ></path>
                      <path
                        d="M967.68 360.96c10.24-15.36 7.68-35.84-7.68-46.08-15.36-12.8-35.84-7.68-46.08 7.68-2.56 2.56-184.32 220.16-401.92 220.16-209.92 0-401.92-220.16-404.48-222.72-12.8-12.8-33.28-15.36-46.08-2.56s-15.36 33.28-2.56 46.08c2.56 5.12 43.52 51.2 104.96 99.84l-84.48 89.6c-5.12 5.12-10.24 15.36-10.24 23.04 0 7.68 5.12 17.92 10.24 23.04 2.56 7.68 12.8 10.24 20.48 10.24 7.68 0 17.92-2.56 23.04-10.24l89.6-94.72c46.08 33.28 97.28 58.88 151.04 79.36l-35.84 117.76c-2.56 7.68-2.56 17.92 2.56 25.6s12.8 12.8 20.48 15.36h10.24c15.36 0 28.16-10.24 30.72-25.6l35.84-117.76c25.6 5.12 53.76 7.68 81.92 7.68s56.32-2.56 81.92-7.68l35.84 117.76c2.56 15.36 17.92 25.6 30.72 25.6 2.56 0 7.68 0 7.68-2.56 7.68-2.56 15.36-7.68 20.48-15.36 5.12-7.68 5.12-17.92 2.56-25.6l-35.84-117.76c53.76-20.48 102.4-46.08 151.04-79.36l89.6 94.72c7.68 7.68 15.36 10.24 23.04 10.24 7.68 0 17.92-2.56 23.04-10.24 12.8-12.8 12.8-33.28 2.56-46.08L860.16 460.8c66.56-51.2 107.52-99.84 107.52-99.84z"
                        fill="#CCCCCC"
                        p-id="1753"
                      ></path>
                    </svg>
                  </div>
                </div>
              </el-input>
            </el-form-item>
            <el-form-item class="password">
              <div class="old-item">
                <div
                  class="right-1 cursor"
                  @click="
                    () => {
                      this.$message.warning($i18n.t('login.msg1'));
                    }
                  "
                >
                  {{ $i18n.t("login.forgotPassword") }}
                </div>
              </div>
            </el-form-item>
            <el-form-item class="margin-0">
              <div class="btn-pack">
                <el-button
                  class="btnStyle"
                  type="primary"
                  :loading="isLogin"
                  @click="submitForm"
                >{{
                    isLogin ? $i18n.t("login.logging") : $i18n.t("login.login")
                  }}
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="login_bottom_text">
      <pre>{{ copyright }}</pre>
    </div>
  </div>
</template>

<script>
import { loadLanguageAsync } from "@/lang/i18n-setup";
const sys = require("@/config.js");
import { getLogo, getTitle, getUserInfo } from "@/api/login";

export default {
  name: "login",
  components: {},
  data() {
    const validateAccount = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("login.accountRule")));
      } else {
        callback();
      }
    };
    const validatePassWord = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("login.passwordRule")));
      } else {
        callback();
      }
    };
    return {
      model: process.env.VUE_APP_CURRENTMODE == "dev",
      options: [
        {
          value: "cn",
          label: "中文",
        },
        {
          value: "en",
          label: "English",
        },
      ],
      passwordType: "password",
      name: sys.name,
      isLogin: false,
      active: "2",
      ruleForm: {
        account: "",
        password: "",
        type: 0, // 0 手机号 1 工号 2 邮箱
        tenantCode: this.$route.params.pathMatch,
      },
      rules: {
        account: [
          {
            validator: validateAccount,
            trigger: "blur",
          },
        ],
        password: [
          {
            validator: validatePassWord,
            trigger: "blur",
          },
        ],
      },
      loginPageBackgroundImage: null,  // 登录页背景图片，防止图片过大导致storage溢出，不存储在store中
    };
  },
  computed: {
    language: {
      get() {
        return this.$store.getters.language;
      },
      set(val) {
        this.$store.commit("SET_LANGUAGE", val);
        document.title = val === 'cn' ? this.$store.getters.titles.tabTitle?.titleContent : this.$store.getters.titles.tabTitle?.titleContentEn;
        loadLanguageAsync();
      },
    },
    getLogos() {
      const { systemLoginPageLogoImage, customerLoginPageLogoImage } = this.$store.getters.logos;
      // 如果自用和客户logo都未设置，默认取本地logo
      if (!systemLoginPageLogoImage && !customerLoginPageLogoImage) {
        return {
          systemLoginPageLogoImage: require("../../assets/images/cosmoplat_logo.png")
        };
      }
      return this.$store.getters.logos;
    },
    // 主页右上角标题
    sysName() {
      return this.$store.getters.titles.loginTitle?.[this.language === 'cn' ? 'titleContent' : 'titleContentEn'] || $i18n.t('sysName');
    },
    // 底部版权信息
    copyright(){
      return this.$store.getters.titles.copyright?.[this.language === 'cn' ? 'titleContent' : 'titleContentEn'] || $i18n.t('login.copyright');
    }
  },
  async created() {
    this.getLogo();
    this.getTitle();
    if (this.$store.getters.token) {
      const res = await getUserInfo();
      if (res.data.code == 0) {
        this.$router.push("/index");
      } else {
        localStorage.clear();
        sessionStorage.clear();
        this.$store.commit("CLEAR_USER");
      }
    }
  },
  mounted() {},
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    // 获取title
    getTitle() {
      const data = {
        tenantCode: this.$route.params.pathMatch,
        usingSystem: "10",
      };
      getTitle(data).then((res) => {
        let titleObj = {};
        if (res.data.result.length) {
          res.data.result.forEach((item) => {
            // usingSystem，10：PC端，20：APP端
            if (item.usingSystem === "10") {
              // usePosition，10：登录页title，20：tab标签title，30：版权信息
              if (item.usePosition === "10") {
                titleObj.loginTitle = {
                  titleContent: item.titleContent || '',
                  titleContentEn: item.titleContentEn || ''
                };
              } else if (item.usePosition === "20") {
                titleObj.tabTitle = {
                  titleContent: item.titleContent || '',
                  titleContentEn: item.titleContentEn || ''
                };
              } else if (item.usePosition === "30") {
                titleObj.copyright = {
                  titleContent: item.titleContent || '',
                  titleContentEn: item.titleContentEn || ''
                };
              }
            }
          });
        }
        this.$store.commit("SET_TITLE", titleObj);
        document.title = titleObj.tabTitle?.[this.language === 'cn' ? 'titleContent' : 'titleContentEn'] || this.$t('sysName')
      });
    },
    // 获取logo以及背景图片
    getLogo() {
      const data = {
        tenantCode: this.$route.params.pathMatch,
        usingSystem: "10",
      };
      getLogo(data).then((res) => {
        let picObject = {
          systemLoginPageLogoImage: null,
          customerLoginPageLogoImage: null,
          indexPageLogoImage: null,
        };
        if (res.data.result.length) {
          res.data.result.forEach(item => {
            // 10：PC端，20：APP端
            if (item.usingSystem === '10') {
              // 10：登录页logo，20：内页logo，30：登录页背景图片
              if (item.usePosition === '10') {
                // 10：自用logo，20：客户设置logo
                item.usageType === '10' ? (picObject['systemLoginPageLogoImage'] = item.pictureContent) : (picObject['customerLoginPageLogoImage'] = item.pictureContent)
              } else if (item.usePosition === '20') {
                picObject['indexPageLogoImage'] = item.pictureContent
              } else if (item.usePosition === '30') {
                // 防止图片过大导致storage溢出，不存储在store中
                this.loginPageBackgroundImage = item.pictureContent
              }
            }
          })
        }
        this.$store.commit("SET_LOGO", picObject);
        this.setBackgroundImage();
      });
    },
    // 设置背景图片
    setBackgroundImage() {
      let img = `url(${
        this.loginPageBackgroundImage ||
        require("../../assets/images/loginNewBg1.png")
      })`;
      this.$nextTick(() => {
        document.getElementById("container").style.backgroundImage = img;
      });
    },
    changeLanguage(item) {
      this.language = item.value;
    },
    // 登录
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.isLogin = true;
          let type = 1;
          if (this.active == 1) {
            // ruleForm.type  0 手机号 1 工号 2 邮箱
            type = this.ruleForm.account.includes("@") ? 2 : 0;
          }
          this.ruleForm.type = type;
          this.$store
            .dispatch("Login", {...this.ruleForm,language:this.language})
            .then((res) => {
              // this.$router.push(sys.indexPath);
              this.$router.push("/index");
            })
            .finally(() => {
              this.isLogin = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$input-hei: 48px;
.container {
  height: 100vh;
  overflow: hidden;
  background-size: 100% 100%;
  .login_bottom_text {
    margin: 0 auto;
    position: fixed;
    bottom: 20px;
    text-align: center;
    width: 100%;
    color: #999;
    font-size: 12px;
    text-decoration: none;
    background-color: transparent;
  }
  .header {
    height: 75px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 30px;
    width: 100%;
    box-sizing: border-box;
    background: #3d69fbc2;
    background: linear-gradient(270deg, #61c0ff33 0%, #1880ff43 100%);
    position: absolute;
    top: 0px;
    img {
      height: 68%;
      object-fit: contain;
    }
    h3 {
      color: #333;
      font-size: 20px;
      font-weight: 600;
    }
    .divider {
      height: 25px;
      margin: 0 15px;
    }
  }
  .language {
    position: fixed;
    right: 4%;
    z-index: 100;
    height: 75px;
    display: flex;
    align-items: center;
    .language-item {
      /deep/ .el-breadcrumb__inner {
        color: #2538f5;
        cursor: pointer;
        font-size: 15px;
      }
    }
    /deep/ .el-breadcrumb__separator {
      margin: 0 5px;
      color: #fff;
    }
    /deep/ .el-breadcrumb__inner {
      color: #fff;
      cursor: pointer;
      font-size: 15px;
    }
  }
  .h3-logo {
    color: white;
  }
  .login-pack {
    width: 100%;
    padding: 48px 50px;
    background: rgba(240, 246, 255, 0.9);
    border-radius: 20px 20px 20px 20px;
    opacity: 1;
    border: 1px solid #ffffff;
    .tabs-pack {
      display: flex;
      width: 55%;
      justify-content: space-evenly;
      padding-top: 4%;
      font-size: 17px;
      cursor: pointer;

      .tabs-def {
        color: #666666;
      }
      .tabs-active {
        color: #1989fa;
        font-weight: 600;
      }
      & > li {
        text-align: center;
      }
      .nbsp-pack {
        color: #7f99bc;
      }
    }
    .btn-pack {
      width: 100%;
      // margin-bottom: 40px;

      button {
        width: 100%;
        margin: 0 auto;
        display: block;
        font-size: 18px;
        font-weight: 600;
        background: linear-gradient(135deg, #4da3ff 0%, #266bf2 100%);
        padding: 10px 0;
        //border-radius: 20px;
        /deep/ span {
          font-size: 16px;
        }
      }
    }
    /deep/ .el-tabs__nav-scroll {
      overflow: hidden;
      display: flex;
      justify-content: center;
    }

    /deep/ .el-tabs__active-bar {
      background: #0066ff;
      width: 60px !important;
      transform: translateX(15px) !important;
    }

    /deep/ .el-tabs__nav-wrap::after {
      background-color: rgba(255, 255, 255, 1);
    }

    /deep/ .el-tabs__item {
      font-size: 16px;
      padding-bottom: 20px;
      height: auto;
      color: #5a6f82;
    }

    /deep/ .el-tabs__item.is-active {
      color: #000;
      font-weight: bold;
      font-size: 20px;
    }
  }

  .login {
    height: 100%;
    width: 100%;
    // max-width: 1000px;
    // margin: 0 auto;
    display: flex;
    justify-content: flex-end;
    box-sizing: border-box;
    align-items: center;
    position: relative;
    /deep/.el-input__suffix {
      display: flex;
      align-items: center;
      padding-right: 15px;
      padding-top: 5px;
    }
    .cursor {
      cursor: pointer;
    }

    .show-pwd {
    }
    .password {
      margin-bottom: 24px !important;
    }
    /deep/.el-tabs__header {
      margin: 0px !important;
    }
    .margin-0 {
      margin: 0px !important;
    }
    .old-item {
      display: flex;
      justify-content: space-between;
      // margin-bottom: 33px;
      & > .left-1 {
        font-size: 16px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #5a6f82;
        /deep/.el-checkbox__label {
          font-size: 16px;
        }
      }
      & > .right-1 {
        font-size: 16px;
        color: #0066ff;
        font-weight: 400;
      }
    }
    /deep/ .el-divider--vertical {
      height: 100%;
    }
    .input-icon {
      font-size: 16px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      line-height: $input-hei;
      color: #b6c0c9;
    }
    .right {
      width: 450px;
      //height: 430px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      flex-wrap: wrap;
      position: relative;
      right: 10%;
      transform: scale(0.9);

      h3 {
        text-align: center;
        width: 100%;
        font-size: 32px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #13173d;
      }

      .form-pack {
        margin-top: 32px;
        width: 100%;

        /deep/ .el-input {
          input:-webkit-autofill {
            transition: background-color 5000s ease-in-out 0s;
          }
        }

        /deep/ .el-input--small .el-input__inner {
          height: $input-hei;
          line-height: $input-hei;
          color: #000;
          background: #ffffff;
          border-radius: 4px 4px 4px 4px;
          opacity: 1;
          border: 1px solid #e5e5e5;
        }
        /deep/.el-input__inner:focus {
          border: 1px solid #0066ff !important;
        }
        /deep/ .el-input__prefix {
          line-height: $input-hei;
          font-weight: 700;
          padding-left: 5px;
          color: #469bf9;
          font-size: 18px;
        }
        .account {
          margin: 32px 0 !important;
        }
        .remember {
          span {
            font-size: 12px;
          }

          .xieyi {
            color: #0299ff;
            cursor: pointer;
          }
        }

        .btnStyle {
          width: 100%;
          height: 45px;
          background: #0066ff;
          font-size: 18px;
          letter-spacing: 8px;
        }
        .btnStyle:hover {
          width: 100%;
          height: 45px;
          background: #005ce6;
          font-size: 18px;
          letter-spacing: 8px;
        }
        .solid {
          height: 0px;
          border: 1px dashed #dddddd;
        }

        .forget {
          /deep/ .el-form-item__content {
            display: flex;
            justify-content: space-between;
          }

          span {
            color: #333333;
            cursor: pointer;
          }
        }
      }
    }
  }

  .apng {
    object-fit: contain;
    width: 85%;
  }

  .left {
    position: absolute;
    width: 56%;
    display: flex;
    align-items: center;
    height: 100%;

    div {
      position: relative;
    }

    .base1 {
      left: 10vw;
      bottom: 1vw;
    }
    .base {
      left: 6vw;
      top: 4vh;
    }
    .base2 {
      bottom: 10vh;
      right: 4vh;
    }
  }

  /*base code*/
  .animated {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }
  .animated.infinite {
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
  }
  .animated.hinge {
    -webkit-animation-duration: 2s;
    animation-duration: 2s;
  }
  /*the animation definition*/
  @-webkit-keyframes fadeInRight {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }
    100% {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }
  @keyframes fadeInRight {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(100%, 0, 0);
      -ms-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }
    100% {
      opacity: 1;
      -webkit-transform: none;
      -ms-transform: none;
      transform: none;
    }
  }
  .fadeInRight {
    -webkit-animation-name: fadeInRight;
    animation-name: fadeInRight;
  }

  /*base code*/
  .animated {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }
  .animated.infinite {
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
  }
  .animated.hinge {
    -webkit-animation-duration: 2s;
    animation-duration: 2s;
  }
  /*the animation definition*/
  @-webkit-keyframes slideInDown {
    0% {
      -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
      visibility: visible;
    }
    100% {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes slideInDown {
    0% {
      -webkit-transform: translate3d(0, -100%, 0);
      -ms-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
      visibility: visible;
    }
    100% {
      -webkit-transform: translate3d(0, 0, 0);
      -ms-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }
  .slideInDown {
    -webkit-animation-name: slideInDown;
    animation-name: slideInDown;
  }
}
</style>
