<template>
  <div class="canvasContainer" style="width:100%;text-align: left;">
    <div ref="excelContainer" class="excel-container" style="font-size:0">
      <canvas ref="canvas" class="canvas" />
      <div class="touch-board" style="width: 100%; height: 100%;">
        <div :style="touchBoardStyle">
          <div class="right-board">
            <div class="select-wrap">
              <div class="selection-board">
                <div
                  :class="'select-area '+(selectAreaClass?selectAreaClass:'')"
                  :style="'left: '+selectArea.x+'px; top:'+selectArea.y+'px; width: '+selectArea.width+'px; height: '+selectArea.height+'px; display: '+selectAreaDisplay+';background-color: '+selectAreaBackgound+';'"
                >
                  <div class="oper-point" :style="'display: '+selectAreaDisplay+';'" />
                </div>
                <div
                  class="active-area"
                  :style="'display: '+focusCellDisplay+';left:  '+focusCell.x+'px; top: '+focusCell.y+'px; width: '+focusCell.width+'px; height:  '+focusCell.height+'px; background-color: '+focusCellBackgound+';'"
                />
                <div class="table-input-board-container" :style="'left: '+richTextEditorX+'px; top:'+selectAreaY+'px; width: '+selectArea.width+'px; height: '+selectArea.height+'px;line-height: '+(selectArea.height *3/4)+'px;'">
                  <div ref="alloyRichTextEditor" class="alloy-rich-text-editor" :style="'text-align:center;min-width: '+(selectArea.width - 3)+'px'" />
                </div>
              </div>
              <xScrollBoard v-if="xScroll" :width="xScrollWidth" :containerwidth="width" @scroll="handleScrollX" />
              <yScrollBoard v-if="yScroll" ref="yScroll" :height="yScrollHeight" :containerheight="height" @scroll="handleScrollY" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import CanvasExcel from './canvasExcel/index'
import xScrollBoard from './xScrollBoard'
import yScrollBoard from './yScrollBoard'
import TableExpand from './tableExpand'
import Config from './canvasExcel/config'

