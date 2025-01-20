<template>
  <el-drawer
    :visible.sync="visible"
    direction="rtl"
    :modal="false"
    size="400px"
    style="top: 60px"
  >
    <template v-slot:title>
      <div class="message">
        <span class="title">{{ $i18n.t('common.sysMsg') }}</span>
        <span class="more" @click="handleMoreMsg">{{ $i18n.t('common.seeMore') }}</span>
      </div>
    </template>
    <el-select
      v-model="status"
      :placeholder="$i18n.t('common.select')"
      class="status"
      @change="handleChange"
    >
      <el-option :label="$i18n.t('layout.all')" value=""> </el-option>
      <el-option :label="$i18n.t('layout.unread')" value="0"> </el-option>
      <el-option :label="$i18n.t('layout.read')" value="2"> </el-option>
    </el-select>
    <div class="infinite-list-wrapper" style="overflow: auto">
      <ul
        class="list"
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled"
        :infinite-scroll-immediate="false"
      >
        <li
          v-for="(item, index) in count"
          class="list-item"
          :key="index"
          @click="handleRouter(item)"
        >
          <div class="top">
            <el-tag v-if="item.messageStatus == 2" effect="plain" type="info">{{
              item.handler
            }}</el-tag>
            <el-tag v-else effect="plain">{{ item.handler }}</el-tag>

            <span class="time">{{ item.createTime }}</span>
          </div>

          <div
            class="content"
            :class="{ readMessage: item.messageStatus == 2 }"
          >
            {{ item.text }}
          </div>
        </li>
      </ul>
      <p v-if="loading">{{ $i18n.t('common.loading') }}</p>
      <p v-if="noMore">{{ $i18n.t('common.noMore') }}</p>
    </div>
  </el-drawer>
</template>

<script>
import { getMessageSend, readMessage } from "@/api/message";
import { routerPush } from "@/utils/judge";
import qs from "qs";
export default {
  data() {
    return {
      visible: false,
      status: "0",
      count: [],
      loading: false,
      pageNum: 1,
    };
  },
  computed: {
    noMore() {
      return this.count.length >= this.total;
    },
    disabled() {
      return this.loading || this.noMore;
    },
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.refresh();
        }
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    handleMoreMsg() {
      this.visible = false;
      this.$router.push("/message");
    },
    handleRouter(item) {
      if (item.messageStatus != 2 && item.handler === "PC") {
        readMessage(item.mid).then((res) => {
          this.$store.dispatch("GetUnreadNum");
        });
      }
      if (item.handler === "PC") {
        this.visible = false;
        const params = item.extra ? JSON.parse(item.extra) : {};
        routerPush(item.router, `?${qs.stringify(params)}`);
      }
    },
    refresh() {
      this.status = "0";
      this.handleChange();
    },
    handleChange() {
      this.pageNum = 1;
      this.total = 0;
      this.count = [];
      this.load();
    },
    load() {
      this.loading = true;
      console.log("加载");
      getMessageSend({
        messageStatus: this.status,
        pageNum: this.pageNum,
        pageSize: 10,
      })
        .then((res) => {
          this.total = res.data.result.total;
          this.count = [...this.count, ...res.data.result.records];
          console.log(res, this.count);
          this.pageNum++;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/.el-drawer {
  box-shadow: 0 2px 4px 0 #363a5052;
}
/deep/ .el-drawer__header {
  border-bottom: 1px solid #e7eaef;
  color: rgba(0, 0, 0, 0.9);
  display: flex;
  padding: 10px;
  margin: 0;
  font-size: 14px;
}
/deep/ .el-dialog__close {
  font-size: 18px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.6);
}
.message {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    font-weight: bolder;
  }
  .more {
    margin-right: 12px;
    color: rgba(0, 0, 0, 0.6);
    line-height: 20px;
    font-size: 12px;
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
  }
}
.status {
  margin: 20px 0;
  width: 80px;
  margin-left: 10px;
}
.infinite-list-wrapper {
  height: calc(100vh - 192px);
  .list-item {
    height: 70px;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
    padding: 10px;
    box-sizing: border-box;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .content {
      color: #333333;
      font-weight: 600;
      line-height: 20px;
      flex: 1 1 auto;
      min-width: 20px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      margin-top: 10px;
      font-size: 12px;
    }
    .time {
      color: rgba(0, 0, 0, 0.4);
      font-size: 12px;
    }
    .readMessage {
      color: rgba(0, 0, 0, 0.4);
    }
  }
  .list-item:hover {
    background: #e7eaef;
    /deep/ .el-tag {
      background: #3c7fcd;
      color: #ffffff;
    }
  }

  p {
    width: 100%;
    padding: 20px 0;
    color: #999;
    text-align: center;
    box-sizing: border-box;
    font-size: 12px;
  }
}
</style>
