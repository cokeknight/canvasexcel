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
DataGrid.prototype.mousedown = function (e) {
  // clearCeng('myContextMenu');
  // clearCeng('showbox');
  // if(_gl_filename === undefined){
  //   return ;
  // }

  var eve = e ? e : event;
  if (this._cols.length === 0 || this._rows.length === 0) return false;

  if (eve.button == 0 || eve.button == 1) { //ie 下左键为1
    var i, row, col;
    var x = this._offsetX,
      y = this._offsetY;
    var ctrpos = glGetMouseCanvasXY(e); //鼠标位置
    var compos = this.getCanvasXY();

    var ctrx = ctrpos.x - compos.x + this.scrollX; // 加上滚动条的位置
    var ctry = ctrpos.y - compos.y + this.scrollY;
    let groupFlagWidth = 0
    if (this.group) {
      groupFlagWidth = Config.groupFlagWidth
    }
    if (ctrx < this._offsetX && ctry > this._offsetY) {
      for (i = this.getScrollRowNum(); i < this._rows.length && y < this._height; i++) {
        row = this._rows[i]
        if (DataRow.getVisible(row)) {
          y += DataRow.getHeight(row);
        }
        if (ctry > y - 3 && ctry < y + 1) {
          if (!this.canResizeRow) {
            break;
          }
          this._handThing = "row";
          this._resizeRow = i;
          this._oldRowBottomY = y;
          this._minRowBottomY = y - DataRow.getHeight(row);
          break;
        } else if (ctry >= y + 1 && ctry < y + 3) {
          if (!DataRow.getVisible(row)) {
            console.log("row")
            this._handThing = "row";
            this._resizeRow = i;
            this._oldRowBottomY = y;
            this._minRowBottomY = y - DataRow.getHeight(row);
            break;
          }
        } else if (ctry >= (y - DataRow.getHeight(row) + 3) && ctry <= (y - 3)) {
          if (ctrx<=groupFlagWidth) {
            this.showGroup(i)
            break;
          }
          this._handThing = "rowcel";
          this._sel_startRow = i;
          this._sel_startCol = 0;
          this._sel_endRow = i;
          this._sel_endCol = this._cols.length - 1;
          this._focusRow = i;
          this._focusCol = this.getScrollColNum();
          this.paint('mousedown');
          break;
        }
      }
    } else if (ctrx > this._offsetX && ctry < this._offsetY && this._selLineAll.on === false) {
      for (i = this.getScrollColNum(); i < this._cols.length && x < this._width; i++) {
        col = this._cols[i]
        if (DataCol.getVisible(col)) {
          x += DataCol.getWidth(col);
        }
        if (ctrx < x + 1 && ctrx > x - 3) {
          console.log('col')
          if (!this.canResizeCol) {
            break;
          }
          this._handThing = "col";
          this._resizeCol = i;
          this._oldColRightX = x;
          this._oldColX = x;
          this._minColRightX = x - DataCol.getWidth(col);
          break;
        } else if (ctrx >= x + 1 && ctrx < x + 3) {
          console.log('col')
          if (!DataCol.getVisible(col)) {
            if (!this.canResizeCol) {
              break;
            }
            this._handThing = "col";
            this._resizeCol = i;
            this._oldColRightX = x;
            this._oldColX = x;
            this._minColRightX = x - DataCol.getWidth(col);
          }
        } else if (ctrx >= (x - DataCol.getWidth(col) + 3) && ctrx <= (x - 3)) {
          console.log('colcel')
          this._handThing = "colcel";
          this._sel_startRow = 0;
          this._sel_startCol = i;
          this._sel_endRow = this._rows.length - 1;
          this._sel_endCol = i;
          this._focusRow = this.getScrollRowNum();
          this._focusCol = i;
          this.paint('mousedown');
          break;
        }
      }
    } else if (ctrx < this._offsetX && ctry < this._offsetY) {
      console.log('allcel')
      this._handThing = "allcel";
      this._sel_startRow = 0;
      this._sel_startCol = 0;
      this._sel_endRow = this._rows.length - 1;
      this._sel_endCol = this._cols.length - 1;
      this._focusRow = this.getScrollRowNum();
      this._focusCol = this.getScrollColNum();
      this.paint('mousedown');
    } else if (ctrx > this._offsetX && ctry > this._offsetY) {
      this._handThing = "cel";
      var focuscell = this.getRowColByCoor(ctrx, ctry);
      this._sel_startRow = focuscell.row;
      this._sel_startCol = focuscell.col;
      this._sel_endRow = focuscell.row;
      this._sel_endCol = focuscell.col;
      this._focusRow = focuscell.row;
      this._focusCol = focuscell.col;
      var cell;
      cell = this.findCombineCellsAroundSelCells();

      if (cell != null) {
        if (cell.startrow < this._sel_startRow) {
          this._sel_startRow = cell.startrow;
        }
        if (cell.startcol < this._sel_startCol) {
          this._sel_startCol = cell.startcol;
        }
        if (cell.endrow > this._sel_endRow) {
          this._sel_endRow = cell.endrow;
        }
        if (cell.endcol > this._sel_endCol) {
          this._sel_endCol = cell.endcol;
        }
      }
      if ((this._tagvalue >> 16) & 0x01) //设置光标整行选中
      {
        this._sel_startCol = 0;
        this._sel_endCol = this._cols.length - 1;
      }
      this.paint('mousedown');
    }
  }
  if (this.getMousecursor().indexOf('paintborder') != -1) {
    this.usepaintBorderLines(ctrpos.x, ctrpos.y, this._focusRow, this._focusCol);
    //alert(this._sel_startCol);
    //this.
  }
}

