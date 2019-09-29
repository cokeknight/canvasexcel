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
import Config from '../config'
const borderColor = '#d8dade'

const DataGrid = require('./instance').default.default

DataGrid.prototype.getMousecursor = function() {
  return this._Mousecursor
}
DataGrid.prototype.getRowHeaderHeight = function() {
  return this._RowHeaderHeight
}
DataGrid.prototype.isShowHeader = function() {
  if (typeof (this._showheader) === 'string') {
    return parseInt(this._showheader, 10)
  }
  if (this._showheader !== undefined) {
    return this._showheader
  }
  return 1
}

DataGrid.prototype.getColHeaderWidth = function() {
  return this._ColHeaderWidth
}
DataGrid.prototype.getNetChartVisible = function() {
  if (typeof (this._showgrid) === 'string') {
    return parseInt(this._showgrid, 10)
  }
  if (this._showgrid !== undefined) {
    return this._showgrid
  }
  return 1
}

DataGrid.prototype.setNetChartVisible = function(visible) {
  if (typeof (visible) === 'boolean') {
    if (visible) {
      this._showgrid = 1
    } else {
      this._showgrid = 0
    }
  } else {
    alert('paramter error:visible should be boolean type')
  }
}

DataGrid.prototype.getRowHeight = function(index) {
  if (index < this._rows.length) {
    const row = (this._rows[index])
    return row.getHeight()
  }

  alert("paramter error:the index you provide is out of this._rows' range")
  return -1
}

DataGrid.prototype.setRowHeight = function(index, height) {
  if (index < this._rows.length) {
    if (typeof (height) === 'number') {
      this._rows[index].height = height
    } else {
      alert('paramter error:this height you provide is not number type')
    }
  } else {
    alert("paramter error:the index you provide is out of the._rows' range")
  }
}
DataGrid.prototype.delCellPrototype = function(prototype) {
  if (prototype === 'financial') {
    let i,
      j,
      cell
    for (i = this._sel_startRow; i <= this._sel_endRow; i++) {
      for (j = this._sel_startCol; j <= this._sel_endCol; j++) {
        cell = this._cells[i][j]
        if ((cell.tag >> 0) & 0x01) { // 设置财务表头
          this._cells[i][j].tag = cell.tag ^ (1 << 0) // 取反
        } else if ((cell.fl >> 15) & 0x01) { // 设置财务表览
          this._cells[i][j].fl = cell.fl ^ (1 << 15) // fl 15
        } else if (cell.swty !== undefined) {
          delete this._cells[i][j].swty
          delete this._cells[i][j].dpt
        }
      }
    }
  }
}

DataGrid.prototype.getRowVisible = function(index) {
  if (index < this._rows.length) {
    const row = (this._rows[index])
    return row.getVisible()
  }

  alert("paramter error: the index you provide is out of the this._rows' range'")
  return -1
}

DataGrid.prototype.setRowVisible = function(index, visible) {
  if (index < this._rows.length) {
    if (typeof (visible) === 'boolean') {
      this._rows[index].visible = visible
    } else {
      alert('paramter error: visible should be boolean type')
    }
  } else {
    alert("paramter error: the index you provide is out of the this._rows' range")
  }
}

DataGrid.prototype.getColWidth = function(index) {
  if (index < this._cols.length) {
    const col = this._cols[index]
    return col.getWidth()
  }

  alert("paramter error: the index you provide out of the this._cols' range")
  return -1
}

DataGrid.prototype.setColWidth = function(index, width) {
  if (index < this._cols.length) {
    if (typeof (width) === 'number') {
      this._cols[index].width = width
    } else {
      alert('paramter error: the width should be number type')
    }
  } else {
    alert("paramter error: the index you provide is out of the this._cols' range")
  }
}

DataGrid.prototype.getColVisible = function(index) {
  if (index < this._cols.length) {
    const col = this._cols[index]
    return col.getVisible()
  }

  alert("paramter error: the index you provide is out of the this._cols' range")
  return -1
}

DataGrid.prototype.setColVisible = function(index, visible) {
  if (index < this._cols.length) {
    if (typeof (visible) === 'boolean') {
      this._cols[i].visible = visible
    } else {
      alert('paramter error:the visible should be boolean')
    }
  } else {
    alert("paramter error: the index you provide is out of the this._cols' range")
  }
}

DataGrid.prototype.getRowsCount = function() {
  return this._rows.length
}

DataGrid.prototype.getColsCount = function() {
  return this._cols.length
}

DataGrid.prototype.insertRow = function(index) {
  let i,
    j
  if (this._rows.length > index) {
    this._rows.splice(index, 0, {})
    this._cells.splice(index, 0, new Array())
    for (j = 0; j < this._cols.length; j++) {
      this._cells[index].push({})
    }
  } else {
    for (i = this._rows.length; i <= index; i++) {
      this._cells.push(new Array())
      this._rows.push({})
      for (j = 0; j < this._cols.length; j++) {
        this._cells[i].push({})
      }
    }
  }
}

DataGrid.prototype.deleteRow = function(index) {
  if (index < this._rows.length) {
    this._rows.splice(index, 1)
    this._cells.splice(index, 1)
  } else {
    alert("paramter error:the index you provide is out of the this._rows' range")
  }
}

