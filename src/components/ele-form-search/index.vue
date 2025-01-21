<template>
  <div class="ele-form-search" :style="style" v-if="Object.keys(formConfig).length > 0">
    <!-- 查询表单 -->
    <ele-form v-bind="selfFormConfig" v-model="formData" v-on="$listeners" ref="searchForm">
      <template
            v-for="(slot, key) in $scopedSlots"
            :slot="key"
            slot-scope="scope"
          >
            <slot :name="key" v-bind="scope"></slot>
      </template>
      <template v-slot:form-btn>
        <el-button @click="handleSearch" type="primary" icon="el-icon-search">{{ $t("common.search") }}</el-button>
        <el-button @click="handleReset" icon="el-icon-refresh">{{ $t("common.reset") }}</el-button>
        <!-- el-icon-arrow-up -->
        <el-button type="text" v-show="isShow" @click="handleOpenOrdown">
          {{ openOrdown ? $t("common.packUp") : $t("common.expand") }}
          <i :class="[openOrdown ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i
        ></el-button>
      </template>
    </ele-form>
  </div>
</template>
<script>
const BASEHEIGHR = 48
export default {
  name: "ele-form-search",
  props: {
    formConfig: {
      type: Object,
      default: () => ({})
    },
    openDown: {
      type: Boolean,
      default: false
    },

    // 初始化时form的值
    initForm: Object,
    openHeight: Number
  },
  watch: {
    openDown: {
      handler(val) {
        this.openOrdown = val
      },
      immediate: true,
      deep: true
    },
    initForm: {
      handler(val) {
        if (!val) return
        this.formData = JSON.parse(JSON.stringify(val))
      },
      immediate: true,
      deep: true
    },
    formConfig: {
      handler(val) {
        this.getFormConfig(val)
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      formData: {},
      isShow: false,
      selfFormConfig: {},
      openOrdown: false
    }
  },
  computed: {
    style() {
      return {
        overflow: "hidden",
        height: this.openOrdown
          ? `${this.openHeight ? this.openHeight : this.getRows * BASEHEIGHR}px`
          : `${BASEHEIGHR}px`,
        transition: "height 0.5s"
      }
    },
    getRows() {
      let { formDesc = {}, column  } = this.formConfig;
      if (!column) {
        let lang = this.$store.getters.language;
        if (lang=='cn') {
          column = 4
        } else {
          column = 3
        }
      }
      const length = Object.keys(formDesc).length + 1
      const rows = Math.ceil(length / column)
      return rows
    },  // 获取当语言,方便根据字符计算列宽
    lang() {
      // 英文下,默认一个字段8个, 中文6个
      let language = this.$store.getters.language;
      return language=='cn'?6:8
   }
  },
  methods: {
    handleSearch() {
      this.$refs.searchForm
        .validate()
        .then((res) => {
          console.log("搜索通过")
          this.$emit("handleSearch")
        })
        .catch((err) => {
          console.log("校验失败", err)
        })
    },
    handleReset() {
      this.formData = {}
      this.$refs.searchForm.resetForm()
      this.$emit("handleReset")
    },
    handleOpenOrdown() {
      this.openOrdown = !this.openOrdown
      setTimeout(() => {
        this.getFormConfig(this.formConfig)
      }, 300)
    },
    getFormConfig(val) {
      let { formDesc = {}, column, ...reset } = val;
      if (!column) {
        let lang = this.$store.getters.language;
        if (lang=='cn') {
          column = 4
        } else {
          column = 3
        }
      }
      const rows = this.getRows
      if (rows > 1) {
        this.isShow = true
      }
      for (const key in formDesc) {
        formDesc[key].layout=formDesc[key].layout||this.lang
      }
      if (rows > 1 && !this.openOrdown) {
        this.isShow = true
        const entries = Object.entries(formDesc)
        const beforeThreeItems = entries.slice(0, column - 1)
        this.selfFormConfig = {
          formDesc: Object.fromEntries(beforeThreeItems),
          ...reset
        }
      } else {
        this.selfFormConfig = val
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ele-form-search {
  transition: height 0.5s;
  height: 38px;
}
</style>
