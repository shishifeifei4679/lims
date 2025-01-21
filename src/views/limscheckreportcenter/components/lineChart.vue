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
      count: []
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        const keys = Object.keys(val)
        if (keys.length) {
          let countArr = []
          for (let i = 0; i < keys.length; i++) {
            let arr_count = [this.getWeekDay(i), this.chartData[keys[i]]]
            countArr.push(arr_count)
          }
          this.count = countArr
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
          data: [$i18n.t('checkReportCenter.entrust')]
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
            name: $i18n.t('checkReportCenter.entrust2'),
            min: 0,
            max: 100,
            interval: 10,
            axisLabel: {
              formatter: '{value} '
            }
          }
        ],
        series: [
          {
            type: 'bar',
            name: $i18n.t('checkReportCenter.entrust'),
            barWidth: 40,
            /*设置柱状图颜色*/
            itemStyle: {
              normal: {
                color: '#0C6CC5'
              }
            },
            data: this.count
          }
        ]
      })
    }
  }
}
</script>
