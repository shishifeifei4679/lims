<template>
  <div class="ele-tabs-table" v-if="config">
    <ele-form-search
      :formConfig="formConfig"
      :initForm="initForm"
      ref="formSearch"
      @handleSearch="searchTable"
      @handleReset="searchTable"
    />
    <el-tabs
      v-model="activeName"
      v-on="$listeners"
      v-bind="$attrs"
      @tab-click="handleClickTab"
    >
      <el-tab-pane
        v-for="(item, index) in config"
        :key="index"
        :label="item.title || 'tabs'"
        :name="index.toString()"
      >
        <ele-table
          v-if="item.attrs"
          v-bind="item.attrs"
          v-on="item.on || {}"
          :ref="'paneTable' + index"
          :beforeRequest="(data) => beforeRequest(data, item.fixParams)"
          @handleOperateEvent="handleOperateEvent"
        ></ele-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import eleFormSearch from '@/components/ele-form-search/index'
import { searchArrKey } from '@/mixins/searchArrKey'
import { exportExcel } from '@/utils/judge'
export default {
  components: {
    eleFormSearch
  },
  mixins: [searchArrKey],
  inheritAttrs: false,
  name: 'eleTabsTable',
  props: {
    config: Array,
    formConfig: {
      type: Object,
      default: () => ({})
    },
    initForm: {
      type: Object,
      default: () => ({})
    },
    // 点击tab时是否刷新请求
    isRefreshCurrentTab: {
      type: Boolean,
      default: false
    },
    // 默认选中当前的Tab
    activIndex: {
      type: [String, Number],
      default: '0'
    }
  },
  data () {
    return {
      activeName: '0'
    }
  },
  watch: {
    activIndex: {
      handler (val) {
        this.activeName = val.toString()
      },
      immediate: true
    }
  },
  methods: {
    getSearchParams () {
      let formData = this.$refs.formSearch.formData
      formData = this.getArrtoMap(formData)
      return formData
    },
    beforeRequest (data, fixParams = {}) {
      return { ...data, ...fixParams, ...this.getSearchParams() }
    },
    // 重新请求当前Tab
    searchTable (isReset = true) {
      const [paneTable] = this.$refs['paneTable' + this.activeName]
      paneTable && paneTable.getTableData(isReset)
    },
    // 点击Tab事件
    handleClickTab () {
      this.isRefreshCurrentTab && this.searchTable()
    },
    // 清空查询条件
    handleReset () {
      this.$refs.formSearch.handleReset()
    },
    handleOperateEvent (data) {
      if (data.handleName === 'export' && data.url) {
        exportExcel(data.url, this.getSearchParams())
      }
    }
  }
}
</script>
<style lang="scss" scoped></style>
