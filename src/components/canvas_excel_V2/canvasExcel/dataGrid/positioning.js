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
DataGrid.prototype.getRowColByCoor = function(x, y) // 根据鼠标位置获得对应的行列
{
  let i,
    j
  let row,
    col
  let tempx = this._offsetX
  let tempy = this._offsetY
  for (i = this._scrollColNum; tempx < x && i < this._cols.length; i++) {
    let col = this._cols[i]
    if (DataCol.getVisible(col)) {
      tempx += DataCol.getWidth(col)
    }
  }

  for (j = this._scrollRowNum; tempy < y && j < this._rows.length; j++) {
    let row = this._rows[j]
    if (DataRow.getVisible(row)) {
      tempy += DataRow.getHeight(row)
    }
  }

  if (tempx < x || tempy < y) {
    if (tempx < x) {
      col = this._cols.length - 1
    } else {
      if (i == 0) {
        i = 1
      }
      col = i - 1
    }

    if (tempy < y) {
      row = this._rows.length - 1
    } else {
      row = j - 1
    }
    return {
      row,
      col
    }
  }

  if (i == 0) {
    i = 1
  }
  if (j == 0) {
    j = 1
  }
  const cell = this._cells[j - 1][i - 1]
  if (DataCell.getRowspan(cell) < 0 || DataCell.getColspan(cell) < 0) {
    return {
      row: (0 - DataCell.getRowspan(cell)),
      col: (0 - DataCell.getColspan(cell))
    }
  }
  if (DataCell.getRowspan(cell) === 0) {
    return {
      row: 0,
      col: (0 - DataCell.getColspan(cell))
    }
  }

  return {
    row: (j - 1),
    col: (i - 1)
  }
}

DataGrid.prototype.getRowByDisToTop = function(y) // 根据鼠标位置获得对应的行
{
  let i,
    row,
    half
  let tempy = 0
  for (i = 0; tempy <= y && i < this._rows.length; i++) {
    row = this._rows[i]
    if (DataRow.getVisible(row)) {
      tempy += DataRow.getHeight(row)
    }
  }
  if (tempy > y) {
    if ((tempy - y) / DataRow.getHeight(row) < 0.5) {
      half = true
    } else {
      half = false
    }
    return {
      row: i,
      half
    }
  }

  return {
    row: this._rows.length,
    half: true
  }
}

DataGrid.prototype.getColByDisToLeft = function(x) // 根据鼠标位置获得对应的列
{
  let i,
    col,
    half
  let tempx = 0
  for (i = 0; tempx <= x && i < this._cols.length; i++) {
    col = this._cols[i]
    if (DataCol.getVisible(col)) {
      tempx += DataCol.getWidth(col)
    }
  }
  if (tempx > x) {
    if ((tempx - x) / DataCol.getWidth(col) < 0.5) {
      half = true
    } else {
      half = false
    }
    return {
      col: i,
      half
    }
  }

  return {
    col: this._cols.length,
    half: true
  }
}
DataGrid.prototype.getCellLeftTopCoor = function(rowindex, colindex) {
  let x,
    y,
    i,
    row,
    col
  x = this._offsetX
  y = this._offsetY
  if (rowindex > this._scrollRowNum) {
    for (i = this._scrollRowNum; i < rowindex; i++) {
      row = (this._rows[i])
      if (DataRow.getVisible(row)) {
        y += DataRow.getHeight(row)
      }
    }
  } else if (rowindex < this._scrollRowNum) {
    for (i = rowindex; i < this._scrollRowNum; i++) {
      row = (this._rows[i])
      if (DataRow.getVisible(row)) {
        y -= DataRow.getHeight(row)
      }
    }
  }
  if (colindex > this._scrollColNum) {
    for (i = this._scrollColNum; i < colindex; i++) {
      col = this._cols[i]
      if (DataCol.getVisible(col)) {
        x += DataCol.getWidth(col)
      }
    }
  } else if (colindex < this._scrollColNum) {
    for (i = colindex; i < this._scrollColNum; i++) {
      col = this._cols[i]
      if (DataCol.getVisible(col)) {
        x -= DataCol.getWidth(col)
      }
    }
  }
  return {
    x: x - this.scrollX,
    y: y - this.scrollY,
  }
}

DataGrid.prototype.getCellRightTopCoor = function(rowindex, colindex) {
  const leftop = this.getCellLeftTopCoor(rowindex, colindex)
  const cellsize = this.getCellSize(rowindex, colindex)
  return {
    x: leftop.x + cellsize.width,
    y: leftop.y
  }
}

DataGrid.prototype.getCellRightBottomCoor = function(rowindex, colindex) {
  const leftop = this.getCellLeftTopCoor(rowindex, colindex)
  const cellsize = this.getCellSize(rowindex, colindex)
  return {
    x: leftop.x + cellsize.width,
    y: leftop.y + cellsize.height
  }
}

DataGrid.prototype.getCellLeftBottomCoor = function(rowindex, colindex) {
  const leftop = this.getCellLeftTopCoor(rowindex, colindex)
  const cellsize = this.getCellSize(rowindex, colindex)
  return {
    x: leftop.x,
    y: leftop.y + cellsize.height
  }
}
