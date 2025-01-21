<template>
  <ele-upload-image
    :class="desc.class"
    :style="desc.style"
    v-bind="attrs"
    v-model="newValue"
    v-on="onEvents"
  />
</template>

<script>
import EleUploadImage from '../ele-upload-image/EleUploadImage.vue'
import formMixin from '../ele-form/mixins/formMixin'
import uploadMixin from '../ele-form/mixins/uploadMixin'

export default {
  name: 'image-uploader',
  mixins: [formMixin, uploadMixin],
  components: {
    EleUploadImage
  },

  data () {
    return {
      defaultAttrs: {
        size: 10
      }
    }
  }
}
</script>
