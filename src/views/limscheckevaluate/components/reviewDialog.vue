<template>
  <div>
    <el-dialog
      class="taskModel"
      :title="type === 'review' ? $i18n.t('checkEvaluate.check') : $i18n.t('common.view')"
      :visible.sync="open"
      width="90%"
      append-to-body
      :close-on-click-modal="false"
      :before-close="handleClose"
      :class="type=='view'?'info':''"
      v-if="open"
    >
      <steps
        :stepsArray="stepsArray"
        :nowStep="nowStep"
        :sampleCount="sampleCount"
      />
      <TopTable :data="data"/>
<!--      v-if="tableData.length > 0"-->
      <el-table
        :data="data.itemsList"
        style="width: 100%"
        border
        class="reportTables"
        ref="reportTables"
      >
        <el-table-column align="center" :label="$i18n.t('checkEvaluate.project')" prop="itemsName" width="120" fixed/>
        <el-table-column
          align="center"
          :label="$i18n.t('checkEvaluate.standard')"
          prop="standardName"
          width="140"
          fixed
        />
        <el-table-column
          align="center"
          :label="$i18n.t('checkEvaluate.skillsRequirement')"
          prop="requirement"
          width="300"
          fixed
        />

        <el-table-column align="center" :label="$i18n.t('checkEvaluate.sampleName')" prop="sampleName" />
        <el-table-column align="center" :label="$i18n.t('checkEvaluate.detectionValue')" prop="checkValue" />
        <el-table-column align="center" :label="$i18n.t('checkEvaluate.originalRecord')" prop="fileUrl" >
          <template slot-scope="scope">
            <span v-if="!scope.row.fileUrl">——</span>
            <el-button
              v-else
              size="medium"
              type="text"
              icon="el-icon-view"
              @click.stop="handlePictureCardPreview( scope.row.fileUrl)"
            >{{ $i18n.t("checkEvaluate.view") }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$i18n.t('checkEvaluate.testResults')" prop="checkResult" :formatter="formatter"/>
        <el-table-column align="center" :label="$i18n.t('checkEvaluate.inspector')" prop="checkerName" />
        <!-- 表格（下） -->
        <div slot="append" class="tableappend">
          <BottomTable
            ref="bottom"
            :files="imgList"
            :data="data"
            :type="type"
            @getConclusion="getConclusion"
            :tableStyle="{ width: width }"
          />
        </div>
      </el-table>
      <div slot="footer" >
        <el-button type="primary" @click="handleSubmit" v-if="type === 'review'">{{ $i18n.t("checkEvaluate.release") }}</el-button>
        <el-button type="danger" @click="handleReset" v-if="type === 'review'">{{ $i18n.t("checkEvaluate.retest") }}</el-button>
        <el-button type="primary" @click="handleDownload" v-else>{{ $i18n.t("checkEvaluate.downloadPdf") }}</el-button>
        <el-button @click="handleClose">{{ $i18n.t('common.cancel') }}</el-button>
      </div>
    </el-dialog>
    <!-- 图片预览弹出框 -->
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <!-- 重测弹框 -->
    <el-dialog :title="$i18n.t('checkEvaluate.chooseSamples')" :visible.sync="reVisible" append-to-body destroy-on-close>
      <el-table
        ref="sampleTable"
        :data="reSetList"
        border
        height="300"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column :label="$i18n.t('checkEvaluate.sampleCode')" align="center" prop="sampleCode" />
        <el-table-column :label="$i18n.t('checkEvaluate.sampleName')" align="center" prop="sampleName" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="reset">{{ $i18n.t('common.ok') }}</el-button>
        <el-button @click="reVisible = false">{{ $i18n.t('common.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Steps from "@/components/steps";
import stepsMixins from "@/mixins/steps";
import TopTable from "@/views/limscheckevaluate/components/topTable.vue";
import BottomTable from "@/views/limscheckevaluate/components/bottomTable.vue";
import {arrSet, exportExcel} from "@/utils/judge";
import {downloadPDF, publish, reportDetail, returnCheck} from "@/api/limscheckevaluate/limsCheckEvaluate";
import {getDict} from "@/api/common";
export default {
  name: "reviewDialog",
  mixins: [stepsMixins],
  components: {
    Steps,
    TopTable,
    BottomTable
  },
  data() {
    return {
      open: false,
      // 保存首页选择的行信息
      row:{},
      data:{},
      tableData:[],
      checkItemList: [],
      files: [],
      imgList: [],
      conclusionForm:{},
      width: "",
      dialogImageUrl: "",
      dialogVisible: false,
      type:'review',
      reVisible:false,
      selection:[],
      reSetList:[],
      resultOptions:[]
    }
  },
  async created() {
    await this.getCheckResult();
  },
  methods: {
    async init(row,type){
      this.row = row
      this.type = type
      await this.getSteps(false, row.id)
      await this.getDetail()
      this.open = true
    },
    async getDetail(){
      const res = await reportDetail(this.row.id)
      this.data = res.data.result || {};
      this.imgList = res.data.result.attachmentsList
    },
    handleClose() {
      this.open = false;
    },
    // 获取检测结论
    getConclusion(val) {
      this.conclusionForm = val;
    },
    // 查看图片
    handlePictureCardPreview(fileUrl) {
      if (fileUrl) {
        this.dialogImageUrl = fileUrl;
        this.dialogVisible = true;
      }
    },
    handleReset(){
      this.reSetList = arrSet('sampleCode',this.data.itemsList)
      this.reVisible = true
    },
    // 选择样品弹框列表选中
    handleSelectionChange(selection) {
      this.selection = selection
    },
    reset(){

      returnCheck({
        id:this.row.id,
        sampleList:this.selection.map(i=>{
          return {
            id:i.sampleId,
            sampleCode:i.sampleCode
          }
        })
      }).then(res=>{
        this.handleClose()
        this.reVisible = false
        this.$message.success($i18n.t("checkEvaluate.sampleSuccessfullyReturn"))
        this.$parent.refresh()
      })
    },
    handleSubmit(){
      const data = {
        id:this.row.id,
        reportUsable: this.conclusionForm.reportUsable ?? "1",
        remark: this.conclusionForm.remark ?? "",
        attachmentsList: this.conclusionForm.attachmentsList ?? [],
      }
      publish(data).then(res =>{
        this.handleClose()
        this.$parent.refresh()
      })
    },
    handleDownload(){
      if(this.row.status == 9 || this.row.status == 10 ){
        exportExcel(downloadPDF(this.row.id),{},'application/pdf;charset=utf-8')
      }else{
        this.$message.warning($i18n.t("checkEvaluate.onlyDownloadPdf"))
      }
    },
    formatter(row, column, cellValue, index){
      const filter = this.resultOptions.filter(i=>{
        return i.value === cellValue
      })
      if(filter.length){
        return filter[0].description
      }
      return ""
    },
    async getCheckResult() {
      const res = await getDict("lims_check_result")
      this.resultOptions = res.data.result || [];
    },
  },
}
</script>

<style scoped lang="scss">
.info{
  /deep/.el-upload--picture-card{
    display: none !important
  }
}
</style>
