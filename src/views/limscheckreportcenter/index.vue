<template>
  <div class="dashboard-editor-container">
    <panel-group :countList="data"/>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class=" chart-wrapper chart-line">
          <div class="titleBox">
            <div class="titleLeftBox">
              <div class="title-shu"></div>
              <p class="tits">{{ $i18n.t("checkReportCenter.dynamicsThisWeek") }}</p>
            </div>
          </div>
          <line-chart :chart-data="data.currentWeekEveryDayTaskQtyVO || {}"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper chart-line">
          <div class="titleBox">
            <div class="titleLeftBox">
              <div class="title-shu"></div>
              <p class="tits">{{ $i18n.t("checkReportCenter.qualificationRateStatistics") }}</p>
            </div>
          </div>
          <line-chart-2 :chart-data="data.currentWeekEveryDayRateVO || {}"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper" id="main-container">
          <div class="titleBox">
            <div class="titleLeftBox">
              <div class="title-shu"></div>
              <p class="tits">{{ $i18n.t("checkReportCenter.statisticsOfEntrustmentProgress") }}</p>
            </div>
            <div class="titleRightBox">
              <el-date-picker
                v-model="date"
                size='mini'
                style="width:250px"
                type="daterange"
                value-format="yyyy-MM-dd"
                :picker-options="endDatePicker"
                @change="changeDate"
                :clearable="false"
                :editable="false"
                :range-separator="$i18n.t('checkReportCenter.to')"
                :start-placeholder="$i18n.t('checkReportCenter.startDate')"
                :end-placeholder="$i18n.t('checkReportCenter.endDate')">
              </el-date-picker>
            </div>
          </div>
          <div  class="hg-contain">
            <div class="hg">
              <!-- <div class="title-shu"></div>
              <p class="tits">{{ $i18n.t("checkReportCenter.qualificationRateStatistics") }}</p> -->
              <div class="chartBox">
                <qualified-Chart :qualifiedData='qualifiedData'/>
                <p>{{ $i18n.t("checkReportCenter.completeQualificationRate") }}</p>
              </div>
            </div>
            <div class="hg">
              <!-- <div class="title-shu"></div>
              <p class="tits">完成进度统计</p> -->
              <div class="chartBox">
                <complated-Chart :complatedData='complatedData'/>
                <p>{{ $i18n.t("checkReportCenter.entrustedCompletionRate") }}</p>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper" id="main-container">
          <div class="titleBox">
            <div class="titleLeftBox">
              <div class="title-shu"></div>
              <p class="tits">{{ $i18n.t("checkReportCenter.sampleProgressThisWeek") }}</p>
            </div>
          </div>
          <div class="progress-container">
            <div class="progress sample">
              <span class="title">{{ $i18n.t("checkReportCenter.sampleReceiving") }}</span>
              <div class="progressItem">
                <el-progress  style="width:70%;margin-top:8px;" :show-text='false' :percentage="100"/>
                <div class="right" style="color:#2194e0">
                  <span class="samplePer">{{ $i18n.t("checkReportCenter.received") }}</span><span>{{data.receivedSampleQty}}</span>
                </div>
              </div>
              <div class="progressItem">
                <el-progress  style="width:70%;margin-top:8px;" color="#EE8625" :show-text='false' :percentage="100"/>
                <div class="right" style="color:#EE8625">
                  <span class="samplePer">{{ $i18n.t("checkReportCenter.toBeAccepted") }}</span><span>{{data.notReceivedSampleQty}}</span>
                </div>
              </div>
              <div class="progressItem">
                <el-progress  style="width:70%;margin-top:8px;" color="#F5B57A" :show-text='false' :percentage="100"/>
                <div class="right" style="color:#F5B57A">
                  <span class="samplePer">{{ $i18n.t("checkReportCenter.returned") }}</span><span>{{data.returnedSampleQty}}</span>
                </div>
              </div>
