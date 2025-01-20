<template>
  <div>
    <el-dialog
      class="taskModel"
      :title="$i18n.t('checkSample.detectionSamplesDetail')"
      :visible.sync="open"
      width="90%"
      append-to-body
      :close-on-click-modal="false"
      :before-close="handleClose"
      v-if="open"
    >
      <steps
        :stepsArray="stepsArray"
        :nowStep="nowStep"
        :sampleCount="sampleCount"
      />
      <div class="menuBox">
        <el-button type="primary" @click="handleReceive" v-if="type === 'receive'">{{ $i18n.t("checkSample.takeOver") }}</el-button>
        <el-button @click="handleClose">{{ $i18n.t("checkSample.cancel") }}</el-button>
      </div>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane :label="$i18n.t('checkSample.entrustedInformation')" name="1">
          <el-form
            ref="form"
            v-model="receiveForm"
            label-width="120px"
            label-position="left"
          >
            <el-row type="flex" justify="end" :gutter="20">
              <!-- <el-col :span="8">
                <el-form-item label="主检人" prop="mainCheckerName" label-width="80px">
                  <el-input
                    v-model="receiveForm.mainCheckerName"
                    placeholder="请输入主检人"
                    v-if="type === 'receive'"
                  >
                    <i
                      class="el-icon-search"
                      slot="suffix"
                      @click="searchMainChecker('mainCheckerName')"
                    ></i>
                  </el-input>
                  <span v-else>{{receiveForm.sampleList[0].mainCheckerName}}</span>
                </el-form-item>
              </el-col> -->
              <el-col :span="8">
                <el-form-item :label="$i18n.t('checkSample.promiseCompletionTime')" prop="promiseFinishTime">
                  <el-date-picker
                    clearable
                    size="small"
                    v-model="receiveForm.promiseFinishTime"
                    type="date"
                    style="width: 100%"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    :placeholder="$i18n.t('checkSample.hintInputPromiseToCompleteTime')"
                    v-if="type === 'receive'"
                  >
                  </el-date-picker>
                  <span v-else>{{receiveForm.sampleList[0].promiseFinishTime}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="sampleInfo">
              <h3>{{ $i18n.t("checkSample.sampleInformation") }}</h3>
              <!--样品-->
              <div v-if="sampleConfig.length">
                <template v-for="(item, index) in sampleConfig">
                  <SampleTable
                    :ref="item.code + 'ref'"
                    model-type="view"
                    :erp-code="erpCode"
                    :data="receiveForm.sampleList || []"
                    v-bind="item"
                    :key="index"
                  />
                </template>
              </div>
              <div v-else>
                <el-empty :image-size="50"></el-empty>
              </div>
            </div>
            <div class="baseInfo">
              <h3 style="margin: 2% 0">{{ $i18n.t("checkSample.entrustedInformation") }}</h3>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$i18n.t('checkSample.entrustedDepartment')" prop="deptName">{{
                    receiveForm.deptName || ""
                  }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$i18n.t('checkSample.commissioner')" prop="createBy">{{
                    receiveForm.entrustName || ""
                  }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$i18n.t('checkSample.assistantContact')" prop="telephone">{{
                    receiveForm.entrustTelephone || ""
                  }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$i18n.t('checkSample.sample')" prop="sender">{{
                    receiveForm.senderName || ""
                  }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$i18n.t('checkSample.contactInformation')" prop="senderTelephone">{{
                    receiveForm.senderTelephone || ""
                  }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$i18n.t('checkSample.hopeCompletionTime')" prop="expectFinishTime">{{
                    receiveForm.expectFinishTime || ""
                  }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$i18n.t('checkSample.contractCode')" prop="contract">{{
                    (receiveForm.contractList || []).join()
                  }}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$i18n.t('checkSample.remark')" prop="remark">{{
                    receiveForm.remark
                  }}</el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="$i18n.t('checkSample.testItems')" name="2">
          <div style="display: flex; align-items: center; margin-bottom: 1%">
            <h3>{{ $i18n.t("checkSample.testItems") }}</h3>
            <div
              style="
                flex: 1;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-left: 2%;
              "
            >
              <div>
                <el-button
                  type="primary"
                  plain
                  size="small"
                  icon="el-icon-plus"
                  @click="openTestItemModel"
                  v-if="type === 'receive'"
                >
                  {{ $i18n.t("checkSample.addFromStandardLibrary") }}
                </el-button>
              </div>
            </div>
          </div>
          <el-table
            ref="table"
            :data="receiveForm.itemsList"
            border
            style="width: 100%"
          >
            <el-table-column :label="$i18n.t('checkSample.projectCode')" align="center" prop="itemsCode" />
            <el-table-column :label="$i18n.t('checkSample.projectName')" align="center" prop="itemsName" />
            <el-table-column :label="$i18n.t('checkSample.standard')" align="center" prop="standardName" />
            <el-table-column :label="$i18n.t('checkSample.skillsRequirement')" align="center" prop="requirement">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.requirement"
                  :placeholder="$i18n.t('checkSample.hintInputTechnicalRequirements')"
                  v-if="type === 'receive'"
                />
                <span v-else>{{scope.row.requirement}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="检测人" align="center" width="150">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.checkerName"
                  placeholder="请输入检测人"
                  v-if="type === 'receive'"
                >
                  <i
                    class="el-icon-search"
                    slot="suffix"
                    @click="searchMainChecker('checkerName', scope.row)"
                  />
                </el-input>
                <span v-else>{{scope.row.checkerName}}</span>
              </template>
            </el-table-column> -->
            <el-table-column :label="$i18n.t('checkSample.operation')" align="center" width="140" v-if="type === 'receive'">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteProgram(scope.$index, receiveForm.itemsList)"
                  >{{ $i18n.t("checkSample.delete") }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <ele-dialog-table
      :title="userTitle"
      width="800px"
      :visible.sync="baseUserDialogVisible"
      :formConfig="baseUserSearchDialog"
      :column="baseUserDialogColumn"
      @getSelectData="getSelectBaseUser"
      :getList="getBaseUserList"
      :hasFooter="hasBaseUserFooter"
    ></ele-dialog-table>
    <ele-dialog-table
      :title="$i18n.t('checkSample.basicInformationQuery')"
      width="1300px"
      :visible.sync="limsStandardItemsDialogVisible"
      :formConfig="limsStandardItemsSearchDialog"
      :column="limsStandardItemsDialogColumn"
      @getSelectData="getSelectLimsStandardItems"
      :getList="getLimsStandardItemsList"
      :hasFooter="hasLimsStandardItemsFooter"
    >
    </ele-dialog-table>
  </div>
</template>

<script>
import Steps from "@/components/steps";
import stepsMixins from "@/mixins/steps";
import { baseUserDialog } from "@/views/limschecksample/mixins/userMixin";
import { limsStandardItemsDialog } from "@/views/limschecksample/mixins/itemsMixin";
import SampleTable from "@/views/limschecktask/components/sampleTable.vue";
import dayjs from "dayjs";
import { getCategoryList } from "@/api/common";
import { receive, receiveDetail } from "@/api/limschecksample/limsCheckSample";
export default {
  name: "receiveDialog",
  mixins: [stepsMixins, baseUserDialog, limsStandardItemsDialog],
  components: {
    Steps,
    SampleTable,
  },
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // tab默认选中
      activeName: "1",
      // 获取erp信息
      erpCode: "",
      receiveForm: {},
      pickerOptions: {
        // 限制日期
        disabledDate: (time) => {
          return time.getTime() <= Date.now() - 8.64e7;
        },
      },
      userType: "mainCheckerName",
      userTitle: $i18n.t("checkSample.chooseMainInspector"),
      // 检测项目行信息
      itemRowData: {},
      // 保存首页选择的行信息
      row: {},
      // 样品信息配置项
      sampleConfig: [],
      type:'receive'
    };
  },
  methods: {
    async init(row,type='receive') {
      this.row = row;
      this.type = type;
      await this.rowDetail(row.id);
      this.sampleConfig = await this.getCategoryList();
      await this.getSteps(false, row.taskId);
      this.$set(
        this.receiveForm,
        "promiseFinishTime",
        this.row.promiseFinishTime
      );
      this.$set(
        this.receiveForm,
        "mainCheckerName",
        this.$store.getters.userInfo.username ?? ""
      );
      this.$set(
        this.receiveForm,
        "mainCheckerId",
        this.$store.getters.userInfo.userId ?? ""
      );
      this.open = true;
    },
    //获取样品表格配置
    getCategoryList() {
      return new Promise((resolve, reject) => {
        getCategoryList().then((res) => {
          const allConfig = res.data.result || [];
          const filter = allConfig.filter((i) => {
            return this.receiveForm.sampleList.some(
              (j) => j.categoryName === i.categoryName
            );
          });
          resolve(filter);
        });
      });
    },
    async rowDetail(id) {
      const res = await receiveDetail(id);
      this.receiveForm = res.data.result || {};
    },
    // 关闭
    handleClose() {
      this.activeName = "1"
      this.open = false;
    },
    handleReceive() {
      if (!this.receiveForm?.itemsList?.length) {
        return this.$message.warning($i18n.t("checkSample.leastOneTestItem"));
      }
      this.receive();
    },
    receive() {
      debugger
      this.row.mainCheckerId = this.receiveForm.mainCheckerId;
      this.row.mainCheckerName = this.receiveForm.mainCheckerName;
      this.row.promiseFinishTime = this.receiveForm.promiseFinishTime
      this.row.itemsList = this.receiveForm.itemsList
      receive(this.row).then((res) => {
        this.handleClose();
        this.$parent.refresh();
      });
    },
    // 主检人弹窗
    searchMainChecker(type, row = {}) {
      this.userType = type;
      this.itemRowData = row;
      this.userTitle =
        type === "searchMainChecker" ? $i18n.t("checkSample.chooseMainInspector") : $i18n.t("checkSample.chooseADetector");
      this.baseUserDialogVisible = true;
    },
    // 弹框表格，双击表格，或者点击确定 返回选中数据
    getSelectBaseUser(data) {
      if (this.userType === "mainCheckerName") {
        this.chooseMainCheckerName(data);
      } else {
        this.chooseCheckerName(data);
      }
    },
    // 选择主检人完成
    chooseMainCheckerName(e) {
      this.$set(this.receiveForm, "mainCheckerId", e[0].jobNumber);
      this.$set(this.receiveForm, "mainCheckerName", e[0].nickName);
    },
    // 选择检测人完成
    chooseCheckerName(e) {
      this.$set(this.itemRowData, "checkerId", e[0].jobNumber);
      this.$set(this.itemRowData, "checkerName", e[0].nickName);
    },
    // 新增检测项目模态框
    openTestItemModel() {
      this.limsStandardItemsDialogVisible = true;
    },
    // 删除检测项目
    deleteProgram(index, rows) {
      rows.splice(index, 1);
    },
  },
};
</script>

<style scoped lang="scss">
.menuBox {
  display: flex;
  justify-content: end;
}
/deep/ .el-input__suffix {
  display: flex;
  align-items: center;
}
</style>
