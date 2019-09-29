<template>
  <div class="x-scroll-board">
    <div ref="scroll" class="x-scroll-wrap" :style="'left: '+x+'px; width: '+containerwidth+'px; display: block; bottom: 2px;'">
      <div
        ref="bar"
        class="x-scroll-box"
        :style="'width: '+(containerwidth/width)*containerwidth+'px; transform: translateX('+offestX+'px);'"
        @mousedown="handleScrollBarMousedown"
        @mouseup="handleScrollBarMouseup"
      />
    </div>
  </div>
</template>
<script>
// import { glGetMouseCanvasXY } from './canvasExcel/glMouseEvent'
// 获取页面滚动距离的浏览器兼容性问题
// 获取页面滚动出去的距离
function getScroll() {
  const scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft
  const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
  return {
    scrollLeft,
    scrollTop
  }
}

// 获取鼠标在页面的位置，处理浏览器兼容性
function getPage(e) {
  const pageX = e.pageX || e.clientX + getScroll().scrollLeft
  const pageY = e.pageY || e.clientY + getScroll().scrollTop
  return {
    pageX,
    pageY
  }
}
export default {
  props: {
    width: {
      type: Number,
      default: 0,
      required: true
    },
    containerwidth: {
      type: Number,
      default: 0,
      required: true
    }
  },
  data() {
    return {
      x: 0,
      eventX: 0,
      offestX: 0,
      mouseDownFlag: false,
      scroll: null,
      bar: null
    }
  },
  watch: {
    offestX() {
      const scale = this.width / this.containerwidth
      this.$emit('scroll', this.offestX * scale)
    }
  },
  mounted() {
    this.scroll = this.$refs.scroll
    this.bar = this.$refs.bar
    document.addEventListener('mouseup', this.cancelDocumentMouseUp)
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.cancelDocumentMouseUp)
  },
  methods: {
    handleScrollBarMousedown(event) {
      this.mouseDownFlag = true
      const e = event || window.event
      const oldOffestX = this.offestX
      // 鼠标在滚动条中的位置
      const X = getPage(e).pageX
      // 2.2鼠标在页面上移动的时候，滚动条的位置
      document.onmousemove = (de) => {
        if (this.mouseDownFlag) {
          const maxBarX = this.scroll.clientWidth - this.bar.clientWidth
          const barX = getPage(de).pageX - X
          // 控制bar不能移除scroll
          if (barX >= 0) {
            if (this.offestX >= maxBarX) {
              this.offestX = Math.min(maxBarX, oldOffestX + barX)
            } else {
              this.offestX = oldOffestX + barX
            }
          } else if (oldOffestX + barX <= 0) {
            this.offestX = 0
          } else {
            this.offestX = oldOffestX + barX
          }
        }
      }
    },
    handleScrollBarMouseup(event) {
      if (this.mouseDownFlag) {
        this.mouseDownFlag = false
      }
    },
    cancelDocumentMouseUp() {
      document.onmousemove = null
    }
  }
}
</script>
<style lang="scss">
.x-scroll-board {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 12px;
  z-index: 106;
  /* background-color: #f4f5f8; */
  /* border-left: 1px solid #d8dade; */
  cursor: auto;
  .x-scroll-wrap {
    position: absolute;
    height: 12px;
    padding: 2px 0;
    bottom: 0px;
    box-sizing: border-box;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    z-index: 102;
    /* background-color: #ffffff; */
    .x-scroll-box {
      position: absolute;
      height: 8px;
      bottom: 2px;
      background-color: #b0b0b0;
      opacity: 0.88;
      left: 0;
      border-radius: 5px;
      transition: background-color, height 0.15s cubic-bezier(0.25, 0.1, 0.25, 0.1);
      overflow: hidden;
      &:hover {
        opacity: 0.88;
        height: 10px;
        background-color: #888888;
      }
      &:active {
        opacity: 0.88;
        height: 10px;
        background-color: #888888;
      }
    }
  }
}
</style>
