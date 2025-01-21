import Vue from "vue";

// ================================================== 图表 ==================================================
// 普通散点图
import ScatterNormal_1 from "./chart/scatter/normal/1/scatter-normal";

Vue.component("ScatterNormal_1", ScatterNormal_1);

// 普通折线图
import LineNormal_1 from "./chart/line/normal/1/line-normal";

Vue.component("LineNormal_1", LineNormal_1);

// 折线面积图
import LineArea_1 from "./chart/line/area/1/line-area";

Vue.component("LineArea_1", LineArea_1);

// 普通柱状图
import HistogramNormal_1 from "./chart/histogram/normal/1/histogram-normal";

Vue.component("HistogramNormal_1", HistogramNormal_1);

// 象形柱图
import PictorialBar_1 from "./chart/histogram/pictorial/1/pictorial-bar";

Vue.component("PictorialBar_1", PictorialBar_1);

// 饼图
import PieNormal_1 from "./chart/pie/normal/1/pie-normal";

Vue.component("PieNormal_1", PieNormal_1);

// 雷达图
import RadarNormal_1 from "./chart/radar/radar/1/radar-normal";

Vue.component("RadarNormal_1", RadarNormal_1);
