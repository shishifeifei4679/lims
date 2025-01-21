<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'

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
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      chart: null,
      rate: []
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        const keys = Object.keys(val)
        if (keys.length) {
          let rateArr = []
          for (let i = 0; i < keys.length; i++) {
            let arr_rate = [this.getWeekDay(i), this.chartData[keys[i]]]
            rateArr.push(arr_rate)
          }
          this.rate = rateArr
          this.$nextTick(() => {
            this.initChart()
          })
        }
      }
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getWeekDay(index) {
      let days = [
        $i18n.t('checkReportCenter.Monday'),
        $i18n.t('checkReportCenter.tuesday'),
        $i18n.t('checkReportCenter.wednesday'),
        $i18n.t('checkReportCenter.thursday'),
        $i18n.t('checkReportCenter.friday'),
        $i18n.t('checkReportCenter.saturday'),
        $i18n.t('checkReportCenter.sunday')
      ]
      return days[index]
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions()
    },
    setOptions() {
      this.chart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [$i18n.t('checkReportCenter.qualificationRateTest')]
        },
        xAxis: [
          {
            type: 'category',
            data: [
              $i18n.t('checkReportCenter.Monday'),
              $i18n.t('checkReportCenter.tuesday'),
              $i18n.t('checkReportCenter.wednesday'),
              $i18n.t('checkReportCenter.thursday'),
              $i18n.t('checkReportCenter.friday'),
              $i18n.t('checkReportCenter.saturday'),
              $i18n.t('checkReportCenter.sunday')
            ],
            axisTick: {
              show: false //隐藏X轴刻度
            },
            axisLabel: {
              show: true,
              margin: 12,
              fontSize: 12,
              textStyle: {
                color: 'black' //X轴文字颜色
              },
              interval: 0
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: $i18n.t('checkReportCenter.qualificationRate2'),
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            type: 'line',
            name: $i18n.t('checkReportCenter.qualificationRate'),
            itemStyle: {
              /*设置折线颜色*/
              normal: {
                color: '#EF6F07'
              }
            },
            data: this.rate
          }
        ]
      })
    }
  }
}
</script>
