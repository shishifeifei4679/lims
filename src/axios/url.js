import { localUrl } from "./localUrl";
export default function baseUrl() {
  let baseUrl = {};
  switch (process.env.VUE_APP_CURRENTMODE) {
    case "dev":
      baseUrl = {
        adminUrl: localUrl.adminUrl,
        dataUrl: localUrl.dataUrl,
        eamUrl: localUrl.eamUrl,
        emsUrl: localUrl.emsUrl,
        iotUrl: localUrl.iotUrl,
        limsUrl: localUrl.limsUrl,
        mqttUrl: localUrl.mqttUrl,
        minioUrl: localUrl.minioUrl,
        generalUrl: localUrl.generalUrl
      };
      break;
    default:
      baseUrl = {
        adminUrl: process.env.VUE_APP_BASEURL,
        dataUrl: process.env.VUE_APP_DATAURL,
        eamUrl: process.env.VUE_APP_EAMURL,
        emsUrl: process.env.VUE_APP_EMSURL,
        iotUrl: process.env.VUE_APP_IOTURL,
        limsUrl: process.env.VUE_APP_LIMSURL,
        mqttUrl: process.env.VUE_APP_MQTTURL,
        minioUrl: process.env.VUE_APP_MINIOURL,
        generalUrl: process.env.VUE_APP_GENERALURL
      };
  }
  return baseUrl;
}