DataGrid.prototype.insertCol = function(index) {
  let i,
    j
  if (this._cols.length > index) {
    this._cols.splice(index, 1, {})
    for (i = 0; i < this._rows.length; i++) {
      this._cells[i].splice(index, 0, {})
    }
  } else {
    for (j = 0; j < this._rows.length; j++) {
      for (i = this._cols.length; i <= index; i++) {
        if (j == 0) {
          this._cols.push({})
        }
        this._cells[j].push({})
      }
    }
  }
}

DataGrid.prototype.deleteCol = function(index) {
  if (index < this._cols.length) {
    let i
    this._cols.splice(index, 1)
    for (i = 0; i < this._rows.length; i++) {
      this._cells[i].splice(index, 1)
    }
  } else {
    alert("paramter error:the index you provide is out of the this._rows' range")
  }
}

DataGrid.prototype.insertCellTop = function(rowindex, colindex) // 上面插入活动单元下移
{
  if (rowindex < this._rows.length && colindex < this._cols.length) {
    let i
    const cell = this._cells[this._rows.length - 1][colindex]
    if (cell.ifSave()) {
      this.insertRow(this._rows.length)
    }
    for (i = this._rows.length; i > rowindex; i--) {
      this._cells[i][colindex] = this._cells[i - 1][colindex]
    }
    this._cells[rowindex][colindex] = {}
  } else {
    alert('paramter error: the rowindex or colindex you provide may out of the range')
  }
}

DataGrid.prototype.deleteCellTopMove = function(rowindex, colindex) // 删除单元格活动单元上移
{
  if (rowindex < this._rows.length && colindex < this._cols.length) {
    let i
    for (i = rowindex; i < this._rows.length; i++) {
      if (i != (this._rows.length - 1)) {
        this._cells[i][colindex] = this._cells[i + 1][colindex]
      } else {
        this._cells[i][colindex] = {}
      }
    }
  } else {
    alert('paramter error: the rowindex or colindex you provide may out of the range')
  }
}

DataGrid.prototype.insertCellLeft = function(rowindex, colindex) // 左边插入活动单元格右移
{
  if (rowindex < this._rows.length && colindex < this._cols.length) {
    let i
    const cell = this._cells[rowindex][this._cols.length - 1]
    if (cell.ifSave()) {
      this.insertCol(this._cols.length)
    }
    for (i = this._cols.length; i > colindex; i--) {
      this._cells[rowindex][i] = this._cells[i - 1][colindex]
    }
    this._cells[rowindex][colindex] = {}
  } else {
    alert('paramter error: the rowindex or colindex you provide may out of the range')
  }
}

DataGrid.prototype.deleteCellLeftMove = function(rowindex, colindex) // 删除单元格活动单元左移
{
  if (rowindex < this._rows.length && colindex < this._cols.length) {
    let i
    for (i = colindex; i < this._cols.length; i++) {
      if (i != (this._cols.length - 1)) {
        this._cells[rowindex][i] = this._cells[rowindex][i + 1]
      } else {
        this._cells[rowindex][i] = {}
      }
    }
  } else {
    alert('paramter error: the rowindex or colindex you provide may out of the range')
  }
}

DataGrid.prototype.getCellSize = function(rowindex, colindex) {
  let i
  let width = 0
  let
    height = 0
  let row,
    col
  const cell = this._cells[rowindex][colindex]
  for (i = 0; i < cell.getColspan(); i++) {
    col = this._cols[colindex + i]
    // try {
      if (col.getVisible()) {
      width += col.getWidth()
    }
    // } catch (error) {
    //   debugger
    // }

  }

  for (i = 0; i < cell.getRowspan(); i++) {
    row = (this._rows[rowindex + i])
    if (row.getVisible()) {
      height += row.getHeight()
    }
  }
  return {
    width,
    height
  }
}



DataGrid.prototype.breakupSelCells = function() {
  this.breakupCells(this._sel_startRow, this._sel_startCol, this._sel_endRow, this._sel_endCol)
}



