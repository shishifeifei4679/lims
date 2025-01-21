<!--  -->
<template>
  <div
    class="recordMeasuringInstruments" ref="mainW"
  >
    <div> 
      <div class="icon-right-drag">
        <div class="img" @mousedown="dragStart">
          <img
            class="img1"
            ref="drag"
            src="@/assets/images/icon_arr_slide_pull.png"
            alt=""
          />
          <img
            ref="drag"
            class="img2"
            src="@/assets/images/icon_arr_slide_pull.png"
            alt=""
          />
        </div>
      </div>
      <div style="overflow: hidden;" class="left"   :class="showLeft ? '' : 'p-0'"
      ref="left">
        <div class="tit">
          <img src="./img/icon_dept_20.png" alt="" />
          <span>{{ $t("recordMeasuringInstruments.department") }}</span>
        </div>
        <div class="btn-pack">
          <!-- <div
            class="item-pack"
            @click="operateEnable(6)"
            v-btnAuths="'auth:operlog:operateDeactivate'"
          >
            <div>
              <img src="./img/icon_btn_del_color.png" alt="" />
            </div>
            <p class="color3">{{ $t("common.delete") }}</p>
          </div> -->
          <div
            class="item-pack"
            @click="operateEnable(1)"
            v-btnAuths="'auth:operlog:operateEnable'"
          >
            <div>
              <img src="./img/icon_btn_start_color.png" alt="" />
            </div>
            <p class="color1">{{ $t("recordMeasuringInstruments.start") }}</p>
          </div>
          <div
            class="item-pack"
            @click="operateEnable(4)"
            v-btnAuths="'auth:operlog:operateDeactivate'"
          >
            <div>
              <img src="./img/icon_btn_turnoff_color.png" alt="" />
            </div>
            <p class="color2">{{ $t("recordMeasuringInstruments.stop") }}</p>
          </div>

          <div
            class="item-pack"
            @click="operateEnable(2)"
            v-btnAuths="'auth:operlog:operateSealUpForSafekeeping'"
          >
            <div>
              <img src="./img/icon_btn_seal_color.png" alt="" />
            </div>
            <p class="color4">
              {{ $t("recordMeasuringInstruments.sealingUp") }}
            </p>
          </div>
          <div
            class="item-pack"
            @click="operateEnable(3)"
            v-btnAuths="'auth:operlog:operateScrap'"
          >
            <div>
              <img src="./img/icon_btn_scrap_color.png" alt="" />
            </div>
            <p class="color5">{{ $t("recordMeasuringInstruments.scrap") }}</p>
          </div>
          <div
            class="item-pack"
            @click="operateEnable(5)"
            v-btnAuths="'auth:operlog:operateLoss'"
          >
            <div>
              <img src="./img/icon_btn_lose_color.png" alt="" />
            </div>
            <p class="color6">{{ $t("recordMeasuringInstruments.lose") }}</p>
          </div>
        </div>
        <div class="tree-pack">
          <el-aside width="var(--leftWidhtInstruments)">
            <div class="tree-filter">
              <el-input
                :placeholder="$t('common.filter')"
                v-model="filterText"
                clearable
              ></el-input>
            </div>
            <el-scrollbar class="scrollbar-tree" v-loading="loadingTree">
              <!-- :current-node-key="currentKey" -->
              <el-tree
                show-checkbox
                :key="time"
                :data="treeDataSource"
                :indent="8"
                ref="tree"
                highlight-current
                :expand-on-click-node="false"
                check-on-click-node
                node-key="code"
                :default-expanded-keys="[...expandedKeys]"
                @node-click="handleNodeClick"
                :filter-node-method="filterNode"
                @node-expand="handleNodeExpand"
                @node-collapse="handleNodeCollapse"
                :props="{
                  label: 'groupName',
                  children: 'children',
                }"
              >
                <template v-slot:default="{ node, data }">
                  <div class="flex label-pack slot-t-node">
                    <span class="padd-r-5">
                      <img v-if="data.children" src="@/assets/images/xia.png" />
                      <template v-else>
                        <img src="@/assets/images/ping.png" />
                        <img
                          v-if="data.measuringToolsFlag == 1"
                          src="./img/icon_gauge.png"
                        />
                      </template>
                    </span>
                    <div>
                      <div class="padd-r-6 flex-y-c">
                        <span :title="data.label">
                          {{ data.label }}
                        </span>
                        <el-tag
                          class="m-l-4"
                          v-if="data.measuringToolsFlag == 1"
                          :type="statusObj[data.status]"
                        >
                          {{ data.statusName }}
                        </el-tag>
                      </div>
                    </div>
                  </div>
                </template>
              </el-tree>
            </el-scrollbar>
          </el-aside>
        </div>
      </div>
    
    </div>
    <div class="right" ref="rightw">
      <Right
        ref="right"
        v-if="currentData && currentData.measuringToolsFlag == 1"
      ></Right>
      <el-empty v-else></el-empty>
    </div>

    <!-- 启用、{{ $t('common.stop') }}、{{ $t('recordMeasuringInstruments.sealingUp') }}、{{ $t('recordMeasuringInstruments.scrap') }}、{{ $t('recordMeasuringInstruments.lose') }} 共用表单 -->
    <ele-form-drawer
      class="dialog-pack"
      size="65%"
      v-loading="loadingTabel"
      :isLoading="isLoading"
      v-model="operateFormDataDialog"
      v-bind="operateFormDescDialog"
      :request-fn="operateHandleSubmit"
      :visible.sync="operateVisible"
      :title="title"
    ></ele-form-drawer>

    <!-- 量检具 选择弹出列表 -->
    <ele-dialog-table
      :title="$t('recordMeasuringInstruments.selectMeasuringTools')"
      width="50%"
      ref="dialogMeasuringTools"
      :visible.sync="measuringToolsVisible"
      :formConfig="measuringToolsSearchDialog"
      :column="measuringToolsDialogColumn"
      @getSelectData="setSelectMeasuringTools"
      :getList="getMeasuringToolsList"
      :hasFooter="measuringToolsHasFooter"
    ></ele-dialog-table>
  </div>
