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

DataGrid.prototype.getRectSize = function(srowindex, scolindex, erowindex, ecolindex) {
  let i
  let row,
    col
  let width = 0
  let
    height = 0
  for (i = srowindex; i <= erowindex; i++) {
    row = this._rows[i]
    if (row && DataRow.getVisible(row)) {
      height += DataRow.getHeight(row)
    }
  }
  for (i = scolindex; i <= ecolindex; i++) {
    col = this._cols[i]
    if (col && DataCol.getVisible(col)) {
      width += DataCol.getWidth(col)
    }
  }
  return {
    width,
    height
  }
}
DataGrid.prototype.combineCellsAdjust = function(_cells, srowindex, scolindex, erowindex, ecolindex) {
  if (srowindex > erowindex || scolindex > ecolindex) {
    // alert('paramter error: srowindex < erowindex or scolindex < ecolindex')
  } else {
    let i
    let j
    const a = 0
    const
      text = ''

    for (i = srowindex; i <= erowindex; i++) {
      for (j = scolindex; j <= ecolindex; j++) {
        if (!_cells[i][j]) _cells[i][j] = {}
        if (i == srowindex && j == scolindex) {
          _cells[i][j].rows = erowindex - srowindex
          _cells[i][j].cols = ecolindex - scolindex
        } else {
          _cells[i][j].rows = 0 - srowindex - 1
          _cells[i][j].cols = 0 - scolindex - 1
        }
      }
    }
  }
}
DataGrid.prototype.combineCells = function(srowindex, scolindex, erowindex, ecolindex) {
  if (srowindex > erowindex || scolindex > ecolindex) {
    alert('paramter error: srowindex < erowindex or scolindex < ecolindex')
  } else {
    let i
    let j
    const a = 0
    const
      text = ''

    if (this._rows.length < erowindex) {
      this.insertRow(erowindex)
    }

    if (this._cols.length < ecolindex) {
      this.insertCol(ecolindex)
    }
    for (i = srowindex; i <= erowindex; i++) {
      for (j = scolindex; j <= ecolindex; j++) {
        if (i == srowindex && j == scolindex) {
          this._cells[i][j].rows = erowindex - srowindex
          this._cells[i][j].cols = ecolindex - scolindex
        } else {
          this._cells[i][j].rows = 0 - srowindex - 1
          this._cells[i][j].cols = 0 - scolindex - 1
        }
      }
    }
  }
}

DataGrid.prototype.combineSelCells = function(srowindex, scolindex, erowindex, ecolindex) {
  this.combineCells(this._sel_startRow, this._sel_startCol, this._sel_endRow, this._sel_endCol)
}
DataGrid.prototype.IscombineCell = function(srowindex, scolindex, erowindex, ecolindex) {
  if (srowindex > erowindex || scolindex > ecolindex) {
    alert('paramter error: srowindex < erowindex or scolindex < ecolindex')
  } else {
    let i
    let j
    const a = 0
    const
      text = ''
    for (i = srowindex; i <= erowindex; i++) {
      for (j = scolindex; j <= ecolindex; j++) {
        if (this._cells[i][j].rows === undefined) {
          return false
        }
      }
    }
  }
  return true
}

DataGrid.prototype.breakupCells = function(srowindex, scolindex, erowindex, ecolindex) {
  let i,
    j
  // this._cells[srowindex][scolindex].t='';
  for (i = srowindex; i <= erowindex; i++) {
    for (j = scolindex; j <= ecolindex; j++) {
      if (this._cells[i][j].rows != undefined) {
        delete this._cells[i][j].rows
      }
      if (this._cells[i][j].cols != undefined) {
        delete this._cells[i][j].cols
      }
    }
  }
}
