/* eslint-disable */
import DataRow from '../DataRow'
import DataCol from '../DataCol'
import DataCell from '../DataCell'
import Component from '../component'
import _ from 'lodash'
import {
  _gl_mouseState,
  glGetMouseState,
  glSetMouseState,
  glGetMouseFocusWin,
  glSetMouseFocusWin,
  glGetMouseFocusEl,
  glSetMouseFocusEl,
  glGetMousePageXY,
  glGetMouseClientXY,
  glGetMouseCanvasXY,
  glGetMouseScreenXY,
  glGetEvent,
  glGetTarget
} from '../glMouseEvent'
const borderColor = '#d8dade'
const DataGrid = require('./instance').default.default
DataGrid.prototype.paintSelCells = function paintSelCells() {
  // eslint-disable-next-line
  const startcoor = this.getCellLeftTopCoor(this._sel_startRow, this._sel_startCol)
  // eslint-disable-next-line
  // console.log('startcoor', startcoor, this._sel_startRow, this._sel_startCol)
  // eslint-disable-next-line
  const selsize = this.getRectSize(this._sel_startRow, this._sel_startCol, this._sel_endRow, this._sel_endCol);
  // eslint-disable-next-line
  const focuscoor = this.getCellLeftTopCoor(this._focusRow, this._focusCol)
  const focusize = this.getCellSize(this._focusRow, this._focusCol)
  // eslint-disable-next-line
  this.$emit('canvasPaintSelCells',startcoor, selsize, focuscoor, focusize, this._sel_startRow, this._sel_startCol, this._sel_endRow, this._sel_endCol,this._focusRow, this._focusCol)
}
DataGrid.prototype.dblclick = function dblclick(e) {
  // eslint-disable-next-line
  if (this._caneditform === false) {
    return false
  }
  // eslint-disable-next-line
  const cellpos = this.getCellLeftTopCoor(this._focusRow, this._focusCol);
  // eslint-disable-next-line
  // console.log('dblclick', this._focusRow, this._focusCol)
  // eslint-disable-next-line
  const focuCellsize = this.getCellSize(this._focusRow, this._focusCol)
  // eslint-disable-next-line
  const cell = this._cells[this._focusRow][this._focusCol]
  // eslint-disable-next-line
  if (!_.isUndefined(cell._fl) && ((cell._fl >> 0) & 0x01) === 0) { // 单元保护
    return false
  }
  // eslint-disable-next-line
  this.$emit('canvasDblclick',cell, this._focusRow, this._focusCol, cellpos, focuCellsize)
}

DataGrid.prototype.mousewheel = function mousewheel(e) {
  if (this.yScroll) {
    if (e.wheelDelta < 0) { // 向下
      this.$emit('yScrolldecrease')
      // self.$refs.yScroll.decrease()
    } else if (e.wheelDelta > 0) { // 向上
      this.$emit('yScrollincrease')
      // self.$refs.yScroll.increase()
    }
  }
}
