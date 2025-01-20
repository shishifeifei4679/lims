<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from "echarts";
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
      default: '160px'
    },
    complatedData:{
      type:Array,
      default:()=>{
        return []
      }
    }
  },
  watch: {
    complatedData: {
      deep: true,
      handler(val) {
        this.initChart()
      }
    }
  },
  data() {
    return {
      chart: null
    }
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
      if(!this.chart) {
        this.chart = echarts.init(this.$el, 'macarons')
      }
      this.chart.setOption({
        tooltip: {
          formatter: '{a}：{c}%'
        },
        series: [{
          name: $i18n.t("checkReportCenter.completionRate"),
          type: 'gauge',
          radius:'90%',
          center:['50%','60%'],
          min: 0,                 // 最小的数据值,默认 0 。映射到 minAngle。
          max: 100,               // 最大的数据值,默认 100 。映射到 maxAngle。
          splitNumber: 5,        // 仪表盘刻度的分割段数,默认 10。
          progress: {
            show: true
          },
          axisLine: {
            lineStyle: {
              width: 8 // 这个是修改宽度的属性
            }
          },
          axisTick: {             // 刻度(线)样式。
            show: true,             // 是否显示刻度(线),默认 true。
            splitNumber: 5,         // 分隔线之间分割的刻度数,默认 5。
            length: 8,              // 刻度线长。支持相对半径的百分比,默认 8。
            lineStyle: {            // 刻度线样式。
              color: "#eee",              //线的颜色,默认 #eee。
              opacity: 1,                 //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
              width: 1,                   //线度,默认 1。
              type: "solid",              //线的类型,默认 solid。 此外还有 dashed,dotted
              shadowBlur: 10,             //(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
              shadowColor: "#fff",        //阴影颜色。支持的格式同color。
            },
          },
          axisLabel: {            // 刻度标签。
            show: true,             // 是否显示标签,默认 true。
            distance: 3,            // 标签与刻度线的距离,默认 5。
            fontSize: 10,           // 文字的字体大小,默认 5。
            formatter: "{value}",   // 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。 示例:// 使用字符串模板，模板变量为刻度默认标签 {value},如:formatter: '{value} kg'; // 使用函数模板，函数参数分别为刻度数值,如formatter: function (value) {return value + 'km/h';}
          },
          detail: {
            valueAnimation: true,
            formatter: '{value}%',
            fontSize: 16,
            color:'black',
            offsetCenter: [0, '65%']
          },
          data:this.complatedData
        }]
      })
    }
  }
}
</script>
