import Vue from "vue";
import "@/components/contextmenu/style.css";
import Contextmenu from "@/components/contextmenu/index";
import awesomeSubBar from "../components/awesomeSubBar/index.vue";
import awesomeTable from "../components/awesomeTable/index.vue";
import { EleFormUploadFile, EleFormImageUploader, EleUploadImage, EleUploadFile } from "mom-pc-core";
import EleFormTreeSelect from "@/components/ele-form-treeSelect/EleFormTreeSelect";
import eleTable from "@/components/ele-table/index.vue";
import ElePage from "@/components/ele-page/index.vue";
import EleDialogTable from "@/components/ele-dialog-table/index.vue";
import EleMasterSubTable from "@/components/master-sub-table/index.vue";
import EleTreeCompositeTable from "@/components/tree-composite-table/index.vue";
import EleRowOperation from "@/components/row-operation/index.vue";
import EleLeftRightMasterSubTable from "@/components/left-right-master-sub-table/index.vue";
import eleTabsTable from "@/components/ele-tabs-table/index.vue";
import eleWangEditor from "@/components/ele-wangEditor/index.vue";
import wangEditor from "@/components/ele-form-wangEditor/index.vue";
import EleTableBatchEditor from "@/components/ele-table-batch-editor/index.vue";
import EleFormTableEditor from "@/components/ele-form-table-editor/index.vue";
import EleImportDrawer from "@/components/ele-import-drawer/index.vue";
import DragPack from "@/components/left-right-drag-pack/index.vue";
Vue.component("ele-table", eleTable);
// 注册单独文件上传
Vue.component("ele-upload-file", EleUploadFile);
// 注册树形选择组件
Vue.component("tree-select", EleFormTreeSelect);
// Vue.component("lbTable", lbTable);
// 集成ele-form 文件上传
Vue.component("upload-file", EleFormUploadFile);
// 集成ele-form 上传图片 ，注册 image-uploader 组件
Vue.component("image-uploader", EleFormImageUploader);
// 页面级table组件
Vue.component("ele-page", ElePage);
// 弹框表格
Vue.component("ele-dialog-table", EleDialogTable);
// 主子表表格 上下布局
Vue.component("ele-master-sub-table", EleMasterSubTable);
// 左边树形，右边表格
Vue.component("ele-tree-composite-table", EleTreeCompositeTable);
// 图片上传
Vue.component("ele-upload-image", EleUploadImage);
Vue.component("awesomeSubBar", awesomeSubBar);
Vue.component("awesomeTable", awesomeTable);
// 表格行操作
Vue.component("ele-row-operation", EleRowOperation);
// 主子表表格 左右布局
Vue.component("ele-left-right-master-sub-table", EleLeftRightMasterSubTable);
// tabs表格
Vue.component("ele-tabs-table", eleTabsTable);
// 单独编辑器
Vue.component("ele-wangEditor", eleWangEditor);
// 集成ele-form编辑器
Vue.component("wang-editor", wangEditor);

// 表格编辑组件
Vue.component("ele-table-batch-editor", EleTableBatchEditor);

// 集成ele-form编辑器 历史遗留 不可删除
Vue.component("table-editor", EleFormTableEditor);
// 表格上传组件
Vue.component("ele-import-drawer", EleImportDrawer);
// 右单机指令
Vue.use(Contextmenu);
Vue.component("drag-pack", DragPack);
