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
/* 绘图相关*/

DataGrid.prototype.paintHeader = function () {
  const HeaderLeftBg = '#fafafa'
  const LeftCornerBg = '#f4f5f8'

  const dc = this.getDc()
  let i,
    y,
    x,
    text,
    textx,
    texty,
    textlength,
    temp
  let row,
    col
  const compos = this.getCanvasXY()
  /* paint the row header*/
  dc.lineWidth = 0.2
  dc.strokeStyle = '#000'
  dc.font = `${this._textHeight}px 宋体`
  let selColor
  if (this.getMousecursor() == 'default') {
    selColor = '#FFF69A' // '#ff1800';
  } else {
    selColor = '#FFF69A'
  }
  dc.save()
  if (this.scrollY) {
    dc.translate(0, -this.scrollY)
  }
  let _offsetX = this._offsetX
  let groupFlagWidth = 0
  if (this.group) {
    groupFlagWidth = Config.groupFlagWidth
    _offsetX = _offsetX - Config.groupFlagWidth
  }
  dc.clearRect(1, this._offsetY, _offsetX + groupFlagWidth - 1,this.getTotalHeight())
  if (this.group) {
    dc.lineWidth = 1
    dc.strokeStyle = borderColor
    dc.beginPath()
    dc.moveTo(groupFlagWidth, 0)
    dc.lineTo(groupFlagWidth, this.getTotalHeight())
    dc.stroke()
    dc.closePath()
  }
  for (i = this._scrollRowNum, y = this._offsetY; y <= this.getTotalHeight() && i < this._rows.length; i++) { // 竖列
    row = (this._rows[i])
    if (row.getVisible()) {
      y += row.getHeight()
      text = i + 1
      textlength = dc.measureText(text).width
      textx = groupFlagWidth + (_offsetX - textlength) / 2
      texty = y - (row.getHeight() - this._textHeight) / 2
      if (i < this._sel_startRow || i > this._sel_endRow) {
        dc.fillStyle = '#fafafa' // "#0f0";//左侧单元格
        dc.fillRect(1+ groupFlagWidth, y + 1 - row.getHeight(), _offsetX - 2, row.getHeight() - 2)
      } else {
        dc.fillStyle = selColor
        dc.fillRect(1+ groupFlagWidth, y + 1 - row.getHeight(), _offsetX - 2, row.getHeight() - 2)
      }

      dc.fillStyle = '#716F64'
      dc.fillRect(1 + groupFlagWidth, y, _offsetX - 2, 0.5)

      dc.fillStyle = '#000'
      dc.fillText(text, textx, texty)
      if (this.group) {
        let grouptext = ''
        if (row.showGroupFlag()) {
          grouptext = '.'
          if (row.isGroup()) {
            if (row.isGroupVisible()) {
              grouptext = '-'
            } else {
              grouptext = '+'
            }
          }
        }
        let grouptextlength = dc.measureText(grouptext).width
        let grouptextx = (groupFlagWidth - grouptextlength) / 2
        let grouptexty = y - (row.getHeight() - this._textHeight) / 2
        dc.fillText(grouptext, grouptextx, grouptexty)
      }

    }
  }
  dc.restore()
  dc.save()
  if (this.scrollX) {
    dc.translate(-this.scrollX, 0)
  }
  dc.clearRect(this._offsetX, 0 ,this.getTotalWidth(),this._offsetY - 1)
  for (i = this._scrollColNum, x = this._offsetX; x <= this.getTotalWidth() && i < this._cols.length; i++) { // 横轴
    col = this._cols[i]
    if (col.getVisible()) {
      x += col.getWidth()
      text = ''
      temp = i
      while (Math.floor(temp / 26) != 0) {
        text = this._charDic[temp % 26] + text
        temp = Math.floor(temp / 26)
      }
      if (text != '') {
        text = this._charDic[temp - 1] + text
      } else {
        text = this._charDic[temp]
      }
      textlength = dc.measureText(text).width
      if (textlength > col.getWidth()) {
        textx = x - col.getWidth()
      } else {
        textx = x - (col.getWidth() + textlength) / 2
      }
      texty = (this._offsetY + this._textHeight) / 2
      if (i < this._sel_startCol || i > this._sel_endCol) // 列
      {
        dc.fillStyle = HeaderLeftBg // "#0f0";
        dc.fillRect((x - col.getWidth() + 1), 1, col.getWidth() - 2, this._offsetY - 2)
      } else {
        dc.fillStyle = selColor
        dc.fillRect((x - col.getWidth() + 1), 1, col.getWidth() - 2, this._offsetY - 2)
      }
      dc.fillStyle = '#716F64' // "#716F64";
      dc.fillRect(x, 1, 0.5, this._offsetY - 2)

      dc.fillStyle = '#000' // 字体颜色
      dc.fillText(text, textx, texty)
    }
  }
  dc.restore()
  dc.fillStyle = '#fff'
  if (y < this.getTotalHeight()) {
    dc.fillRect(0, y, this.getTotalWidth(), this.getTotalHeight() - y)
  }
  if (x < this.getTotalWidth()) {
    dc.fillRect(x, 0, this.getTotalWidth() - x, this.getTotalHeight())
  }
  /* 左上角*/
  dc.translate(0, 0)
  dc.lineWidth = 0.2
  dc.strokeStyle = '#7F97B9'
  dc.font = `${this._textHeight}px 宋体`

  dc.fillStyle = LeftCornerBg // "#0f0";
  dc.clearRect(0, 0, _offsetX, this._offsetY);
  dc.strokeRect(groupFlagWidth, 0, _offsetX, this._offsetY)
  dc.fillRect(groupFlagWidth, 0, _offsetX, this._offsetY)

  this.releaseDc(dc)
}

