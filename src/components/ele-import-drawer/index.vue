<!--  -->
<template>
  <!--   v-btnAuths="auth" -->
  <div class="ele-import-drawer"  v-show="isShow()">
    <slot name="button">
      <el-button type="primary" @click="showDrawer()" icon="el-icon-upload2">
        {{ btnText || $t("import.btn") }}
      </el-button>
    </slot>
    <!-- 导入弹框 -->
    <ele-form-drawer
      size="30%"
      class="import-drawer"
      :isLoading="isLoadingImport"
      v-model="importData"
      v-bind="importFormDescDialog"
      :request-fn="handleSubmitImport"
      :visible.sync="importVisible"
      :destroyOnClose="true"
      :title="$t('import.title')"
    >
      <template v-slot:tit="{ desc, data, field, formData }">
        <slot name="header">
          <div class="tit">
            <div class="tips">Tips：{{ $t("import.msg") }}</div>
            <div class="down" @click="downloadTemplate()">
              <div>
                <img :src="require('./images/icon_download.png')" />
              </div>
              <p>{{ $t("import.downloadTemplate") }}</p>
            </div>
          </div>
        </slot>
      </template>
      <template v-slot:msg>
        <!-- msgData.msg -->
        <div v-if="msgData.successFlag === false" class="msg">
          <div class="header">
            <p>
              {{ $t("import.msgTips") }}
              <i class="el-icon-s-comment"></i>
            </p>
            <!-- <i class="el-icon-s-comment"></i> -->
            <div
              class="down"
              v-if="msgData.failDataDownloadUrl"
              @click="downloadExcl(msgData.failDataDownloadUrl)"
            >
              <div class="animated up">
                <img :src="require('./images/icon_download.png')" />
              </div>
              <p class="p-l-6">{{ $t("import.downloadExcl") }}</p>
            </div>
          </div>
          <div class="bk-fff msg-content">
            <template v-if="msgData.isShowCount">
              <p class="msg-content success">
                {{ $t("import.msg1", { count: msgData.successCount }) }}
              </p>
              <p class="msg-content error">
                {{ $t("import.msg2", { count: msgData.failCount }) }}
              </p>
              <p class="msg-content warning" v-if="msgData.excelParseErrorMsg">
                {{ $t("import.msg3") }}{{ msgData.excelParseErrorMsg }}
              </p>
            </template>
            <template v-else>
              <p class="msg-content warning" v-if="msgData.excelParseErrorMsg">
                {{ msgData.excelParseErrorMsg }}
              </p>
            </template>
          </div>
        </div>
        <div v-else></div>
      </template>
      <template v-slot:file="{ desc, data, field, formData }">
        <div class="file">
          <uploadNoAuto @onchange="upLoadHandleChange" ref="uploadNoAuto" />
        </div>
        <!-- 插槽内容有el-form-item组件包裹 -->
      </template>
    </ele-form-drawer>
  </div>
</template>

