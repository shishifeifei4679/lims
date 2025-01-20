<template>
  <div>
    <el-dialog
      class="taskModel"
      :title="$i18n.t('checkEvaluate.evaluate')"
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
      <el-form
        class="evaluateForm"
        ref="form"
        v-model="form"
        label-width="80px"
        label-position="right"
      >
        <el-form-item
          v-for="item in evaluateOptions"
          :label="item.description"
          :key="item.id"
        >
          <el-rate v-model="form[item.id]"
                   :allow-half="true"
                   show-score
                   text-color="#ff9900"
                   score-template="{value}" />
        </el-form-item>
<!--        <el-form-item label="描述" prop="evaluateContent">-->
<!--          <el-input v-model="form.evaluateContent" type="textarea" rows="3" />-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" >
        <el-button type="primary" @click="handleSubmit">{{ $i18n.t("common.ok") }}</el-button>
        <el-button @click="handleClose">{{ $i18n.t('common.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Steps from "@/components/steps";
import stepsMixins from "@/mixins/steps";
import {getDict} from "@/api/common";
import {evaluate} from "@/api/limscheckevaluate/limsCheckEvaluate";
export default {
  name: "scoreDialog",
  mixins: [stepsMixins],
  components: {
    Steps,
  },
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 保存首页选择的行信息
      row:{},
      form:{},
      // 评价项字典
      evaluateOptions: [],
    }
  },
  async created() {
    await this.getDic();
  },
  methods: {
    async init(row){
      this.row = row
      // await this.rowDetail(row.taskId)
      await this.getSteps(false, row.id)
      this.open = true
    },
    handleClose(){
      this.form = {}
      this.open = false
    },
    handleSubmit(){
      const evaluatesList = this.evaluateOptions.map(i=>{
        return {
          evaluateItemId:i.id,
          evaluateItemName:i.description,
          score:this.form[i.id]
        }
      })
      const data = {
        id:this.row.id,
        evaluatesList
      }
      evaluate(data).then(res=>{
        this.handleClose()
        this.$parent.refresh()
      })
    },
    async getDic(){
      const res = await getDict('lims_evaluate_item')
      this.evaluateOptions = res.data.result || []
    }
  },
}
</script>

<style scoped lang="scss">
  /deep/ .el-form-item__label {
    line-height:normal;
  }
</style>
