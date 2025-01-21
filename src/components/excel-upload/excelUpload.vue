<template>
  <div>
    <el-tooltip effect="dark" :content="$t('common.uploadExcel')" placement="top">
      <el-upload
        ref="upload"
        :action="action"
        @before-upload="handleBeforeUpload"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :on-progress="handleUploadProgress"
        :show-file-list="false"
        :file-list="fileList"
        :headers="{ Satoken: $store.getters.token }"
        accept=".xls, .xlsx"
        v-bind="$attrs"
      >
        <el-button :type="type" :loading="loading" icon="el-icon-upload2">{{ buttonTxt }}</el-button>
      </el-upload>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: "excelUpload",
  props: {
    action: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: "primary"
    },
    buttonTxt: {
      type: String,
      default: $i18n.t("common.import")
    }
  },
  data() {
    return {
      loading: false,
      fileList: []
    }
  },
  methods: {
    handleBeforeUpload(file) {
      // console.log('上传前回调')
      this.loading = true
    },
    handleUploadProgress() {
      // console.log('上传时回调')
      this.loading = true
    },
    handleUploadSuccess(res) {
      // console.log('上传成功回调', res)
      this.loading = false
      if (res.success) {
        this.$message.success(this.$t("common.upload11"))
        this.$emit("handleUploadSuccess", res)
      } else {
        this.$message.error(res.message || this.$t("common.upload10"))
        this.$emit("handleUploadError", res)
      }
      this.$refs.upload.clearFiles()
    },
    handleUploadError(err) {
      this.$message.error(this.$t("common.upload10"))
      this.$emit("handleUploadError", err)
      // console.log('上传失败回调')
      this.loading = false
      this.$refs.upload.clearFiles()
    }
  }
}
</script>

<style scoped></style>
