<template>
  <div>
    <el-dialog
      class="taskModel"
      :title="title"
      :visible.sync="open"
      width="1300px"
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
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane :label="$i18n.t('checkTask.entrustedInformation')" name="1">
          <el-form
            ref="ruleForm"
            :model="form"
            label-width="120px"
            label-position="top"
            :rules="rules"
          >
            <div class="baseInfo">
              <h3>{{ $i18n.t("checkTask.entrustedInformation") }}</h3>
              <el-row :gutter="20">
                <!--              <el-col :span="8">-->
                <!--                <el-form-item label="委托编号" prop="code">-->
                <!--                  <el-input-->
                <!--                    v-model="form.code"-->
                <!--                    placeholder="请输入委托编号"-->
                <!--                    disabled-->
                <!--                    v-if="modelType !== 'view'&&modelType !== 'audit'"-->
                <!--                  />-->
                <!--                  <span v-else>{{ form.code }}</span>-->
                <!--                </el-form-item>-->
                <!--              </el-col>-->
                <el-col :span="8">
                  <el-form-item :label="$i18n.t('checkTask.entrustedDepartment')" prop="deptName">
                    <el-input
                      v-model="form.deptName"
                      :placeholder="$i18n.t('checkTask.hintInputCommissionDepartment')"
                      disabled
                      v-if="modelType !== 'view'&&modelType !== 'audit'"
                    />
                    <span v-else>{{ form.deptName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$i18n.t('checkTask.commissioner')" prop="entrustName">
                    <el-input
                      v-model="form.entrustName"
                      :placeholder="$i18n.t('checkTask.hintInputClient')"
                      readonly
                      v-if="modelType !== 'view'&&modelType !== 'audit'"
                    >
                      <i
                        class="el-icon-search"
                        slot="suffix"
                        @click="openUsersModel('entrust')"
                      ></i></el-input>
                    <span v-else>{{ form.entrustName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$i18n.t('checkTask.assistantContact')" prop="entrustTelephone">
                    <el-input
                      v-model="form.entrustTelephone"
                      :placeholder="$i18n.t('checkTask.hintInputClientContact')"
                      disabled
                      v-if="modelType !== 'view'&&modelType !== 'audit'"
                    />
                    <span v-else>{{ form.entrustTelephone }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$i18n.t('checkTask.sample')" prop="senderName">
                    <el-input
                      v-model="form.senderName"
                      :placeholder="$i18n.t('checkTask.hintInputSamplePerson')"
                      readonly
                      v-if="modelType !== 'view'&&modelType !== 'audit'"
                    >
                      <i
                        class="el-icon-search"
                        slot="suffix"
                        @click="openUsersModel('sender')"
                      ></i>
                    </el-input>
                    <span v-else>{{ form.senderName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$i18n.t('checkTask.contactInformation')" prop="senderTelephone">
                    <el-input
                      v-model="form.senderTelephone"
                      :placeholder="$i18n.t('checkTask.hintInputSampleContact')"
                      v-if="modelType !== 'view'&&modelType !== 'audit'"
                    />
                    <span v-else>{{ form.senderTelephone }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$i18n.t('checkTask.hopeCompletionTime')" prop="expectFinishTime">
                    <el-date-picker
                      clearable
                      size="small"
                      v-model="form.expectFinishTime"
                      type="date"
                      style="width: 100%"
                      value-format="yyyy-MM-dd"
                      :placeholder="$i18n.t('checkTask.hintInputExpectedTime')"
                      :picker-options="expireTimeOption"
                      v-if="modelType !== 'view'&&modelType !== 'audit'"
                    >
                    </el-date-picker>
                    <span v-else>{{ form.expectFinishTime }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$i18n.t('checkTask.contractCode')" prop="contractStr">
                    <!--                    <el-select
                                          v-model="form.contractList"
                                          placeholder="请选择"
                                          multiple
                                          style="width: 100%"
                                          v-if="modelType !== 'view'&&modelType !== 'audit'"
                                        >
                                          <el-option label="1111" value="1111"/>
                                          <el-option label="222" value="22222"/>
                                        </el-select>-->
                    <el-input
                      v-model="form.contractStr"
                      :placeholder="$i18n.t('checkTask.hintInputContract')"
                      readonly
                      v-if="modelType !== 'view'&&modelType !== 'audit'"
                    >
                      <i
                        class="el-icon-search"
                        slot="suffix"
                        @click="openContractModel()"
                      ></i></el-input>
                    <span v-else>{{ (form.contractList || []).join() }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-if="modelType !== 'view'&&modelType !== 'audit'">
                  <el-form-item :label="$i18n.t('checkTask.sampleType')" prop="sampleType">
                    <el-select v-model="sampleType" :clearable="false" filterable  style="width: 100%">
                      <el-option v-for="i in sampleConfig" :label="i.categoryName" :value="i.categoryCode" :key="i.categoryCode"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="modelType !== 'view'&&modelType !== 'audit' ? 8 : 12">
                  <el-form-item :label="$i18n.t('checkTask.remark')" prop="remark">
                    <el-input
                      type="textarea"
                      v-model="form.remark"
                      :maxlength="500"
                      show-word-limit
                      :placeholder="$i18n.t('checkTask.hintInputRemarks')"
                      v-if="modelType !== 'view'&&modelType !== 'audit'"
                    />
                    <span v-else>{{ form.remark }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
          <div class="sampleInfo">
            <h3>
              {{ $i18n.t("checkTask.sampleInformation") }}<span style="font-size: 14px" v-if="sampleCode !== ''"
            >（{{  $i18n.t("checkTask.sampleCode") }}：{{ sampleCode }}）</span
            >
            </h3>
            <!--样品-->
            <div v-if="sampleConfig.length">
              <template v-for="(item,index) in sampleConfig">
                <SampleTable :ref="item.categoryCode+'ref'" :model-type="modelType" :erp-code="erpCode"
                             :data="form.sampleList || []" v-bind="item"
                             :key="index" v-if="sampleType === item.categoryCode"/>
              </template>
            </div>
            <div v-else>
              <el-empty :image-size="50"></el-empty>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$i18n.t('checkTask.testItems')" name="2">
          <div style="display: flex;align-items: center;margin-bottom: 1%">
            <h3>{{ $i18n.t("checkTask.testItems") }}</h3>
            <div style="flex:1;display: flex;justify-content: space-between;align-items: center;margin-left: 2%">
              <div>
                <el-button
                  type="primary"
                  plain
                  size="small"
                  icon="el-icon-plus"
                  @click="openTestItemModel"
                  :disabled="modelType === 'view'||modelType === 'audit'"
                >
                  {{ $i18n.t("checkTask.addFromStandardLibrary") }}
                </el-button>
              </div>
              <!--              <div>-->
              <!--                <el-select-->
              <!--                  v-model="query.itemModelType"-->
              <!--                  placeholder="请选择模板类型"-->
              <!--                  clearable-->
              <!--                  size="small"-->
              <!--                  @change="chooseModel"-->
              <!--                  :disabled='modelType=="view"'-->
              <!--                >-->
              <!--                  <el-option-->
              <!--                    v-for="item in modelOptipn"-->
              <!--                    :key="item.id"-->
              <!--                    :label="item.name"-->
              <!--                    :value="item.id"-->
              <!--                  />-->
              <!--                </el-select>-->
              <!--                <el-input-->
              <!--                  v-model="query.code"-->
              <!--                  placeholder="请输入内容"-->
              <!--                  clearable-->
              <!--                  size="small"-->
              <!--                  :disabled='modelType=="view"'-->
              <!--                  style="width: 200px; margin-left: 16px"-->
              <!--                />-->
              <!--              </div>-->
            </div>
          </div>
          <el-table
            ref="table"
            :data="form.itemsList"
            border
            style="width: 100%"
          >
            <el-table-column :label="$i18n.t('checkTask.projectCode')" align="center" prop="itemsCode"/>
            <el-table-column :label="$i18n.t('checkTask.projectName')" align="center" prop="itemsName"/>
            <el-table-column :label="$i18n.t('checkTask.standard')" align="center" prop="referenceValue"/>
            <el-table-column :label="$i18n.t('checkTask.skillsRequirement')" align="center" prop="requirement">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.requirement"
                  :placeholder="$i18n.t('checkTask.hintInputTechnicalRequirements')"
                  v-if="modelType !== 'view'&&modelType !== 'audit'"
                />
                <span v-else>{{ scope.row.requirement }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$i18n.t('checkTask.operation')"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click.native.prevent="deleteProgram(scope.$index, form.itemsList)"
                  :disabled="modelType === 'view'||modelType === 'audit'"
                >{{ $i18n.t("checkTask.delete") }}
                </el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitForm"
          :loading="loading1"
          v-if="modelType !== 'view' && modelType !== 'audit'"
        >{{ $i18n.t("checkTask.save") }}
        </el-button
        >
        <el-button
          type="primary"
            :loading="loading2"
          @click="handleSubmit"
          v-if="modelType !== 'view' && modelType !== 'audit'"
        >{{ $i18n.t("checkTask.submit") }}
        </el-button
        >
        <el-button
          type="success"
          @click="handleAudit('4',$i18n.t('checkTask.reviewSuccess'))"
          v-if="modelType === 'audit'"
        >{{ $i18n.t("checkTask.review") }}
        </el-button
        >
        <el-button
          type="danger"
          @click="handleAudit('1',$i18n.t('checkTask.turnDownSuccess'))"
          v-if="modelType === 'audit'"
        >{{ $i18n.t("checkTask.turnDown") }}
        </el-button
        >
        <el-button @click="handleClose">{{ $i18n.t("common.cancel") }}</el-button>
      </div>
    </el-dialog>
    <ele-dialog-table
      :title="userTitle"
      width="800px"
      :visible.sync="baseUserDialogVisible"
      :formConfig="baseUserSearchDialog"
      :column="baseUserDialogColumn"
      @getSelectData="getSelectBaseUser"
      :otherParam="{status:1}"
      :getList="getBaseUserList"
      :hasFooter="hasBaseUserFooter"
    ></ele-dialog-table>
    <ele-dialog-table
      :title="$i18n.t('checkTask.basicInformationQuery')"
      width="1000px"
      :visible.sync="limsStandardItemsDialogVisible"
      :formConfig="limsStandardItemsSearchDialog"
      :column="limsStandardItemsDialogColumn"
      @getSelectData="getSelectLimsStandardItems"
      :getList="getLimsStandardItemsList"
      :hasFooter="hasLimsStandardItemsFooter"
    >
    </ele-dialog-table>
    <ele-dialog-table
      :title="$i18n.t('checkTask.contractList')"
      width="800px"
      :visible.sync="contractVisible"
      :formConfig="contractSearchDialog"
      :column="contractDialogColumn"
      @getSelectData="handleSelectionChange"
      :getList="getContractList"
      :other-param="{activeFlag:'1'}"
      :transFormdata="transFormdata"
      :hasFooter="hasContractFooter"
    >
    </ele-dialog-table>
  </div>
</template>

<script>
import SampleTable from "@/views/limschecktask/components/sampleTable.vue";
import Steps from "@/components/steps";
import stepsMixins from "@/mixins/steps";
import {baseUserDialog} from "@/views/limschecktask/mixins/userMixin"
import {limsStandardItemsDialog} from "@/views/limschecktask/mixins/itemsMixin"
import {contractrDialog} from "@/views/limschecktask/mixins/contractMixin"
import {getContractList, rowCreate, rowDetail, rowUpdate, setStatus} from "@/api/limsCheckTask/limsCheckTask";
import {getCategoryList} from "@/api/common";

export default {
  name: "addOrViewDialog",
  mixins: [stepsMixins, baseUserDialog, limsStandardItemsDialog,contractrDialog],
  components: {
    Steps,
    SampleTable,
  },
  data() {
    return {
      // 弹出层标题
      title: $i18n.t("common.add"),
      loading1: false,
      loading2:false,
      // 模态框类型
      modelType: 'add',
      // tab默认选中
      activeName: "1",
      // 是否显示弹出层
      open: false,
      query: {
        itemModelType: "",
        code: "",
      },
      // 表单参数
      form: {},
      //erp信息
      erpInfo: {},
      // 新增时获取的样品编号
      sampleCode: "",
      // 获取erp信息
      erpCode: "",
      // 检测项目模板类型
      modelOptipn: [],
      // 用户弹框
      userType: '',
      userTitle: '',
      // 禁用当前日期之前的时间
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() <= Date.now() - 8.64e7;
        },
      },
      sampleType:'',
      // 样品信息配置项
      sampleConfig: [],
      rules: {
        entrustName: [
            { required: true, message: $i18n.t("checkTask.pleaseChooseAClient"), trigger: 'blur' },
          ],
        senderName: [
            { required: true, message: $i18n.t("checkTask.pleaseChooseSendSamplers"), trigger: 'blur' }
          ],
          // senderTelephone: [
          //   { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          // ],
          expectFinishTime: [
            { required: true, message: $i18n.t("checkTask.pleaseChooseTime"), trigger: 'blur' }
          ],
        contractStr: [
            { required: true, message: $i18n.t("checkTask.leastOneContract"), trigger: 'blur' }
          ]
        }
    }
  },
  methods: {
    async init(modelType, row = {}) {
      this.modelType = modelType;
      if (modelType === 'add') {
        this.title = $i18n.t("common.add")
        this.sampleConfig = await this.getCategoryList()
        await this.getSteps()
      } else {
        this.title = modelType === 'edit' ? $i18n.t("checkTask.edit") : $i18n.t("common.details")
        await this.rowDetail(row.id)
        this.sampleConfig = await this.getCategoryList()
        await this.getSteps(false, row.id)
      }
      this.open = true
    },
    //获取样品表格配置
    getCategoryList() {
      return new Promise((resolve, reject) => {
        getCategoryList().then(res => {
          const allConfig = res.data.result || []
          if (this.modelType !== 'view' && this.modelType !== 'audit') {
            if(this.modelType === 'edit'){
              const filter = allConfig.filter(i => {
                return this.form.sampleList.some(j => j.categoryName === i.categoryName)
              })
              this.sampleType = filter[0]?.categoryCode ?? ""
            }else {
              this.sampleType = res.data.result[0]?.categoryCode ?? ""
            }
            resolve(allConfig)
          } else {
            const filter = allConfig.filter(i => {
              return this.form.sampleList.some(j => j.categoryName === i.categoryName)
            })
            this.sampleType = filter[0]?.categoryCode ?? ""
            resolve(filter)
          }
        })
      })
    },
    // 获取详情
    async rowDetail(id) {
      const res = await rowDetail(id)
      this.form = res.data.result || {};
      if (res.data.result.sampleType) {
        this.sampleType = res.data.result.sampleType
      }
    },
    // 删除检测项目
    deleteProgram(index, rows) {
      rows.splice(index, 1);
    },
    // 新增检测项目模态框
    openTestItemModel() {
      this.limsStandardItemsDialogVisible = true
    },
    // 根据选择的检测模板获取对应的检测项目
    chooseModel(val) {

    },
    // 委托人与送样人可选
    openUsersModel(type) {
      this.userType = type
      this.userTitle = type === 'sender' ? $i18n.t("checkTask.chooseASample") : $i18n.t("checkTask.chosenClient")
      this.baseUserDialogVisible = true
    },
    // 弹框表格，双击表格，或者点击确定 返回选中数据
    getSelectBaseUser(data) {
      if (this.userType === 'sender') {
        this.chooseSender(data)
      } else {
        this.chooseCreator(data)
      }
    },
    // 选择委托人完成
    chooseCreator(e) {
      this.form.entrustName = e[0].nickName;
      this.form.entrustId = e[0].jobNumber;
      this.form.deptId = e[0].deptId;
      this.form.deptName = e[0].deptName;
      this.form.entrustTelephone = e[0].mobile;
      this.form = Object.assign({}, this.form);
      this.$nextTick(()=>{
        this.$refs.ruleForm.clearValidate('entrustName')
      })
    },
    // 选择送样人完成
    chooseSender(e) {
      this.form.senderId = e[0].jobNumber;
      this.form.senderName = e[0].nickName;
      this.form.senderTelephone = e[0].mobile;
      this.form = Object.assign({}, this.form);
      this.$nextTick(()=>{
        this.$refs.ruleForm.clearValidate('senderName')
      })
    },
    // 合同号可选
    openContractModel() {
      this.contractVisible = true
    },
    // 转换合同号查询接口数据格式
    transFormdata(data) {
      return Promise.resolve({
        records:data.data.result,
        total:data.data.result.length
      })
    },
    // 合同号选择完成
    handleSelectionChange(e) {
      this.form.contractStr = e.map((val) => val.contractNo).join(',')
      this.form = Object.assign({}, this.form);
      this.$nextTick(()=>{
        this.$refs.ruleForm.clearValidate('contractStr')
      })
    },
    // 关闭
    handleClose() {
      this.form = {}
      this.activeName = "1"
      this.open = false
    },
    // 保存
    submitForm() {
      this.$refs.ruleForm.validate((valid, error) => {
        if (valid) {
          this.form.status = '1'
          this.form.sampleType=this.sampleType
          this.form.id ? this.handleRowUpdate(this.form, $i18n.t("common.submitSuccess")) : this.handleRowCreate(this.form, $i18n.t("common.saveSuccess"))
        } else {
          // 表单校验错误提示
          const h = this.$createElement;
          let messageArr = [];
          Object.keys(error).forEach(key => {
            error[key].forEach(item => messageArr.push(h("div", { style: { marginBottom: "8px" }}, item.message)))
          });
          this.$notify.error({
            title: $i18n.t("ele-form.formError"),
            message: h("div", { style: { marginTop: "12px" } }, messageArr),
          });
          this.activeName = '1';
        }
      });
    },
    // 提交
    handleSubmit() {
      this.$refs.ruleForm.validate((valid, error) => {
        if (valid) {
          this.form.status = '2'
          this.form.sampleType=this.sampleType
          this.form.id ? this.handleRowUpdate(this.form, $i18n.t("common.submitSuccess")) : this.handleRowCreate(this.form, $i18n.t("common.saveSuccess"))
        } else {
          // 表单校验错误提示
          const h = this.$createElement;
          let messageArr = [];
          Object.keys(error).forEach(key => {
            error[key].forEach(item => messageArr.push(h("div", { style: { marginBottom: "8px" }}, item.message)))
          });
          this.$notify.error({
            title: $i18n.t("ele-form.formError"),
            message: h("div", { style: { marginTop: "12px" } }, messageArr),
          });
          this.activeName = '1';
        }
      });
    },
    handleRowUpdate(data, title) {
      if(!this.checkFinish()) return
      this.form.sampleList = this.handleData()
      this['loading'+this.form.status] = true
      rowUpdate(data).then((res) => {
        this['loading'+this.form.status] = false
        const message = res.data.message
        this.$message.success(message || title)
        this.handleClose()
        this.$parent.refresh()
      }).catch(err => {
        this['loading'+this.form.status] = false
      })
    },
    handleRowCreate(data, title) {
      if(!this.checkFinish()) return
      this.form.sampleList = this.handleData()
      this['loading'+this.form.status] = true
      rowCreate(data).then((res) => {
        this['loading'+this.form.status] = false
        const message = res.data.message
        this.$message.success(message || title)
        this.handleClose()
        this.$parent.refresh()
      }).catch(error => {
        this['loading'+this.form.status] = false
      })
    },
    // 检查必填项是否填写完毕
    checkFinish(){
      const sampleList = this.$refs[this.sampleType + 'ref'][0].sampleList
      const disabledType = this.$refs[this.sampleType + 'ref'][0].disabledType
      if (!sampleList.length) {
        this.$message.warning($i18n.t("checkTask.leastOneSampleInformation"))
        return false
      }
      if (sampleList.some(i => !i.sampleName || !i.sampleNum || !i.sampleModel || !i.unitCode || (!i.sampleCode&&!disabledType))) {
         this.$message.warning($i18n.t("checkTask.hintInputSampleInformation"))
        return false
      }
      if (!this.form?.itemsList?.length) {
        this.$message.warning($i18n.t("checkTask.leastOneTestItem"))
        return false
      }
      return true
    },
    // 处理样品表格数据
    handleData() {
      const list = []
      const sampleItem = this.sampleConfig.filter(i=>i.categoryCode === this.sampleType)[0]
      const sampleList = this.$refs[this.sampleType + 'ref'][0].sampleList
      const keys = sampleItem.fieldVOList.map(item => item.code)
      sampleList.forEach(item => {
        const obj = {}
        const jsonObj = {}
        for (let itemKey in item) {
          if (!keys.includes(itemKey)) {
            obj[itemKey] = item[itemKey]
          } else {
            jsonObj[itemKey] = item[itemKey]
          }
        }
        obj['sampleJson'] = JSON.stringify(jsonObj)
        list.push(obj)
      })
      return list
    },
    // 审核通过 及驳回
    handleAudit(status, title) {
      this.handleSetStatus(this.form.id, status, title);
    },
    // 批量处理状态
    handleSetStatus(ids, status, title) {
      this.loading = true
      setStatus({ids: ids, status: status}).then((res) => {
        const message = res.data.message
        this.$message.success(message || title)
        this.handleClose()
        this.$parent.refresh()
      })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style scoped lang="scss">

</style>
