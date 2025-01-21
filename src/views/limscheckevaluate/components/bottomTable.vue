<template>
  <div>
    <table class="bottomTab" :style="styleObject">
      <tr>
        <td colspan="2" class="columns colspan_2">{{ $i18n.t("checkEvaluate.appendix") }}</td>
        <div class="uploadFiles" style="display:flex;">
          <el-upload
            ref="upload"
            :action="upload.filePathAction"
            :data="uploadImageData"
            list-type="picture-card"
            :headers="upload.headers"
            :on-preview="handlePreview"
            :file-list="upload.fileList"
            name="file"
            :on-success="handleFileSuccess"
            :on-remove="handleRemove"
            :before-upload="handleFileBeforeUpload"
            accept=".jpeg,.jpg,.png"
            multiple
            :disabled="type === 'view'"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </tr>
<!--      <tr>-->
<!--        <td colspan="2" class="columns">主检人</td>-->
<!--        <td v-for="(i,index) in data.sampleList" :key="index">-->
<!--          {{i.mainCheckerName}}-->
<!--        </td>-->
<!--      </tr>-->
      <tr>
        <td rowspan="3" class="columns">{{ $i18n.t("checkEvaluate.testConclusion") }}</td>
        <td class="columns">{{ $i18n.t("checkEvaluate.reviewer") }}</td>
        <td>{{data.reportReviewerName}}</td>
      </tr>
      <tr>
        <td class="columns">{{ $i18n.t("checkEvaluate.isAvailable") }}</td>
        <td v-if="type === 'review'">
          <el-radio-group v-model="conclusionForm.reportUsable" @change="changeRadio">
            <el-radio label="1">{{ $i18n.t("checkEvaluate.available") }}</el-radio>
            <el-radio label="2">{{ $i18n.t("checkEvaluate.inBatches") }}</el-radio>
            <el-radio label="3">{{ $i18n.t("checkEvaluate.newProductTrial") }}</el-radio>
            <el-radio label="4">{{ $i18n.t("checkEvaluate.returnGoods") }}</el-radio>
          </el-radio-group>
        </td>
        <td v-else>{{ checkResultFormat(data.reportUsable) }}</td>
      </tr>
      <tr>
        <td class="columns">{{ $i18n.t("checkEvaluate.remark") }}</td>
        <td v-if="type === 'review'">
          <el-input
            @change="handleChange"
            style="padding:0 10px;"
            v-model="conclusionForm.remark"
            :placeholder="$i18n.t('checkEvaluate.hintInput')"
          ></el-input>
        </td>
        <td v-else>{{ data.remark }}</td>
      </tr>
    </table>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import url from "@/axios/url";
const { adminUrl } = url()
export default {
  name: "bottomTable",
  props: {
    data:{
      type: Object,
      default: () => {
        return {};
      },
    },
    files: {
      type: Array,
      default: function () {
        return [];
      },
    },
    type:{
      type:String,
      default:'review'
    }
  },
  data() {
    return {
      styleObject: {},
      conclusionForm: {
        reportUsable: "1",
      },
      dialogVisible:false,
      dialogImageUrl:'',
      uploadImageData: { bucket: "limsservice" },
      upload:{
        headers: { Satoken: this.$store.getters.token },
        // 上传地址
        filePathAction: `${adminUrl}file`,
        fileList: [],
      },
      sampleList:[]
    };
  },
  watch: {
    data:{
      handler(val){
        this.conclusionForm = {
          reportUsable:val.reportUsable ?? "1",
          remark:val.remark ?? "",
          attachmentsList:val.attachmentsList ?? []
        }
        this.sampleList = val.sampleList
      },
      immediate:true
    },
    files: {
      handler(val) {
        this.upload.fileList = val;
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {},
  methods: {
    // 预览附件
    handlePreview(file){
      this.dialogVisible = true
      this.dialogImageUrl = file.fileUrl?file.fileUrl:file.url;
    },
    handleFileBeforeUpload(file) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        this.$message.error($i18n.t("checkEvaluate.onlyUploadFormat"))
        return false;
      }
      return true;
    },
    // 附件上传成功
    handleFileSuccess(response, file) {
      this.$message.success($i18n.t("common.uploadSuccess"));
      this.conclusionForm.attachmentsList = [
        ...this.conclusionForm.attachmentsList,
        {
          fileName:response.result.object
            ? response.result.object
            : "",
          url:response.result.path
            ? response.result.path
            : ""
        }
      ]
      this.$emit('getConclusion',this.conclusionForm)
    },
    handleRemove({response}){
      this.conclusionForm.attachmentsList = this.conclusionForm.attachmentsList.filter(i=>{
        return response.result.path !== i.url
      })
      this.$emit('getConclusion',this.conclusionForm)
    },
    changeRadio(val) {
      this.conclusionForm.reportUsable = val
      this.$emit('getConclusion',this.conclusionForm)
    },
    handleChange(val){
      this.conclusionForm.remark = val
      this.$emit('getConclusion',this.conclusionForm)
    },
    // 是否可用
    checkResultFormat(data){
      switch(data){
        case '1':
          return $i18n.t("checkEvaluate.available");
        case '2':
          return $i18n.t("checkEvaluate.inBatches");
        case '3':
          return $i18n.t("checkEvaluate.newProductTrial");
        case '4':
          return $i18n.t("checkEvaluate.returnGoods");
        default:
          return "";

      }
    },
  },
}
</script>

<style scoped lang="scss">
.bottomTab{
  font-size: 12px;
  width: 100%;
  color: #606266;
  border:1px solid #dfe6ec;
  text-align: center;
  border-collapse: collapse;
  table-layout:fixed;
  tr{
    td{
      border:1px solid #dfe6ec;
      text-align: center;
      box-sizing: border-box;
      padding: 8px 10px;
      word-break: break-all;
      word-wrap:break-word;
    }
    .columns{
      background-color: #EFF2FB;
      color: #515a6e;
      font-size: 14px;
      font-weight: 600;
      width: 240px;
    }
    .colspan_2 {
      width: 560px;
    }
  }
}
.img{
  width:60px;
  height: 60px;
  cursor: pointer;
  margin: 5px;
}
::v-deep .el-radio{
  margin-right: 20px;
}
::v-deep .uploadFiles  {
  .el-upload--picture-card{
    width: 60px;
    height: 60px;
    line-height: 60px;
    i {
      font-size: 18px;
    }
  }
  .el-upload-list__item-actions {
    .el-icon-zoom-in,.el-icon-delete{
      font-size: 14px;
    }
  }
  .el-upload-list--picture-card {
    .el-upload-list__item{
      width: 60px;
      height: 60px;
    }
  }
}
</style>
