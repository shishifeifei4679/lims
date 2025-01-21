<template>
  <div class="treeCompositeTable" v-loading="loading" ref="mainW">
    <el-container>
      <div>
        <div class="icon-right-drag" v-if="showDrag">
          <div class="img" @mousedown="dragStart">
          <img
            v-if="showDrag === true || showDrag == 'left'"
            class="img1"
            ref="drag"
            src="@/assets/images/icon_arr_slide_pull.png"
            alt=""
          />
          <img
            v-if="showDrag === true || showDrag == 'right'"
            ref="drag"
            class="img2"
            src="@/assets/images/icon_arr_slide_pull.png"
            alt=""
          />
        </div>
        </div>
        <div class="el-aside" :class="showLeft?'':'p-0'" ref="left">
          <el-input
            style="margin-bottom: 10px;"
            :placeholder="$t('common.filter')"
            v-model="filterText"
            clearable
          ></el-input>
          <el-scrollbar class="scrollbarTree">
            <!-- :indent="8" -->
            <el-tree
              :data="data"
              :indent="8"
              :default-expand-all="defaultExpandAll"
              ref="tree"
              highlight-current
              :expand-on-click-node="false"
              check-on-click-node
              accordion
              node-key="id"
              :current-node-key="currentKey"
              :default-expanded-keys="expandedKeys"
              @node-expand="handleNodeExpand"
              @node-collapse="handleNodeCollapse"
              @node-click="handleNodeClick"
              :filter-node-method="filterNode"
              v-bind="$attrs"
              v-on="$listeners"
            >
              <template slot-scope="{ node, data }">
                <slot :data="{ node, data }">
                  <span class="df-span">{{ node.label }}</span>
                </slot>
              </template>
            </el-tree>
          </el-scrollbar>
        </div>
     
      </div>
      <el-main class="main-pack">
        <ele-page
          v-bind="$attrs"
          v-on="$listeners"
          ref="treeCompositeTable"
          :beforeAjax="beforeAjax"
          @handleReset="handleReset"
        ></ele-page>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "tree-composite-table",
  inheritAttrs: false,
  props: {
    //是否显示拖拽
    showDrag: {
      type: Boolean,
      default: true,
    },
    leftWidth: {
      type: String,
      default: "200px",
    },
    defaultSelection: {
      type: Boolean,
      default: false,
    },
    //树形结构API
    treeApi: Function,
    //树形接口请求参数
    treeParams: {
      type: Object,
      default: () => ({}),
    },
    //树形数据转化
    tranformTreeData: Function,
    //查询子节点请求参数
    getParamsFromNode: {
      type: [Object, Function],
      default: () => {
        return {
          column: [],
        };
      },
    },
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      filterText: "",
      data: [],
      currentData: {}, //当前node数据
      requestParams: {}, //当前请求参数集合
      currentKey: null, //当前选中Id
      expandedKeys: [], //展开的ID
      loading: false,
      showLeft: true,
      mainW: 0,
      startX: 0,
      offsetX: 0,
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getTreeData(false, (data) => {
      if (this.defaultSelection) {
        this.currentKey = data[0]?.id;
        this.currentData = data[0];
        this.getChildrenParams(data[0]);
        this.$refs["tree"].setCurrentKey(this.currentKey);
        this.$refs.treeCompositeTable.refresh(false);
      }
    });
  },
  mounted() {
    this.$refs.left.style.width = "" + this.leftWidth;
    this.mainW = this.$refs.mainW.offsetWidth;
  },
  methods: {
    // 树节点展开
    handleNodeExpand(data) {
      // 保存当前展开的节点
      let flag = false;
      this.expandedKeys.some((item) => {
        if (item === data.id) {
          // 判断当前节点是否存在， 存在不做处理
          flag = true;
          return true;
        }
      });
      if (!flag) {
        // 不存在则存到数组里
        this.expandedKeys.push(data.id);
      }
    },
    // 树节点关闭
    handleNodeCollapse(data) {
      // 删除当前关闭的节点
      this.expandedKeys.some((item, i) => {
        if (item === data.id) {
          this.expandedKeys.splice(i, 1);
        }
      });
      this.removeChildrenIds(data); // 这里主要针对多级树状结构，当关闭父节点时，递归删除父节点下的所有子节点
    },
    // 删除树子节点
    removeChildrenIds(data) {
      const ts = this;
      if (data.children) {
        data.children.forEach(function (item) {
          const index = ts.expandedKeys.indexOf(item.id);
          if (index > 0) {
            ts.expandedKeys.splice(index, 1);
          }
          ts.removeChildrenIds(item);
        });
      }
    },
    //筛选过滤
    filterNode(value, data) {
      const { props } = this.$attrs;
      if (!value) return true;
      const label = props && props.label ? props.label : "label";
      return data[label].indexOf(value) !== -1;
    },
    //获取属性数据 bool :false:大刷, true:保存当前展开
    getTreeData(bool = false, callback) {
      if (!this.treeApi) {
        console.warn("请传入获取树形数据的API（treeApi）");
        return;
      }
      this.loading = true;
      this.treeApi(this.treeParams)
        .then((res) => {
          const data = this.tranformTreeData
            ? this.tranformTreeData(res)
            : res.data.result || [];
          this.data = data;
          if (!bool) {
            this.expandedKeys = [data[0]?.id];
          }
          this.$nextTick(() => {
            this.$refs["tree"].setCurrentKey(this.currentKey);
            this.$refs.tree.filter(this.filterText);
          });

          callback ? callback(data) : "";
        })
        .finally((res) => {
          this.loading = false;
        });
    },
    //节点选择事件
    handleNodeClick(data, node, self) {
      this.currentData = data;
      this.currentKey = data["id"];
      this.$emit("node-select-before", { data, node, self });
      this.getChildrenParams(data);
      this.$refs.treeCompositeTable.refresh(true);
      this.$emit("node-select", { data, node, self });
    },
    //获取子节点请求参数
    getChildrenParams(data) {
      // 判断getParamsFromNode是否是函数，如果是函数进行执行
      if (typeof this.getParamsFromNode === "function") {
        this.requestParams = this.getParamsFromNode(data);
      } else {
        const { column, ...reset } = this.getParamsFromNode; //getParamsFromNode
        const params = {};
        column.forEach(({ value, key }) => {
          const index = key ? key : value;
          params[index] = data[value];
        });
        this.requestParams = { ...params, ...reset };
      }
    },
    //请求表格之前的请求参数处理
    beforeAjax(params) {
      const data = { ...params, ...this.requestParams };
      return data;
    },
    handleReset() {
      this.refresh(true);
    },
    //刷新树状数据，以及当前节点的详情
    /*
      @params  isReset 是否重新刷新
    */
    refresh(isReset = false) {
      if (isReset) {
        // this.currentData = {};
        // this.requestParams = {};
        // this.currentKey = null;
        // this.expandedKeys = [];
        this.$emit("node-select", {});
        this.getTreeData(true);
      }
      this.$refs.treeCompositeTable.refresh(true);
    },
    dragStart(event) {
      // 获取元素初始位置和鼠标按下时的坐标
      this.startX = event.clientX;
      this.offsetX = event.currentTarget.offsetLeft;
      // 绑定mousemove事件
      document.addEventListener("mousemove", this.dragging);
      document.addEventListener("mouseup", this.dragEnd);
      event.preventDefault();
    },
    dragging(event) {
      // 计算鼠标移动了多少距离
      const deltaX = event.clientX - this.startX;
      // 更新元素的位置
      const newLeft = this.offsetX + deltaX;
      let w = newLeft < 0 ? 0 : newLeft;
      w = newLeft > this.mainW ? this.mainW : w;
      if (w) {
        this.showLeft = true;
      } else {
        this.showLeft = false;
      }
       this.$refs.left.style.width = w + "px";
      // this.selfLeftWidth = w + "px";
      event.preventDefault();
    },
    dragEnd(event) {
      event.preventDefault();
      // 解除mousemove事件
      document.removeEventListener("mousemove", this.dragging, false);
      document.removeEventListener("mouseup", this.dragEnd, false);
      // draggingBool = false;
      // setTimeout(() => {
      //   draggingBool = true;
      // }, 500);
      event.preventDefault();
    },
  },
};
</script>

