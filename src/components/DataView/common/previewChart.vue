<template>
  <div class="data-view-chart">
    <slot></slot>
    <!-- :theme="ThemeConfigMap[theme].theme" -->
    <component
      :is="item.chartType + '_' + item.chartVersion"
      :item="item"
      :update-options="updateOptions"
      @init="chartInit"
    />
  </div>
</template>
<script>
import "../components/index";
import ThemeConfigMap from "@/components/DataView/themes/theme-config-map";

export default {
  name: "previewChart",
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    theme: {
      type: String,
      default() {
        return "";
      },
    },
    api: Function,
  },
  data() {
    return {
      updateOptions: {
        notMerge: true,
        lazyUpdate: false,
      },
      chart: null,
      timer: null,
      changeTimer: null,
      // ThemeConfigMap,
    };
  },
  computed: {
    refresh() {
      return this.item.refresh;
    },
  },
  watch: {
    refresh: function (newVal) {
      if (newVal === "true") {
        if (this.timer === null) {
          this.setTimer(this.item.interval);
        }
      } else if (newVal === "false") {
        if (this.timer !== null) {
          clearInterval(this.timer);
          this.timer = null;
        }
      }
    },
  },
  destroyed() {
    if (this.timer !== null) {
      clearInterval(this.timer);
    }
    if (this.changeTimer !== null) {
      clearInterval(this.changeTimer);
    }
  },
  mounted() {
    this.handleRestData();
  },
  methods: {
    setTimer: function (interval) {
      this.timer = setInterval(() => {}, interval);
    },
    setChangeTimer: function () {
      let index = 0;
      this.changeTimer = setInterval(() => {
        this.changeHighLightItem(index);
        index++;
      }, 2000);
    },

    handleRestData(data = {}) {
      if (this.api) {
        this.api(data).then((res) => {
          console.log(res);
          this.item.data = res.data.result;
        });
      }
    },

    /**
     * 轮播ECharts组件
     * @param index 用来计算当前Index
     */
    changeHighLightItem(index) {
      const length = this.item.option.series[0].data.length;
      if (this.chart !== null) {
        this.chart.dispatchAction({
          type: "downplay",
          seriesIndex: 0,
        });
        this.chart.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: index % length,
        });
      }
    },
    chartInit({ chart }) {
      this.chart = chart;
    },
  },
};
</script>
