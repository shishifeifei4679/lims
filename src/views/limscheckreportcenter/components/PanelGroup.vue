<template>
  <el-row :gutter="10" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel checkTask">
        <div class="card-panel-icon-wrapper icon-people">
          <img src="@/assets/svg/dicengjiagou.svg" alt="">
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ $i18n.t("checkReportCenter.ntrustedOrderse") }}
          </div>
          <count-to
            :start-val="0"
            :end-val="countList.sumTaskQty"
            :duration="3000"
            :suffix='" " + $i18n.t("checkReportCenter.item")'
            class="card-panel-num"
          />
        </div>
        <div class="data-description" style="color:rgb(156, 154, 254);">
          <div class="data-text">
            <count-to
              :start-val="0"
              :end-val="countList.currentMonthTaskQty"
              :duration="3000"
              :prefix='$i18n.t("checkReportCenter.thisMonth") + "："'
              class="card-panel-num"
            />
          </div>

          <div class="data-text">
            <count-to
              :start-val="0"
              :end-val="countList.todayTaskQty"
              :duration="3000"
              :prefix='$i18n.t("checkReportCenter.today") + "："'
              class="card-panel-num"
            />
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel checkSample">
        <div class="card-panel-icon-wrapper icon-message">
          <img src="@/assets/svg/gongyi.svg" alt="">
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ $i18n.t("checkReportCenter.samplesNumber") }}
          </div>
          <count-to
            :start-val="0"
            :end-val="countList.sumSampleQty"
            :duration="3000"
            :suffix='" " + $i18n.t("checkReportCenter.item")'
            class="card-panel-num"
          />
        </div>
        <div class="data-description" style="color:rgb(255, 164, 84);">
          <div class="data-text">
            <count-to
              :start-val="0"
              :end-val="countList.currentMonthSampleQty"
              :duration="3000"
              :prefix='$i18n.t("checkReportCenter.thisMonth") + "："'
              class="card-panel-num"
            />
          </div>
          <div class="data-text">
            <count-to
              :start-val="0"
              :end-val="countList.todaySampleQty"
              :duration="3000"
              :prefix='$i18n.t("checkReportCenter.today") + "："'
              class="card-panel-num"
            />
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel checkReport">
        <div class="card-panel-icon-wrapper icon-money">
          <img src="@/assets/svg/dingdan.svg" alt="">
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ $i18n.t("checkReportCenter.reportsNumber") }}
          </div>
          <count-to
            :start-val="0"
            :end-val="countList.sumReportQty"
            :duration="3000"
            :suffix='" " + $i18n.t("checkReportCenter.portion")'
            class="card-panel-num"
          />
        </div>
        <div class="data-description" style="color:rgb(255, 83, 83);">
          <div class="data-text">
            <count-to
              :start-val="0"
              :end-val="countList.currentMonthReportQty"
              :duration="3000"
              :prefix='$i18n.t("checkReportCenter.thisMonth") + "："'
              class="card-panel-num"
            />
          </div>
          <div class="data-text">
            <count-to
              :start-val="0"
              :end-val="countList.todayReportQty"
              :duration="3000"
              :prefix='$i18n.t("checkReportCenter.today") + "："'
              class="card-panel-num"
            />
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel checkResult">
        <div class="card-panel-icon-wrapper icon-shopping">
          <img src="@/assets/svg/anquanyinsi.svg" alt="">
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ $i18n.t("checkReportCenter.testingNumberThisWeek") }}
          </div>
          <count-to
            :start-val="0"
            :end-val="countList.currentWeekItemsQty"
            :duration="3000"
            :suffix='" " + $i18n.t("checkReportCenter.item")'
            class="card-panel-num"
          />
        </div>
        <div class="data-description" style="color:rgb(255, 83, 83);">
          <div class="data-text">
            <count-to
              :start-val="0"
              :end-val="countList.lastWeekItemsQty"
              :duration="3000"
              :prefix='$i18n.t("checkReportCenter.lastWeek") + "："'
              class="card-panel-num"
            />
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
export default {
  components: {
    CountTo,
  },
  props: {
    countList: {
      type: Object,
      default: () => ({})
    },
  },
  data(){
    return{}
  },
  created(){
    // this.getData()
  },
  methods: {
    // getData(){
    //   getCountList()
    //     .then(res=>{
    //       this.countList = res.data
    //     })
    //     .catch(err=>{
    //       console.log(err)
    //     })
    // },
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 0;

  .card-panel-col {
    margin-bottom: 24px;
  }
  .checkTask{
    background: url(../../../assets/images/bg1.png) no-repeat;
    background-size: 100% 100%;
  }
  .checkSample{
    background: url(../../../assets/images/bg2.png) no-repeat;
    background-size: 100% 100%;
  }
  .checkReport{
    background: url(../../../assets/images/bg3.png) no-repeat;
    background-size: 100% 100%;
  }
  .checkResult{
    background: url(../../../assets/images/bg4.png) no-repeat;
    background-size: 100% 100%;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    // background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    border-radius: 8px;
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #36a3f7;
        img {
          width: 32px;
          height: 32px;
          filter: drop-shadow(#fff 100px 0);
          transform: translateX(-100px);
        }
      }

      .icon-message {
        background: #f7c436;
        img {
          width: 32px;
          height: 32px;
          filter: drop-shadow(#fff 100px 0);
          transform: translateX(-100px);
        }
      }

      .icon-money {
        background: #f4516c;
        img {
          width: 32px;
          height: 32px;
          filter: drop-shadow(#fff 100px 0);
          transform: translateX(-100px);
        }
      }

      .icon-shopping {
        background: #34bfa3;
        img {
          width: 32px;
          height: 32px;
          filter: drop-shadow(#fff 100px 0);
          transform: translateX(-100px);
        }
      }
    }

    .icon-people{
      color: #40c9c6;
      img {
        width: 32px;
        height: 32px;
        filter: drop-shadow(#40c9c6 100px 0);
        transform: translateX(-100px);
      }
    }

    .icon-message {
      color: #36a3f7;
      img {
        width: 32px;
        height: 32px;
        filter: drop-shadow(#36a3f7 100px 0);
        transform: translateX(-100px);
      }
    }

    .icon-money {
      color: #f4516c;
      img {
        width: 32px;
        height: 32px;
        filter: drop-shadow(#f4516c 100px 0);
        transform: translateX(-100px);
      }
    }

    .icon-shopping {
      color: #34bfa3;
      img {
        width: 32px;
        height: 32px;
        filter: drop-shadow(#34bfa3 100px 0);
        transform: translateX(-100px);
      }
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 20px 0 0 8px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 32px;
    }

    .card-panel-description {
      float: left;
      font-weight: bold;
      margin: 26px 0 26px 7%;

      .card-panel-text {
        line-height: 15px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 17px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 17px;
      }
    }

    .data-description{
      line-height: 18px;
      font-weight: 600;
      position: absolute;;
      top: 47px;
      right: 36px;
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }
  .data-description{
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 23px auto !important;
      float: none !important;
    }
  }
}
</style>
