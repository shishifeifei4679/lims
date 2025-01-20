<template>
  <div>
    <div class="printBtn" style="overflow: hidden" v-show="isPrint">
      <el-button
        style="float: right"
        ref="printing"
        type="primary"
        v-print="printObj"
        >{{ $t("common.print") }}</el-button
      >
    </div>
    <div
      class="drag-contain"
      ref="print"
      id="print"
      :style="{
        width: formInline.width + 'px',
        height: formInline.height + 'px',
      }"
    >
      <vue-draggable-resizable
        v-for="(item, index) in draggableList"
        :key="index"
        :w="Number(item.width)"
        :h="Number(item.height)"
        :x="Number(item.x)"
        :y="Number(item.y)"
        :parent="true"
        :debug="false"
        :draggable="false"
        :resizable="false"
        :isConflictCheck="true"
        :snap="true"
        :snapTolerance="2"
        :style="{
          border: item.isBorder ? '1px solid #000000' : 'none',
        }"
      >
        <!-- lineHeight: item.height + 'px', -->
        <div
          class="node"
          :style="{
            textAlign: item.textAlign,
            fontSize: item.fontSize + 'px',
          }"
          v-if="item.type == 1"
        >
          {{
            item.value
              ? `${item.text ? item.text : ""} ${item.value}`
              : item.text
          }}
        </div>
        <div
          class="datamatrix"
          :id="`datamatrix${index}`"
          v-else-if="item.type == 3 && item.codeType == 'datamatrix'"
        ></div>
        <img class="img" v-else :ref="item.ref" :src="item.src" />
      </vue-draggable-resizable>
    </div>
  </div>
</template>

<script>
import VueDraggableResizable from "vue-draggable-resizable-gorkys";
// import "vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css"
import QRCode from "qrcode"; // 引入qrcode 二维码
import JsBarcode from "jsbarcode"; // 条形码
// import { fileupload } from "@/api/common";
import { generateBarcode } from "@/utils/generateBarcode.js";
const upload = require("@/assets/images/no.png");
// 组件类型 1--文本 2--二维码 3--条码 4--图标
const config = {
  width: 300,
  height: 250,
};
export default {
  name: "barcodePrint",
  components: {
    VueDraggableResizable,
  },
  data() {
    return {
      centerDialogVisible: false,
      printObj: {
        id: "print",
        popTitle: "",
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',
      },
      formInline: config,
      draggableList: [],
    };
  },
  props: {
    edit: {
      type: Boolean,
      default: false,
    },
    barcodeInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isPrint: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    barcodeInfo: {
      handler(val) {
        this.getInfo(val);
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {},
  methods: {
    getInfo(barcodeInfo) {
      // 组件类型 componentType 1--文本 2--二维码 3--条码 4--图标
      const {
        details,
        templateHeight,
        templateWidth,
        values = {},
      } = barcodeInfo;
      this.formInline = {
        height: templateHeight || config.height,
        width: templateWidth || config.width,
      };
      if (!Array.isArray(details)) return;
      const draggableList = [];
      details.forEach((item, index) => {
        // if (item.componentType == 4) this.downLoadfile(item.imgSrc, index);
        if (item.componentType == 2) {
          // 生成二维码
          this.$nextTick(() => {
            this.bindQRCode(item, values, index);
          });
        }
        if (item.componentType == 3) {
          if (item.codeType == "datamatrix") {
            this.$nextTick(() => {
              const value = values[item.componentValue];
              generateBarcode(`datamatrix${index}`, value);
            }); // 生成条形码
          } else {
            this.$nextTick(() => {
              this.bindJsBarcode(item, values, index);
            }); // 生成条形码
          }
        }

        const detail = {
          type: item.componentType,
          text: item.componentText,
          value: values ? this.getValue(item, values) : "",
          width: item.componentWidth,
          height: item.componentHeight,
          isBorder: item.borderFlag == "Y",
          textAlign: item.textAlign || "left",
          fontSize: Number(item.fontSize),
          x: item.positionX,
          y: item.positionY,
          id: item.id,
          src: item.imgSrc || upload,
          imgSrc: item.imgSrc,
          isShow: false,
          ref: item.componentValue,
          codeType: item.codeType,
          testValue: item.testValue || "",
        };

        draggableList.push(detail);
      });

      this.draggableList = draggableList;
      console.log("Muban1门板", draggableList);
    },
    getValue(item, values) {
      return values[item.componentValue] ? values[item.componentValue] : "";
    },
    // downLoadfile(id, index) {
    //   fileupload(id).then((res) => {
    //     this.$set(this.draggableList[index], "src", res.data.result);
    //   });
    // },

    bindQRCode(item, values, index) {
      if (!values) return;
      const value = values[item.componentValue];
      if ([null, undefined, ""].includes(value)) return;
      QRCode.toDataURL(value, { margin: 0 })
        .then((url) => {
          this.$set(this.draggableList[index], "src", url);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    bindJsBarcode(item, values, index) {
      if (!values) return;

      const value = values[item.componentValue];
      if ([null, undefined, ""].includes(value)) return;
      this.$set(this.draggableList[index], "isShow", true);
      console.log(this.$refs[item.componentValue]);
      JsBarcode(this.$refs[item.componentValue][0], value, {
        format: item.codeType, // 选择要使用的条形码类型
        width: 1, // 设置条之间的宽度
        height: item.componentHeight, // 高度
        displayValue: false, // 是否在条形码下方显示文字
        margin: 3, // 设置条形码周围的空白边距
        // fontOptions:"bold italic",//使文字加粗体或变斜体
        // font:"fantasy",//设置文本的字体
        // textAlign:"left",//设置文本的水平对齐方式
        // textPosition:"top",//设置文本的垂直位置
        // textMargin:5,//设置条形码和文本之间的间距
        // fontSize:15,//设置文本的大小
        // background:"#eee",//设置条形码的背景
        // lineColor:"#2196f3",//设置条和文本的颜色。
        // valid: (valid) => {
        //   if (valid && value.length > 20) {
        //     this.$refs[item.componentValue][0].style.transform = "scaleX(0.68)";
        //     this.$refs[item.componentValue][0].style.transformOrigin = "left";
        //   }
        // },
      });

      // console.log("JsBarcode", JsBarcode);
    },
  },
};
</script>
<style lang="scss" scoped>
.drag-contain {
  margin: 0 auto;
  // border: 1px solid #000;
  background: #ffffff;
}
.img {
  object-fit: contain;
  height: 100%;
  margin: 0 auto;
  display: block;
}
.node {
  width: 100%;
  // height: 100%;
  // vertical-align: middle;
  // display: table-cell;
  word-break: break-all;
  line-height: 1;
}
/deep/.vdr {
  display: flex;

  align-items: center;
}
// .node::before {
//   display: block;
//   content: "";
//   height: 100%;
//   vertical-align: middle;
//   word-break: break-all;
// }
/deep/ .el-image__error {
  font-size: 13px;
}
</style>
<style media="print">
@page {
  size: auto;
  margin: 3mm 1mm 0 0mm;
}
</style>
