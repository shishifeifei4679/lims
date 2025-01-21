<template>
  <div class="stepsWrap">
    <el-steps :active="active" finish-status="success">
      <el-step v-for="(item, index) in steps" :key="index">
        <template v-slot:title>
          <div class="titleWrap">
            <div>{{ item.name }}</div>
            <div
              style="display: flex; align-items: center"
              v-if="index === 1"
            >
              <div class="stepBar">
                <div
                  class="stepNow"
                  :style="{
                    maxWidth: '100%',
                    width:
                      (item.timeline.length / sampleCount).toFixed(0) * 100 +
                      '%',
                  }"
                ></div>
              </div>
              <div class="stepNum">
                ({{
                  item.timeline.some((_item) => _item.content === "整单退回") ||
                  item.timeline.some((_item) => _item.content === "重测")
                    ? 0
                    : item.timeline.length
                }}/{{ sampleCount }})
              </div>
            </div>
            <div
              style="display: flex; align-items: center"
              v-if="index === 2"
            >
              <div class="stepBar">
                <div
                  class="stepNow"
                  :style="{
                    maxWidth: '100%',
                    width:
                      (sampleCount / item.timeline.length).toFixed(0) * 100 +
                      '%',
                  }"
                ></div>
              </div>
              <div class="stepNum">
                ({{ sampleCount }}/{{
                  item.timeline.some((_item) => _item.content === "整单退回") ||
                  item.timeline.some((_item) => _item.content === "重测")
                    ? 0
                    : item.timeline.length
                }})
              </div>
            </div>
          </div>
        </template>
        <template v-slot:description>
          <stretch
            v-if="(index == 1 || index === 2) && item.timeline.length > 1"
          >
            <el-timeline>
              <el-timeline-item
                v-for="(activity, _index) in item.timeline"
                :key="_index"
                :timestamp="activity.timestamp"
                :color="activity.color"
              >
                <p style="margin: 0">{{ activity.code }}</p>
                <p
                  style="
                    margin: 0;
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                  "
                >
                  {{ activity.content }}
                </p>
              </el-timeline-item>
            </el-timeline>
          </stretch>

          <el-timeline v-else>
            <el-timeline-item
              v-for="(activity, _index) in item.timeline"
              :key="_index"
              :timestamp="activity.timestamp"
              :color="activity.color"
            >
              <p style="margin: 3px 0">{{ activity.code }}</p>
              <p
                style="
                  margin: 0;
                  width: 100%;
                  overflow: hidden;
                  white-space: nowrap;
                "
              >
                {{ activity.content }}
              </p>
            </el-timeline-item>
          </el-timeline>
        </template>
      </el-step>
    </el-steps>
  </div>
</template>

<script>
import stretch from "@/components/stretch";
export default {
  props: {
    stepsArray: {
      type: Array,
      default: () => [],
    },
    nowStep: {
      type: Number | String,
      default: 0,
    },
    sampleCount: {
      type: Number | String,
      default: 1,
    },
    nowCounts: {
      type: Number | String,
    },
  },
  components: { stretch },
  created() {},
  mounted() {},
  data() {
    return {
      active: 2,
      steps: [
        {
          name: $i18n.t("common.testCommission"),
          timeline: [],
        },
        {
          name: $i18n.t("common.sampleReception"),
          timeline: [],
        },
        {
          name: $i18n.t("common.sampleTesting"),
          timeline: [],
        },
        {
          name: $i18n.t("common.generateReport"),
        },
        {
          name: $i18n.t("common.evaluate"),
        },
      ],
    };
  },
  computed: {},
  methods: {},
  watch: {
    stepsArray: {
      handler(val) {
        this.steps =
          val.length !== 0
            ? this.steps.map((item, index) => {
                item.timeline = val[index] || [];
                return item;
              })
            : [
                {
                  name: $i18n.t("common.testCommission"),
                  timeline: [],
                },
                {
                  name: $i18n.t("common.sampleReception"),
                  timeline: [],
                },
                {
                  name: $i18n.t("common.sampleTesting"),
                  timeline: [],
                },
                {
                  name: $i18n.t("common.generateReport"),
                },
                {
                  name: $i18n.t("common.evaluate"),
                },
              ];
      },
      immediate: true,
    },
    nowStep: {
      handler(val) {
        this.active = val - 1;
      },
      immediate: true,
    },
  },
};
</script>

<style scoped lang="scss">
.stepsWrap {
  margin: auto;
  width: 95%;
  min-height: 80px;
  padding-bottom: 10px;
}
.titleWrap {
  display: flex;
  align-items: center;
  .stepBar {
    margin: 0 10px 0 10px;
    width: 60px;
    height: 5px;

    border-radius: 5px;
    background-color: #ddd;

    .stepNow {
      width: 0%;
      height: 5px;
      border-radius: 5px;
      background-color: #1890ff;
    }
  }
}
/deep/ .el-timeline {
  padding: 0;
  padding-top: 10px;
  padding-left: 8px;
  .el-timeline-item {
    &:nth-last-of-type(1) {
      padding-bottom: 0;
    }
  }
}
/deep/ .is-success {
  color: #1890ff;
  border-color: #1890ff;
}
/deep/ .el-step__description {
  padding-right: 0;
}
</style>
