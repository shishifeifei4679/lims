<template>
  <div>
    <el-popover
      placement="right-start"
      trigger="hover"
      :visible-arrow="false"
      popper-class="popperClass"
      v-if="menu.children"
      v-model="visible"
      :open-delay="200"
    >
      <!-- 鼠标滑过的展示层 -->
      <div class="menuPack">
        <div>
          <template v-for="item in getNoChildren(menu.children)">
            <div
              v-if="item.visible == 1"
              :key="item.id"
              class="menuContent"
              @click="handleRouter(item)"
            >
              {{ item.name }}
            </div>
          </template>
        </div>

        <div v-for="item in getChildren(menu.children)" :key="item.id">
          <div v-if="item.children && item.visible == 1">
            <div class="menulist">{{ item.name }}</div>
            <template v-for="c in getMenu(item.children)">
              <div
                :key="c.id"
                v-if="c.visible == '1'"
                class="menuContent"
                @click="handleRouter(c)"
              >
                {{ c.name }}
              </div>
            </template>
          </div>
        </div>
      </div>
      <div slot="reference" class="menuName">
        <p>{{ menu.name }}</p>
        <img
          class="def"
          style="width: 20px; height: 20px;"
          :src="require('@/assets/menu/right.png')"
          alt=""
        />
        <img
          class="hover"
          style="width: 20px; height: 20px;"
          :src="require('@/assets/menu/right_h.png')"
          alt=""
        />
      </div>
    </el-popover>
    <div
      class="menuName"
      v-if="!menu.children && menu.visible == 1"
      @click="handleRouter(menu)"
    >
      <p>{{ menu.name }}</p>
      <img
        class="def"
        style="width: 20px; height: 20px;"
        :src="require('@/assets/menu/right.png')"
        alt=""
      />
      <img
        class="hover"
        style="width: 20px; height: 20px;"
        :src="require('@/assets/menu/right_h.png')"
        alt=""
      />
      <!-- <i :class="menu.icon ? menu.icon : 'el-icon-setting'"></i> -->
    </div>
  </div>
</template>

<script>
import { resourceVisit } from "@/api/login";
import { routerPush } from "@/utils/judge";
export default {
  name: "menuItem",
  data() {
    return {
      visible: false,
    };
  },
  props: {
    menu: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    getMenu() {
      return function (children) {
        return children ? children : [];
      };
    },
    getNoChildren() {
      return function (menus = []) {
        let data = menus.filter((val) => !val.children);
        return data;
      };
    },
    getChildren() {
      return function (menus = []) {
        let data = menus.filter((val) => val.children);
        return data;
      };
    },
  },
  methods: {
    handleRouter(item) {
      resourceVisit(item.id);
      this.visible = false;
      routerPush(item.path, "", item);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$menuWidth: 140px;
.menuPack {
  display: flex;
}
.menuName {
  width: 100%;
  height: 46px;
  color: $header-fontColor;
  font-size: 14px;
  line-height: 46px;
  cursor: pointer;
  padding: 0px 10px;
  box-sizing: border-box;
  font-weight: bolder;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .def {
    display: block;
  }
  .hover {
    display: none;
  }
}

.menuName:hover .hover {
  display: block;
}
.menuName:hover .def {
  display: none;
}
.menuContent {
  width: $menuWidth;
  min-height: 35px;
  color: $header-fontColor;
  text-align: left;
  font-size: 14px;
  line-height: 35px;
  // background: #252d3e;
  cursor: pointer;
  padding-left: 15px;
  font-weight: bolder;
}
.menuContent:hover {
  background: $header-bkColor-hover; //#2f394e;//左侧 侧边栏鼠标移入二级菜单展示页 hover颜色  by bing
  color: var(--header-fontColor-hover);
}
.menuName:hover {
  background: $header-bkColor-hover;
  color: $header-fontColor-hover;
  i {
    color: $header-fontColor-hover;
  }
}
.menulist {
  width: $menuWidth;
  color: $header-fontColor;
  text-align: left;
  font-size: 14px;
  line-height: 35px;
  background: $app-color-header;
  padding-left: 15px;
  position: relative;
  font-weight: bolder;
}
.menulist::before {
  content: "";
  position: absolute;
  left: 5px;
  top: 10px;
  background: #0066ff;
  width: 6px;
  height: 14px;
  border-radius: 3px;
}
</style>
