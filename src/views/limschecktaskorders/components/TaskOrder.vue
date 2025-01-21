<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'

const animationDuration = 2000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    chartData:{
      type:Object,
      default:function(){
        return {}
      }
    },
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.initChart()
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top:10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: [$i18n.t("checkTaskOrders.taskQty"),$i18n.t("checkTaskOrders.amountCompleted"),$i18n.t("checkTaskOrders.quantityCompletedTime"),$i18n.t("checkTaskOrders.quantityAvailable"),$i18n.t("checkTaskOrders.quantity")],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          min: 0,
          // interval: 50,
          axisTick: {
            show: false
          }
        }],
        series: [
          {
            type: 'bar',
            barWidth: '15%',
            barGap: '0%',
            data: [
              {
                value: this.chartData.taskQty || 0,
                itemStyle: {
                  color: '#07BB10'
                }
              },              {
                value: this.chartData.finishQty || 0,
                itemStyle: {
                  color: '#F49A0A'
                }
              },              {
                value: this.chartData.timeFinishQty || 0,
                itemStyle: {
                  color: '#F55027'
                }
              },              {
                value: this.chartData.availableQty || 0,
                itemStyle: {
                  color: '#FFB980'
                }
              },
              {
                value: this.chartData.reportQty || 0,
                itemStyle: {
                  color: '#D87A80'
                }
              },
            ],
            animationDuration
          },
        ]
      })
    }
  }
}
</script>
