<!--  -->
<template>
  <!-- v-loading="mainLoading" -->
  <div class="main-pack" v-loading="mainLoading">
    <div class="left">
      <div class="img">
        <el-image
          fit="cover"
          style="width: 220px; height: 220px;"
          :src="itemData.measuringToolPicPath|| require('../img/img_default.png')"
          :preview-src-list="[itemData.measuringToolPicPath||require('../img/img_default.png')]"
        ></el-image>
        <!-- <div class="img-empty" v-else>{{ $t('recordMeasuringInstruments.msgd3d2') }}</div> -->
      </div>

      <div class="info">
        <h2>{{ itemData.measuringToolName }}</h2>
        <p>{{ $t('recordMeasuringInstruments.measuringToolCode:') }}{{ itemData.measuringToolCode }}</p>
        <p>{{ $t('recordMeasuringInstruments.department:') }}{{ itemData.departmentName }}</p>
        <div class="x-y-center">
          <canvas id="barCode"></canvas>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="tabs-pack">
        <el-tabs v-model="activeName">
          <el-tab-pane  :label="`   `+ $t('recordMeasuringInstruments.essentialInformation')" name="0">
            <div class="center-pack">
              <ele-form v-bind="formDescDialog" v-model="formDataDialog">
                <!-- 目标负责人 -->
                <template v-slot:directorName>
                  <!-- 插槽内容有el-form-item组件包裹 -->
                  <el-input
                    v-model="formDataDialog.directorName"
                    readonly
                    :placeholder="
                      $i18n.t('recordMeasuringInstruments.selDirectorCode')
                    "
                  ></el-input>
                </template>
                <!-- 供应商 -->
                <template v-slot:supplierName>
                  <!-- 插槽内容有el-form-item组件包裹 -->
                  <el-input
                    v-model="formDataDialog.supplierName"
                    readonly
                    :placeholder="
                      $i18n.t('recordMeasuringInstruments.selSupplierCode')
                    "
                  ></el-input>
                </template>

                <!-- 有效期 -->
                <template v-slot:validDate>
                  <!-- 插槽内容有el-form-item组件包裹 -->
                  <!-- @input="(val) => handleInputNumber(val, 'validDate')" -->
                  <el-input
                    :placeholder="
                      $i18n.t('recordMeasuringInstruments.inputValidDate')
                    "
                    v-model="formDataDialog.validDate"
                    class="input-with-select"
                    type="number"
                  >
                    <el-select
                      v-model="formDataDialog.validDateUnit"
                      slot="append"
                      :placeholder="$i18n.t('common.select')"
                      style="width: 90px;"
                    >
                      <el-option
                        v-for="item in dateUnitList"
                        :label="item.description"
                        :value="item.value"
                        :key="item.value"
                      ></el-option>
                    </el-select>
                  </el-input>
                </template>

                <!-- 检定周期 -->
                <template v-slot:verificationCycle>
                  <!-- 插槽内容有el-form-item组件包裹 -->
                  <!-- @input="(val) => handleInputNumber(val, 'verificationCycle')" -->
                  <el-input
                    :placeholder="
                      $i18n.t(
                        'recordMeasuringInstruments.inputVerificationCycle'
                      )
                    "
                    v-model="formDataDialog.verificationCycle"
                    class="input-with-select"
                    type="number"
                  >
                    <el-select
                      v-model="formDataDialog.verificationCycleUnit"
                      slot="append"
                      :placeholder="$i18n.t('common.select')"
                      style="width: 90px;"
                    >
                      <el-option
                        v-for="item in verificationCycleUnitList"
                        :label="item.description"
                        :value="item.value"
                        :key="item.value"
                      ></el-option>
                    </el-select>
                  </el-input>
                </template>

                <!-- 提醒时间 -->
                <template v-slot:reminderTime>
                  <!-- 插槽内容有el-form-item组件包裹 -->
                  <!-- @input="(val) => handleInputNumber(val, 'verificationCycle')" -->
                  <el-input
                    :placeholder="
                      $i18n.t('recordMeasuringInstruments.inputReminderTime')
                    "
                    v-model="formDataDialog.reminderTime"
                    class="input-with-select"
                    type="number"
                  >
                    <el-select
                      v-model="formDataDialog.reminderTimeUnit"
                      slot="append"
                      :placeholder="$i18n.t('common.select')"
                      style="width: 90px;"
                    >
                      <el-option
                        v-for="item in reminderTimeUnitList"
                        :label="item.description"
                        :value="item.value"
                        :key="item.value"
                      ></el-option>
                    </el-select>
                  </el-input>
                </template>
              </ele-form>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('recordMeasuringInstruments.operationRecord')" name="1">
            <div class="center-pack">
              <div class="block timeline-pack">
                <el-timeline v-if="logList.length">
                  <!--    :timestamp="item.createTime" -->
                  <el-timeline-item
                    v-for="(item, index) in logList"
                    :key="index"
                    placement="top"
                    :hide-timestamp="true"
                    icon="el-icon-cloudy"
                  >
                    <template #dot>
                      <div
                        class="timeline-icon"
                        :class="colorObj[item.operateType]"
                      ></div>
                    </template>
                    <div class="date">
                      <p>{{ item.createTime.split(" ")[0] }}</p>
                      <p>{{ item.createTime.split(" ")[1] }}</p>
                    </div>
                    <template >
                      <p class="tit">{{ item.operateTypeName }}</p>
                     
                      <p>
                        <span>
                          {{
                            $t(
                              "recordMeasuringInstruments.executor"
                            )
                          }}：{{ item.operateExecutorName }}
                        </span>
                      </p>
                      <p>
                        <div style="display: flex;">
                          <p>  {{
                            $t(
                              "recordMeasuringInstruments.content"
                            )
                          }}：{{  $t(
                              "recordMeasuringInstruments.msg1"
                            ) }}<span style="padding: 0 3px;color:#333333 ;" > {{ item.measuringToolName }} </span> {{ item.operateTypeName }} </p>
                        </div></p> 
                      </p>
                      <p>
                        <span>
                          {{
                            $t(
                              "recordMeasuringInstruments.reason"
                            )
                          }}：{{ item.operateContent }}
                        </span>
                      </p>
                    </template>
                    <!-- </el-card> -->
                  </el-timeline-item>
                </el-timeline>
                <el-empty v-else></el-empty>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('recordMeasuringInstruments.msg1071')" name="2">
            <!-- 量检具领用归还记录 弹出列表 -->
            <div class="center-pack">
              <div class="title">
                <div class="icon"></div>
                <p class="label">{{ $t('recordMeasuringInstruments.currentStatus:') }}</p>
                <p class="value">
                  {{ itemData.collectReturnStatusName || "" }}
                </p>
              </div>
              <ele-page
                :apiImmediate="false"
                maxHeight="calc(100vh - 282px)"
                ref="dialogCollectReturnLog"
                :column="collectReturnLogDialogColumn"
                :otherParams="{ measuringToolCode: itemData.measuringToolCode }"
                :getList="getCollectReturnLogList"
              ></ele-page>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('recordMeasuringInstruments.verificationRecord')" name="3">
            <div class="center-pack">
              <div class="title">
                <el-radio-group
                  v-model="tabPosition"
                  style="margin-bottom: 30px;"
                >
                  <el-radio-button label="0">{{ $t('recordMeasuringInstruments.outsourcedVerification') }}</el-radio-button>
                  <el-radio-button label="1">{{ $t('recordMeasuringInstruments.internalVerification') }}</el-radio-button>
                </el-radio-group>
              </div>
              <!-- 内件 -->
              <ele-page
                v-show="tabPosition == 1"
                :apiImmediate="false"
                maxHeight="calc(100vh - 282px)"
                ref="neiPage"
                :column="checkRecordsDialogColumnLeft"
                :otherParams="{ measuringToolCode: itemData.measuringToolCode }"
                :getList="getCheckRecordsListLeft"
              ></ele-page>
              <!-- 外检 -->
              <ele-page
                v-show="tabPosition == 0"
                :apiImmediate="false"
                maxHeight="calc(100vh - 282px)"
                ref="waiPage"
                :column="checkRecordsDialogColumnRight"
                :otherParams="{
                  measuringToolCode: itemData.measuringToolCode,
                }"
                :getList="getCheckRecordsListRight"
              ></ele-page>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
