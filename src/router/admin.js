export default [
  {
    path: "/index",
    name: "index",
    component: (resolve) => require(["@/views/index/index"], resolve),
    meta: {
      title: "首页"
    }
  },
  //  路由追加
  /** =====================================业务日志===================================== */
  {
    path: "/limsstandarditems",
    name: "limsstandarditems",
    component: (resolve) => require(["@/views/limsstandarditems/index"], resolve),
    meta: {
      title: "检测标准",
    },
  },
  {
    path: "/limsstandarditemshistory",
    name: "limsstandarditemshistory",
    component: (resolve) => require(["@/views/limsstandarditemshistory/index"], resolve),
    meta: {
      title: "检测标准版本历史",
    },
  },
  {
    path: "/limsequipment",
    name: "limsequipment",
    component: (resolve) => require(["@/views/limsequipment/index"], resolve),
    meta: {
      title: "实验室设备管理",
    },
  },
  {
    path: "/limschecksample",
    name: "limschecksample",
    component: (resolve) => require(["@/views/limschecksample/index"], resolve),
    meta: {
      title: "样品管理",
    },
  },
  {
    path: "/limssamplecategory",
    name: "limssamplecategory",
    component: (resolve) => require(["@/views/limssamplecategory/index"], resolve),
    meta: {
      title: "样品类别",
    },
  },
  {
    path: "/limschecktask",
    name: "limschecktask",
    component: (resolve) => require(["@/views/limschecktask/index"], resolve),
    meta: {
      title: "委托管理",
    },
  },
  {
    path: "/limscheckitems",
    name: "limscheckitems",
    component: (resolve) => require(["@/views/limscheckitems/index"], resolve),
    meta: {
      title: "检测管理",
    },
  },
  {
    path: "/limscheckevaluate",
    name: "limscheckevaluate",
    component: (resolve) => require(["@/views/limscheckevaluate/index"], resolve),
    meta: {
      title: "报告管理",
    },
  },
  {
    path: "/limscheckreportcenter",
    name: "limscheckreportcenter",
    component: (resolve) => require(["@/views/limscheckreportcenter/index"], resolve),
    meta: {
      title: "数据分析",
    },
  },
  {
    path: "/limschecktaskorders",
    name: "limschecktaskorders",
    component: (resolve) => require(["@/views/limschecktaskorders/index"], resolve),
    meta: {
      title: "委托单统计",
    },
  },
  {
    path: "/limschecktaskoperaterecord",
    name: "limsCheckTaskOperateRecord",
    component: (resolve) => require(["@/views/limschecktaskoperaterecord/index"], resolve),
    meta: {
      title: "业务日志",
    },
  },
  {
    path: "/limsmeasuringtoolscollectreturn",
    name: "limsmeasuringtoolscollectreturn",
    component: (resolve) => require(["@/views/limsmeasuringtools/measuringtoolscollectreturn/index"], resolve),
    meta: {
      title: "量检具库存",
    },
  },
  {
    path: "/limsmeasuringtoolscollectreturntask",
    name: "limsmeasuringtoolscollectreturntask",
    component: (resolve) => require(["@/views/limsmeasuringtools/measuringToolscollectreturntask/index"], resolve),
    meta: {
      title: "领用归还任务",
    },
  },
  {
    path: "/limsmeasuringtoolscollectreturndetail",
    name: "limsmeasuringtoolscollectreturndetail",
    component: (resolve) => require(["@/views/limsmeasuringtools/measuringToolscollectreturndetail/index"], resolve),
    meta: {
      title: "领用归还记录",
    },
  },
  {
    path: "/measuringtoolsinternalcheck",
    name: "measuringtoolsinternalcheck",
    component: (resolve) => require(["@/views/limsmeasuringtools/measuringtoolsinternalcheck/index"], resolve),
    meta: {
      title: "量检具内部检定",
    },
  },
  {
    path: "/measuringtoolsoutsourcingcheck",
    name: "measuringtoolsoutsourcingcheck",
    component: (resolve) => require(["@/views/limsmeasuringtools/measuringtoolsoutsourcingcheck/index"], resolve),
    meta: {
      title: "量检具委外检定",
    },
  },
  {
    path: "/measuringtoolsoperate",
    name: "measuringtoolsoperate",
    component: (resolve) => require(["@/views/limsmeasuringtools/measuringtoolsoperate/index"], resolve),
    meta: {
      title: "量检具处置管理",
    },
  },
  {
    path: "/measuringtoolsoperatelog",
    name: "measuringtoolsoperatelog",
    component: (resolve) => require(["@/views/limsmeasuringtools/measuringtoolsoperatelog/index"], resolve),
    meta: {
      title: "量检具处置记录",
    },
  },
  {
    path: "/recordMeasuringInstruments",
    name: "recordMeasuringInstruments",
    component: (resolve) => require(["@/views/limsmeasuringtools/recordMeasuringInstruments/index.vue"], resolve),
    meta: {
      title: "量检具履历",
    },
  },
  // 404页面配置必须放在最后
  {
    path: "/*",
    name: "Page404",
    component: (resolve) => require(["@/views/error/404"], resolve),
    meta: {
      title: "404",
    },
  },
]
