// ================================================== 图表 ==================================================
import { getScatterNormalConfig_1 } from "./chart/scatter/normal/1/scatter-normal-config";

import { getLineNormalConfig_1 } from "./chart/line/normal/1/line-normal-config";
import { getLineAreaConfig_1 } from "./chart/line/area/1/line-area-config";

import { getHistogramNormalConfig_1 } from "./chart/histogram/normal/1/histogram-normal-config";
import { getPictorialBarConfig_1 } from "./chart/histogram/pictorial/1/pictorial-bar-config";

// import { getMapChinaConfig_1 } from "./chart/map/china/1/map-china-config";

import { getPieNormalConfig_1 } from "./chart/pie/normal/1/pie-normal-config";

import { getRadarNormalConfig_1 } from "./chart/radar/radar/1/radar-normal-config";
const OptionConfigMap = {
  ScatterNormal_1: getScatterNormalConfig_1,

  LineNormal_1: getLineNormalConfig_1,
  LineArea_1: getLineAreaConfig_1,

  HistogramNormal_1: getHistogramNormalConfig_1,
  PictorialBar_1: getPictorialBarConfig_1,

  // MapChina_1: getMapChinaConfig_1,

  PieNormal_1: getPieNormalConfig_1,

  RadarNormal_1: getRadarNormalConfig_1,
};

export default OptionConfigMap;
