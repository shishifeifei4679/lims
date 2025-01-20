<template>
  <div class="ele-wangEditor">
    <div :id="id"></div>
  </div>
</template>
<script>
import E from "wangeditor";
export default {
  name: "eleWangEditor",
  props: {
    // 值
    value: {
      type: String,
      default: "",
    },
    //编辑器配置
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
    id: {
      type: String,
      default: "eleWangEditor",
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
  data() {
    return {
      editor: null,
      html: "",
    };
  },
  watch: {
    value: {
      handler(val, old) {
        this.$nextTick(() => {
          if (val != this.html) this.editor && this.editor.txt.html(val);
        });
      },
      immediate: true,
    },

    disabled: {
      handler(val) {
        this.$nextTick(() => {
          if (this.editor) {
            val ? this.editor.disable() : this.editor.enable();
          }
        });
      },
      immediate: true,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const editor = new E(`#${this.id}` || "eleWangEditor");
      editor.config.zIndex = 1;
      editor.config.focus = false;
      editor.config = {
        ...editor.config,
        ...this.config,
      };
      if (!editor.config.uploadImgServer) {
        editor.config.uploadImgShowBase64 = true;
      }
      // 配置 onchange 回调函数，将数据同步到 vue 中
      editor.config.onchange = (newHtml) => {
        this.$emit("input", newHtml);
        this.html = newHtml;
      };
      editor.create();
      this.editor = editor;
    },
  },
  beforeDestroy() {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy();
    this.editor = null;
  },
};
</script>
<style lang="scss" scoped></style>