const borderWidth = 1
const borderHeight = 1
export default {
  components: {
    xScrollBoard,
    yScrollBoard
  },
  props: {
    tableSchema: { // 定义表格骨架
      type: Object,
      required: true
    },
    tableData: { // 定义表格数据
      type: [Object, Array]
    },
    canvasProps: { // 定义表格骨架
      type: Object,
      default(){
        return {
          xScroll:true,
          yScroll:true,
          caneditform:false
        }
      }
    }
  },
  data() {
    return {
      isSelectArea: false,
      richTextEditorX: '-9999',
      selectAreaClass: null,
      selectArea: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        self: null,
        startRow: null,
        startCol: null,
        endRow: null,
        endCol: null
      },
      focusCell: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        row: null,
        col: null,
        self: null
      },
      elTableHeaderHeight: 0,
      canvasExcelInstance: null,

      width: 0,
      height: 0,
      totalWidth: null,
      totalHeight: null
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    selectAreaDisplay() {
      if (this.richTextEditorX === '-9999') {
        return 'block'
      }
      return 'none'
    },
    isEditing() {
      return this.richTextEditorX !== '-9999'
    },
    // isSelectArea() {
    //   return this.selectArea.endRow !== this.focusCell.row || this.selectArea.endCol !== this.focusCell.col
    // },
    focusCellDisplay() {
      if (this.isSelectArea) {
        return 'block'
      }
      return 'none'
    },
    focusCellBackgound() {
      if (this.isSelectArea) {
        return 'rgba(255, 255, 255, 0.4)'
      }
      return 'transparent'
    },
    selectAreaBackgound() {
      if (this.isSelectArea) {
        return 'rgba(1, 136, 251, 0.1)'
      }
      return 'rgba(0, 0, 0, 0);'
    },
    selectAreaY() {
      return this.selectArea.y
    },
    isInfixedArea() {
      return this.selectAreaClass === 'fixed'
    },
    xScrollWidth() {
      return this.totalWidth || 0
    },
    yScrollHeight() {
      return this.totalHeight || 0
    },
    touchBoardStyle() {
      return `margin-left: 40px; margin-top: 20px; font-size: 0px;width: ${this.width - 40}px;height:${this.height - Config.colheadheight}px;`
    },
    xScroll() {
      if (this.canvasProps && 'xScroll' in this.canvasProps) {
        return this.canvasProps.xScroll
      }
      return true
    },
    yScroll() {
      if (this.canvasProps && 'yScroll' in this.canvasProps) {
        return this.canvasProps.yScroll
      }
      return true
    }
  },
  watch: {
    tableData(tableData) {
      if (tableData) {
        console.log(156, '表格数据变化')
        this.rePaintCanvas()
      }
    },
    canvasProps: {
      handler(val) {
        if (val) {
          setTimeout(() => {
            this.init()
          }, 0)
        }
      },
      immediate: true
    }
  },
  beforeCreate() {
    // const self = this
  },
  methods: {
    init() {
      const {
        canvas,
        excelContainer
      } = this.$refs
      const {
        x,
        y
      } = canvas.getBoundingClientRect()
      const { width: maxWidth, height: maxHeight } = excelContainer.getBoundingClientRect()

      const props = TableExpand.getTableSchema(this.tableSchema, this.tableData, this.canvasProps || {})
      const totalcol = this.canvasProps.totalcol || props.totalcol
      let totalRow = this.canvasProps.totalrow
      if (!totalRow && this.tableData) {
        totalRow = this.tableData.length
        props.totalrow = totalRow
      }

      this.totalWidth = Config.getWidth({ totalcol, cols: props.cols, group: this.canvasProps.group })
      this.totalHeight = Config.getHeight({ totalrow: totalRow })
      this.width = Math.min(maxWidth, this.totalWidth)
      this.height = maxHeight

      if (!totalRow) { 
        this.totalHeight = this.height
      }
      console.log(169,'totalRow',
      totalRow, '宽度',
       this.totalWidth, 
       '高度', this.totalHeight,
       '最大高度',this.height)
      this.canvasExcelInstance = new CanvasExcel(canvas, {
        width: this.width,
        height: this.height,
        totalWidth: this.totalWidth,
        totalHeight: this.totalHeight,
        offestX: x,
        offest: y,
        rowheadwidth: Config.rowheadwidth,
        colheadheight: Config.colheadheight,
        ...this.canvasProps,
        ...props
      })
      this.canvasExcelInstance.$on('canvasPaintSelCells', (...rest) => {
        this.canvasPaintSelCells(...rest)
      })
      this.canvasExcelInstance.$on('canvasDblclick', (...rest) => {
        this.canvasDblclick(...rest)
      })
      this.canvasExcelInstance.$on('yScrolldecrease', (...rest) => {
        this.$refs.yScroll.decrease()
      })
      this.canvasExcelInstance.$on('yScrollincrease', (...rest) => {
        this.$refs.yScroll.increase()
      })
      this.canvasExcelInstance.run()
    },
    setSize() {
      const {
        excelContainer
      } = this.$refs

      const { width: maxWidth, height: maxHeight } = excelContainer.getBoundingClientRect()
      this.width = Math.min(maxWidth, this.totalWidth)
      this.height = Math.max(maxHeight, this.totalHeight)
      this.canvasExcelInstance.setSize({ width: this.width, height: this.height })
    },
    reDrawChart(){
      this.canvasExcelInstance.reDrawChart()
    },
    rePaintCanvas() {
      const { cells } = TableExpand.getTableSchema(this.tableSchema, this.tableData, {})
      this.canvasExcelInstance.redrawCells(cells)
    },
    resetSize() {
      this.setSize()
    },
    isCurrentCell(startRow, startCol) {
      return this.focusCell.row === startRow && this.focusCell.col === startCol
    },
    canvasPaintSelCells(startcoor, selsize, focuscoor, focusize, startRow, startCol, endRow, endCol, focusRow, focusCol) {
      if (this.isEditing && !this.isCurrentCell(startRow, startCol)) {
        this.retrieveCellEditStatus()
      }

      const x = startcoor.x - Config.rowheadwidth
      const y = startcoor.y - Config.colheadheight
      // 设置选区域
      this.selectArea.x = x
      this.selectArea.y = y
      this.selectArea.selsize = selsize
      this.selectArea.width = selsize.width
      this.selectArea.height = selsize.height
      this.selectArea.startRow = startRow
      this.selectArea.startCol = startCol
      this.selectArea.endRow = endRow
      this.selectArea.endCol = endCol
      // 设置选中的开始单元格

      const focuscoorx = focuscoor.x - Config.rowheadwidth
      const focuscoory = focuscoor.y - Config.colheadheight
      // console.log('选中单元格', startcoor, selsize, focuscoor, focusize,
      //   'startRow', startRow, 'startCol', startCol,
      //   'endRow', endRow, 'endCol', endCol, 'focusRow', focusRow, 'focusCol', focusCol,
      //   'x', x, 'y', y,
      //   'focuscoorx', focuscoorx, 'focuscoory', focuscoory)
      this.focusCell.x = focuscoorx + borderHeight
      this.focusCell.y = focuscoory + borderWidth
      this.focusCell.width = focusize.width - borderWidth * 2
      this.focusCell.height = focusize.height - borderHeight * 2
      this.focusCell.row = focusRow
      this.focusCell.col = focusCol

      if (focuscoorx === x && focuscoory === y && selsize.width === focusize.width && selsize.height === focusize.height) {
        this.isSelectArea = false
      } else {
        this.isSelectArea = true
      }
    },

    canvasDblclick(cell, row, col, cellpos, focuCellsize) {
      this.richTextEditorX = cellpos.x - Config.rowheadwidth
      const divCell = this.getRichTextEditor()
      const val = this.getData(cell, row, col)
      if (val) {
        divCell.innerHTML = val
      }
      divCell.contentEditable = true
      this.focusCell.self = cell
      setTimeout(() => {
        divCell.focus()
        const range = document.createRange()
        range.setStart(divCell, divCell.childNodes.length)
        const selection = getSelection()
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
      }, 0)
    },

    getRichTextEditor() {
      if (this.isInfixedArea) {
        return document.getElementById('alloy-rich-text-editor-fixedleft')
      }
      return this.$refs.alloyRichTextEditor
    },

    handleCanvasMouseDown() {
      console.log(175, 'handleCanvasMouseDown')
      // if (this.isCurrentCell) {

      // }
    },
    retrieveCellEditStatus(cellValue) {
      const retrieveCellStatusCallback = (cell, property, uniqueId) => {
        const divCell = this.getRichTextEditor()
        if (divCell === null) {
          setTimeout(() => {
            retrieveCellStatusCallback(property, uniqueId)
          }, 0)
          return
        }
        const text = cellValue || divCell.innerHTML
        if (text) { // 存在数据 需要设置到单元格里
          cell.setValue(text)
          this.$emit('reset', uniqueId, property, text)
        }
        divCell.innerHTML = ''
        divCell.removeAttribute('contentEditable')
      }
      if (this.focusCell.self) {
        const uniqueId = this.focusCell.row
        const property = this.focusCell.col
        this.richTextEditorX = '-9999'
        retrieveCellStatusCallback(this.focusCell.self, property, uniqueId)
      }
    },
    getData(cell, row, col) {
      if (cell.tableHeader) {
        return cell.value
      }
      return null
    },
    handleScrollX(offestX) {
      this.canvasExcelInstance.handleScrollX(offestX)
    },
    handleScrollY(offestY) {
      this.canvasExcelInstance.handleScrollY(offestY)
    }
  }
}

