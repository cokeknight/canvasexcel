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
DataGrid.prototype.showGroup = function(rowIndex) // 根据鼠标位置获得对应的行列
{
  let visible = true
  if (this._rows[rowIndex].isGroupVisible()) {
    visible = false
    this._rows[rowIndex].setGroupVisible(false)
  } else {
    this._rows[rowIndex].setGroupVisible(true)
  }
  for (let i = rowIndex + 1; i < this._rows.length; i++) {
    let row = this._rows[i]
    if (row.group===true) {
      break;
    } else {
      row.setVisible(visible)
    }
  }
  this.reDrawChart()
}