DataGrid.prototype.findCombineCellsAroundSelCells = function() // 找到合并的单元格
{
  let i,
    cell
  let temp_startrow,
    temp_startcol,
    temp_endrow,
    temp_endcol
  for (i = this._sel_startRow; i <= this._sel_endRow; i++) {
    cell = this._cells[i][this._sel_startCol]
    if (cell.getRowspan() <= 0 && cell.getColspan() <= 0) {
      temp_startrow = 0 - cell.getRowspan()
      temp_startcol = 0 - cell.getColspan()
      cell = this._cells[temp_startrow][temp_startcol]
      temp_endrow = temp_startrow + cell.getRowspan() - 1
      temp_endcol = temp_startcol + cell.getColspan() - 1
      if (temp_startrow < this._sel_startRow || temp_startcol < this._sel_startCol || temp_endrow > this._sel_endRow || temp_endcol > this._sel_endCol) {
        return {
          startrow: temp_startrow,
          startcol: temp_startcol,
          endrow: temp_endrow,
          endcol: temp_endcol
        }
      }
    } else if (cell.getRowspan() > 1 || cell.getColspan() > 1) // mouseDown 触发合并单元格
    {
      temp_startrow = i
      temp_startcol = this._sel_startCol
      temp_endrow = temp_startrow + cell.getRowspan() - 1
      temp_endcol = temp_startcol + cell.getColspan() - 1
      if (temp_startrow < this._sel_startRow || temp_startcol < this._sel_startCol || temp_endrow > this._sel_endRow || temp_endcol > this._sel_endCol) {
        return {
          startrow: temp_startrow,
          startcol: temp_startcol,
          endrow: temp_endrow,
          endcol: temp_endcol
        }
      }
    }
  }

  for (i = this._sel_startRow; i <= this._sel_endRow; i++) {
    cell = this._cells[i][this._sel_endCol]
    if (cell.getRowspan() <= 0 && cell.getColspan() <= 0) {
      temp_startrow = 0 - cell.getRowspan()
      temp_startcol = 0 - cell.getColspan()
      cell = this._cells[temp_startrow][temp_startcol]
      temp_endrow = temp_startrow + cell.getRowspan() - 1
      temp_endcol = temp_startcol + cell.getColspan() - 1
      if (temp_startrow < this._sel_startRow || temp_startcol < this._sel_startCol || temp_endrow > this._sel_endRow || temp_endcol > this._sel_endCol) {
        return {
          startrow: temp_startrow,
          startcol: temp_startcol,
          endrow: temp_endrow,
          endcol: temp_endcol
        }
      }
    } else if (cell.getRowspan() > 1 || cell.getColspan() > 1) {
      temp_startrow = i
      temp_startcol = this._sel_endCol
      temp_endrow = temp_startrow + cell.getRowspan() - 1
      temp_endcol = temp_startcol + cell.getColspan() - 1
      if (temp_startrow < this._sel_startRow || temp_startcol < this._sel_startCol || temp_endrow > this._sel_endRow || temp_endcol > this._sel_endCol) {
        return {
          startrow: temp_startrow,
          startcol: temp_startcol,
          endrow: temp_endrow,
          endcol: temp_endcol
        }
      }
    }
  }

  for (i = this._sel_startCol; i <= this._sel_endCol; i++) {
    cell = this._cells[this._sel_startRow][i]
    if (cell.getRowspan() <= 0 && cell.getColspan() <= 0) {
      temp_startrow = 0 - cell.getRowspan()
      temp_startcol = 0 - cell.getColspan()
      cell = this._cells[temp_startrow][temp_startcol]
      temp_endrow = temp_startrow + cell.getRowspan() - 1
      temp_endcol = temp_startcol + cell.getColspan() - 1
      if (temp_startrow < this._sel_startRow || temp_startcol < this._sel_startCol || temp_endrow > this._sel_endRow || temp_endcol > this._sel_endCol) {
        return {
          startrow: temp_startrow,
          startcol: temp_startcol,
          endrow: temp_endrow,
          endcol: temp_endcol
        }
      }
    } else if (cell.getRowspan() > 1 || cell.getColspan() > 1) {
      temp_startrow = this._sel_startRow
      temp_startcol = i
      temp_endrow = temp_startrow + cell.getRowspan() - 1
      temp_endcol = temp_startcol + cell.getColspan() - 1
      if (temp_startrow < this._sel_startRow || temp_startcol < this._sel_startCol || temp_endrow > this._sel_endRow || temp_endcol > this._sel_endCol) {
        return {
          startrow: temp_startrow,
          startcol: temp_startcol,
          endrow: temp_endrow,
          endcol: temp_endcol
        }
      }
    }
  }

  for (i = this._sel_startCol; i <= this._sel_endCol; i++) {
    cell = this._cells[this._sel_endRow][i]
    if (cell.getRowspan() <= 0 && cell.getColspan() <= 0) {
      temp_startrow = 0 - cell.getRowspan()
      temp_startcol = 0 - cell.getColspan()
      cell = this._cells[temp_startrow][temp_startcol]
      temp_endrow = temp_startrow + cell.getRowspan() - 1
      temp_endcol = temp_startcol + cell.getColspan() - 1
      if (temp_startrow < this._sel_startRow || temp_startcol < this._sel_startCol || temp_endrow > this._sel_endRow || temp_endcol > this._sel_endCol) {
        return {
          startrow: temp_startrow,
          startcol: temp_startcol,
          endrow: temp_endrow,
          endcol: temp_endcol
        }
      }
    } else if (cell.getRowspan() > 1 || cell.getColspan() > 1) {
      temp_startrow = this._sel_endRow
      temp_startcol = i
      temp_endrow = temp_startrow + cell.getRowspan() - 1
      temp_endcol = temp_startcol + cell.getColspan() - 1
      if (temp_startrow < this._sel_startRow || temp_startcol < this._sel_startCol || temp_endrow > this._sel_endRow || temp_endcol > this._sel_endCol) {
        return {
          startrow: temp_startrow,
          startcol: temp_startcol,
          endrow: temp_endrow,
          endcol: temp_endcol
        }
      }
    }
  }
  return null
}

DataGrid.prototype.getScrollTop = function() {
  let i,
    tempheight,
    row
  for (i = 0, tempheight = 0; i < this._scrollRowNum; i++) {
    row = (this._rows[i])
    if (row.getVisible()) {
      tempheight += row.getHeight()
    }
  }
  return tempheight
}

DataGrid.prototype.getScrollLeft = function() {
  let i,
    tempwidth,
    col
  for (i = 0, tempwidth = 0; i < this._scrollColNum; i++) {
    col = this._cols[i]
    if (col.getVisible()) {
      tempwidth += col.getWidth()
    }
  }
  return tempwidth
}

