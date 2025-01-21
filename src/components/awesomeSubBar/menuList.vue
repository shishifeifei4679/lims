<template>
  <el-menu-item v-if="item.path && !item.children" :index="item.path">
    <i class="icon-pack" :class="item.icon ? item.icon : 'el-icon-setting'"></i>
    <span slot="title">{{ item.name }}</span>
  </el-menu-item>
  <el-submenu v-else :index="item.id.toString()">
    <template slot="title">
      <i
        class="icon-pack"
        :class="item.icon ? item.icon : 'el-icon-setting'"
      ></i>

      <span slot="title" :class="collapse ? 'disp-none' : ''">
        {{ item.name }}
      </span>
    </template>
    <template v-for="content in item.children">
      <menu-list
        v-if="content.children && content.children.length > 0"
        :item="content"
        :key="content.id"
      >
      </menu-list>
      <el-menu-item :key="content.id" v-else :index="content.path">
        {{ content.name }}
      </el-menu-item>
    </template>
  </el-submenu>
</template>

<script>
export default {
  name: "menuList",
  data() {
    return {};
  },
  props: {
    collapse: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