<!--              <div class="progressItem">-->
<!--                <el-progress  style="width:70%;margin-top:8px;" color="#F41C15" :show-text='false' :percentage="100"/>-->
<!--                <div class="right" style="color:#F41C15">-->
<!--                  <span class="samplePer">已作废</span><span>{{data.obsoleteSampleQty}}</span>-->
<!--                </div>-->
<!--              </div>-->
            </div>
            <div class="progress check">
              <span class="title">{{ $i18n.t("checkReportCenter.detected") }}</span>
              <div class="progressItem">
                <el-progress  style="width:70%;margin-top:10px;" :show-text='false' :percentage="checkPercentage?checkPercentage:0" :stroke-width="10"/>
                <div class="right">
                  <span class="percentage">{{data.detectedSampleQty}}/{{data.currentWeekItemsQty}}</span>
                </div>
              </div>
            </div>
            <div class="progress report">
              <span class="title">{{ $i18n.t("checkReportCenter.reported") }}</span>
              <div class="progressItem">
                <el-progress  style="width:70%;margin-top:10px;" :show-text='false' :percentage="reprotePercentage?reprotePercentage:0" :stroke-width="10"/>
                <div class="right">
                  <span class="percentage">{{data.reportSampleQty}}/{{data.currentWeekItemsQty}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import dayjs from "dayjs";
import PanelGroup from "@/views/limscheckreportcenter/components/PanelGroup.vue";
import LineChart from "@/views/limscheckreportcenter/components/lineChart.vue"
import LineChart2 from "@/views/limscheckreportcenter/components/lineChart2.vue";
import QualifiedChart from "@/views/limscheckreportcenter/components/qualifiedChart.vue";
import ComplatedChart from "@/views/limscheckreportcenter/components/complatedChart.vue";
import {getHomePageEntity,getTaskReportEntity} from "@/api/limscheckreportcenter/limsCheckReportCenter";
export default {
  name: "index",
  components: {
    PanelGroup,
    LineChart,
    LineChart2,
    QualifiedChart,
    ComplatedChart
  },
  data() {
    return {
      date: [dayjs().subtract(6, 'day').format('YYYY-MM-DD'),dayjs().format('YYYY-MM-DD')],
      endDatePicker: {
        disabledDate(time) {
          let t = new Date().getDate();
          // 如果想包含本月本月 - 8.64e7 * t 就不需要了，
          // 如果想之前的不能选择把 > 换成 <
          return time.getTime() > Date.now();
        },
      },
      data:{},
      checkPercentage:0,
      reprotePercentage:0,
      qualifiedData:[],
      complatedData:[],
    }
  },
  created(){
    this.getData()
    this.getPieChartData()
  },
  methods: {

    getData(){
      getHomePageEntity().then(res=>{
        this.data = res.data.result
        this.checkPercentage = (res.data.result.detectedSampleQty/res.data.result.currentWeekItemsQty) * 100
        this.reprotePercentage = (res.data.result.reportSampleQty/res.data.result.currentWeekItemsQty) * 100
      })
    },
// 切换日期获取饼图数据
    changeDate(val){
      this.getPieChartData()
    },
    // 获取饼图数据
    getPieChartData(){
      getTaskReportEntity({
        startTime:this.date[0],
        endTime: this.date[1],
      })
        .then(res=>{
          this.qualifiedData = [res.data.result.qualifiedRate || 0]
          this.complatedData = [res.data.result.finishRate || 0]
        })
    },
  },
}
</script>

<style scoped lang="scss">
.dashboard-editor-container {
  padding: 16px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 24px;
    border-radius: 8px;
  }
  .chart-line{
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 24px;
    border-radius: 8px;
  }
  .chart-bar{
    padding-bottom: 10px;
  }
  .titleBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .titleLeftBox {
    display: flex;
  }
  .title-shu{
    width:5px;
    height:24px;
    background: #4998e0;
    border-radius: 2px;
    margin-right: 10px;
    margin-top: 5px;
  }
  .tits{
    color: rgb(85, 85, 85);
    font-size: 14px;
    margin-top: 8px;
  }
}
.bar-container{
  width: 32%;
  height: 282px;
  // height: 138px;
  p{
    text-align: center;
    font-size: 14px;
    margin: auto;
    // color: rgba(0, 0, 0, 0.45);
  }
}
.station,.todo{
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  .task{
    width: 22%;
    height: 70px;
    margin-right: 4px;
    margin-bottom: 25px;
    .card-panel-icon-wrapper{
      cursor: pointer;
      font-size: 14px;
      font-size: 40px;
      text-align: center;
    }
    .taskTitle{
      font-size: 12px;
      text-align: center;
      color: rgba(0, 0, 0, 0.65);
      margin-top: 5px;
    }
  }
}
.station:after,.todo:after {
  display:block;
  content:"";
  width: 22%;
  height:0px;
}
.todo{
  .matters{
    .cicle-icon{
      cursor: pointer;
      width: 46px;
      height: 46px;
      border-radius: 50%;
      margin: 0 auto;
      background: rgba(112, 173, 235,.35);
      font-size: 26px;
      text-align: center;
      line-height: 46px;
    }
  }
}
.progress-container{
  .sample{
    height: 80px;
  }
  .check,.report{
    height: 50px;
  }
  .progress{
    width: 100%;
    margin-bottom: 4px;
    .progressItem {
      display: flex;
      justify-content: space-between;
      .right {
        display: flex;
        justify-content: space-between;
        width: 100px;
        margin-right:4%;
        font-size: 12px;
        .samplePer{
          width: 60px;
        }
      }
      .percentage{
        width: 100%;
        text-align: end;
        font-size: 14px;
        margin-right: 4%;
        color:#2194e0;
      }
    }
    .title{
      font-size: 12px;
      color:#4a47d4;
    }
  }
}
#main-container{
  height: 245px;
}
.hg-contain{
  // background: red;
  width: 100%;
  height: 151px;
  display: flex;
  justify-content: space-between;
  .hg{
    width: 48%;
    height: 151px;
    // background: pink;
    .chartBox{
      width: 100%;
      height: 169px;
      // background: greenyellow;
      // margin-top: -11px;
      p{
        text-align: center;
        font-size: 14px;
        margin: auto;
      }
    }
  }
}
@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
