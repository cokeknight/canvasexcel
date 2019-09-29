<template>
  <div class="y-scroll-board">
    <div ref="scroll" class="y-scroll-wrap" :style="'top: '+x+'px; height: '+height+'px; display: block; bottom: 2px;'">
      <div
        ref="bar"
        class="y-scroll-box"
        :style="'height: '+height*0.6+'px; transform: translatey('+offestY+'px);'"
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
    height: {
      type: Number,
      default: 0,
      required: true
    }
  },
  data() {
    return {
      x: 0,
      eventX: 0,
      offestY: 0,
      mouseDownFlag: false,
      scroll: null,
      bar: null,
      maxBarY: 0
    }
  },
  watch: {
    offestY() {
      this.$emit('scroll', this.offestY)
    }
  },
  mounted() {
    this.scroll = this.$refs.scroll
    this.bar = this.$refs.bar
    this.maxBarY = this.scroll.clientHeight - this.bar.clientHeight
    document.addEventListener('mouseup', this.cancelDocumentMouseUp)
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.cancelDocumentMouseUp)
  },
  methods: {
    handleScrollBarMousedown(event) {
      this.mouseDownFlag = true
      const e = event || window.event
      const oldOffestY = this.offestY
      // 鼠标在滚动条中的位置
      const Y = getPage(e).pageY
      // 2.2鼠标在页面上移动的时候，滚动条的位置
      document.onmousemove = (de) => {
        if (this.mouseDownFlag) {
          const { maxBarY } = this
          const barY = getPage(de).pageY - Y
          // 控制bar不能移除scroll
          if (barY >= 0) {
            if (this.offestY >= maxBarY) {
              this.offestY = Math.min(maxBarY, oldOffestY + barY)
            } else {
              this.offestY = oldOffestY + barY
            }
          } else if (oldOffestY + barY <= 0) {
            this.offestY = 0
          } else {
            this.offestY = oldOffestY + barY
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
    },
    decrease() {
      const newOffestY = this.offestY + this.maxBarY * 0.05
      if (newOffestY <= this.maxBarY) {
        this.offestY = newOffestY
      }
    },
    increase() {
      const newOffestY = this.offestY - this.maxBarY * 0.05
      if (newOffestY >= 0) {
        this.offestY = newOffestY
      }
    }
  }
}
</script>
<style lang="scss">
.y-scroll-board {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 12px;
  z-index: 106;
  /* background-color: #f4f5f8; */
  /* border-left: 1px solid #d8dade; */
  cursor: auto;
  .y-scroll-wrap {
    position: absolute;
    width: 12px;
    right: 0;
    // padding: 0 2px;
    box-sizing: border-box;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    z-index: 102;
    /* background-color: #ffffff; */
    transition: right 0.5s ease
  }
  /* background-color: #ffffff; */
  .y-scroll-box {
    position: absolute;
    width: 8px;
    right: 2px;
    top: 0;
    border-radius: 5px;
    background-color: #b0b0b0;
    opacity: 0.88;
    transition: background-color, width 0.15s cubic-bezier(0.25, 0.1, 0.25, 0.1);
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
</style>
