<!-- 穿梭table 选择系统建模 -->
<template>
  <div class="treeTable">
    <el-dialog
      :title="$i18n.t('baseRegionModeling.title1')"
      :visible.sync="dialogVisible"
      width="82%"
      :before-close="() => (dialogVisible = false)"
      :destroy-on-close="true"
    >
      <div class="table">
        <div class="left">
          <el-input
            clearable
            class="w-60 tit"
            v-model="search"
            :placeholder="$i18n.t('baseRegionModeling.placeholder1')"
            @input="searchTreeTable"
          ></el-input>

          <!--  leftTableData.filter(
                (data) => !search || data.modelingCode.includes(search)
              ) -->
          <el-table :key="time"
            :data="newLeftTableData"
            style="width: 100%;"
            row-key="modelingCode"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            border
            height="400px"
            :default-expand-all="isExpandAll"
            :expand-row-keys="expandRowKeysList"
            @expand-change="expandChange"
          >
            <el-table-column
              align="center"
              label=""
              prop="caizuo"
              width="50"
              type=""
            >
              <template slot-scope="scope">
                <el-checkbox
                  @change="(val) => checkChange(val, scope.row)"
                  v-model="scope.row.checkbox"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$i18n.t('common.order')"
              type="index"
              width="70"
            ></el-table-column>
            <el-table-column
              :label="$i18n.t('baseRegionModeling.modelingCode')"
              min-width="100"
              prop="modelingCode"
              header-align="center"
            ></el-table-column>
            <el-table-column
              align="center"
              :label="$i18n.t('baseRegionModeling.modelingName')"
              prop="modelingName"
            ></el-table-column>
            <el-table-column
              width="100"
              align="center"
              :label="$i18n.t('baseRegionModeling.leval')"
              prop="date"
            >
              <template slot-scope="{ row }">
                <p>{{ getName(row) }}</p>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="right">
          <h3 class="tit">{{ $i18n.t("baseRegionModeling.title2") }}</h3>
          <el-table
            :data="rightTableData"
            style="width: 100%;"
            border
            height="400px"
          >
            <el-table-column
              align="center"
              :label="$i18n.t('common.order')"
              width="70"
              type="index"
            ></el-table-column>
            <el-table-column
              :label="$i18n.t('baseRegionModeling.modelingCode')"
              prop="modelingCode"
              min-width="60"
              align="center"
            ></el-table-column>
            <el-table-column
              align="center"
              :label="$i18n.t('baseRegionModeling.modelingName')"
              prop="modelingName"
            ></el-table-column>
            <el-table-column
              align="center"
              :label="$i18n.t('common.operation')"
              width="100"
              class-name="p-0"
            >
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, scope.row)"
                  size="mini"
                  type="text"
                  style="color: #f56c6c;"
                >
                  {{ $i18n.t("common.delete") }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ $i18n.t("common.cancel") }}
        </el-button>
        <el-button type="primary" @click="save()">
          {{ $i18n.t("common.ok") }}
        </el-button>
      </span>
    </el-dialog>
    <treeTable ref="treeTable" @change="treeTable" />
  </div>
