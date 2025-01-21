<template>
  <div>
    <el-dialog
        class="taskModel"
        :title="$i18n.t('checkItems.addResult')"
        :visible.sync="open"
        width="1360px"
        append-to-body
        :close-on-click-modal="false"
        :before-close="handleClose"
        v-if="open"
        :class="modelType!='edit'?'info':''"
    >
      <steps
          :stepsArray="stepsArray"
          :nowStep="nowStep"
          :sampleCount="sampleCount"
      />
      <el-form
          ref="form"
          v-model="resultEntryForm"
          label-width="120px"
          label-position="left"
      >
        <div class="baseInfo">
          <h3 style="margin: 2% 0">{{ $i18n.t("checkItems.entrustedInformation") }}</h3>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item :label="$i18n.t('checkItems.entrustedDepartment')" prop="deptName">{{ resultEntryForm.limsCheckTask.deptName || "" }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$i18n.t('checkItems.commissioner')" prop="createBy">{{ resultEntryForm.limsCheckTask.entrustName || "" }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$i18n.t('checkItems.assistantContact')" prop="telephone">
                {{ resultEntryForm.limsCheckTask.entrustTelephone || "" }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$i18n.t('checkItems.sampleSender')" prop="sender">{{ resultEntryForm.senderName || "" }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$i18n.t('checkItems.sampleSenderContact')" prop="senderTelephone">{{ resultEntryForm.senderTelephone || "" }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$i18n.t('checkItems.hopeCompletionTime')" prop="expectFinishTime">{{ resultEntryForm.expectFinishTime || "" }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$i18n.t('checkItems.contractCode')" prop="contract">
                {{ (resultEntryForm.limsCheckTask.contractList || []).join() }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$i18n.t('checkItems.remark')" prop="remark">{{ resultEntryForm.limsCheckTask.remark }}</el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="sampleInfo">
          <div style="display: flex;align-items: center;margin-bottom: 1%">
            <h3>{{ $i18n.t("checkItems.testItems") }}</h3>
            <div style="flex:1;display: flex;justify-content: space-between;align-items: center;margin-left: 2%">
              <div>
                <el-button
                    type="primary"
                    plain
                    size="small"
                    icon="el-icon-plus"
                    v-if="modelType==='edit'"
                    @click="openTestItemModel"
                >
                  {{ $i18n.t("checkItems.addFromStandardLibrary") }}
                </el-button>
                <el-button
                    type="primary"
                    plain
                    size="small"
                    icon="el-icon-s-custom"
                    v-if="modelType===''"
                    @click="delegatorCheck"
                >
                  {{ $i18n.t("checkItems.proxyDetection") }}
                </el-button>
              </div>
            </div>
          </div>
          <el-table
              ref="table"
              :data="resultEntryForm.itemsList"
              border
              style="width: 100%"
          >
            <el-table-column :label="$i18n.t('checkItems.projectCode')" minWidth="150" align="center" prop="itemsCode"/>
            <el-table-column :label="$i18n.t('checkItems.projectName')" minWidth="150" align="center" prop="itemsName"/>
            <el-table-column :label="$i18n.t('checkItems.standard')" minWidth="150" align="center" prop="standardName"/>
            <el-table-column :label="$i18n.t('checkItems.skillsRequirement')" minWidth="190" align="center" prop="requirement">
              <template slot-scope="scope">
                <el-input
                    v-model="scope.row.requirement"
                    :placeholder="$i18n.t('checkItems.hintInputTechnicalRequirements')"
                    v-if="modelType==='edit'"
                />
                <span v-else>{{ scope.row.requirement }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$i18n.t('checkItems.detectionValue')" minWidth="150" align="center" prop="checkValue">
              <template slot="header">
                <span class="star">*</span>
                <span>{{ $i18n.t("checkItems.detectionValue") }}</span>
              </template>
              <template slot-scope="scope">
                <el-input
                    v-model="scope.row.checkValue"
                    :placeholder="$i18n.t('checkItems.hintInputDetectionValue')"
                    v-if="modelType==='edit'"
                />
                <span v-else>{{ scope.row.checkValue }}</span>
              </template>
            </el-table-column>
            <el-table-column
                :label="$i18n.t('checkItems.testResults')"
                align="center"
                prop="checkResult"
                minWidth="160"
            >
              <template slot="header">
                <span class="star">*</span>
                <span>{{ $i18n.t("checkItems.testResults") }}</span>
              </template>
              <template slot-scope="scope">
                <el-select
                    v-model="scope.row.checkResult"
                    :placeholder="$i18n.t('checkItems.hintInputTestResults')"
                    size="small"
                    clearable
                    filterable
                    v-if="modelType==='edit'"
                >
                  <el-option
                      v-for="item in resultOptions"
                      :key="item.value"
                      :label="item.description"
                      :value="item.value"
                  />
                </el-select>
                <span v-else>{{ checkResult(scope.row.checkResult) }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$i18n.t('checkItems.remark')" align="center">
              <template slot-scope="scope">
                <el-input
                    v-model="scope.row.remark"
                    :placeholder="$i18n.t('checkItems.hintInputRemarks')"
                    v-if="modelType==='edit'"
                />
                <span v-else>{{ scope.row.remark }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$i18n.t('checkItems.inspector')" prop="checkerName" align="center" width="120"/>
            <el-table-column
                :label="$i18n.t('checkItems.uploadOriginalRecord')"
                align="center"
                class-name="small-padding"
                min-width="180"
            >
              <template slot-scope="scope">
                <el-upload
                    ref="fileNameOriginal"
                    :show-file-list="false"
                    accept=".jpeg,.jpg,.png"
                    :data="uploadImageData"
                    :headers="upload.headers"
                    :disabled="upload.isUploading"
                    :action="upload.filePathAction"
                    :on-success="handleFilePathSuccess"
                    :on-progress="handleFileUploadProgress"
                    :before-upload="handleFileBeforeUpload"
                    :file-list="file"
                    name="file"
                    :limit=1
                    :on-change="handleUpload"
                >
                  <el-button
                      size="small"
                      type="text"
                      v-if="modelType==='edit'"
                      icon="el-icon-upload"
                      @click="handleSelect(scope.$index)"
                  >{{ $i18n.t("checkItems.upload") }}
                  </el-button
                  >
                  <el-button
                      size="small"
                      v-if="scope.row.fileUrl"
                      type="text"
                      icon="el-icon-view"
                      @click.stop="handlePictureCardPreview(scope.row)"
                  >{{ $i18n.t("checkItems.preview") }}
                  </el-button
                  >
                </el-upload>
              </template>
            </el-table-column>
            <el-table-column
                :label="$i18n.t('checkItems.operation')"
                align="center"
                width="120"
                v-if="modelType==='edit'"
            >
              <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="deleteProgram(scope.$index,resultEntryForm.itemsList)"
                >{{ $i18n.t("checkItems.delete") }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="margin-top: 1%" v-if="fileList&&fileList.length">
          <h3 style="margin-bottom: 1%">{{ $i18n.t("checkItems.fileUpload") }}</h3>
          <el-upload
              :limit=3
              class="filesUpload"
              ref="upload"
              :action="upload.filePathAction"
              list-type="picture-card"
              :headers="upload.headers"
              :disabled="upload.isUploading"
              :data="uploadImageData"
              :on-remove="handleRemove"
              :on-exceed="handleExceed"
              :on-preview="handlePreview"
              :before-upload="handleFileBeforeUpload"
              :file-list="fileList"
              name="file"
              accept="image/jpeg,image/jpg,image/png"
              :on-success="handleFileSuccess"
              multiple
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave" :loading="loading1"
                   v-if="modelType==='edit'">{{ $i18n.t("checkItems.save") }}
        </el-button>
        <el-button type="success" @click="handleSubmit" :loading="loading2"
                   v-if="modelType==='edit'">{{ $i18n.t("checkItems.submit") }}
        </el-button>
        <!--        <el-button type="danger" @click="handleReCheck">重测</el-button>-->
        <el-button @click="handleClose">{{ $i18n.t('common.cancel') }}</el-button>
      </div>
    </el-dialog>
    <ele-dialog-table
        :title="$i18n.t('checkItems.asicInformationQuery')"
        width="1500px"
        :visible.sync="limsStandardItemsDialogVisible"
        :formConfig="limsStandardItemsSearchDialog"
        :column="limsStandardItemsDialogColumn"
        @getSelectData="getSelectLimsStandardItems"
        :getList="getLimsStandardItemsList"
        :hasFooter="hasLimsStandardItemsFooter"
    >
    </ele-dialog-table>
    <!-- 图片预览弹出框 -->
    <el-dialog :title="$i18n.t('checkItems.picturePreview')" :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt=""/>
    </el-dialog>
  </div>
</template>

<script>
import Steps from "@/components/steps";
import stepsMixins from "@/mixins/steps";
import {limsStandardItemsDialog} from "@/views/limscheckitems/mixins/itemsMixin"
import {rowDetail, rowUpdate} from "@/api/limscheckitems/limsCheckItems";
import url from "@/axios/url";
import {getDict} from "@/api/common";

const {adminUrl} = url()

export default {
  name: "resultEntryDialog",
  mixins: [stepsMixins, limsStandardItemsDialog],
  components: {
    Steps,
  },
  data() {
    return {
      modelType: 'edit',
      // 是否显示弹出层
      open: false,
      resultEntryForm: {fileList: []},
      // 保存首页选择的行信息
      row: {},
      // 检测结果字典
      resultOptions: [],
      // resultOptions:[{value:1111,description:'1111'}],
      uploadImageData: {bucket: "limsservice"},
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 上传地址
        filePathAction: adminUrl + "file",
        // 设置上传的请求头部
        headers: {
          Satoken: this.$store.getters.token,
        },
      },
      // 记录操作行下标
      rowIndex: "",
      file: [],
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      loading1: false,
      loading2:false,
    }
  },
  methods: {
    async init(modelType, row) {
      this.modelType = modelType;
      this.upload.isUploading = modelType === 'view'
      this.row = row
      await this.getCheckResult()
      await this.rowDetail(row.id)
      await this.getSteps(false, row.taskId)
      this.open = true
    },
    handleClose() {
      this.open = false
    },
    async rowDetail(id) {
      const res = await rowDetail(id)
      this.resultEntryForm = res.data.result || {};
      this.fileList = this.resultEntryForm.fileList
    },
    async getCheckResult() {
      const res = await getDict("lims_check_result")
      this.resultOptions = res.data.result || [];
    },
    // 新增检测项目模态框
    openTestItemModel() {
      this.limsStandardItemsDialogVisible = true
    },
    // 代理检测
    delegatorCheck() {

    },
    // 删除检测项目
    deleteProgram(index, rows) {
      rows.splice(index, 1)
    },
    // 点击上传
    handleSelect(index) {

      this.rowIndex = index;
    },
    // 多次上传只保留最后一次（表格）
    handleUpload(file, fileList) {

      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
    },
    // 点击预览
    handlePreview(file) {
      this.dialogImageUrl = file.fileUrl ? file.fileUrl : file.url;
      this.dialogVisible = true;
    },
    // 表格预览
    handlePictureCardPreview(file) {
      if (file.fileUrl) {
        this.dialogImageUrl = file.fileUrl;
        this.dialogVisible = true;
      } else {
        this.$message.warning($i18n.t("checkItems.noUploadedAnnex"));
      }
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {

      this.upload.isUploading = true;
    },
    handleFileBeforeUpload(file) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        this.$message.error($i18n.t("checkItems.onlyUploadFormat"))
        return false;
      }
      return true;
    },
    // 附件上传成功
    handleFileSuccess(response, file) {

      // let fileName = response.result.object
      // let fileUrl = response.result.path
      // this.resultEntryForm.filename = fileName
      // this.resultEntryForm.fileUrl = fileUrl

      this.fileList.push({
        url: response.result.path,
        fileName: response.result.object
      })
      this.$message.success($i18n.t("common.uploadSuccess"));
    },
    handleExceed() {

      this.$message.error($i18n.t("checkItems.uploadPicture3"));
    },
    handleRemove(file) {//移除图片
      let fileList = this.fileList;
      for (let k in fileList) {
        if (file.fileName == fileList[k].fileName) {
          fileList.splice(k, 1);
        }
      }
      this.fileList = fileList;
    },
    // 文件上传成功处理（表格）
    handleFilePathSuccess(response, file) {
      this.upload.isUploading = false;
      this.$message.success($i18n.t("common.uploadSuccess"));
      this.resultEntryForm.itemsList[this.rowIndex].fileUrl = response.result.path
          ? response.result.path
          : "";
      this.resultEntryForm.itemsList[this.rowIndex].fileName = response.result.object
          ? response.result.object
          : "";
      this.dialogImageUrl = response.result.path
          ? response.result.path
          : "";
    },
    // 保存
    handleSave() {
      if (this.resultEntryForm?.itemsList?.length) {
        if (this.resultEntryForm.itemsList.some(i => !i.checkValue || !i.checkResult)) {
          return this.$message.warning($i18n.t("checkItems.mustComplete"))
        } else {
          this.resultEntryForm.fileList = this.fileList
          console.log('this.resultEntryForm', this.resultEntryForm)
          this.loading1 = true;
          rowUpdate(this.resultEntryForm).then((res) => {
            const message = res.data.message
            this.loading1 = false;
            this.$message.success(message || $i18n.t("common.saveSuccess"))
            this.handleClose()
            this.$parent.refresh()
          }).catch(err => {
            this.loading1 = false;
          })
        }
      }
    },
    // 提交
    handleSubmit() {
      if (this.resultEntryForm?.itemsList?.length) {
        if (this.resultEntryForm.itemsList.some(i => !i.checkValue || !i.checkResult)) {
          return this.$message.warning($i18n.t("checkItems.mustComplete"))
        } else {
          this.resultEntryForm.status = '6';
          this.loading2 = true;
          rowUpdate(this.resultEntryForm).then((res) => {
            const message = res.data.message;
            this.loading2 = false;
            this.$message.success(message || $i18n.t("common.submitSuccess"))
            this.handleClose()
            this.$parent.refresh()
          }).catch(err => {
            this.loading2 = false;
          })
        }
      }
    },
    checkResult(val) {
      if (val) {
        return this.resultOptions.filter(res => res.value === val)[0].description
      } else {
        return ''
      }
    },
    // 重测
    handleReCheck() {

    }
  },
}
</script>

<style scoped lang="scss">
.star {
  color: red;
}
.info{
  /deep/.el-upload--picture-card{
    display: none !important
  }
}
</style>