<script>
//例如：import 《组件名称》 from '《组件路径》';
import uploadNoAuto from "@/components/upload-no-auto";
// import { exportUrl, importUrl } from "@/api/import.js";
import { Loading } from "element-ui";
import request from "@/axios/request";
import url from "@/axios/url";
const { adminUrl,generalUrl } = url();
export default {
  name: "ele-import-drawer",
  //import引入的组件需要注入到对象中才能使用
  components: {
    uploadNoAuto,
  },
  props: {
    // 按钮权限
    auth: {
      type: String,
      default: "",
    },
    //默认倒入完刷新列表
    refresh: {
      type: Boolean,
      default: true,
    },
    btnText: {
      type: String,
      default: "",
    },
    // 自定义,下载模板
    exportFuntion: Function,
    // 自定义,下载模板地址，不传就是默认
    exportAction: {
      type: String,
      default: "",
    },
    //导入地址
    importAction: {
      type: String,
      default: `${adminUrl}excelCommon/import`,
    },
    // 自定义,导入模板
    importFuntion: Function,
    // async importFuntion(formData) {
    //   // let res = await apixxxx(formData)
    //   let data = {
    //     failCount, //失败的条数
    //     failDataDownloadUrl, //需要下载的地址
    //     successCount, //成功的条数
    //     successFlag, //是否成功
    //     excelParseErrorMsg, //错误提醒
    //     isShowCount, //是否展示导入成功失败统计  true:展示,成功0条,失败0条,错误信息... false 仅展示错误信息
    //   };
    //   return data;
    // },
  },
  data() {
    //这里存放数据
    return {
      isLoadingImport: false,
      importVisible: false,
      msgData: {},
      importData: {},
      importFormDescDialog: {
        span: 24,
        disabled: false,
        labelPosition: "top",
        isShowSubmitBtn: true,
        formDesc: {
          tit: {
            type: "input",
            layout: 24,
            class: "tit",
          },
          file: {
            type: "input",
            label: $i18n.t("common.chooseFile"),
            layout: 24,
            required: true,
          },
          // br: {
          //   type: "input",
          //   layout: 24,
          //   class: "br",
          // },
          msg: {
            type: "input",
            layout: 24,
            class: "msg123",
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
    //控制导入按钮是否隐藏【显示逻辑：当前控件不加auth属性，或者加了用户存在权限的auth属性】
    isShow(data){
     const btnAuths = this.$store.getters.btnAuths || [];
          if (!this.auth || btnAuths.includes(this.auth)) {
             return true;
          } else {
            return false;
          }
    },
    //打开侧抽
    showDrawer() {
      this.importVisible = true;
      if (this.importVisible) {
        this.msgData = {};
        this.importData = {};
      }
    },
    //下载模板
    downloadTemplate() {
      this.exportFuntion
        ? this.exportFuntion()
        : this.exportExcel(
            this.exportAction
              ? this.exportAction
              : `${adminUrl}baseImportExportTemplateConfig/downloadImportTemplate`
          );
    },
    //下载导入的错误excl
    downloadExcl(url) {
      window.open(url);
    },

    //导入api
    importRequest(data) {
      return request({
        url: this.importAction,
        method: "POST",
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    // 提交导入信息
    handleSubmitImport() {
      if (!this.importData.file) {
        this.$message.error($i18n.t("common.uploadMsg"));
        return;
      }
      const formData = new FormData();
      formData.append("file", this.importData.file.get("file"));
      this.isLoadingImport = true;
      this.importFuntion
        ? this.importFuntion(formData)
        : this.importRequest(formData)
            .then((res) => {
              let {
                failCount,
                failDataDownloadUrl,
                successCount,
                successFlag,
                excelParseErrorMsg,
              } = res.data.result;
              this.msgData = {
                failCount,
                failDataDownloadUrl,
                successCount,
                successFlag,
                excelParseErrorMsg,
                isShowCount: true,
              };
              if (successFlag) {
                this.$message.success(
                  $i18n.t("import.successMsg", { count: successCount })
                );
                this.importVisible = false;
                this.$emit("success", res);
                this.$refs.uploadNoAuto.clearFiles();
                this.refreshfn();
              } else {
                this.$emit("error", res);
                if (successCount > 0) {
                  this.refreshfn();
                }
              }
            })
            .catch((error) => {
              // this.$set(this.importData, "file", null);
              this.$set(this.msgData, "msg", error.data.message || "未知错误");
              this.msgData = {
                successFlag: false,
                excelParseErrorMsg: error.data.message || "未知错误",
                isShowCount: false,
              };
              this.$emit("error", error);
            })
            .finally(() => {
              this.$refs.uploadNoAuto.clearFiles();
              this.$refs.uploadNoAuto.onRemove();
              this.isLoadingImport = false;
            });
    },

    refreshfn() {
      if (this.refresh) {
        try {
          if (this.$parent?.$parent?.$parent.refresh ?? "") {
            this.$parent.$parent.$parent.refresh();
          }
        } catch (error) {
          console.log(error, "刷新失败");
        }
      }
    },
    //数据文件上传
    upLoadHandleChange(file) {
      this.$set(this.importData, "file", file);
    },
    // 下载接口返回流
    exportExcel(url, data, type = "application/json", method = "get", headers) {
      const loadingInstance = Loading.service({
        lock: true,
        text: $i18n.t("common.downLoading"),
        spinner: "el-icon-loading",
      });
      request({
        url,
        data,
        params: method == "get" ? data : undefined,
        method,
        responseType: "blob",
        headers: {
          "content-Type": type,
          ...headers,
        },
      })
        .then((res) => {
          const contentType = res.headers["content-type"];
          // 如果是json格式，将blob还原为json
          if (contentType.indexOf("application/json") === 0) {
            const reader = new FileReader();
            reader.readAsText(res.data, "UTF-8");
            reader.onload = (e) => {
              const { message } = JSON.parse(e.target.result);
              this.$message.error(message || "未知错误");
            };
          } else {
            const disposition = res.headers["content-disposition"];
            let fileName = "";
            let name = "";
            let suffix = "";
            if (disposition) {
              fileName = disposition.split("=")[1];
              const [na, suf] =
                fileName.split("'").length == 1
                  ? fileName.split(".")
                  : fileName.split("'")[2].split(".");
              name = window.decodeURIComponent(na);
              suffix = suf;
            }
            const data = res.data;
            const url = URL.createObjectURL(data);
            const link = document.createElement("a");
            link.href = url;
            link.download = name ? `${name}.${suffix}` : "文件下载";
            link.click();
          }
        })
        .catch((err) => {
          console.log("debug log --> ", err);
        })
        .finally(() => {
          loadingInstance.close();
        });
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
};
</script>
<style scoped lang="scss">
.ele-import-drawer {
  /deep/.el-drawer__header {
    margin-bottom: 10px;
  }

  // /deep/.br {
  //   margin: 0 !important;
  //   .el-form-item__content {
  //     margin: 0 !important;
  //     border-bottom: 1px solid #f3f3f5;
  //   }
  // }

  .down {
    cursor: pointer;
    padding: 6px 0;
    padding-top: 0px;
    padding-bottom: 0px !important;
    display: flex;
    align-items: center;
    p {
      color: #3c7fcd !important;
      font-weight: initial !important;
    }
  }
  .msg {
    width: 100%;
    // display: flex;
    // align-items: center;
    font-size: 14px;
    min-height: 36px;
    .header {
      padding: 4px;
      padding-left: 8px;
      padding-right: 8px;
      background: #f7f8e7;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .el-icon-warning {
      color: #df2323;
      margin: 0 6px;
    }
    p {
      color: #5a6f82;
    }
    .msg-content {
      padding: 0px 8px;
      background: #4d4c4c;
      .success {
        color: #18be16;
      }
      .error {
        color: #f16262;
      }
      .warning {
        // text-indent: 4em;
        color: #f1a533;
      }
    }
  }
  .tit {
    padding-bottom: 18px;
    border-bottom: 1px solid #f3f3f5;
    .tips {
      padding: 6px 0;
      padding-bottom: 0px;
      font-size: 14px;
      color: #5a6f82;
    }
    .header {
      padding: 6px 0;
      background: #f5f5f5;
      flex-shrink: 0;
      .el-icon-circle-check {
        color: #0066ff;
        font-size: 24px;
      }

      .center {
        width: 100%;
        margin: 0 auto;
        .label {
          padding-left: 4px;
          color: #999999;
        }
        .item {
          flex: 1;
          align-items: center;
          display: flex;
          justify-content: center;
        }
      }
    }
  }
  .file {
    padding-bottom: 18px;
    border-bottom: 1px solid #f3f3f5;
    /deep/.btn-pack {
      display: flex;
      align-items: center;
    }
    /deep/.el-upload__tip {
      margin-left: 6px;
      margin-top: 0px;
      color: #999;
    }
  }
  // /deep/.ele-form-btns {
  //   position: fixed;
  //   bottom: 4px;
  //   right: 6px;
  //   float: right;
  //   text-align: right;
  // }

  .border-b {
    border-bottom: 1px solid #f3f3f5;
  }
  .flex {
    display: flex;
  }
  .flex-1 {
    flex: 1;
  }
  .h-100 {
    height: 100%;
  }
  .flex-j-sb {
    justify-content: space-between;
  }
  .flex-item-center {
    align-items: center;
  }
  .p-l-6 {
    padding-left: 6px;
  }
  .up {
    animation-name: upAnimation; /*动画的名称*/
    transform-origin: center bottom; /*设置动画旋转元素的基点为*/
    cursor: pointer;
  }
  .animated {
    animation-iteration-count: infinite; /*动作循环的次数：infinite 无限循环*/
    animation-duration: 4s; /*动画时间*/
    animation-fill-mode: both; /*播放后的状态*/
  }
  @keyframes upAnimation {
    0%,
    100% {
      transform: translateY(0);
    }
    25% {
      transform: translateY(-5px);
    }
    50% {
      transform: translateY(5px);
    }
    75% {
      transform: translateY(-5px);
    }
  }
}
</style>
