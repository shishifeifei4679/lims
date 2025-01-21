<template>
  <div>
    <ele-page
      maxHeight="calc(100vh - 310px - 216px)"
      v-loading="loading"
      :formConfig="searchConfig"
      ref="eleTable"
      :column="column"
      :getList="getList"
      uniqueId="limsCheckTaskTable"
      :transFormdata="transFormdata"
      :initForm="initForm"
      :pagination="false"
      @handleReset = "handleReset"
    >
    </ele-page>
    <el-row>
      <el-col :span="24" class="card-box">
        <div style="width: 100%; height: 300px; margin-top: 10px;">
          <task-order :chartData="data" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { searchConfig } from "./config";
import { getTaskReportEntity } from "@/api/limscheckreportcenter/limsCheckReportCenter";
import TaskOrder from "@/views/limschecktaskorders/components/TaskOrder.vue";
import dayjs from "dayjs";
export default {
  name: "index",
  components: {
    TaskOrder,
  },
  data() {
    return {
      loading: false,
      searchConfig,
      getList: getTaskReportEntity,
      initForm: {date:[dayjs().format('YYYY-MM-01'),dayjs().format('YYYY-MM-DD')]},
      data: {},
      column: [
        {
          label: $i18n.t("checkTaskOrders.entrustedStatistics"),
          children: [
            {
              prop: "taskQty",
              label: $i18n.t("checkTaskOrders.taskQty"),
              align: "center",
              minWidth:160
            },
            {
              prop: "finishQty",
              label: $i18n.t("checkTaskOrders.finishQty"),
              align: "center",
              minWidth:160
            },
            {
              prop: "finishRate",
              label: $i18n.t("checkTaskOrders.finishRate"),
              align: "center",
              minWidth:160
            },
            {
              prop: "timeFinishQty",
              label: $i18n.t("checkTaskOrders.timeFinishQty"),
              align: "center",
              minWidth:160
            },
            {
              prop: "availableQty",
              label: $i18n.t("checkTaskOrders.availableQty"),
              align: "center",
              minWidth:160
            },
            {
              prop: "availableRate",
              label: $i18n.t("checkTaskOrders.availableRate"),
              align: "center",
              minWidth:160
            },
            {
              prop: "reportQty",
              label: $i18n.t("checkTaskOrders.reportQty"),
              align: "center",
              minWidth:160
            },
            {
              prop: "qualifiedRate",
              label: $i18n.t("checkTaskOrders.qualifiedRate"),
              align: "center",
              minWidth:160
            },
          ],
        },
      ],
    };
  },
  methods: {
    handleReset() {
      this.$set(this.initForm,'date',[
        dayjs().format("YYYY-MM-01"),
        dayjs().format("YYYY-MM-DD"),
      ])
      this.$refs.eleTable.refresh()
    },
    transFormdata(data) {
      this.data = data.data.result;
      for (const key in data.data.result) {
        if (key.includes("Rate")) {
          data.data.result[key] = data.data.result[key] + "%";
        }
      }
      return Promise.resolve({
        records: [{ ...data.data.result }],
      });
    },
  },
};
</script>

<style scoped></style>
