<template>
  <div>
    <el-upload
      ref="upload"
      action=""
      :limit="1"
      :auto-upload="false"
      :on-change="handleChange"
      :accept="accept"
      :file-list="fileList"
      :on-exceed="onExceed"
      :on-remove="onRemove"
    >
      <div class="btn-pack">
        <el-button
          plain
          icon="el-icon-upload2"
          size="small"
          type="primary"
          :loading="uploading"
        >
          {{ uploading ? "上传中..." : $t("common.clickUpload") }}
        </el-button>
        <div slot="tip" class="el-upload__tip">{{ tip }}</div>
      </div>
    </el-upload>
  </div>
</template>

<script>
// 手动上传，选择资源之后，不马上上传，表单提交时一起上传
// import formMixin from '../ele-form/mixins/formMixin'
export default {
  name: "upload-no-auto",
  // mixins: [formMixin], // 必须引入mixin
  props: {
    accept: {
      type: String,
      default: ".xlsx, .xls",
    },
    tip: {
      type: String | Function,
      default: () => $i18n.t("common.uploadFileRule"),
    },
    uploading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fileList: [],
    };
  },
  methods: {
    handleChange(file) {
      var FileExt = file.name.replace(/.+\./, ".");
      if (!this.accept.includes(FileExt)) {
        this.fileList.pop();
        this.$message.warning(this.$t("import.msg4",{msg:this.accept}))
      } else{
        const formData = new FormData();
        formData.append("file", file.raw);
        this.$emit("onchange", formData);
      }
    },
    onRemove(file, fileList) {
      this.$emit("onchange", null);
    },
    onExceed() {
      this.$message.error(this.$t("common.uploadLimit1"));
    },
    clearFiles() {
      this.$refs.upload.clearFiles();
    },
  },
};
</script>

<style scoped></style>
