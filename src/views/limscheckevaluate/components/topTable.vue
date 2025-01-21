<template>
  <div>
    <div class="title">{{ $i18n.t("checkEvaluate.testReport") }}</div>
    <div class="title title1">
      <span>{{ $i18n.t('checkEvaluate.entrustCode') }}：{{data.code}}</span>
      <span>{{ $i18n.t('checkEvaluate.reportDate') }}：{{data.updateTime}}</span>
    </div>
    <table>
      <tr>
        <td class="column">{{ $i18n.t("checkEvaluate.sampleName") }}</td>
        <td colspan="3" class="content">{{[...new Set(data.itemsList.map(i=>i.sampleName))].join('/')}}</td>
      </tr>
    </table>
<!--    <el-descriptions class="margin-top" :column="2"  border :labelStyle="labelStyle" :contentStyle="contentStyle">-->
<!--      <el-descriptions-item>-->
<!--        <template slot="label">-->
<!--          <i class="el-icon-user"></i>-->
<!--          用户名-->
<!--        </template>-->
<!--        kooriookami-->
<!--      </el-descriptions-item>-->
<!--      <el-descriptions-item>-->
<!--        <template slot="label">-->
<!--          <i class="el-icon-mobile-phone"></i>-->
<!--          手机号-->
<!--        </template>-->
<!--        18100000000-->
<!--      </el-descriptions-item>-->
<!--      <el-descriptions-item>-->
<!--        <template slot="label">-->
<!--          <i class="el-icon-location-outline"></i>-->
<!--          居住地-->
<!--        </template>-->
<!--        苏州市-->
<!--      </el-descriptions-item>-->
<!--      <el-descriptions-item>-->
<!--        <template slot="label">-->
<!--          <i class="el-icon-tickets"></i>-->
<!--          备注-->
<!--        </template>-->
<!--        <el-tag size="small">学校</el-tag>-->
<!--      </el-descriptions-item>-->
<!--      <el-descriptions-item>-->
<!--        <template slot="label">-->
<!--          <i class="el-icon-office-building"></i>-->
<!--          联系地址-->
<!--        </template>-->
<!--        江苏省苏州市吴中区吴中大道 1188 号-->
<!--      </el-descriptions-item>-->
<!--    </el-descriptions>-->
  </div>
</template>

<script>
export default {
  name: "topTable",
  props: {
    data: {
      type: Object,
      default: () =>({})
    },
  },
  data() {
    return {
      labelStyle:{background:'#EFF2FB',color:'#666666',fontWeight:600,textAlign:'center',width:'200px'},
      contentStyle:{textAlign:'center'}
    }
  },
}
</script>

<style scoped lang="scss">
  .title {
    background:#EFF2FB;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #dedede;
    border-bottom: none;
    padding: 8px 20px;
  }
  .title1 {
    justify-content: space-between;
  }
  ::v-deep .el-descriptions-row:last-child {
    th,td{
      border-bottom: none;
    }
  }
  table {
    width: 100%;
    font-size: 12px;
    color: #606266;
    text-align: center;
    border-collapse: collapse;
    tr{
      td{
        border:1px solid #dfe6ec;
        text-align: center;
        padding: 8px 10px;
        box-sizing: border-box;
        border-bottom: none;
      }
      .column {
        width: 200px;
        font-weight:600;
        background:#EFF2FB;
        color:#666666;
      }
    }
  }
</style>
