<!--  -->
<template>
  <div class="">
    <el-dialog
      :title="
        $i18n.t('measuringtoolsoutsourcingcheck.submissionRegistrationTit')
      "
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="() => (dialogVisible = false)"
    >
      <div style="padding: 0px 40px;">
        <el-form label-position="top" :model="ruleForm" ref="ruleForm">
          <el-form-item
            :label="
              $i18n.t('measuringtoolsoutsourcingcheck.submissiontTit') + ':'
            "
            prop="resource"
          >
            <el-radio-group v-model="ruleForm.resource">
              <el-radio
                :label="ite.value"
                :key="i"
                v-for="(ite, i) in optionList"
              >
                <!-- <span style="display: flex;"> -->
                <span>{{ ite.description }}</span>

                <el-popover
                  v-if="type == 'lims_in_send_check_type'"
                  placement="top-start"
                  trigger="hover"
                  :content="msg[ite.value]"
                >
                  <i
                    slot="reference"
                    class="el-icon-question"
                    style="color: #969696; font-size: 14px; margin-left: 4px;"
                  ></i>
                </el-popover>
                <!-- </span> -->
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ $i18n.t("common.cancel") }}
        </el-button>
        <el-button type="primary" @click="submit()" :loading="loading">
          {{ $i18n.t("common.submit") }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//例如：import 《组件名称》 from '《组件路径》';
import { getDict } from "@/api/common";
import {
  registSend,
  registInternalSend,
} from "@/api/limsmeasuringtools/measuringtoolsoutsourcingcheck";
export default {
  name: "",
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    type: {
      type: String,
      default: "lims_out_send_check_type",
    },
  },
  data() {
    //这里存放数据
    return {
      msg: {
        3: $i18n.t("measuringtoolsinternalcheck.msg2"),
        4: $i18n.t("measuringtoolsinternalcheck.msg1"),
      },
      dialogVisible: false,
      ruleForm: { resource: "1" }, //表单字段
      rows: [], //选中的列内容
      optionList: [],
      loading: false,
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    init(data) {
      this.rows = data;
      this.dialogVisible = true;
      if (this.optionList.length) {
        this.ruleForm.resource = this.optionList[0].value;
      }
    },
    async submit() {
      try {
        this.loading = true;
        let data = {
          sendCheckType: this.ruleForm.resource,
          measuringToolCodes: this.rows
            .map((ite) => ite.measuringToolCode)
            .join(),
        };
        let res = null;
        if (this.type == "lims_in_send_check_type") {
          // 内部检定
          res = await registInternalSend(data);
        } else {
          //委外检定
          res = await registSend(data);
        }
        this.$message.success(
          res.data.message || $i18n.t("common.operateSuccess")
        ); // 操作成功
        this.dialogVisible = false;
        this.$parent.refresh();
      } finally {
        this.loading = false;
      }
    },
    async getDic() {
      const res = await getDict(this.type);
      this.optionList = res.data.result || [];
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getDic();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
};
</script>
<style scoped lang="scss"></style>
