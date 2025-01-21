<template>
  <treeselect
    :class="desc.class"
    :options="options"
    :style="desc.style"
    class="ele-form-tree-select"
    v-bind="treeAttrs"
    v-model="newValue"
    v-on="onEvents"
  >
    <template v-for="(render, key) of desc.slots" v-slot:[key]="data">
      <extend-slot :data="data" :key="key" :render="render" />
    </template>
  </treeselect>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect"
import "@riophae/vue-treeselect/dist/vue-treeselect.css"
import formMixin from "../ele-form/mixins/formMixin"
export default {
  name: "EleFormTreeSelect",
  mixins: [formMixin],
  components: { Treeselect },
  inject: ["EleForm"],
  data() {
    return {
      defaultAttrs: {
        placeholder: $i18n.t("common.select") + this.desc.label
      }
    }
  },
  computed: {
    treeAttrs() {
      const colAttrs = this.EleForm.disabled ? { ...this.attrs, disabled: true } : { ...this.attrs }
      return colAttrs
    }
  }
}
</script>

<style>
.vue-treeselect {
  line-height: 20px;
  height: 32px;
  color: #606266;
  font-size: 13px;
}

.vue-treeselect__input {
  -webkit-appearance: none;
  background-image: none;
  border-radius: 4px;
  display: block;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  outline: none;
}
.vue-treeselect__label {
  font-size: 14px;
  padding: 0 20px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
  height: 32px;
  line-height: 32px;
  box-sizing: border-box;
  cursor: pointer;
}

.vue-treeselect__option--selected .vue-treeselect__label {
  color: #409eff;
}
.vue-treeselect--disabled .vue-treeselect__control {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}
.vue-treeselect--disabled .vue-treeselect__control .vue-treeselect__single-value {
  color: #c0c4cc;
}
</style>
