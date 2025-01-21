export const table = {
  data () {
    return {
      total: 0,
      pageSize: 10,
      pageNum: 1,
      loading: false,
      multipleSelection: []
    }
  },
  created () {
    // 某些时候 不需要页面一进来就需要请求列表，this.noRefresh == true  不需要请求列表，默认是请求的
    if (!this.noRefresh) {
      this.getList()
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageNum = 1
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getList()
    },
    handleSearch () {
      this.pageNum = 1
      this.getList()
    },
    handleRest () {
      this.pageNum = 1
      this.formData = {}
      this.getList()
    },
    handleRowClick (e) {
      const rowIndex = this.multipleSelection.findIndex(item => {
        return item.id === e.id
      })
      this.multipleSelection = []
      this.$refs.elTable.clearSelection()
      if (rowIndex === -1) {
        this.$refs.elTable.toggleRowSelection(e, true)
        this.multipleSelection.push(e)
      } else {
        this.$refs.elTable.toggleRowSelection(e, false)
      }
    }

  }

}