DataGrid.prototype.getFullWidth = function() {
  let i,
    col,
    fullwidth
  for (i = 0, fullwidth = 0; i < this._cols.length; i++) {
    col = this._cols[i]
    if (col.getVisible()) {
      fullwidth += col.getWidth()
    }
  }
  col = this._cols[this._cols.length - 1]
  return fullwidth + this.getGridZoneWidth() - col.getWidth()
}

DataGrid.prototype.getFullHeight = function() {
  let i,
    col,
    fullheight
  for (i = 0, fullheight = 0; i < this._rows.length; i++) {
    row = (this._rows[i])
    if (row.getVisible()) {
      fullheight += row.getHeight()
    }
  }
  col = (this._rows[this._rows.length - 1])
  return fullheight + this.getGridZoneHeight() - col.getHeight()
}

DataGrid.prototype.getGridZoneWidth = function() {
  return this._width - this._offsetX
}

DataGrid.prototype.getGridZoneHeight = function() {
  return this._height - this._offsetY
}

DataGrid.prototype.getScrollRowNum = function() {
  return this._scrollRowNum
}

DataGrid.prototype.setScrollRowNum = function(num) {
  if (typeof (num) === 'number') {
    this._scrollRowNum = num
  } else {
    alert('paramter error:scrollrownum should be number type')
  }
}

DataGrid.prototype.getScrollColNum = function() {
  return this._scrollColNum
}

DataGrid.prototype.setScrollColNum = function(num) {
  if (typeof (num) === 'number') {
    this._scrollColNum = num
  } else {
    alert('paramter error:scrollcolnum should be number type')
  }
}

DataGrid.prototype.getSelStartRow = function() {
  return this._sel_startRow
}

DataGrid.prototype.getSelStartCol = function() {
  return this._sel_startCol
}

DataGrid.prototype.getEndRow = function() {
  return this._sel_endRow
}

DataGrid.prototype.getEndCol = function() {
  return this._sel_endCol
}

DataGrid.prototype.setFocusRow = function(rowindex) {
  this._focusRow = rowindex
}

DataGrid.prototype.setFocusCol = function(colindex) {
  this._focusCol = colindex
}

DataGrid.prototype.getCellValue = function(rowindex, colindex) {
  if (rowindex < this._rows.length && colindex < this._cols.length) {
    const cell = this._cells[rowindex][colindex]
    return cell.getValue()
  }

  alert("paramter error:the paramter which you provide is out of the cells' range")
}

DataGrid.prototype.setCellValue = function(rowindex, colindex, value) {
  if (rowindex < this._rows.length && colindex < this._cols.length) {
    this._cells[rowindex][colindex].t = value
  } else {
    alert("paramter error:the paramter which you provide is out of the cells' range")
  }
}

DataGrid.prototype.setCellProperty = function(rowindex, colindex, property, propertyvalue) {
  if (rowindex < this._rows.length && colindex < this._cols.length) {
    for (const i in this._cells[rowindex][colindex]) {
      if (i === property) {
        this._cells[rowindex][colindex][i] = propertyvalue
        break
      }
    }
  } else {
    alert("paramter error:the paramter which you provide is out of the cells' range")
  }
}
DataGrid.prototype.getCellProperty = function(rowindex, colindex, property) {
  if (rowindex < this._rows.length && colindex < this._cols.length) {
    if (this._cells[rowindex][colindex][property] !== undefined) {
      return true
    }
  } else {
    alert("paramter error:the paramter which you provide is out of the cells' range")
  }
}
DataGrid.prototype.setCellTextAlign = function(rowindex, colindex, textalign) {
  if (rowindex < this._rows.length && colindex < this._cols.length) {
    this._cells[rowindex][colindex].hag = textalign
  } else {
    alert("paramter error:the paramter which you provide is out of the cells' range")
  }
}

DataGrid.prototype.setSelCellTextAlign = function(textalign) {
  let i,
    j
  for (i = this._sel_startRow; i <= this._sel_endRow; i++) {
    for (j = this._sel_startCol; j <= this._sel_endCol; j++) {
      this.setCellTextAlign(i, j, textalign)
    }
  }
}
DataGrid.prototype.setSelCellVerticalAlign = function(verticalAlign) {
  let i,
    j
  for (i = this._sel_startRow; i <= this._sel_endRow; i++) {
    for (j = this._sel_startCol; j <= this._sel_endCol; j++) {
      this.setCellVerticalAlign(i, j, verticalAlign)
    }
  }
}

DataGrid.prototype.setCellVerticalAlign = function(rowindex, colindex, verticalAlign) {
  if (rowindex < this._rows.length && colindex < this._cols.length) {
    this._cells[rowindex][colindex].vag = verticalAlign
  } else {
    alert("paramter error:the paramter which you provide is out of the cells' range")
  }
}

DataGrid.prototype.setFontFamily = function(rowindex, colindex, family) {
  this._cells[rowindex][colindex].fontFamily = family
}