DataGrid.prototype.mousemove = function(e) {
  const eve = e || event

  if (eve.button == 0 && !((this._tagvalue >> 16) & 0x01)) {
    let i; let x = this._offsetX
    let y = this._offsetY
    const ctrpos = glGetMouseCanvasXY(e)
    const compos = this.getCanvasXY()
    const ctrx = ctrpos.x - compos.x  + this.scrollX; // 加上滚动条的位置
    const ctry = ctrpos.y - compos.y  + this.scrollY; // 加上滚动条的位置
    let row,
      col
    var cellrowcol = this.getRowColByCoor(ctrx, ctry)

    // if(document.getElementById("showbox")){
    // if(this._cells[cellrowcol.row][cellrowcol.col].showTipFlag=== undefined){
    // clearCeng("showbox");
    // }
    // }
    if (glGetMouseState()) {
      if (this._handThing == 'row') { // 拉行高
        if (!this.canResizeRow) {
          return
        }
        row = this._rows[this._resizeRow]
        if (DataRow.getHeight(row) + Math.floor(ctry) - this._oldRowBottomY > 0) {
          this._rows[this._resizeRow].tagval &= ~(1 << 9) // 置第x位为0
          this._rows[this._resizeRow].height = DataRow.getHeight(row) + Math.floor(ctry) - this._oldRowBottomY
          this._oldRowBottomY = Math.floor(ctry)
        } else {
          this._rows[this._resizeRow].tagval |= 1 << 9 // 设置第x位为1
          this._rows[this._resizeRow].tagval |= 1 << 8 // 设置第x位为1
          this._rows[this._resizeRow].height = 0
          this._oldRowBottomY = this._minRowBottomY
        }
        this.paint('mousemove')
        if (this.resizeRow) {
          // this.resizeRow(e, this._resizeRow);
        }
      } else if (this._handThing == 'col') {
        if (!this.canResizeCol) {
          return
        }
        col = this._cols[this._resizeCol]
        if (DataCol.getWidth(col) + Math.floor(ctrx) - this._oldColRightX > 0) {
          this._cols[this._resizeCol].tagval &= ~(1 << 9) // 置第x位为0
          this._cols[this._resizeCol].width = DataCol.getWidth(col) + Math.floor(ctrx) - this._oldColRightX
          this._oldColRightX = Math.floor(ctrx)
        } else { // DataCol.getWidth(col) === 0
          this._cols[this._resizeCol].tagval |= 1 << 9 // 设置第x位为1
          this._cols[this._resizeCol].tagval |= 1 << 8 // 设置第x位为1
          this._cols[this._resizeCol].width = 0
          this._oldColRightX = this._minColRightX
        }
        this.paint('mousemove')
        if (this.resizeCol) {
          this.resizeCol(e, this._resizeCol)
        }
      } else if (this._handThing == 'allcel') {} else if (this._handThing == 'rowcel') {} else if (this._handThing == 'colcel') {} else if (this._handThing == 'cel') {
        var cellrowcol = this.getRowColByCoor(ctrx, ctry)
        if (cellrowcol.row > this._focusRow) {
          this._sel_startRow = this._focusRow
          this._sel_endRow = cellrowcol.row
        } else if (cellrowcol.row < this._focusRow) {
          this._sel_startRow = cellrowcol.row
          this._sel_endRow = this._focusRow
        } else {
          this._sel_startRow = this._focusRow
          this._sel_endRow = this._focusRow
        }
        if (cellrowcol.col > this._focusCol) {
          this._sel_startCol = this._focusCol
          this._sel_endCol = cellrowcol.col
        } else if (cellrowcol.col < this._focusCol) {
          this._sel_startCol = cellrowcol.col
          this._sel_endCol = this._focusCol
        } else {
          this._sel_startCol = this._focusCol
          this._sel_endCol = this._focusCol
        }
        let cell = this.findCombineCellsAroundSelCells()
        while (cell != null) {
          if (cell.startrow < this._sel_startRow) {
            this._sel_startRow = cell.startrow
          }
          if (cell.startcol < this._sel_startCol) {
            this._sel_startCol = cell.startcol
          }
          if (cell.endrow > this._sel_endRow) {
            this._sel_endRow = cell.endrow
          }
          if (cell.endcol > this._sel_endCol) {
            this._sel_endCol = cell.endcol
          }
          cell = this.findCombineCellsAroundSelCells()
        }
        this.paint('mousemove')
      }
    } else if (ctrx < this._offsetX && ctry > this._offsetY) {
      for (i = this.getScrollRowNum(); y < this._height && i < this._rows.length; i++) {
        row = this._rows[i]
        if (DataRow.getVisible(row)) {
          y += DataRow.getHeight(row)
        }
        if (ctry > y - 3 && ctry < y + 1) {
          if (!this.canResizeRow) {
            return
          }
          this.glGetCanvas().style.cursor = 'n-resize' // 拉行高
          break
        } else if (ctry >= y + 1 && ctry < y + 3) {
          if (!DataRow.getVisible(row)) {
            this.glGetCanvas().style.cursor = "url('image/icon/H_split.png'),auto"
            // glGetCanvas().style.cursor = "e-split";//拉列
            break
          }
        } else {
          this.glGetCanvas().style.cursor = 'default'
        }
      }
    } else if (ctrx > this._offsetX && ctry < this._offsetY) {
      for (i = this.getScrollColNum(); y < this._width && i < this._cols.length; i++) {
        col = this._cols[i]
        if (DataCol.getVisible(col)) {
          x += DataCol.getWidth(col)
        }
        if (ctrx < x + 1 && ctrx > x - 3) {
          if (!this.canResizeCol) {
            return
          }
          this.glGetCanvas().style.cursor = 'e-resize' // 拉列
          break
        } else if (ctrx >= x + 1 && ctrx < x + 3) {
          if (!DataCol.getVisible(col)) {
            this.glGetCanvas().style.cursor = "url('image/icon/split.png'),auto"
            // glGetCanvas().style.cursor = "e-split";//拉列
            break
          }
        } else {
          this.glGetCanvas().style.cursor = 'default'
        }
      }
    } else {
      this.glGetCanvas().style.cursor = this.getMousecursor()
    }
  }
}

