import { approvalProcess as getProgress } from "@/api/limsCheckTask/limsCheckTask";

export default {
  data() {
    return {
      stepsArray: [],
      nowStep: 0,
      sampleCount: 0,
    };
  },
  methods: {
    async getSteps(isAdd=true, getId="") {
      if (isAdd) {
        this.stepsArray = [];
        this.nowStep = 1;
        return;
      }
      const progressData = (await getProgress(getId)).data.result;
      let reportFunc = item => ({
        content: `${ $i18n.t("common.reviewer") }：${item.operatorName ?? ""}`,
        timestamp: item.operateTime ?? "",
        color: "#1890ff"
      });

      let detectFunc = item => ({
        content: `${ $i18n.t("common.chiefExaminer") }：${item.operatorName ?? ""}`,
        timestamp: item.operateTime ?? "",
        code: `${item.sampleName ?? ""}`,
        color: "#1890ff"
      });
      let evaluateFunc = item => ({
        content: `${ $i18n.t("common.appraiser") }：${item.operatorName ?? ""}`,
        timestamp: item.operateTime ?? "",
        color: "#1890ff"
      });

      let operateName = progressData.operateRecordList
        ? progressData.operateRecordList.map(item => item.operateName)
        : [];

      let againIndex = operateName.lastIndexOf($i18n.t("common.retest"))
      let backIndex = operateName.lastIndexOf($i18n.t("common.entireReturn"));

      if (againIndex > -1) {
        progressData.checkTaskStage = 1;

        reportFunc = () => ({
          content: $i18n.t("common.retest"),
          color: "#C0C4CC"
        });
      }
      if (backIndex > -1 && againIndex < 0) {
        progressData.checkTaskStage -= 1;

        detectFunc = () => ({
          content: $i18n.t("common.entireReturn"),
          color: "#C0C4CC"
        });
      }

      this.stepsArray = [
        [
          {
            content: `${$i18n.t("common.client")}：${progressData.entrustName ?? ""}`,
            timestamp: progressData.createTime ?? "",
            color: "#1890ff"
          }
        ],
        this.handleList(progressData.sampleList, null, item => ({
          content: `${$i18n.t("checkTask.receiver")}：${item.receiver ?? ""}`,
          timestamp: item.receiveTime ?? "",
          code: `${item.sampleName ?? ""}`,
          color: "#1890ff"
        })),
        this.handleList(
          progressData.operateRecordList,
          item => item.operateStage == 3,
          detectFunc
        ),
        this.handleList(
          progressData.operateRecordList,
          item => item.operateStage == 4,
          reportFunc
        ).slice(0, 1),
        this.handleList(
          progressData.operateRecordList,
          item => item.operateStage == 5,
          evaluateFunc
        ).slice(0, 1)
      ];

      this.sampleCount = progressData.sampleCount;

      if (progressData.checkTaskStage == 2) {
        this.nowStep =
          !progressData.sampleList ||
          progressData.sampleList.length != this.sampleCount
            ? progressData.checkTaskStage
            : progressData.checkTaskStage + 1;
      } else if (progressData.checkTaskStage == 3) {
        this.nowStep =
          progressData.operateRecordList.filter(item => item.operateStage == 3)
            .length != this.sampleCount
            ? progressData.checkTaskStage
            : progressData.checkTaskStage + 1;
      } else {
        this.nowStep = progressData.checkTaskStage + 1;
      }
    },
    handleList(array, filterFunc, mapFunc) {
      let handleArr = array || [];
      if (!filterFunc) {
        return handleArr.map(mapFunc);
      }
      return handleArr.filter(filterFunc).map(mapFunc);
    }
  }
};
