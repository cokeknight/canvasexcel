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
    if (col.getVisible()) {
      tempx += col.getWidth()
    }
  }

  for (j = this._scrollRowNum; tempy < y && j < this._rows.length; j++) {
    let row = this._rows[j]
    if (row.getVisible()) {
      tempy += row.getHeight()
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
  if (cell.getRowspan() < 0 || cell.getColspan() < 0) {
    return {
      row: (0 - cell.getRowspan()),
      col: (0 - cell.getColspan())
    }
  }
  if (cell.getRowspan() === 0) {
    return {
      row: 0,
      col: (0 - cell.getColspan())
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
    if (row.getVisible()) {
      tempy += row.getHeight()
    }
  }
  if (tempy > y) {
    if ((tempy - y) / row.getHeight() < 0.5) {
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
    if (col.getVisible()) {
      tempx += col.getWidth()
    }
  }
  if (tempx > x) {
    if ((tempx - x) / col.getWidth() < 0.5) {
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
      if (row.getVisible()) {
        y += row.getHeight()
      }
    }
  } else if (rowindex < this._scrollRowNum) {
    for (i = rowindex; i < this._scrollRowNum; i++) {
      row = (this._rows[i])
      if (row.getVisible()) {
        y -= row.getHeight()
      }
    }
  }
  if (colindex > this._scrollColNum) {
    for (i = this._scrollColNum; i < colindex; i++) {
      col = this._cols[i]
      if (col.getVisible()) {
        x += col.getWidth()
      }
    }
  } else if (colindex < this._scrollColNum) {
    for (i = colindex; i < this._scrollColNum; i++) {
      col = this._cols[i]
      if (col.getVisible()) {
        x -= col.getWidth()
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