</script>
<style lang="scss">
.canvasContainer{
  position: relative;
}
.excel-container{
  transform-origin: left top;
  height: 100%;
  width: 100%;
  transform: scale(1);
  overflow: hidden;
  .touch-board{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
    background-color: rgba(255, 255, 255, 0);
    width: 100%;
    height: 100%;
    pointer-events: none;
    .right-board{
      position: relative;
      height: 100%;
      width: 100%;
      left: 0px;
      overflow: hidden;
    }
    .alloy-rich-text-editor,.alloy-rich-text-editor-fixedleft {
      padding: 0px 2px;
      display: table-cell;
      white-space: pre-wrap;
      word-break: break-word;
      overflow-wrap: break-word;
      background-color: rgb(255, 255, 255);
      text-align: right;
      vertical-align: middle;
      text-decoration-skip-ink: none;
      font-family: "Microsoft YaHei", 微软雅黑;
      font-size: 10pt;
      color: rgb(0, 0, 0);
      font-weight: normal;
      font-style: normal;
      text-decoration: none;
      -moz-user-select:none;
      user-select:none;
    }
  }
}
.select-wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 3;

  .table-input-board-container{
    position: absolute;
    top: 0;
    left: 0;
    width: auto;
    height: auto;
    border: 2px #5292f7 solid;
    z-index: 105;
    background-color: #ffffff;
    box-sizing: border-box;
    transform-origin: top left;
  }
  .x-scroll-board{
    pointer-events: visible;
  }
  .y-scroll-board{
    pointer-events: visible;
  }
  .selection-board{
    position: absolute;
    left: 0;
    top: 0;
    z-index: 9;
    transform: translate3d(0px, 0px, 0px);
    pointer-events: visible;

    .select-area{
      display: none;
      position: absolute;
      background-color: rgba(1, 136, 251, 0.1);
      box-sizing: border-box;
      border: 2px solid #0188fb;
      box-sizing: border-box !important;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      tap-highlight-color: rgba(0, 0, 0, 0);
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      pointer-events: none;
      &.fixed{
        z-index: 99;
        // position: fixed;
      }
      .oper-point{
        position: absolute;
        background-color: #0188fb;
        height: 5px;
        width: 5px;
        border: 2px solid rgb(255, 255, 255);
        display: block;
        right: -4.5px;
        bottom: -4.5px;
        cursor: crosshair;
        box-sizing: content-box;
      }
    }
    .active-area {
      display: none;
      position: absolute;
      box-sizing: border-box;
      /* border: 2px solid #0188fb; */
      -webkit-transform-origin: left top;
      transform-origin: left top;
      -webkit-transform: matrix(1, 0, 0, 1, 0, 0);
      transform: matrix(1, 0, 0, 1, 0, 0);
      box-sizing: border-box !important;
      pointer-events: none;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  }
}

</style>