//例如：import 《组件名称》 from '《组件路径》';
import QRCode from "qrcode"; // 引入qrcode 二维码
import { measuringToolsCollectReturnLogDialog } from "../mixinMeasuringToolsCollectReturnLog.js";
import { measuringToolsCheckLogDialogRight } from "./mixinMeasuringToolsCheckLogRight.js";
import { measuringToolsCheckLogDialogLeft } from "./mixinMeasuringToolsCheckLogLeft.js";
import {
  exportUrl,
  downloadTemplateUrl,
  getMeasuringToolsTypeCodeList,
  getMeasuringToolsTypeCodeTree,
  getAccuracyLevelCodeList,
  getDepartmentCodeList,
  getDepartmentCodeTree,
  getSupplierCodeList,
} from "@/api/limsmeasuringtools/commonMeasuringToolsLedger";
import { getInfoByCode } from "@/api/limsmeasuringtools/measuringtoolsoperate.js";
import { listLog,jilulistLog } from "@/api/limsmeasuringtools/measuringtoolscollectreturn";
import {
  getDict, // 字典查询
} from "@/api/common";
export default {
  name: "",
  //import引入的组件需要注入到对象中才能使用
  components: {},
  mixins: [
    measuringToolsCollectReturnLogDialog,
    measuringToolsCheckLogDialogLeft,
    measuringToolsCheckLogDialogRight,
  ],
  data() {
    //这里存放数据
    return {
      colorObj: {
        1: 'color2',
        2: 'color1',
        3: 'color3',
        4: 'color1',
        5: 'color3'
      },
      activeName: null,
      logList: [],
      collectReturnStatusList: [],
      mainLoading: false,
      tabPosition: "0",
      itemData: {
        measuringToolPicPath: "",
        measuringToolName: "",
        tit: this.$t('recordMeasuringInstruments.voltmeter'),
        code: "sxxxxxxxxxxxxxxxx",
        name: this.$t('recordMeasuringInstruments.factoryModel'),
      },
      tabs1: {},
      dateUnitList: [],
      verificationCycleUnitList: [],
      reminderTimeUnitList: [],
      formDataDialog: {},
      formDescDialog: {
        span: 24,
        disabled: true,
        'label-position':"top",
        isShowSubmitBtn: false,
        formDesc: {
          measuringToolCode: {
            type: "input",
            label: $i18n.t("recordMeasuringInstruments.measuringToolCode"), // 量检具编码
            layout: 8,
            required: true,
            disabled: (data) => {
              return !!data.id;
            },
            validator: "Encoding",
          },
          measuringToolName: {
            type: "input",
            label: $i18n.t("recordMeasuringInstruments.measuringToolName"), // 量检具名称
            layout: 8,
            required: true,
          },
          exFactoryCode: {
            type: "input",
            label: $i18n.t("recordMeasuringInstruments.exFactoryCode"), // 出厂编码
            layout: 8,
            required: false,
          },
          status: {
            type: "select",
            label: $i18n.t("recordMeasuringInstruments.status"), // 状态(字典：common_measuring_tool_status)【1：使用中 2：封存 3：报废 4：停用 5：丢失】
            layout: 8,
            required: false,
            disabled: (data) => {
              return !!data.id;
            },
            default: "1",
            prop: {
              value: "value",
              text: "description",
            },
            options: async (data) => {
              const list = await getDict("common_measuring_tool_status");
              return list.data.result;
            },
          },
          measuringToolsTypeCode: {
            type: "tree-select",
            label: $i18n.t("recordMeasuringInstruments.measuringToolsTypeCode"), // 类型编码
            layout: 8,
            required: true,
            attrs: {
              normalizer(node) {
                return node;
              },
            },
            options: async (data) => {
              const list = await getMeasuringToolsTypeCodeTree();
              return list.data.result;
            },
          },
          measuringToolSpecification: {
            type: "input",
            label: $i18n.t(
              "recordMeasuringInstruments.measuringToolSpecification"
            ), // 规格型号
            layout: 8,
            required: false,
          },
          accuracyLevelCode: {
            type: "select",
            label: $i18n.t("recordMeasuringInstruments.accuracyLevelCode"), // 精度等级编码
            layout: 8,
            required: false,
            optionsLinkageFields: ["measuringToolsTypeCode"],
            prop: {
              value: "accuracyLevelCode",
              text: "accuracyLevelName",
            },
            options: async (data) => {
              if (!!data.measuringToolsTypeCode) {
                const list = await getAccuracyLevelCodeList({
                  parentTypeCode: data.measuringToolsTypeCode,
                });
                return list.data.result;
              }
              return [];
            },
          },
          measuringRangeCode: {
            type: "input",
            label: $i18n.t("recordMeasuringInstruments.measuringRangeCode"), // 测量范围
            layout: 8,
            required: false,
          },
          manufactureDate: {
            type: "date",
            label: $i18n.t("recordMeasuringInstruments.manufactureDate"), // 生产日期
            layout: 8,
            required: false,
            attrs: {
              valueFormat: "yyyy-MM-dd",
            },
          },
          purchaseDate: {
            type: "date",
            label: $i18n.t("recordMeasuringInstruments.purchaseDate"), // 采购日期
            layout: 8,
            required: false,
            attrs: {
              valueFormat: "yyyy-MM-dd",
            },
          },
          enableDate: {
            type: "date",
            label: $i18n.t("recordMeasuringInstruments.enableDate"), // 启用日期
            layout: 8,
            required: false,
            attrs: {
              valueFormat: "yyyy-MM-dd",
            },
          },
          validDate: {
            type: "number",
            label: $i18n.t("recordMeasuringInstruments.validDate"), // 有效期
            layout: 8,
            required: false,
          },
          // validDateUnit: {
          //   type: "select",
          //   label: $i18n.t("recordMeasuringInstruments.validDateUnit"),  // 有效期单位(字典：cycle_type )【day：天 week：周 month：月 year：年】
          //   layout: 8,
          //   required: false,
          //   prop: {
          //     value: "value",
          //     text: "description",
          //   },
          //   options: async (data) => {
          //     const list = await getValidDateUnitList()
          //     return list.data.result
          //   },
          // },
          scrapDate: {
            type: "date",
            label: $i18n.t("recordMeasuringInstruments.scrapDate"), // 报废日期
            layout: 8,
            required: false,
            attrs: {
              valueFormat: "yyyy-MM-dd",
            },
          },
          supplierName: {
            type: "input",
            label: $i18n.t("recordMeasuringInstruments.supplierCode"), // 供应商编码
            layout: 8,
            required: false,
            //      prop: {
            //        value: "value",
            //        text: "description",
            //      },
            //      options: async (data) => {
            //        const list = await getSupplierCodeList()
            //        return list.data.result
            //      },
          },
          instrumentCategory: {
            type: "select",
            label: $i18n.t("recordMeasuringInstruments.instrumentCategory"), // 仪器类别(字典：common_instrument_category_type)【1：内部检定 2：送检设备 3：厂商检定 4：不需检定】
            layout: 8,
            required: true,
            prop: {
              value: "value",
              text: "description",
            },
            options: async (data) => {
              const list = await getDict("common_instrument_category_type");
              return list.data.result;
            },
          },
          recentlyTestedDate: {
            type: "date",
            label: $i18n.t("recordMeasuringInstruments.recentlyTestedDate"), // 最近检定日期
            layout: 8,
            required: false,
            attrs: {
              valueFormat: "yyyy-MM-dd",
            },
          },
          verificationCycle: {
            type: "number",
            label: $i18n.t("recordMeasuringInstruments.verificationCycle"), // 检定周期
            layout: 8,
            required: false,
          },
          //     verificationCycleUnit: {
          //       type: "select",
          //       label: $i18n.t("recordMeasuringInstruments.verificationCycleUnit"),  // 检定周期单位(字典：cycle_type )【day：天 week：周 month：月 year：年】
          //       layout: 8,
          //       required: false,
          //       prop: {
          //         value: "value",
          //         text: "description",
          //       },
          //       options: async (data) => {
          //         const list = await getVerificationCycleUnitList()
          //         return list.data.result
          //       },
          //     },
          reminderTime: {
            type: "number",
            label: $i18n.t("recordMeasuringInstruments.reminderTime"), // 提醒时间
            layout: 8,
            required: false,
          },
          //    reminderTimeUnit: {
          //      type: "select",
          //      label: $i18n.t("recordMeasuringInstruments.reminderTimeUnit"),  // 提醒时间单位(字典：cycle_type )【day：天 week：周 month：月 year：年】
          //      layout: 8,
          //      required: false,
          //      prop: {
          //        value: "value",
          //        text: "description",
          //      },
          //      options: async (data) => {
          //        const list = await getReminderTimeUnitList()
          //        return list.data.result
          //      },
          //    },
          departmentCode: {
            type: "tree-select",
            label: $i18n.t("recordMeasuringInstruments.departmentCode"), // 部门编码
            layout: 8,
            required: true,
            attrs: {
              normalizer(node) {
                return {
                  id: node.deptCode,
                  label: node.name,
                  children: node.children,
                };
              },
            },
            options: async (data) => {
              const list = await getDepartmentCodeTree();
              return list.data.result;
            },
          },
          directorName: {
            type: "input",
            label: $i18n.t("recordMeasuringInstruments.directorCode"), // 负责人编码
            layout: 8,
            required: true,
          },
          createByName: {
            type: "input",
            label: $i18n.t("recordMeasuringInstruments.createByName"), // 负责人编码
            layout: 8,
            required: true,
          },
          createTime: {
            type: "input",
            label: $i18n.t("recordMeasuringInstruments.createTime"), // 负责人编码
            layout: 8,
            required: true,
          },
          remark: {
            type: "textarea",
            label: $i18n.t("recordMeasuringInstruments.remark"), // 用途说明
            layout: 24,
            required: false,
          },
          measuringToolFilePath: {
            type: "upload-file",
            label: $i18n.t("recordMeasuringInstruments.measuringToolFilePath"), // 文档
            layout: 24,
            required: false,
            attrs: {
              limit: 1,
              // action: `${adminUrl}file`,
              data: {
                bucket: "general-template",
              },
              // headers: {
              //   Satoken: store.getters.token,
              // },
              // autoUpload: false,
              responseFn(response, file) {
                if (response.code === 0) {
                  return {
                    name: file.name,
                    url: response.result.path, // 文件id
                    size: file.size,
                    ...response.result,
                  };
                }
              },
            },
          },
        },
      },
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    init(data) {
      if (!data) {
        return;
      }
      this.itemData = data;
      this.$nextTick(async () => {
        try {
          this.mainLoading = true;
          let res = await getInfoByCode({
            measuringToolCode: data.code,
          });
          this.mainLoading = false;
          this.itemData = res.data.result;
          if (res.data.result.measuringToolFilePath) {
            res.data.result.measuringToolFilePath = {
              name: this.getName(res.data.result.measuringToolFilePath),
              url: res.data.result.measuringToolFilePath,
            };
          }
          this.formDataDialog = res.data.result;
          let nameObj = this.collectReturnStatusList.find(
            (ite) => ite.value == res.data.result.collectReturnStatus
          );
          this.itemData.collectReturnStatusName = nameObj.description;

          const element = document.getElementById("barCode");
          const url = res.data.result.measuringToolCode;
          QRCode.toCanvas(element, url);
          this.$refs.dialogCollectReturnLog.refresh(true);
          this.$refs.neiPage.refresh(true);
          this.$refs.waiPage.refresh(true);
          this.getLog();
        } finally {
          this.mainLoading = false;
        }
      });
    },
    getName(url) {
      if (url) {
        let arr = url.split("/");
        return arr.at(-1);
      } else {
        return "";
      }
    },
    async getLog() {
      let res = await jilulistLog({
        measuringToolCode: this.itemData.measuringToolCode,
      });
      this.logList = res.data.result;
    },
    getUnitList() {
      getDict("common_cycle_type").then((res) => {
        this.dateUnitList = res.data.result;
      });

      getDict("common_cycle_type").then((res) => {
        this.verificationCycleUnitList = res.data.result;
      });

      getDict("common_reminder_cycle_type").then((res) => {
        this.reminderTimeUnitList = res.data.result;
      });
      getDict("common_collect_return_status").then((res) => {
        this.collectReturnStatusList = res.data.result;
      });
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getUnitList();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.init();
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped lang="scss">
.main-pack {
  //   padding: 10px;
  padding-top: 0px;
  height: 100%;
  height: calc(100vh - 150px);
  display: flex;
  justify-content: space-between;
  /deep/.el-tabs--top .el-tabs__item.is-top:nth-child(2){
    padding-left: 12px;
  }
  .x-y-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .left {
    width: 220px;
    height: 100%;
    padding: 24px;
    padding-bottom: 0px;
    border-right: 1px solid #3333;
    .img {
      width: 220px;
      height: 220px;
      background: #f7fafc;
      margin-bottom: 30px;
      .img-empty {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #b8b8b8;
        //line-height: 0px;
        width: 100%;
        height: 100%;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: center;
        font-style: normal;
        text-transform: none;
      }
    }
    h2 {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 16px;
      padding-bottom: 10px;
      color: #333333;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
    .info {
      p {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        line-height: 0px;
        text-align: left;
        font-style: normal;
        text-transform: none;
        line-height: 32px;
      }
    }
  }
  .right {
    // flex: 1;
    width: calc(100% - 286px);
    padding-left: 16px;
    .tabs-pack {
      /deep/.el-tabs__nav-scroll {
        background: #f7fafc;
      }
    }

    .timeline-pack {
      margin: 0 auto;
      width: 50%;
      font-size: 14px;
      color: #333333 !important;
      /deep/.el-timeline-item__tail {
        border-left: 2px dashed #e5e5e5;
      }
      .color1 {
        border: 2px solid #f89d37;
      }
      .color2 {
        border: 2px solid #57be6a;
      }
      .color3 {
        border: 2px solid #F56C6C;
      }
      .color4 {
        border: 2px solid #57be6a;
      }
      .date {
        position: absolute;
        left: -90px;
        color: #5a6f82 !important;
      }
      .timeline-icon {
        width: 12px;
        height: 12px;
        background: #ffffff;
        border-radius: 12px;
        margin-left: -3px;
      }
      .tit {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: bold;

        color: #333333 !important;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
      p {
        line-height: 24px;
      }
    }
    .center-pack {
      width: 100%;
      height: calc(100vh - 192px);
      overflow-y: auto;
      overflow: hidden;
      overflow-y: auto;
      .title {
        z-index: 999;
        font-size: 14px;
        position: absolute;
        display: flex;
        align-items: center;
        .icon {
          width: 4px;
          height: 16px;
          background: #00b39b;
          margin-right: 4px;
        }
        .label {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #5a6f82;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }
        .value {
          height: 19px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: bold;
          font-size: 14px;
          color: #333333;
        }
      }
    }
    /deep/.ele-form-btns {
      display: none;
    }
  }
}
</style>