DataGrid.prototype.setSelCellFontFamily = function(family) {
  let i,
    j

  if (this._ftlist === undefined) this._ftlist = []
  let templist = Object.extend({}, this._ftlist[this._cells[this._focusRow][this._focusCol].ftid]) || {}
  if (!T.isEmptyObject(templist)) {
    templist.fname = family
  } else {
    templist = {
      hei: '-12',
      cset: '134',
      fname: family
    }
  }

  let listid = T.array.InArray(templist, this._ftlist) // 查询ftid的值 若为false则 插入
  if (listid === false) {
    this._ftlist.push(templist)
    listid = String(this._ftlist.length - 1)
  }

  for (i = this._sel_startRow; i <= this._sel_endRow; i++) {
    for (j = this._sel_startCol; j <= this._sel_endCol; j++) {
      this._cells[i][j].ftid = listid
    }
  }
}
DataGrid.prototype.setCellNumberOnly = function(rowindex, colindex) {
  this._cells[rowindex][colindex].numberOnly = !this._cells[rowindex][colindex].numberOnly
}

DataGrid.prototype.setSelCellNumberOnly = function() {
  let i,
    j
  for (i = this._sel_startRow; i <= this._sel_endRow; i++) {
    for (j = this._sel_startCol; j <= this._sel_endCol; j++) {
      this._cells[i][j].numberOnly = !this._cells[i][j].numberOnly
    }
  }
}

DataGrid.prototype.setFontSize = function(rowindex, colindex, size) {
  if (typeof (size) !== 'number') {
    this._cells[rowindex][colindex].fontSize = parseInt(size)
  } else {
    this._cells[rowindex][colindex].fontSize = size
  }
}

DataGrid.prototype.setSelCellFontSize = function(size) {
  let i
  let j
  var size
  var tempfontsize
  let tempsize
  const ftlist = this._ftlist
  let
    listid
  size = arguments[0]
  if (typeof (size) !== 'number') {
    size = parseInt(size)
  }

  if (ftlist === undefined) this._ftlist = []
  let templist = Object.extend({}, ftlist[this._cells[this._focusRow][this._focusCol].ftid]) || {}
  var tempfontsize = -parseInt(templist.hei, 10) || 14
  tempsize = -size
  if (!T.isEmptyObject(templist)) { // 引用
    templist.hei = String(tempsize)
  } else {
    templist = {
      hei: String(tempsize),
      cset: '134'
    }
  }

  listid = T.array.InArray(templist, ftlist) // 查询ftid的值 若为false则 插入
  if (listid === false) {
    this._ftlist.push(templist)
    listid = String(this._ftlist.length - 1)
  }

  for (i = this._sel_startRow; i <= this._sel_endRow; i++) {
    let textheight = this.getRowHeight(i)
    for (j = this._sel_startCol; j <= this._sel_endCol; j++) {
      if (tempfontsize > size) {
        textheight -= tempfontsize - size
      } else if (tempfontsize < size) {
        textheight += size - tempfontsize
      }

      this._cells[i][j].ftid = listid
    }
    this.setRowHeight(i, textheight)
  }
}

DataGrid.prototype.setFontBold = function(rowindex, colindex, Bold) {
  this._cells[rowindex][colindex].fontBold = Bold
}

DataGrid.prototype.setSelCellFontBold = function() {
  let i,
    j,
    Bold

  if (this._ftlist === undefined) this._ftlist = []
  let templist = Object.extend({}, this._ftlist[this._cells[this._focusRow][this._focusCol].ftid]) || {}
  if (!T.isEmptyObject(templist)) {
    if (!('wei' in templist)) {
      templist.wei = '700'
    } else {
      delete templist.wei
    }
  } else {
    templist = {
      hei: '-12',
      cset: '134',
      wei: '700'
    }
  }

  let listid = T.array.InArray(templist, this._ftlist) // 查询ftid的值 若为false则 插入
  if (listid === false) {
    this._ftlist.push(templist)
    listid = String(this._ftlist.length - 1)
  }

  for (i = this._sel_startRow; i <= this._sel_endRow; i++) {
    for (j = this._sel_startCol; j <= this._sel_endCol; j++) {
      this._cells[i][j].ftid = listid
    }
  }
}

DataGrid.prototype.setFontItalic = function(rowindex, colindex, italic) {
  this._cells[rowindex][colindex].fontItalic = italic
}
DataGrid.prototype.setCellNote = function(rowindex, colindex, note) {
  this._cells[rowindex][colindex].note = note
}
DataGrid.prototype.setCellTip = function(rowindex, colindex, tip) {
  this._cells[rowindex][colindex].tip = tip
}
DataGrid.prototype.setSelCellFontItalic = function() {
  let i,
    j,
    italic

  if (this._ftlist === undefined) this._ftlist = []
  let templist = Object.extend({}, this._ftlist[this._cells[this._focusRow][this._focusCol].ftid]) || {}
  if (!T.isEmptyObject(templist)) {
    if (!('ita' in templist)) {
      templist.ita = '1'
    } else {
      delete templist.ita
    }
  } else {
    templist = {
      hei: '-12',
      cset: '134',
      ita: '1'
    }
  }

  let listid = T.array.InArray(templist, this._ftlist) // 查询ftid的值 若为false则 插入
  if (listid === false) {
    this._ftlist.push(templist)
    listid = String(this._ftlist.length - 1)
  }

  for (i = this._sel_startRow; i <= this._sel_endRow; i++) {
    for (j = this._sel_startCol; j <= this._sel_endCol; j++) {
      this._cells[i][j].ftid = listid
    }
  }
}

DataGrid.prototype.setCellUnderline = function(rowindex, colindex, flag) {
  this._cells[rowindex][colindex].fontUnderline = flag
}