<style lang="scss" scoped>
.treeCompositeTable {
  //background-color: #eff2fb;
  padding: 0;
  //margin: -10px;
  min-height: calc(100vh - 112px);
  .p-0{
    padding: 0px !important;
  }
  .icon-right-drag {
    position: relative;
    .img {
      position: absolute;
      right: -7px;
      width: 12px;
      top: calc(calc(50vh - 136px));
      cursor: col-resize;
      transform: rotate(180deg);
      z-index: 3;
      display: flex;
      .img1 {
        transform: rotate(180deg);
        position: relative;
        top: 0;
      }
      .img2 {
        transform: rotate(0deg);
        left: -10px;
        top: 0;
        position: relative;
      }
    }
  }
  .el-main {
    padding: 10px;
    padding-top: 0;
  }
  .df-span {
    font-size: 14px;
  }
  .el-aside {
    background-color: #ffffff;
    padding: 10px;
    min-height: calc(100vh - 112px);
    border-right: 1px solid #E5E5E5;
  }
  .scrollbarTree {
    height: calc(100vh - 180px);
    box-sizing: border-box;
    background-color: #ffffff;
    /deep/ .el-tree-node > .el-tree-node__children {
      overflow: inherit;
    }
  }

  .main-pack {
    width: calc(100vw - 365px);
    //height: calc(100vh - 122px);
    margin-left: 10px;
    background-color: white;
    padding: 10px;
    padding-bottom: 0;
  }
}
</style>
