<template>
  <div
    class="left-right-drag-pack"
    :style="{
      background: showDrag === true && !!showLeft ? '#E5E5E5' : '#E5E5E5',
    }"
    ref="mainW"
  >
    <div style="background: white;">
      <div class="icon-right-drag-s">
        <div class="img" @mousedown="dragStart">
          <img
            v-if="showDrag === true || showDrag == 'left'"
            class="img1"
            ref="drag"
            src="@/assets/images/icon_arr_slide_pull.png"
            alt=""
          />
          <img
            v-if="showDrag === true || showDrag == 'right'"
            ref="drag"
            class="img2"
            src="@/assets/images/icon_arr_slide_pull.png"
            alt=""
          />
        </div>
      </div>
      <div
        class="left-pack center-pack"
        :class="showLeft ? '' : 'p-0'"
        ref="leftw"
      >
        <slot name="left" style="width: 100%; height: 100%;"></slot>
      </div>
    </div>
    <div
      ref="rightw"
      class="right-pack center-pack"
    >
      <slot name="right" style="width: 100%; height: 100%;"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "left-right-drag-pack",
  props: {
    leftWidth: {
      type: String,
      default: "280px",
    },
    enhance: {
      type: Boolean, //强制调整右侧宽度,有性能问题,不建议开启
      default: false,
    },
    // 拖拽按钮的显示隐藏
    showDrag: {
      type: Boolean | String, //true 默认样式,  false:不显示拖拽按钮, left:显示左侧,right:显示右侧
      default: true,
    },
    offsetR: {
      type: Number,
      default: 11,
    },
  },
  data() {
    return {
      mainW: 0,
      showLeft: true,
      startX: 0,
      offsetX: 0,
    };
  },
  methods: {
    dragStart(event) {
      // 获取元素初始位置和鼠标按下时的坐标
      this.startX = event.clientX;
      this.offsetX = event.currentTarget.offsetLeft;
      // 绑定mousemove事件
      document.addEventListener("mousemove", this.dragging);
      document.addEventListener("mouseup", this.dragEnd);
      event.preventDefault();
    },
    dragging(event) {
      // 计算鼠标移动了多少距离
      const deltaX = event.clientX - this.startX;
      // 更新元素的位置
      const newLeft = this.offsetX + deltaX;
      let w = newLeft < 0 ? 0 : newLeft;
      w = newLeft > this.mainW ? this.mainW : w;
      if (w) {
        this.showLeft = true;
      } else {
        this.showLeft = false;
      }
      this.$refs.leftw.style.width = w + "px";
      if (this.enhance) {
        this.$refs.rightw.style.width = `calc(100% - ${w}px)`;
      }
      // this.selfLeftWidth = w + "px";
      event.preventDefault();
    },
    dragEnd(event) {
      event.preventDefault();
      // 解除mousemove事件
      document.removeEventListener("mousemove", this.dragging, false);
      document.removeEventListener("mouseup", this.dragEnd, false);
      event.preventDefault();
    },
    init() {
      this.$refs.leftw.style.width = "" + this.leftWidth;
      this.mainW = this.$refs.mainW.offsetWidth - this.offsetR;
      if (this.enhance) {
        this.$refs.rightw.style.width = `calc(100% - ${this.leftWidth})`;
      }
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.left-right-drag-pack {
  //background-color: #eff2fb;
  padding: 0;
  //margin: -10px;
  width: 100%;
  display: flex;
  height: 100%;
  .p-0 {
    padding: 0px !important;
  }
  .icon-right-drag-s {
    position: relative;
    .img {
      position: absolute;
      right: -7px;
      width:12px;
      top: calc(calc(50vh - 136px));
      cursor: col-resize;
      transform: rotate(180deg);
      z-index: 3;
      display: flex;
      .img1 {
        transform: rotate(180deg);
        position: relative;
        top: 0;
      }
      .img2 {
        transform: rotate(0deg);
        left: -10px;
        top: 0;
        position: relative;
      }
    }
  }
  .right-pack {
    padding-left: 10px;
    box-sizing: border-box;
    position: relative;
    z-index: 2;
    flex: 1;
    background: #ffff;
    min-height: calc(100vh - 140px);
  }
  .left-pack {
    padding-right: 10px;
    border-right: 1px solid #E5E5E5;
    background: #ffff;
    overflow: auto;
    min-height: calc(100vh - 140px);
  }
  .center-pack {
    & > div {
      width: 100%;
    }
  }
}
</style>