DataGrid.prototype.paintNetLine = function () {
  const dc = this.getDc()
  // dc.save()
  const paintNetLines = function () {
    let i
    let row
    let col
    let x
    let y
    const offsety = this._offsetY
    const
      offsetx = this._offsetX

    dc.lineWidth = 1
    dc.strokeStyle = borderColor // '#BBBBBB'
    let groupFlagWidth = 0
    if (this.group) {
      groupFlagWidth= Config.groupFlagWidth
    }
    y = 0
    dc.lineWidth = 1
    dc.beginPath()
    dc.moveTo(groupFlagWidth, y)
    dc.lineTo(this.getTotalWidth(), y)
    y += this._offsetY
    dc.moveTo(groupFlagWidth, y)
    dc.lineTo(this.getTotalWidth(), y)
    dc.stroke()
    dc.closePath()

    x = 0
    let _offsetX = this._offsetX
    if (this.group) {
      x = x + groupFlagWidth
      _offsetX = _offsetX - groupFlagWidth
    }
    dc.strokeStyle = borderColor // '#BBBBBB' 竖线
    dc.beginPath()
    dc.moveTo(x, 0)
    dc.lineTo(x, this.getTotalHeight())
    x += _offsetX
    dc.moveTo(x, 0)
    dc.lineTo(x, this.getTotalHeight())
    dc.stroke()
    dc.closePath()


    if (this.getNetChartVisible()) // 是否显示表格线
    {
      // dc.save()
      dc.translate(-this.scrollX, -this.scrollY)
      const rectSize = this.getRectSize(this._scrollRowNum, this._scrollColNum, this._rows.length, this._cols.length)
      const width = Number(this._showheader) === 0 ? rectSize.width : this.getTotalWidth()
      const height = Number(this._showheader) === 0 ? rectSize.height : this.getTotalHeight()

      for (i = this._scrollRowNum; y <= this.getTotalHeight() && i < this._rows.length; i++) { // 横线
        row = (this._rows[i])
        if (row.getVisible()) {
          dc.beginPath()
          y += row.getHeight()
          dc.moveTo(offsetx, y)
          dc.lineTo(width, y)
          dc.stroke()
          dc.closePath()
        }
      }

      for (i = this._scrollColNum; x <= this.getTotalWidth() && i < this._cols.length; i++) { // 竖线
        col = this._cols[i]
        if (col.getVisible()) {
          dc.beginPath()
          x += col.getWidth()
          dc.moveTo(x, offsety)
          dc.lineTo(x, height)
          dc.stroke()
          dc.closePath()
        }
      }
      this.releaseDc(dc)
    }
  }

  const _this = this
  if (this.getProperty('backimage')) {
    const img = {}
    const temp = this._imglist[this._backimage - 1]
    if ((this._tagval2 >> 17) & 0x01) {
      img.size = 'origin'
    } else {
      img.size = 'canvas'
    }

    img.width = temp.width
    img.height = temp.height
    const image = new Image()
    image.src = temp.src
    _this.paintBackimage(dc, img, image)
    paintNetLines.apply(_this)
  } else {
    paintNetLines.apply(this) // 在当前作用域中执行paintNetLines函数，不然是window对象
  }
}
DataGrid.prototype.setCanvasStyle = function (dc) {
  var textfont = this.getdcfont();
  dc.font = textfont
  dc.fillStyle = '#000000'; // T.color.getcolorFromByte(cell.get("tcor")) || "#000000";
}
DataGrid.prototype.paintCells = function() {
  let x,
    y
  let i,
    j,
    m
  let cellsize,
    compos,
    cellpos
  let row,
    col,
    cell,
    temprow,
    tempcol,
    tempwidth;
  let  width = 0;
  let  height = 0;
  compos = this.getCanvasXY()
  const dc = this.getDc()
  dc.save()
  dc.translate(-this.scrollX,-this.scrollY)
  // 设置画布的字体属性 就不用在画布里设置
  this.setCanvasStyle(dc)

  for (i = this._scrollRowNum, y = this._offsetY; y < this.getHeight() && i < this._rows.length; i++) {
    row = this._rows[i]
    if (row.getVisible()) {
      for (x = this._offsetX, j = this._scrollColNum; j < this._cols.length && x < this.getWidth(); j++) {
        col = this._cols[j]
        if (col.getVisible()) {
          cell = this._cells[i][j]
          cellsize = this.getCellSize(i, j)

          if (cell.ifPaint()) {
            width = 0
            height = 0
            if (cell.getColspan() > 0 && cell.getRowspan() > 0) { // 该单元格为合并 或者正常

              if (cellsize.width > 0 && cellsize.height > 0) {
                if (cell.getCombineStyle() == 'combine') { // 该单元格为合并
                  dc.fillStyle = "#fff";
                  dc.fillRect(x + 1, y + 1, cellsize.width - 2, cellsize.height - 2)
                  let nextcell = this._cells[i][j + 1]
                  //										if(nextcell!==undefined &&nextcell.col !== undefined){
                  //												dc.save();
                  //												/*遮罩区域*/
                  //												dc.beginPath();
                  //												dc.strokeStyle = "transparent";
                  //												dc.rect(x,y,cellsize.width, cellsize.height);
                  //												dc.clip();
                  //												dc.stroke();
                  //												dc.closePath();
                  //												/*遮罩区域*/
                  //												this.paintCellContent(dc, cell, x, y, cellsize.width, cellsize.height);
                  //												dc.restore();
                  //											}else{
                  //												this.paintCellContent(dc, cell, x, y, cellsize.width, cellsize.height);
                  //											}
                  // }else{

                  if (row.getColor() !== false) {
                    dc.fillStyle = row.getColor()
                    dc.fillRect(x, y, cellsize.width, cellsize.height)
                  }
                  this.paintCellContent(dc, cell, x, y, cellsize.width, cellsize.height)

                  // }
                } else { // 改单元格非合并单元格
                  //
                  //  if (cell.ifPaint()) { //单元格无内容不描绘,前一个有内容不描绘
                  // dc.fillStyle = "#fff";
                  // dc.fillRect(x + 1, y + 1, cellsize.width - 2, cellsize.height - 2);
                  // var nextcell=this._cells[i][j+1];
                  //										if(dc.measureText(cell._value).width>cellsize.width){
                  //
                  //										if(nextcell!==undefined && nextcell.col !== undefined){
                  //												dc.save();
                  //												/*遮罩区域*/
                  //												//dc.setTransform(1, 0, 0, 1, 0, 0);
                  //												dc.beginPath();
                  //												dc.strokeStyle = "transparent";
                  //												dc.rect(x,y,cellsize.width, cellsize.height);
                  //												dc.clip();
                  //												dc.stroke();
                  //												dc.closePath();
                  //												/*遮罩区域*/
                  //
                  //												this.paintCellContent(dc, cell, x, y, cellsize.width, cellsize.height);
                  //												dc.restore();
                  //											}else{
                  //												this.paintCellContent(dc, cell, x, y, cellsize.width, cellsize.height);
                  //											}
                  // }else{
                  if (row.getColor() !== false) {
                    dc.fillStyle = row.getColor()
                    dc.fillRect(x, y, cellsize.width, cellsize.height)
                  }

                  this.paintCellContent(dc, cell, x, y, cellsize.width, cellsize.height)
                  //
                  // }

                  // }
                }
              }
            } else { // cell.getColspan() < 0 合并单元格的其他单元格
              temprow = 0 - cell.getRowspan()
              tempcol = 0 - cell.getColspan()
              if (temprow < this._scrollRowNum || tempcol < this._scrollColNum) {
                if ((i == this._scrollRowNum && j == this._scrollColNum) || (i == this._scrollRowNum && j == tempcol) || (j == this._scrollColNum && i == temprow)) {
                  cell = this._cells[temprow][tempcol]
                  cellpos = this.getCellLeftTopCoor(temprow, tempcol)
                  cellsize = this.getCellSize(temprow, tempcol)
                  dc.fillStyle = '#fff'
                  dc.fillRect(cellpos.x + 1, cellpos.y + 1, cellsize.width - 2, cellsize.height - 2)
                  this.paintCellContent(dc, cell, cellpos.x, cellpos.y, cellsize.width, cellsize.height)
                }
              }
            }
          } else {
            //                        if (cell.getBorderLine() != "none") {
            //                            this.paintCellContent(dc, cell, x, y, cellsize.width, cellsize.height);
            //                        } else {
            //                           // if (cell._backColor != "" && cell._value != '' && cell._cellImage != 'none') { //单元格无内容不描绘
            //                                dc.fillStyle = "#fff";
            //                                dc.fillRect(x + 1, y + 1, cellsize.width - 2, cellsize.height - 2);
            //								 this.paintCellContent(dc, cell, x, y, cellsize.width, cellsize.height);
            //                           // }
            //
            //                        }
            // dc.fillStyle = "#fff";
            // dc.fillRect(x+1,y+1,cellsize.width-2,cellsize.height-2);

          }
          x += col.getWidth()
        }
      }
      y += row.getHeight()
    }
  }
  // rightimagedata = null;
  // bottomimagedata = null;
  dc.restore()
  this.releaseDc(dc)
}

