<template>
  <div class="errPage-container">
    <!-- <el-button icon="arrow-left" class="pan-back-btn" @click="back">
      {{ $t('common.back') }}
    </el-button> -->
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">
          {{ $t("common.err401") }}
        </h1>
        <h2>{{ $t("common.noAccess") }}</h2>
        <h6>{{ $t("common.noBack") }}</h6>
        <ul class="list-unstyled">
          <li class="link-type">
            <el-button
              class="bullshit__return-home"
              type="text"
              size="small"
              @click="back"
            >
              {{ $t("common.reLogin") }}</el-button
            >
          </li>
        </ul>
      </el-col>
      <el-col :span="12">
        <img
          :src="errGif"
          width="313"
          height="428"
          alt="Girl has dropped her ice cream."
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import errGif from "@/assets/401_images/401.gif";
import { logout } from "@/utils/judge";
export default {
  name: "Page401",
  data() {
    return {
      errGif: errGif + "?" + +new Date(),
    };
  },
  methods: {
    back() {
      // logout();
    },
  },
};
</script>

<style lang="scss" scoped>
.errPage-container {
  width: 800px;
  max-width: 100%;
  margin: 100px auto;
  .pan-back-btn {
    background: #008489;
    color: #fff;
    border: none !important;
  }
  .pan-gif {
    margin: 0 auto;
    display: block;
  }
  .pan-img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }
  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }
  .list-unstyled {
    font-size: 14px;
    li {
      padding-bottom: 5px;
    }
    a {
      color: #008489;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