DataGrid.prototype.setSelCellUnderline = function() {
  let i,
    j,
    flag

  if (this._ftlist === undefined) this._ftlist = []
  let templist = Object.extend({}, this._ftlist[this._cells[this._focusRow][this._focusCol].ftid]) || {}
  if (!T.isEmptyObject(templist)) {
    if (!('uline' in templist)) {
      templist.uline = '1'
    } else {
      delete templist.uline
    }
  } else {
    templist = {
      hei: '-12',
      cset: '134',
      uline: '1'
    }
  }

  let listid = T.array.InArray(templist, this._ftlist) // 查询ftid的值 若为false则 插入
  if (listid === false) {
    this._ftlist.push(templist)
    listid = String(this._ftlist.length - 1)
  }

  for (i = this._sel_startRow; i <= this._sel_endRow; i++) {
    for (j = this._sel_startCol; j <= this._sel_endCol; j++) {
      this._cells[i][j].ftid = listid
    }
  }
}

DataGrid.prototype.setCellTopBorder = function(rowindex, colindex, border) {
  if (rowindex < this._rows.length && colindex < this._cols.length) {} else {
    alert("paramter error:the paramter which you provide is out of the cells' range")
  }
}

DataGrid.prototype.setCellRightBorder = function() {

}

DataGrid.prototype.setCellBottomBorder = function() {

}

DataGrid.prototype.setCellLeftBorder = function() {

}

DataGrid.prototype.setCellFontFamily = function() {

}

DataGrid.prototype.setCellFontSize = function() {

}

DataGrid.prototype.setCellFontColor = function(rowindex, colindex, color) {
  this._cells[rowindex][colindex].fontColor = color
}

DataGrid.prototype.setCellBackColor = function(rowindex, colindex, color) {
  this._cells[rowindex][colindex].backColor = color
}

DataGrid.prototype.setCellBackImage = function() {

}

DataGrid.prototype.getSaveJson = function() {
  let str = ''
  let i,
    j,
    row,
    col,
    cell,
    flag
  if (this._netChartVisible) {
    str += '{netChartVisible:true,'
  } else {
    str += 'netChartVisible:false,'
  }
  str += (`rowsNum:${this._rows.length},`)
  str += (`colsNum:${this._cols.length},`)
  str += 'rows:['
  for (i = 0, flag = 0; i < this._rows.length; i++) {
    row = (this._rows[i])
    if (row.ifSave()) {
      if (flag != 0) {
        str += ','
      }
      str += `{row:${i},data:${toJson(this._rows[i])}}`
      flag++
    }
  }
  str += '],'
  str += 'cols:['
  for (i = 0, flag = 0; i < this._cols.length; i++) {
    col = this._cols[i]
    if (col.ifSave()) {
      if (flag != 0) {
        str += ','
      }
      str += `{col:${i},data:${toJson(this._cols[i])}}`
      flag++
    }
  }
  str += '],'
  str += 'cells:['
  for (i = 0, flag = 0; i < this._rows.length; i++) {
    for (j = 0; j < this._cols.length; j++) {
      cell = this._cells[i][j]
      if (cell.ifSave()) {
        if (flag != 0) {
          str += ','
        }
        str += `{row:${i},col:${j},data:${toJson(this._cells[i][j])}}`
        flag++
      }
    }
  }
  str += ']}'
  return str
}


DataGrid.prototype.getProperty = function(p) {
  if (this[`_${p}`] !== undefined) {
    if (this[`_${p}`] !== 'none' && this[`_${p}`] !== '') {
      return this[`_${p}`]
    }
    return false
  }
  return false
}
DataGrid.prototype.paintRowColor = function() {
  const dc = this.getDc()
  let i
  let row
  let col
  const x = 0
  let y = 0
  const offsety = this._offsetY
  const offsetx = this._offsetX
  let
    width = 0

  dc.lineWidth = 1
  dc.strokeStyle = '#BBBBBB'
  for (let j = this._scrollColNum; j < this._cols.length; j++) {
    col = this._cols[j]

    if (col.getVisible()) {
      width += col.getWidth()
    }
  }
  for (i = 0; i < this._rows.length; i++) {
    row = (this._rows[i])

    if (row.getVisible()) {
      if (row.getColor() !== false) {

        // dc.fillStyle =row.getColor();;
        // dc.fillRect(x,y,width,row.getHeight());
      }
    }
    y += row.getHeight()
  }
  this.releaseDc(dc)
}


