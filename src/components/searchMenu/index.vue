<template>
  <el-autocomplete
    class="search"
    clearable
    :placeholder="$t('common.searchMenu')"
    prefix-icon="el-icon-search"
    :fetch-suggestions="querySearch"
    v-model="searchVal"
    value-key="name"
    :trigger-on-focus="false"
    @select="handleSelect"
    popper-class="searchPoper"
  >
    <template slot-scope="{ item }">
      <div :title="item.name" class="pack-1">
        <p class="name">{{ item.name }}</p>
        <p class="label">{{ item.mergeName }}</p>
      </div>
    </template>
  </el-autocomplete>
</template>
<script>
import { routerPush } from "@/utils/judge";
import { resourceVisit } from "@/api/login";
export default {
  name: "searchMenu",
  data() {
    return {
      searchVal: "",
    };
  },
  computed: {
    getRouters() {
      return this.$store.getters.routersFolt;
    },
  },
  methods: {
    querySearch(queryString, cb) {
      queryString = queryString.trim();
      const getRouters = this.getRouters;
      const results = queryString
        ? getRouters.filter((val) => val.name.includes(queryString))
        : [];
      cb(results);
    },
    handleSelect(val) {
      resourceVisit(val.id);
      routerPush(val.path, "", val);
      this.searchVal = "";
    },
  },
};
</script>
<style lang="scss">
.searchPoper {
  /* width: 180px !important; */
  .el-scrollbar__view > li:hover {
    background: #eef7ff !important;
  }
  .pack-1 {
    padding: 5px 0;
    .name {
      font-size: 14px;
      font-weight: 600;
      line-height: initial;
      line-height: 23px;
    }
    .label {
      font-size: 12px;
      font-weight: 600;
      color: #5a6f82;
      line-height: initial;
      line-height: 23px;
    }
  }
  .pack-1:hover .name {
    color: #0066ff;
  }

  .pack-1:hover {
    background: #eef7ff !important;
  }
}
</style>
<style lang="scss" scoped>
.search {
  width: 260px;
  margin-left: 10px;
  /deep/ .el-input__inner {
    height: 32px;
    line-height: 32px;
    background: $app-color-header;
    border: 1px solid #617696;
    border-radius: 16px;
    color: $header-fontColor;
    &::placeholder {
      font-weight: 400;
      color: $header-fontColor;
    }
  }
}
</style>
