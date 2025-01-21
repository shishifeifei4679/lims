<template>
  <div class="layout-pack" style="width: 100%;">
    <el-header class="app-header" v-if="!isMicro">
      <app-header :logo="indexPageLogoImage"> </app-header>
    </el-header>
    <awesome-subBar></awesome-subBar>
  </div>
</template>
<script>
import appHeader from "./components/appHeader";
import { getLogo, getTitle } from '@/api/login';

export default {
  name: "Layout",
  components: {
    appHeader,
  },
  data() {
    return {
      isMicro: !!window.__POWERED_BY_QIANKUN__,
      indexPageLogoImage: null,
    };
  },
  created() {
    this.$store.dispatch("GetMenus");
    this.$store.dispatch("GetUnreadNum");
  },
  mounted() {
    this.getUserInfo();
    this.getLogo();
    this.getTitle();
  },
  methods: {
    getUserInfo() {
      this.$store.dispatch("GetuserInfo").then(() => {});
    },
    // 获取内页logo
    async getLogo() {
      let logoImage;
      // 如果Vuex中没有，就重新获取
      if (!this.$store.getters.logos['indexPageLogoImage']) {
        const response = await getLogo({
          tenantCode: this.$store.getters.userInfo.tenantCode,
          usingSystem: "10",
        })
        if (response.data.result.length) {
          logoImage = response.data.result.find(item => item.usePosition === '20' && item.usingSystem === '10')
          console.log(logoImage, 'logoImage')
        }
        this.$store.commit("SET_LOGO", { indexPageLogoImage: logoImage?.pictureContent, ...this.$store.getters.logos });
      }
      logoImage = this.$store.getters.logos['indexPageLogoImage'];
      this.indexPageLogoImage = logoImage ? logoImage : require("../../assets/images/cosmoplat_logo.png");
    },
    // 获取标题
    async getTitle() {
      // 如果Vuex中有就不重新获取
      if (Object.keys(this.$store.getters.titles?.['tabTitle']).length > 0) {
        document.title = this.$store.getters.language === 'cn'
          ? this.$store.getters.titles?.['tabTitle'].titleContent
          : this.$store.getters.titles?.['tabTitle'].titleContentEn;
      } else {
        // Vuex中没有就重新获取
        const response = await getTitle({
          tenantCode: this.$store.getters.userInfo.tenantCode,
          usingSystem: "10",
        })
        if (response.data.result.length) {
          const tabTitle = response.data.result.find(item => item.usePosition === '20' && item.usingSystem === '10')
          this.$store.commit("SET_TITLE", { tabTitle });
          document.title = this.$store.getters.language === 'cn'
            ? tabTitle.titleContent
            : tabTitle.titleContentEn;
        } else {
          // 如果返回的结果是空，就用默认的标题
          document.title = this.$t('sysName');
        }
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.app-header {
  // overflow: hidden;
  background: $header-topBkColor;
  height: 54px !important;
  padding: 0 !important;
}
</style>