DataGrid.prototype.openJson = function(jsonstr) {
  const DATA = new parseXjc(jsonstr)
  this._rows = new Array()
  this._cols = []
  this._rows = DATA._rows
  this._cols = DATA._cols
  this._xjc = DATA.xjc
  this._cells = new Array()
  const General = ['caneditform', 'rowheadwidth', 'colheadheight', 'showgrid', 'showheader', 'totalcol', 'totalrow', 'vermajor', 'verminor', 'tableimage', 'backimage',
    'pacolor', 'maxeditrow', 'maxeditcol', 'showformula', 'protecthascursor', 'dclicklabelsort', 'propertiy', 'printgrid', 'fixedcols',
    'printhcalign', 'printvcalign', 'designmode', 'showmenu', 'loadscript', 'data', 'userfuncs', 'genscript', 'savedb', 'hiderowdrag',
    'tagvalue', 'tagval2', 'titlerows', 'selbkcolor', 'calscript', 'calscripttype', 'cursorwidth', 'sysdbsource', 'prefooterrows', 'pfooterrows',
    'gridcolor', 'gridtype', 'statscript', 'errmsgbox', 'pagerows', 'useado', 'allowrowresize', 'allowcolresize', 'autojump', 'sheetname',
    'rowautosize'
  ]
  for (var i = 0; i < General.length; i++) {
    if (General[i] in this) {
      delete this[General[i]]
    }
    if (`_${General[i]}` in this) {
      delete this[`_${General[i]}`]
    }
  }

  for (p in DATA.datagrid) {
    if (p === '_VerMinor') {
      this._verminor = DATA.datagrid[p]
    } else {
      this[p] = DATA.datagrid[p]
    }
  }
  this.print = DATA.print
  for (i = 0; i < this._rows.length; i++) {
    this._cells.push(new Array())
    for (j = 0; j < this._cols.length; j++) {
      this._cells[i].push({})
    }
  }
  //

  for (var i = 0; i < this._rows.length; i++) {
    for (var j = 0; j < this._cols.length; j++) {
      for (p in DATA._cells[i][j]) {
        if (DATA._cells[i][j].cellcheck !== undefined) {
          const startcoor = this.getCellLeftTopCoor(i, j)
          this._cells[i][j][p] = DATA._cells[i][j][p]
          this._cells[i][j][p].x = startcoor.x
          this._cells[i][j][p].y = startcoor.y
        } else {
          this._cells[i][j][p] = DATA._cells[i][j][p]
        }
      }
    }
  }
  if (this._tableimage !== undefined) {
    const tableimglist = this._tableimage.split(',')
    const bb = []
    for (var i = 0; i < tableimglist.length; i++) {
      if (tableimglist[i] !== '' && i == 0) {
        const img = new Image()

        img.src = this._imglist[tableimglist[i] - 1].src
        img.id = `uploadimgToCanavs${i}`

        bb.push(`aa${i}`)

        document.body.appendChild(img)
        bb[i] = new dragimg(img.id, img.width, img.height)
      }
    }
  }

  // exportXml(this);
  // =DATA._cells;
}
// DataGrid.prototype.paintSelCells = function() {
//   const dc = this.getDc()
//   let compos = this.getCanvasXY()
//   let selColor,
//     selAlpha
//   /* 绘制选中的遮罩*/
//   let startcoor = this.getCellLeftTopCoor(this._sel_startRow, this._sel_startCol)
//   let selsize = this.getRectSize(this._sel_startRow, this._sel_startCol, this._sel_endRow, this._sel_endCol)
//   dc.save()
//   if ((this._tagvalue >> 16) & 0x01) {
//     dc.globalAlpha = 0.5
//     dc.fillStyle = T.color.getcolorFromByte(this._selbkcolor) || '#D2E0FF'
//     dc.fillRect(startcoor.x, startcoor.y, selsize.width, selsize.height)
//   } else if (startcoor.x + selsize.width > this._offsetX && startcoor.y + selsize.height > this._offsetY) {
//     dc.globalAlpha = 0.2
//       dc.fillStyle = '#00f';
//     dc.fillRect(startcoor.x, startcoor.y, selsize.width, selsize.height)
//       /*绘制焦点单元格*/
//       dc.globalAlpha = selAlpha || 1
//       var focuscoor = this.getCellLeftTopCoor(this._focusRow, this._focusCol)
//       var focusize = this.getCellSize(this._focusRow, this._focusCol)
//       var cell = this._cells[this._focusRow][this._focusCol]

//       if (focuscoor.x + focusize.width > 40 && focuscoor.y + focusize.height > 20) {
//       dc.fillStyle = '#fff';

//       dc.fillRect(focuscoor.x + 1, focuscoor.y + 1, focusize.width - 2, focusize.height - 2)
//         this.paintCellContent(dc, cell, focuscoor.x, focuscoor.y, focusize.width, focusize.height)
//       }
//     /* 绘制线框*/
//     dc.strokeStyle = '#000000';
//     dc.lineWidth = 3
//       dc.beginPath()
//       dc.moveTo(startcoor.x, startcoor.y)
//       dc.lineTo(startcoor.x + selsize.width, startcoor.y)
//       dc.lineTo(startcoor.x + selsize.width, startcoor.y + selsize.height)
//       dc.lineTo(startcoor.x, startcoor.y + selsize.height)
//       dc.closePath()
//       dc.stroke()
//     }
//   dc.restore()
//   this.releaseDc(dc)
// }
DataGrid.prototype.glGetWidth = function() {
  let width =  this.width
  if (this.group) {
    width+=Config.groupFlagWidth
  }
  return width
}
DataGrid.prototype.glGetHeight = function() {
  return this.height
}

DataGrid.prototype.paintBbname = function(dc) {
  dc.font = '12px 宋体'
  dc.fillStyle = '#000'
  // dc.fillRect(0,_gl_canvas.height-20,_gl_canvas.width-21,100);
  dc.strokeRect(0, 0, Math.floor(this.getWidth()), Math.floor(this.getHeight()))
  dc.clearRect(10, _gl_canvas.height - 20, _gl_canvas.width - 421, 20)

  // dc.fillText('当前工作报表：'+(_gl_filename || ''), 10, 547);
}



