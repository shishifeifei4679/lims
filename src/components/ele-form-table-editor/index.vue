<template>
  <div>
    <slot name="topBtn" />
    <div style="margin-bottom: 10px" v-if="attrs.topBtnRender">
      <lb-render :render="attrs.topBtnRender" :scope="newValue" />
    </div>
    <ele-table-editor
      v-cnEn
      :class="desc.class"
      :style="desc.style"
      class="ele-form-table-editor"
      v-bind="attrs"
      ref="table-editor"
      v-model="newValue"
      v-on="onEvents"
    >
      <template v-for="(render, key) of desc.slots" v-slot:[key]="data">
        <extend-slot :data="data" :key="key" :render="render" />
      </template>
    </ele-table-editor>
  </div>
</template>

<script>
import lbRender from "@/components/lb-table/lb-render"
import EleTableEditor from "ele-table-editor"
import formMixin from "@/components/ele-form/mixins/formMixin"

export default {
  name: "EleFormTableEditor",
  mixins: [formMixin],
  components: { EleTableEditor, lbRender },

  props: {
    topBtnRender: { type: Object, default: () => {} }
  },
  methods: {
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs["table-editor"]
          .validate()
          .then(resolve)
          .catch(() => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({
              [this.$parent.$props.prop]: this.desc.label + $i18n.t("common.tableErr")
            })
          })
      })
    }
  }
}
</script>