DataGrid.prototype.mouseup = function(e) {

}

DataGrid.prototype.mousewheel = function(e) {

}
DataGrid.prototype.dblclick = function(e) {
  if (this._designmode === undefined) { // 计算模式
    if (this.getCellProperty(this._focusRow, this._focusCol, 'note')) {
      return
    }
  }
  clearCeng('showbox')
  let pagepos = glGetMousePageXY(e)
  let canpos = glGetMouseCanvasXY(e)
  let compos = this.getCanvasXY()
  let ctrx = canpos.x - compos.x
  let ctry = canpos.y - compos.y
  let dc = this.getDc()
  let cell = this._cells[this._focusRow][this._focusCol]
  let cellpos = this.getCellLeftTopCoor(this._focusRow, this._focusCol)
  let cellsize = this.getCellSize(this._focusRow, this._focusCol)
  this._dblclick = true
  // textlength = this.getCellvaluewidth(cell);
 	if (cell._fl && ((cell._fl >> 0) & 0x01) === 0) { // 单元保护
    alert('单元保护')
    return false
  }

  const textAlign = cell._hag || this._hag; let
    horMargin = cell._lspan || 5// 内左边距;
  let textlength = Math.ceil(dc.measureText(cell._t).width)
  textlength = this.getCellvaluewidth(cell)
  if (textAlign == '0') {
    textx = textlength + horMargin
  } else if (textAlign == '6') {
    if (dc.measureText(cell._t).width > width) {
      textx = textlength
    } else {
      textx = textlength + (width - textlength) / 2
    }
  } else if (textAlign == '2') {
    if (dc.measureText(cell._t).width > width) {
      textx = textlength
    } else {
      textx = textlength + width - horMargin - textlength
    }
  } else {
    textx = textlength
  }

  if (textx < cellsize.width) {
    textx = cellsize.width
  }

  dc.fillStyle = '#fff'
  dc.fillRect(cellpos.x, cellpos.y, textx, cellsize.height)
  dc.fillStyle = '#000'
  dc.strokeRect(cellpos.x, cellpos.y, textx, cellsize.height)
  /* 绘制线框*/
  this._editBox.style.left = `${pagepos.x - (ctrx - cellpos.x)}px`
  this._editBox.style.top = `${pagepos.y - (ctry - cellpos.y) }px`
  this._editBox.style.width = `${textx}px` // cellsize.width + "px";
  this._editBox.style.fontsize = '12px'
  // this._editBox.width = 1000 +"px"; //cellsize.width + "px";
  this._editBox.style.display = 'block'
  this._editBox.focus()
  this.releaseDc(dc)
}