</template>

<script>
//例如：import 《组件名称》 from '《组件路径》';
import Right from "./components/right.vue";
import { measuringToolsDialog } from "./mixinMeasuringTools";
import {
  treeList,
  commonMeasuringToolsLedgerList,
  applyOperate,
  deleteRelate,
} from "@/api/limsmeasuringtools/measuringtoolsoperate.js";
let draggingBool = true;
export default {
  name: "recordMeasuringInstruments",
  //import引入的组件需要注入到对象中才能使用
  components: { Right },
  mixins: [measuringToolsDialog],

  data() {
    const _this = this;
    //这里存放数据
    return {
      time:1111,
      leftWidhtInstruments: 280,
      // 拖拽相关
      startX: 0,
      offsetX: 0,
      isLoading: false,
      loadingTabel: false,
      loadingTree: false,
      operateFormDataDialog: {},
      title: "",
      operateVisible: false,
      // 启用、停用、封存、报废、丢失 共用表单
      operateFormDescDialog: {
        span: 24,
        disabled: false,
        isShowSubmitBtn: true,
        formDesc: {
          detailList: {
            type: "table-editor",
            label: "",
            layout: 24,
            required: false,
            attrs: {
              // 上方,按钮,render

              isShowAdd: false,
              isShowDelete: true,
              columns: [
                {
                  // el-table-column 的属性
                  type: "index",
                  align: "center",
                  label: $i18n.t("common.order"),
                  width: 66,
                  fixed: "left",
                },
                {
                  // el-table-column 的属性
                  prop: "measuringToolCode",
                  align: "center",
                  label: $i18n.t(
                    "recordMeasuringInstruments.measuringToolCode"
                  ), // 量检具编码
                  minWidth: 190,
                },
                {
                  prop: "measuringToolName",
                  align: "center",
                  label: $i18n.t(
                    "recordMeasuringInstruments.measuringToolName"
                  ), // 量检具名称
                  showOverflowTooltip: true,
                  minWidth: 200,
                },
                {
                  prop: "departmentName",
                  align: "center",
                  label: $i18n.t("recordMeasuringInstruments.departmentCode"), // 类型编码
                  showOverflowTooltip: true,
                  minWidth: 180,
                },
                {
                  prop: "measuringToolsTypeName",
                  align: "center",
                  label: $i18n.t(
                    "recordMeasuringInstruments.measuringToolsTypeCode"
                  ), // 量检具名称
                  showOverflowTooltip: true,
                  minWidth: 175,
                },
                {
                  prop: "measuringToolSpecification",
                  align: "center",
                  label: $i18n.t(
                    "recordMeasuringInstruments.measuringToolSpecification"
                  ), // 规格型号
                  showOverflowTooltip: true,
                  minWidth: 195,
                },
                {
                  prop: "statusName",
                  align: "center",
                  label: $i18n.t("recordMeasuringInstruments.status"), // 检定状态
                  showOverflowTooltip: true,
                  minWidth: 120,
                },
              ],
            },
          },
          // operateType: {
          //   type: "input",
          //   // attrs: {
          //   //   type: "hidden",
          //   // },
          // },
          operateContent: {
            type: "textarea",
            label: (data) => {
              let str = this.$t("recordMeasuringInstruments.describe");
              let obj = {
                1: this.$t("recordMeasuringInstruments.start") + str,
                4: this.$t("recordMeasuringInstruments.stop") + str,
                2: this.$t("recordMeasuringInstruments.sealingUp") + str,
                3: this.$t("recordMeasuringInstruments.scrap") + str,
                5: this.$t("recordMeasuringInstruments.lose") + str,
              };

              return obj[data.operateType];
            },
            layout: 24,
            required: true,
            vif(data) {
              let bool = data.operateType != 6;
              return bool;
            },
          },
        },
      }, //
      treeDataSource: [],
      expandedKeys: [],
      currentKey: null,
      currentData: null,
      filterText: "",
      statusObj: {
        1: "success",
        2: "",
        3: "danger",
        4: "warning",
        5: "",
      },
      nodeParentAll: [],
      mainW: 0,
      showLeft: true,
      startX: 0,
      offsetX: 0,
    };
  },
  //监听属性 类似于data概念
  computed: {},
  watch: {
    // 树形结构搜索条件
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    $route: {
      handler(val) {
        if (val.query && val.query.id) {
          this.getreeList(true, (data) => {
            let obj = this.getObjById(data, val.query.id);
            if (!obj) return;
            this.handleNodeClick(obj);
            this.$refs.tree.setCurrentKey(val.query.id);
            setTimeout(() => {
              this.getAndExpandAll(val.query.id);
            }, 200);
          });
        } else {
          this.getreeList(true, (data) => {
            let obj = this.getObjByOne(data);
            if (!obj) return;
            this.handleNodeClick(obj);
            this.$refs.tree.setCurrentKey(obj.code);
            setTimeout(() => {
              this.getAndExpandAll(obj.code);
            }, 200);
          });
        }
      },
      immediate: true,
      // 深度观察监听
      deep: true,
    },
  },
  //方法集合
  methods: {
    // 树节点展开
    handleNodeExpand(data) {
      // 保存当前展开的节点
      let flag = false;
      this.expandedKeys.some((item) => {
        if (item === data.code) {
          // 判断当前节点是否存在， 存在不做处理
          flag = true;
          return true;
        }
      });
      if (!flag) {
        // 不存在则存到数组里
        this.expandedKeys.push(data.code);
      }
    },
    // 树节点关闭
    handleNodeCollapse(data) {
      // 删除当前关闭的节点
      this.expandedKeys.some((item, i) => {
        if (item === data.code) {
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
          const index = ts.expandedKeys.indexOf(item.code);
          if (index > 0) {
            ts.expandedKeys.splice(index, 1);
          }
          ts.removeChildrenIds(item);
        });
      }
    },

    addList() {
      this.measuringToolsVisible = true;
    },
    // 获取已经选中的数据
    getCheckedNodes() {
      let list = this.$refs.tree.getCheckedNodes();
      let map = list.filter((ite) => ite.measuringToolsFlag == 1);
      let arr = map.map((ite) => ite.code);
      return arr;
    },
    //tree上方按钮
    async operateEnable(type) {
      try {
        this.loadingTabel = true;

        let arr = this.getCheckedNodes();

        if (!arr.length) {
          //至少勾选一条数据
          this.$message.warning(this.$t("recordMeasuringInstruments.msg2"));
          return;
        }
        this.operateVisible = true;
        let titobj = {
          5: this.$t("recordMeasuringInstruments.lose"),
          3: this.$t("recordMeasuringInstruments.scrap"),
          2: this.$t("recordMeasuringInstruments.sealingUp"),
          4: this.$t("recordMeasuringInstruments.stop"),
          1: this.$t("recordMeasuringInstruments.start"),
          6: this.$t("common.delete"),
        };
        this.title = titobj[type] + this.$t("recordMeasuringInstruments.apply");
        if (arr.length) {
          let res = await commonMeasuringToolsLedgerList({
            measuringToolCodeList: arr.join(),
          });
          this.operateFormDataDialog.detailList = res.data.result;
        } else {
          this.operateFormDataDialog.detailList = [];
        }
        this.$set(this.operateFormDataDialog, "operateType", type);
      } finally {
        this.loadingTabel = false;
      }
    },
    // 启用、停用、封存、报废、丢失 提交事件
    async operateHandleSubmit(data) {
      if (this.isLoading) return; // 判断状态
      this.isLoading = true;

      try {
        if (data.operateType == 6) {
          let res = await deleteRelate({
            detailList: data.detailList.map(({ measuringToolCode }) => {
              return {
                measuringToolCode,
              };
            }),
          });
          const message = res.data.message;
          this.$message.success(message || $i18n.t("common.operateSuccess")); // 操作成功
          this.visible = false;
          this.refresh(false);
          this.operateVisible = false;
        } else {
          applyOperate(data)
            .then((res) => {
              const message = res.data.message;
              this.$message.success(
                message || $i18n.t("common.operateSuccess")
              ); // 操作成功
              this.visible = false;
              this.refresh(false);
              this.operateVisible = false;
            })
            .finally(() => {
              this.isLoading = false;
            });
        }
      } catch {
        this.isLoading = false;
      }
    },
    /**
     * @description 节点点击表格关联查询
     * @param {componentCode} 业务组件 data.parentId == -1
     * @param {formCode} 业务表单 data.parentId != -1
     */
    handleNodeClick(data, node) {
      this.currentKey = data.code;
      this.currentData = data;
      if (data.measuringToolsFlag == 1) {
        console.log(22222, data);
        this.$nextTick(() => {
          this.$refs.right.init(data);
        });
      }
    },
    refresh(bool) {
      this.getreeList(bool);
    }, // 筛选过滤树结构
    filterNode(value, data) {
      if (!value) return true;
      let str = data.name;
      return str.indexOf(value) !== -1;
    },
    async getreeList(bool = true, callback) {
      try {
        this.loadingTree = true;
        let res = await treeList();
        bool ? (this.expandedKeys = [res.data.result[0].code]) : "";
        this.treeDataSource = res.data.result;
        this.$nextTick(() => {
          callback ? callback(res.data.result) : "";
        });
      } finally {
        this.loadingTree = false;
      }
    },

    getObjByOne(data) {
      const isA = Array.isArray(data);
      if (!isA) return;
      for (let i = 0, len = data.length; i < len; i++) {
        let item = data[i];
        if (item.measuringToolsFlag == 1) {
          return item;
        } else {
          if (item.children && item.children.length > 0) {
            let obj = this.getObjByOne(item.children);
            if (obj) return obj;
          }
        }
      }
    },
    getObjById(data, id) {
      const isA = Array.isArray(data);
      if (!isA) return;
      for (let i = 0, len = data.length; i < len; i++) {
        let item = data[i];
        if (item.code == id) {
          return item;
        } else {
          if (item.children && item.children.length > 0) {
            let obj = this.getObjById(item.children, id);
            if (obj) return obj;
          }
        }
      }
    },
    getAndExpandAll(nodeKey) {
      if (nodeKey) {
        this.$nextTick(() => {
          // 等待树组件渲染完成再执行相关操作
          // 获取节点
          const node = this.$refs.tree.getNode(nodeKey);
          if (node) {
            // 获取其所有父级节点
            this.getParentAll(node);
            if (this.nodeParentAll.length > 0) {
              // 将获取到的所有父级节点进行展开
              for (var i = 0, n = this.nodeParentAll.length; i < n; i++) {
                this.$refs.tree.store.nodesMap[
                  this.nodeParentAll[i].data.code
                ].expanded = true;
              }
            }

            // 将节点高亮显示
            this.$refs.tree.setCurrentKey(nodeKey);
          }
        });
      }
    },
    // 获取所有父级节点
    getParentAll(node) {
      if (node) {
        this.nodeParentAll = [];
        // 节点的第一个父级
        var parentNode = node.parent;
        // level为节点的层级 level=1 为顶级节点
        for (var j = 0, lv = node.level; j < lv; j++) {
          if (parentNode.level > 0) {
            // 将所有父级节点放入集合中
            this.nodeParentAll.push(parentNode);
          }
          // 继续获取父级节点的父级节点
          parentNode = parentNode.parent;
        }

        if (this.nodeParentAll.length > 1) {
          // 如果集合长度>1 则将数组进行倒叙.reverse() 其是就是将所有节点按照 从 顶级节点 依次往下排
          this.nodeParentAll.reverse();
        }
      }
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
      this.$refs.rightw.style.width = `calc(100% - ${w}px)`;
      event.preventDefault();
    },
    dragEnd(event) {
      event.preventDefault();
      // 解除mousemove事件
      document.removeEventListener("mousemove", this.dragging, false);
      document.removeEventListener("mouseup", this.dragEnd, false);
      event.preventDefault();
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    // this.getreeList();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.$refs.left.style.width = "280px";
    this.mainW = this.$refs.mainW.offsetWidth - 20;
    this.$refs.rightw.style.width = `calc(100% - 280px)`;
  },
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
.recordMeasuringInstruments {
  .p-0 {
    padding: 0px !important;
  }
  .icon-right-drag {
    position: relative;
    z-index: 999;
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
  display: flex;
  .m-l-4 {
    margin-left: 4px;
  }
  .left {
    // width: var(--leftWidhtInstruments);
    border-right: 1px solid #3333;
    padding: 8px 12px;
    height: calc(100vh - 150px);
    .tit {
      display: flex;
      align-items: center;
      height: 40px;
      background: #ffffff;
      border-radius: 0px 0px 0px 0px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      line-height: 0px;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
    .btn-pack {
      width: 100%;
      min-width: 280px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .item-pack {
        width: 84px;
        height: 32px;
        display: flex;
        cursor: pointer;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        font-size: 14px;
        background: #f7fafc;
        border-radius: 0px 0px 0px 0px;
        border: 1px solid #e5e5e5;
        p {
          padding-left: 4px;
        }
        .color1 {
          color: #3aae2a;
        }
        .color2 {
          color: #ff8700;
        }
        .color3 {
          color: #f56c6c;
        }
        .color4 {
          color: #3c7fcd;
        }
        .color5 {
          color: #f56c6c;
        }
        .color6 {
          color: #3c7fcd;
        }
      }

      .item-pack:hover {
        background: #ffffff;
      }
    }
    .tree-pack {
      width: 100%;
      height: calc(100vh - 290px);
      font-size: 14px;
      // 树形结构筛选框容器
      .el-aside {
        height: 100%;
      }
      .scrollbar-tree {
        padding-bottom: 10px;
        height: calc(100% - 52px);
      }
      .tree-filter {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        // 只选择当前工厂checkbox

        /deep/ .el-input__inner {
          padding-right: 10px;
        }
        .current-factory {
          flex: 0 0 120px;
          text-align: right;
          /deep/ .el-checkbox__label {
            font-size: 12px;
          }
        }
      }
      .label-pack {
        width: 100%;
        span {
          display: block;
        }

        .padd-l-5 {
          padding-left: 5px;
        }
        .padd-r-5 {
          padding-right: 5px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
  .right {
    flex: 1;
    // width: calc(100% - 28px - var(--leftWidhtInstruments));
    /deep/.xpage{
      padding-right: 20px !important
    }
  }
  .flex {
    display: flex;
  }
  .flex-y-c {
    display: flex;
    align-items: center;
  }
  .padd-r-6 {
    padding-right: 6px;
  }
  .label-pack {
    align-items: center;
  }
}
</style>