DataGrid.prototype.paintCellContent = function(dc, cell, x, y, width, height) {
    var backFillStyle = cell.getBackColor(this._brlist);;
	if (backFillStyle !== undefined) {
        	dc.fillStyle = backFillStyle;//cell._backColor;
        	// dc.fillRect(x + 1, y + 1, width - 2, height - 2);
    		dc.fillRect(x, y, width, height);
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
DataGrid.prototype.paintCellBorder = function(dc, cell, x, y, width, height) {
  const fl = cell._fl
  let paintdash = function(x, y, x2, y2, style, width, color) {
    if (style === '2') { // 点线
      T.canvas.drawDashes(x, y, x2, y2, '1 2 0 2', width, 'dotted', color)
    } else if (style === '1') { // 虚线
      T.canvas.drawDashes(x, y, x2, y2, '10 5 0 10', width, 'dashed', color)
    } else if (style === '3') { // 点划线
      T.canvas.drawDashes(x, y, x2, y2, '10 4', width, 'butt', color)
    } else if (style === '4') { // 点点划线
      T.canvas.drawDashes(x, y, x2, y2, '10 4', width, 'bbut', color)
    }
  }

  if ((fl >> 5) & 0x01) { // cell._borderTopWidth > 0
    const borderTopColor = T.color.getcolorFromByte(String(this._penlist[cell._tpenid].color))
    let borderTopWidth = this._penlist[cell._tpenid].widx
    let borderTopStyle = this._penlist[cell._tpenid].style

    dc.strokeStyle = borderTopColor // cell._borderTopColor;
    dc.lineWidth = borderTopWidth
    if (borderTopStyle === '0') {
      dc.beginPath()
      dc.moveTo(x, y)
      dc.lineTo(x + width, y)
      dc.stroke()
      dc.closePath()
    } else {
      paintdash(x, y, x + width, y, borderTopStyle, borderTopWidth, borderTopStyle)
    }
  }

  if ((fl >> 6) & 0x01) { // cell._borderRightWidth > 0 && cell._rightNetLine
    const borderRightColor = T.color.getcolorFromByte(String(this._penlist[cell._rpenid].color))
    let borderRightWidth = this._penlist[cell._rpenid].widx
    let borderRightStyle = this._penlist[cell._rpenid].style

    dc.strokeStyle = borderRightColor
    dc.lineWidth = borderRightWidth
    if (borderRightStyle === '0') {
      dc.beginPath()
      dc.moveTo(x + width, y)
      dc.lineTo(x + width, y + height)
      dc.stroke()
      dc.closePath()
    } else {
      paintdash(x + width, y, x + width, y + height, borderRightStyle, borderRightWidth, borderRightColor)
    }
  }

  if ((fl >> 7) & 0x01) { // cell._borderBottomWidth > 0
    const borderBottomColor = T.color.getcolorFromByte(String(this._penlist[cell._bpenid].color))
    let borderBottomWidth = this._penlist[cell._bpenid].widx
    let borderBottomStyle = this._penlist[cell._bpenid].style

    dc.strokeStyle = borderBottomColor
    dc.lineWidth = borderBottomWidth
    if (borderBottomStyle === '0') {
      dc.beginPath()
      dc.moveTo(x, y + height)
      dc.lineTo(x + width, y + height)
      dc.stroke()
      dc.closePath()
    } else {
      paintdash(x, y + height, x + width, y + height, borderBottomStyle, borderBottomWidth, borderBottomColor)
    }
  }

  if ((fl >> 4) & 0x01) { // cell._borderLeftWidth > 0 && cell._leftNetLine
    const borderLeftColor = T.color.getcolorFromByte(String(this._penlist[cell._lpenid].color))
    let borderLeftWidth = this._penlist[cell._lpenid].widx
    let borderLeftStyle = this._penlist[cell._lpenid].style

    dc.strokeStyle = borderLeftColor
    dc.lineWidth = borderLeftWidth
    if (borderLeftStyle === '0') {
      dc.beginPath()
      dc.moveTo(x, y)
      dc.lineTo(x, y + height)
      dc.stroke()
      dc.closePath()
    } else {
      paintdash(x, y, x, y + height, borderLeftStyle, borderLeftWidth, borderLeftColor)
    }
  }
}
// DataGrid.prototype.dblclick = function(e) {
//   if (this._designmode === undefined) { // 计算模式
//     if (this.getCellProperty(this._focusRow, this._focusCol, 'note')) {
//       return
//     }
//   }
//   clearCeng('showbox')
//   let pagepos = glGetMousePageXY(e)
//   let canpos = glGetMouseCanvasXY(e)
//   let compos = this.getCanvasXY()
//   let ctrx = canpos.x - compos.x
//   let ctry = canpos.y - compos.y
//   let dc = this.getDc()
//   let cell = this._cells[this._focusRow][this._focusCol]
//   let cellpos = this.getCellLeftTopCoor(this._focusRow, this._focusCol)
//   let cellsize = this.getCellSize(this._focusRow, this._focusCol)
//   this._dblclick = true
//   // textlength = this.getCellvaluewidth(cell);
//   console.log(cell)
//  	if (cell._fl && ((cell._fl >> 0) & 0x01) === 0) { // 单元保护
//     alert('单元保护')
//     return false
//   }

//   const textAlign = cell._hag || this._hag; let
//     horMargin = cell._lspan || 5// 内左边距;
//   let textlength = Math.ceil(dc.measureText(cell._t).width)
//   textlength = this.getCellvaluewidth(cell)
//   if (textAlign == '0') {
//     textx = textlength + horMargin
//   } else if (textAlign == '6') {
//     if (dc.measureText(cell._t).width > width) {
//       textx = textlength
//     } else {
//       textx = textlength + (width - textlength) / 2
//     }
//   } else if (textAlign == '2') {
//     if (dc.measureText(cell._t).width > width) {
//       textx = textlength
//     } else {
//       textx = textlength + width - horMargin - textlength
//     }
//   } else {
//     textx = textlength
//   }

//   if (textx < cellsize.width) {
//     textx = cellsize.width
//   }

//   dc.fillStyle = '#fff'
//   dc.fillRect(cellpos.x, cellpos.y, textx, cellsize.height)
//   dc.fillStyle = '#000'
//   dc.strokeRect(cellpos.x, cellpos.y, textx, cellsize.height)
//   /* 绘制线框*/
//   this._editBox.style.left = `${pagepos.x - (ctrx - cellpos.x)}px`
//   this._editBox.style.top = `${pagepos.y - (ctry - cellpos.y) }px`
//   this._editBox.style.width = `${textx}px` // cellsize.width + "px";
//   this._editBox.style.fontsize = '12px'
//   // this._editBox.width = 1000 +"px"; //cellsize.width + "px";
//   this._editBox.style.display = 'block'
//   this._editBox.focus()
//   this.releaseDc(dc)
// }
DataGrid.prototype.paint = function(type) {
  // console.log('paint', type)
  if (type === 'mousedown' || type === 'mousemove'){
    let dc = this.getDc()
    // this.paintNetLine()
    this.paintSelCells()
    this.releaseDc(dc)
    dc.restore()
    if (this.isShowHeader()) this.paintHeader() // 画表头的字母
    return
  }

  this.clear()
  const isMouseDown = type === 'mousedown'
  const compos = this.getCanvasXY()
  let dc = this.getDc()
  // var imageRight = dc.getImageData(compos.x + this.getWidth(), 0, this.glGetWidth() - compos.x - this.getWidth(), this.glGetHeight());
  // var imageBottom = dc.getImageData(0, compos.y + this.getHeight(), this.glGetWidth(), this.glGetHeight() - compos.y - this.getHeight());
  this.releaseDc(dc)
  dc.save()

  // this.paintRowColor();//背景奇偶颜色调色器
  // dc.translate(this.scrollX, this.scrollY)


  dc = this.getDc()
  this.paintNetLine()
  // var imageLeft = dc.getImageData(0, 0, compos.x + this._offsetX, this.glGetHeight());
  // var imageTop = dc.getImageData(0, 0, this.glGetWidth(), compos.y + this._offsetY);
  this.releaseDc(dc)

  this.paintCells()
  if (this.getMousecursor().indexOf('paintborder') == -1 && this._cols.length !== 0) {
    // if (type === 'isMouseDown') {
    this.checkIsInCombineCellsAroundSelCells() // 第一次渲染 检测第一个单元格是不是合并单元格
    this.paintSelCells()
    // }
  }
  // this.paintNetLine()
  /* 绘制选中框*/
// console.log(this._rows,this.getTotalWidth(),this.getTotalHeight())
  dc = this.getDc()
  // dc.putImageData(imageLeft, 0, 0);
  // dc.putImageData(imageTop, 0, 0);
  this.releaseDc(dc)
  dc.restore()
  if (this.isShowHeader()) this.paintHeader() // 画表头的字母

  dc = this.getDc()
  // dc.putImageData(imageRight, compos.x + this.getWidth(), 0);
  // dc.putImageData(imageBottom, 0, compos.y + this.getHeight());
  this.releaseDc(dc)
  // this.paintBbname(dc);
}
DataGrid.prototype.reDrawChart=function(){
  console.time('reDrawChart');
  let dc = this.getDc()
  // console.log(this.getTotalWidth(),this.getTotalHeight(),this.width,this.height)

  dc.clearRect(0,0,this.glGetWidth(),this.getHeight());
  this.paint()
  console.timeEnd('reDrawChart');
}
DataGrid.prototype.checkIsInCombineCellsAroundSelCells = function(){
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
}