</template>
<script>
//例如：import 《组件名称》 from '《组件路径》';
import { getModelingTree } from "@/api/baseRegionModeling";
import { getDict } from "@/api/common";
export default {
  name: "",
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {time:1,
      dialogVisible: false,
      isExpandAll: false,
      expandRowKeysList: [], //目前展开的列
      modelinglList: [], //工厂模型
      search: "", //左侧搜索
      leftTableData: [], //左侧表格内容
      newLeftTableData: [],
      rightTableData: [],
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    // 记录展开信息
    expandChange(data, bool) {
      // if (bool) {
      //   this.expandRowKeysList.push(data.modelingCode + "");
      // } else {
      //   let index = this.expandRowKeysList.findIndex(ite => ite.modelingCode == data.modelingCode);
      //   this.expandRowKeysList.splice(index,1)
      // }
    },
    async show(list) {
      this.search = "";
      this.rightTableData = JSON.parse(JSON.stringify(list));
      await this.init();
      this.isExpandAll = false;
      this.dialogVisible = true;
      this.time = Date.now()
      //this.leftTableData
    },
    async init() {
      // 获取级别
      await this.modelingLevelList();
      let res = await getModelingTree();
      this.leftTableData = res.data.result;
      this.newLeftTableData = this.leftTableData;
      let list = res.data.result;
      // 展开对应层级
      this.expandRowKeysList = [];
      list.map((ite) => {
        this.expandRowKeysList.push(ite.modelingCode + "");
      });
      //end
      //   初始化,根据右侧数据勾选左侧
      this.setCheckChildren(list);
    },
    // 同步左侧两个参数list
    setCheckList(type, bool, modelingCode) {
      const _this = this;
      let list = type == 1 ? this.leftTableData : this.newLeftTableData;
      checkChildren(list);
      function checkChildren(arr) {
        for (let i = 0; i < arr.length; i++) {
          let ite = arr[i];
          if (modelingCode == ite.modelingCode) {
            _this.$set(ite, "checkbox", bool);
            return;
          }
          if (ite.children) {
            checkChildren(ite.children);
          }
        }
      }
    },

    searchTreeTable(val) {
      if (val) {
        this.isExpandAll = true;
      } else {
        this.isExpandAll = false;
      }
      val = [val];
      let treeData = this.leftTableData;
      function filterRecursive(node, parentIncluded) {
        // 如果节点是数组，则对每个元素应用过滤逻辑
        if (Array.isArray(node)) {
          const filteredArray = node.map((child) =>
            filterRecursive(child, parentIncluded)
          );

          return filteredArray.filter((child) => child !== null);
        }

        // 检查当前节点的值是否包含任何过滤值
        const valueContainsFilter = val.some((filter) =>
          (node.modelingCode + node.modelingName).includes(filter)
        );
        const includeNode = parentIncluded || valueContainsFilter;

        const filteredChildren = node.children
          ? filterRecursive(node.children, includeNode)
          : [];

        return includeNode || filteredChildren.length > 0
          ? { ...node, children: filteredChildren }
          : null;
      }

      const filteredTree = filterRecursive(treeData, false);

      const cleanFilteredTree = JSON.parse(JSON.stringify(filteredTree));

      this.newLeftTableData = cleanFilteredTree;
      //   return cleanFilteredTree;
    },
    // 获取类型名称
    getName({ level, modelingType }) {
      let name = "";
      if (!this.modelinglList.length) return;

      let obj = this.modelinglList.find((ite) => ite.value == level);
      name = obj.description;
      if (level == 4) {
        name =
          modelingType == 1
            ? this.$i18n.t("baseRegionModeling.warehouse")
            : this.$i18n.t("baseRegionModeling.workshop");
      }
      return name;
    },
    async modelingLevelList() {
      const list = await getDict("factory_modeling_level");
      this.modelinglList = list.data.result;
    },
    //右侧表格删除
    deleteRow(index, row) {
      let { modelingCode } = row;
      const _this = this;
      checkChildren(this.leftTableData);
      function checkChildren(list) {
        for (let i = 0; i < list.length; i++) {
          let ite = list[i];
          //与左侧多选 联动
          if (ite.modelingCode == modelingCode) {
            _this.$set(ite, "checkbox", false);
            _this.setCheckList(0, false, modelingCode);
            _this.rightTableData.splice(index, 1);
            return;
          } else {
            if (ite.children) {
              checkChildren(ite.children);
            }
          }
        }
      }
    },
    //根据右侧数据,左侧勾选 初始化使用
    setCheckChildren(list) {
      for (let i = 0; i < list.length; i++) {
        let ite = list[i];
        let bool = this.rightTableData.some((item) => {
          let c = item.modelingCode == ite.modelingCode;
          if (c) {
            item.parentId = ite.parentId;
            // item.parentName = ite.modelingName;
            item.level = ite.level;
            item.modelingType = ite.modelingType;
          }

          return c;
        });
        if (bool) {
          this.$set(ite, "checkbox", true);
        } else {
          this.$set(ite, "checkbox", false);
        }
        if (ite.children) {
          this.setCheckChildren(ite.children);
        }
      }
    },
    //多选时找上下级关系,提醒
    checkChange(val, row) {
      //modelingCode 右侧与左侧相关联字段,重要,根据后端返回实际字段修改*****
      let { modelingCode, checkbox, parentId } = row;
      val = checkbox;
      //   console.log(val, "进change了");
      this.setCheckList(1, val, modelingCode);
      this.$nextTick(() => {
        //取消选择
        if (!val) {
          // 查看右侧是否有数据,
          let index = this.rightTableData.findIndex(
            (ite) => ite.modelingCode == modelingCode
          );
          if (index != -1) {
            //   this.deleteRow(index);
            //   删除右侧
            this.rightTableData.splice(index, 1);
          }
        } else {
          //选择校验  不可选择同分支树
          let check1 = {}; //当前选中的对象
          let check2 = {}; //已经选中的父级节点
          let check3 = {}; //已经选中的节点

          let { modelingCode: m, checkbox: b } = this.leftTableData[0];
          if (b && modelingCode != m) {
            this.$message.error(this.$i18n.t("baseRegionModeling.msg1"));
            this.$set(row, "checkbox", false);
            this.setCheckList(1, false, modelingCode);
          } else {
            check3 = this.rightTableData.find((item) => {
              return parentId != item.parentId;
            });
            if (check3) {
              this.$set(row, "checkbox", false);
              this.setCheckList(1, false, modelingCode);
              let modeling = this.getModeling(check3.parentId);
              let str = `${$i18n.t("baseRegionModeling.selectedAlready")}${modeling.modelingName}(${
                modeling.modelingCode
              })${$i18n.t("baseRegionModeling.msg3")}${this.getName(check3)},${$i18n.t("baseRegionModeling.onlySelectable")}${
                modeling.modelingName
              }${$i18n.t("baseRegionModeling.msg4")}${this.getName(check3)}`;
              this.$message.error(str);
            } else {
              this.rightTableData.push({
                ...row,
              });
            }
          }
          // 后续可能需要这一块逻辑
          //   let treeShip = this.extractPossibilities(this.leftTableData);
          //   // 是否往右侧追加, 默认可追加
          //   let isAdd = true;
          //   for (let i = 0; i < treeShip.length; i++) {
          //     const ite = treeShip[i];
          //     let list = ite.filter((item) => item.checkbox);
          //     // 说明同分支树,出现了多个勾选
          //     if (list.length > 1) {
          //       let check1 = {}; //当前选中的对象
          //       let check2 = {}; //已经选中的父级节点
          //       let check3 = {}; //已经选中的节点
          //       //父级节点对象
          //       //   let parentIndex = null;
          //       list.map((items, indexs) => {
          //         if (items.modelingCode == modelingCode) {
          //           check1 = items;
          //         } else {
          //           //最靠近,当前选中的亲戚
          //           //   parentIndex =
          //           check3 = items;
          //           let j = ite.findIndex(
          //             (itemst) => itemst.modelingCode == items.modelingCode
          //           );
          //           check2 = ite[j - 1];
          //         }
          //       });
          //       if (check1.modelingCode && check1.parentId != check2.parentId) {
          //         this.$nextTick(() => {
          //           this.$set(row, "checkbox", false);
          //           this.setCheckList(1, false, modelingCode);
          //           // 获取工厂
          //           let { modelingCode: m, checkbox: b } = this.leftTableData[0];
          //           if (b && modelingCode != m) {
          //             this.$message.error(
          //               this.$i18n.t("baseRegionModeling.msg1")
          //             );
          //           } else {
          //             let str = `已经选择${check2.modelingName}(${
          //               check2.modelingCode
          //             })的${this.getName(check3)},只可选择${
          //               check2.modelingName
          //             }下的${this.getName(check3)}`;
          //             this.$message.error(str);
          //           }
          //         });
          //         return;
          //       }
          //     } else {
          //     }
          //   }
          //   if (isAdd) {
          //     this.rightTableData.push({
          //       ...row,
          //       // modelingCode: row.modelingCode,
          //     });
          //   }
        }
      });
    },
    getModeling(id) {
      let obj = null;
      checkChildren(this.leftTableData);
      function checkChildren(arr) {
        for (let i = 0; i < arr.length; i++) {
          let ite = arr[i];
          if (id == ite.id) {
            obj = ite;
            return;
          }
          if (ite.children) {
            checkChildren(ite.children);
          }
        }
      }
      return obj;
    },
    //// 存储可能性的数组
    extractPossibilities(data) {
      var possibilities = [];
      // 递归函数来遍历数据
      function traverse(obj, currentPossibility) {
        // 将当前对象的 id 和 name 加入当前可能性数组
        currentPossibility.push({
          modelingCode: obj.modelingCode,
          modelingName: obj.modelingName,
          checkbox: obj.checkbox,
          level: obj.level,
          parentId: obj.parentId,
          modelingType: obj.modelingType,
        });
        // 如果当前对象没有 children 属性，则将当前可能性数组加入可能性数组
        if (!obj.hasOwnProperty("children") || !Array.isArray(obj.children)) {
          possibilities.push(currentPossibility.slice()); // 使用 slice() 复制数组
        } else {
          // 如果当前对象有 children 属性，则递归遍历每个子对象
          obj.children.forEach(function (child) {
            traverse(child, currentPossibility);
          });
        }
        currentPossibility.pop();
      }

      // 调用递归函数开始遍历数据
      data.forEach(function (item) {
        traverse(item, []);
      });
      console.log(1111, possibilities);
      // 返回可能性数组
      return possibilities;
    },
    //查看父级节点
    getParent() {},
    // 确认按钮
    save() {
      this.$emit("change", this.rightTableData);
      this.dialogVisible = false;
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.init();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped lang="scss">
.treeTable {
  .table {
    display: flex;
  }
  .tit {
    height: 42px;
  }
  .left {
    flex: 1;
  }
  .right {
    flex: 1;
    margin-left: 20px;
  }

  .w-50 {
    width: 50%;
  }
  .w-60 {
    width: 60%;
  }
  /deep/.p-0 {
    padding: 0px !important;
  }
}
</style>