DataGrid.prototype.paintCellContent = function(dc, cell, x, y, width, height) {
  const backFillStyle = cell.getBackColor(this._brlist)
  if (backFillStyle !== undefined) {
    dc.fillStyle = backFillStyle // cell._backColor;
    // dc.fillRect(x + 1, y + 1, width - 2, height - 2);
    dc.fillRect(x, y, width, height)
  }

  if ((cell._flex >> 6) & 0x01) { // flex 6 单元是否为特色背景色
    this.paintGradientColor(dc, cell, x, y, width, height)
  }
  if ((cell._tag >> 5) & 0x01) { // 3Dbox
    this.paintCell3Dshape(dc, cell, x, y, width, height)
  }
  if (cell._cellImage !== 'none' && cell._cellImage.filename !== undefined) {
    const _this = this

    let img = {}
    let temp = cell._cellImage
    temp.imagetype = Number(temp.imagetype)
    let imagetypearr = ['image/bmp', 'image/jpeg', 'image/gif', 'image/png']
    img.filename = `data:${ imagetypearr[temp.imagetype - 1]};base64,${temp.filename}`
    img.type = 'cell'
    if ((cell._tag >> 4) & 0x01) {
      img.size = 'origin'
    } else if ((cell._tag >> 15) & 0x01) {
      img.size = 'imgsize'
    } else if ((cell._tag >> 3) & 0x01) {
      img.size = 'cell'
    }
    if (cell._imgangle !== undefined) {
      img.turn = {}
      if ((cell._tag >> 16) & 0x01) {
        img.turn.direction = 'right'
      } else {
        img.turn.direction = 'left'
      }
      img.turn.angle = parseInt(cell._imgangle, 10)
    }
    img.width = temp.width
    img.height = temp.height
    let image = new Image()
    image.src = img.filename
    // image.onload = function() {

    _this.paintCellImage(dc, cell, x, y, width, height, img, image)
    if ((!(cell._fl >> 15 & 0x01) && !(cell._tag >> 0 & 0x01)) || cell._note !== 'none') {
      if (cell._slty === undefined) {
        _this.paintCellText(dc, cell, x, y, width, height)
      }
    }
    // }

    this.paintCellBorder(dc, cell, x, y, width, height)
  } else {
    if ((!(cell._fl >> 15 & 0x01) && !(cell._tag >> 0 & 0x01)) || cell._note !== 'none') {
      if (cell._slty === undefined || Number(cell._slty) === 0) {
        this.paintCellText(dc, cell, x, y, width, height)
      }
    }

    this.paintCellBorder(dc, cell, x, y, width, height)
  }
  if ((cell._fl >> 12) & 0x01) { // 下拉框
    this.paintCellControlsItem(dc, cell, 'dropdownbox', x, y, width, height)
  }

  if ((cell._fl >> 10) & 0x01) { // 单选框
    this.paintCellControlsItem(dc, cell, 'radiobutton', x, y, width, height)
  }

  if (cell._cellurl !== undefined) { // 按钮
    if ((cell._cellurl.tagval >> 1) & 0x01) {
      // this.paintCellControlsItem(dc, cell, "button", x, y, width, height);
    }
  }
  if ((cell._fl >> 15) & 0x01) { // 财务表览
    this.paintCellControlsItem(dc, cell, 'financialmain', x, y, width, height)
  }
  if ((cell._tag >> 0) & 0x01) { // 财务表头
    this.paintCellControlsItem(dc, cell, 'financialhead', x, y, width, height)
  }

  if (cell.getBorderLine() != 'none') {
    const borderLines = cell.getBorderLine()
    // this.paintBorderLine(dc,borderLines,x,y,width,height,cell);
  }

  if (cell._slty != undefined) {
    this.paintCellSlantline(dc, cell, x, y, width, height)
  }
  if ((this._designmode === undefined && cell._note !== 'none') || cell._tip !== 'none') {
    this.paintNoteTag(dc, cell, x, y, width, height)
  }
}
DataGrid.prototype.getdcfont = function (font) {
  if (font === undefined) {
    return "13px Microsoft YaHei";
  }
  font = this._ftlist[font];
  if (font !== undefined) {
    var fontstr = "";
    if (font.ita !== undefined) {
      fontstr += "italic ";
    }
    if (font.wei !== undefined) {
      fontstr += "bold ";
    }

    if (font.hei !== undefined) {
      fontstr += -parseInt(font.hei, 10) + "px ";
    } else {
      fontstr += "12px ";
    }
    if (font.fname !== undefined) {
      fontstr += font.fname + " ";
    } else {
      fontstr += "宋体 ";
    }

    return fontstr;

  }
    return "12px 宋体";


}

DataGrid.prototype.glGetCanvas = function() {
  return this.canvas
}

DataGrid.prototype.clear = function() {
  const dc = this.getDc()
  let compos = this.getCanvasXY()
  dc.fillStyle = '#fff'
  dc.fillRect(0, 0, this.getTotalWidth(), this.getTotalHeight())
  this.releaseDc(dc)
}
DataGrid.prototype.setScrollX = function(scrollX) {
  this.scrollX = scrollX
  // this._scrollColNum = 4
  const dc = this.getDc()
  // dc.translate(0,20)

  window.requestAnimationFrame(() => {
    this.reDrawChart()
  })
}
DataGrid.prototype.setScrollY = function(scrollY) {
  this.scrollY = scrollY
  //
  window.requestAnimationFrame(() => {
    this.reDrawChart()
  })
}
