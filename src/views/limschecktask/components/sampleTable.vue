<template>
  <div style="margin-top: 2%">
    <div class="tableTop">
      <span>{{ categoryName }}</span>
      <!--      :disabled="erpCode === ''"-->
      <el-button
        type="primary"
        plain
        size="small"
        icon="el-icon-plus"
        @click="addSample"
        v-if="modelType !== 'view' && modelType !== 'audit'"
      >
        {{ $i18n.t("checkTask.addSample") }}
      </el-button>
    </div>
    <el-table v-loading="loading" :data="sampleList" border max-height="200px">
      <el-table-column
        :label="$i18n.t('common.order')"
        type="index"
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ indexMethod(scope.$index) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$i18n.t('checkTask.category')"
        prop="categoryName"
        min-width="100"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column min-width="100" align="center" show-overflow-tooltip>
        <template slot="header" slot-scope="scope">
          <span class="requiredStar">*</span>{{ $i18n.t("checkTask.code") }}
        </template>
        <template slot-scope="scope">
          <el-input
            :disabled="disabledType"
            v-if="modelType !== 'view' && modelType !== 'audit'"
            v-model="scope.row.sampleCode"
            :placeholder="$i18n.t('checkTask.hintInputCode')"
            @blur="checkValue(scope.row)"
          />
          <span v-else>{{ scope.row.sampleCode || "" }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100" align="center" show-overflow-tooltip>
        <template slot="header" slot-scope="scope">
          <span class="requiredStar">*</span>{{ $i18n.t("checkTask.name") }}
        </template>
        <template slot-scope="scope">
          <el-input
            v-if="modelType !== 'view' && modelType !== 'audit'"
            v-model="scope.row.sampleName"
            :placeholder="$i18n.t('checkTask.hintInputName')"
          />
          <span v-else>{{ scope.row.sampleName || "" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100" show-overflow-tooltip>
        <template slot="header" slot-scope="scope">
          <span class="requiredStar">*</span>{{ $i18n.t("checkTask.quantity") }}
        </template>
        <template slot-scope="scope">
          <el-input-number
            v-if="modelType !== 'view' && modelType !== 'audit'"
            v-model="scope.row.sampleNum"
            :min="1"
            :placeholder="$i18n.t('checkTask.hintInputQuantity')"
            style="width: 100%"
            :controls="false"
          />
          <span v-else>{{ scope.row.sampleNum || "" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100" show-overflow-tooltip>
        <template slot="header" slot-scope="scope">
          <span class="requiredStar">*</span>{{ $i18n.t("checkTask.model") }}
        </template>
        <template slot-scope="scope">
          <el-input
            v-if="modelType !== 'view' && modelType !== 'audit'"
            v-model="scope.row.sampleModel"
            :placeholder="$i18n.t('checkTask.hintInputModel')"
          />
          <span v-else>{{ scope.row.sampleModel || "" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100" show-overflow-tooltip>
        <template slot="header" slot-scope="scope">
          <span class="requiredStar">*</span>{{ $i18n.t("checkTask.unit") }}
        </template>
        <template slot-scope="scope">
          <el-select
            v-if="modelType !== 'view' && modelType !== 'audit'"
            v-model="scope.row.unitCode"
            :placeholder="$i18n.t('checkTask.hintInputUnit')"
            @change="(val) => selectChange(val, 'unit', unitDic, scope.row)"
            filterable
            clearable
          >
            <el-option
              v-for="item in unitDic"
              :key="item.value"
              :value="item.value"
              :label="item.description"
            ></el-option>
          </el-select>
          <span v-else>{{ scope.row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in fieldVOList"
        :key="item.code"
        :label="item.name"
        :prop="item.code"
        align="center"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-input
            v-if="modelType !== 'view' && modelType !== 'audit'"
            v-model="scope.row[item.code]"
            :placeholder="$i18n.t('common.input') + item.name"
          />
          <span v-else>{{ scope.row[item.code] || "" }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column-->
      <!--        label="状态"-->
      <!--        align="center"-->
      <!--        prop="status"-->
      <!--        v-if="modelType === 'view'"-->
      <!--        min-width="100"-->
      <!--      >-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ sampleStatus(scope.row.status) }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column
        :label="$i18n.t('checkTask.operation')"
        align="center"
        min-width="80"
        fixed="right"
        v-if="modelType !== 'view' && modelType !== 'audit'"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click.native.prevent="deleteSample(scope.$index, sampleList)"
            >{{ $i18n.t("checkTask.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getUnitDictList, getBaseCodeStrategy } from "@/api/common";

export default {
  name: "sampleTable",
  props: {
    categoryName: {
      type: String,
      default: "",
    },
    categoryCode: {
      type: String,
      default: "",
    },
    fieldVOList: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
      required: true,
    },
    modelType: {
      type: String,
      default: "add",
      required: true,
    },
    erpCode: {
      type: String,
      default: "",
      required: true,
    },
  },
  data() {
    return {
      disabledType: false,
      codeStrategy: "",
      // 遮罩层
      loading: false,
      // 样品列表信息
      sampleList: [],
      // 单位字典
      unitDic: [],
    };
  },
  watch: {
    modelType: {
      async handler(val) {
        await this.getBaseCodeStrategy();
        if (val === "add") {
          this.sampleList = [];
        } else {
          this.$nextTick(() => {
            this.sampleList = this.data
              .filter((i) => i.categoryName === this.categoryName)
              .map((i) => {
                return {
                  ...i,
                  ...JSON.parse(i.sampleJson ?? "{}"),
                  codeStrategy: this.codeStrategy,
                };
              });
          });
        }
      },
      immediate: true,
    },
  },
  async created() {
    await this.getDic();
  },
  methods: {
    async getBaseCodeStrategy() {
      const res = await getBaseCodeStrategy({
        code: "limssample",
        system: "default",
        strategyStatus: "1",
      });
      const result = res.data.result;
      this.codeStrategy =
        Array.isArray(result) && result.length > 0 ? result[0].code : "";
      this.disabledType = true;
    },
    // 自定义序号
    indexMethod(index) {
      if (index + 1 >= 1 && index + 1 <= 9) {
        return `0${index + 1}`;
      } else {
        return index + 1;
      }
    },
    // 添加样品信息
    addSample() {
      this.sampleList.push({
        codeStrategy: this.codeStrategy,
        sampleCategory: this.categoryCode,
        categoryName: this.categoryName,
      });
    },
    // 删除样品信息
    deleteSample(index, rows) {
      // if (rows.length === 1) {
      //   this.$message.warning(`请至少添加一条${this.categoryName}样品信息！`);
      // } else {
      //
      // }
      rows.splice(index, 1);
    },
    // 下拉选择事件
    selectChange(val, label, dic, row) {
      const filter = dic.filter((i) => i.value === val);
      row[label] = filter.length ? filter[0].description : "";
    },
    // 检测输入编码格式校验
    checkValue(row) {
      const reg = /^[a-zA-Z0-9]*$/;
      if (!reg.test(row.sampleCode)) {
        row.sampleCode = "";
        return this.$message.warning($i18n.t("checkTask.theLettersNumerals"));
      }
    },
    // 处理状态值回显
    sampleStatus(status) {
      return "111111";
    },
    async getDic() {
      this.unitDic = (await getUnitDictList()).data.result || [];
    },
  },
};
</script>

<style scoped lang="scss">
.tableTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1%;
}
.requiredStar {
  color: red;
}
</style>
