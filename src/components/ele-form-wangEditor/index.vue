<template>
  <ele-wangEditor
    @input="handleChange"
    :class="desc.class"
    :style="desc.style"
    v-bind="editorAttrs"
    v-model="newValue"
    v-on="onEvents"
  />
</template>
<script>
import formMixin from "../ele-form/mixins/formMixin";
export default {
  name: "wang-Editor",
  mixins: [formMixin],
  inject: ["EleForm"],
  computed: {
    editorAttrs() {
      const colAttrs = this.EleForm.disabled
        ? { ...this.attrs, disabled: true }
        : { ...this.attrs };
      return colAttrs;
    },
  },
};
</script>
