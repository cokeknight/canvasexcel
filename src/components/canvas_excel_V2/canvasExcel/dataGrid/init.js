/* eslint-disable */
import DataRow from '../DataRow'
import DataCol from '../DataCol'
import DataCell from '../DataCell'
import Component from '../component'
import _ from 'lodash'
import Config from '../config'
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

function DataGrid(config,canvasContext) {
  Component.call(this, config) // 继承自 组件
  this._charDic = new Array(
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  )
  this.config = config
  this.group = config.group // 数据分组
  this.dc =  canvasContext.getContext('2d')
  this.canvas = canvasContext
  this._offsetX = config.rowheadwidth || 40 // 默认宽度 ColHeaderWidth
  this._offsetY = config.colheadheight || 20 // 默认高度 RowHeaderHeight
  if (this.group) {
    this._offsetX += Config.groupFlagWidth // 如果存在分组 需要腾出20px来
  }
  this.width = config.width || 0
  this.height = config.height || 0
  this.customPaintCellText = config.customPaintCellText
  this.colsNum = config.totalcol || 8 // 总列数
  this.rowsNum = config.totalrow || 18 // 总行数
  this.fixedWidth = config.fixedWidth
  // this._localStorageName  = 	config.localStorageName || 'none';//
  this.scrollX = 0
  this.scrollY = 0
  this._textHeight = config.textHeight || 14 // 文字高度
  this._scrollRowNum = config.scrollRowNum || 0 // 滚动数量
  this._scrollColNum = config.scrollColNum || 0 // 纵向滚动条滚动条滚动数量

  if (config.showgrid !== undefined) {
    this._showgrid = 0
  } else {
    this._showgrid = 1 // /表格线showgrid缺省为显示表格线
  }
  if (config.showheader !== undefined) {
    this._showheader = 0
  } else {
    this._showheader = 1 // /表格线_showheader缺省为显示行列头
  }

  if (config.Mousecursor != undefined) {
    this._Mousecursor = config.Mousecursor //
  } else {
    this._Mousecursor = 'default' // 鼠标样式
  }
  if (config.backimage != undefined) {
    this._backimage = config.backimage // 整个报表的背景图像
  } else {
    this._backimage = ''
  }
  if (config.tableimage != undefined) {
    this._tableimage = config.tableimage // 在表格上放置图片
  } else {
    this._tableimage = ''
  }
  if (config.caneditform != undefined) {
    this._caneditform = config.caneditform // /设置整表保护
  }
  if (config.statscript != undefined) {
    this._statscript = config.statscript // 统计脚本
  }
  if (config.verminor != undefined) {
    this._verminor = config.verminor // 版本号
  }
  if (config.VerMinor != undefined) {
    this._verminor = config.VerMinor // 版本号
  }
  if (config.vermajor != undefined) {
    this._vermajor = config.vermajor // 此版本号
  }
  if (config._pacolor != undefined) {
    this.__pacolor = config._pacolor // 背景颜色
  }
  if (config._maxeditrow != undefined) {
    this.__maxeditrow = config._maxeditrow // 可编辑航
  }
  if (config.maxeditcol != undefined) {
    this._maxeditcol = config.maxeditcol // 可编辑咧
  }

  if (config.showformula != undefined) {
    this._maxeditcol = config.showformula // 是否显示公式
  }
  if (config.protecthascursor != undefined) {
    this._protecthascursor = config.protecthascursor // 报表保护时是否出现光标
  }
  if (config.dclicklabelsort != undefined) {
    this._dclicklabelsort = config.dclicklabelsort // 双击报表表头是否排序
  }
  if (config.propertiy != undefined) {
    this._propertiy = config.propertiy // 报表属性值
  }
  if (config.printgrid != undefined) {
    this._printgrid = config.printgrid // 是否打印表格线
  }
  if (config.fixedcols != undefined) {
    this._fixedcols = config.fixedcols // 固定列头数
  }
  if (config.printhcalign != undefined) {
    this._printhcalign = config.printhcalign // 打印是否横向中间对齐
  }
  if (config.printvcalign != undefined) {
    this._printvcalign = config.printvcalign // 打印是否竖向中间对齐
  }
  if (config.designmode != undefined) {
    this._designmode = config.designmode // 是否是设计模式
  }
  if (config.showmenu != undefined) {
    this._showmenu = config.showmenu // 是否显示弹出菜单
  }
  if (config.loadscript != undefined) {
    this._loadscript = config.loadscript // 报表加载时加载的脚本
  }
  if (config.data != undefined) {
    this._data = config.data // 报表计算之前运行的脚本
  }
  if (config.userfuncs != undefined) {
    this._userfuncs = config.userfuncs // 用户自定义函数
  }
  if (config.genscript != undefined) {
    this._genscript = config.genscript // 是否自动生成统计脚本
  }
  if (config.savedb != undefined) {
    this._savedb = config.savedb // 是否是录入报表
  }
  if (config.tagvalue != undefined) {
    this._tagvalue = config.tagvalue // 报表设置属性
  }
  if (config.tagval2 != undefined) {
    this._tagval2 = config.tagval2 // 是否自动生成统计脚本
  }
  if (config.selbkcolor != undefined) {
    this._selbkcolor = config.selbkcolor // 选中区域背景颜色
  }
  if (config.calscript != undefined) {
    this._calscript = config.calscript // 计算之后运行的脚本
  }
  if (config.calscripttype != undefined) {
    this._calscripttype = config.calscripttype // 计算之后运行的脚本类型
  }
  if (config.cursorwidth != undefined) {
    this._cursorwidth = config.cursorwidth // 活动光标宽度
  }
  if (config.sysdbsource != undefined) {
    this._sysdbsource = config.sysdbsource // 系统连接的数据源
  }
  if (config.prefooterrows != undefined) {
    this._prefooterrows = config.prefooterrows // 页前脚行数
  }
  if (config.pfooterrows != undefined) {
    this._pfooterrows = config.pfooterrows // 页脚行数
  }
  if (config.gridcolor != undefined) {
    this._gridcolor = config.gridcolor // 系统表格线颜色
  }
  if (config.gridtype != undefined) {
    this._gridtype = config.gridtype // 系统表格线类型
  }
  if (config.errmsgbox != undefined) {
    this._errmsgbox = config.errmsgbox // 是否显示错误提示
  }
  if (config.pagerows != undefined) {
    this._pagerows = config.pagerows // 主从和普通报表一页打印的行数
  }
  if (config.useado != undefined) {
    this._useado = config.useado // 是否使用ado
  }
  if (config.allowrowresize != undefined) {
    this._allowrowresize = config.allowrowresize // 是否允许行调整
  }
  if (config.allowcolresize != undefined) {
    this._allowcolresize = config.allowcolresize // 是否允许列调整
  }
  if (config.autojump != undefined) {
    this._autojump = config.autojump // 是否允许光标自动跳转
  }
  if (config.sheetname != undefined) {
    this._sheetname = config.sheetname // 报表sheet名字
  }
  if (config.rowautosize != undefined) {
    this._rowautosize = config.rowautosize // 是否自动调整行高
  }

  if (config.rowautosize != undefined) {
    this._rowautosize = config.rowautosize // 是否自动调整行高
  }
  if (config.brlist != undefined) {
    this._brlist = config.brlist // 单元背景色对象列表开始
  }
  if (config.ftlist != undefined) {
    this._ftlist = config.ftlist // 单元字体对象列表开始
  }
  if (config.penlist != undefined) {
    this._penlist = config.penlist // 框线的对象类型的
  }
  if (config.defaultcell != undefined) {
    this._defaultcell = config.defaultcell // 表格
  }
  if (config.print != undefined) {
    this._print = config.print // 打印属性
  }
  if (config.swty != undefined) {
    this._swty = config.swty // 默认显示属性
  }
  if (config.hag != undefined) {
    this._hag = config.hag // 默认显示属性
  }
  if (config.vag != undefined) {
    this._vag = config.vag // 默认显示属性
  }
  if (config.imglist != undefined) {
    this._imglist = config.imglist
  } else {
    this._imglist = []
  }
  if (config.chartattribute !== undefined) { // 图表类型
    this._chartattribute = config.chartattribute
  }

  // if (config.rows != undefined) {
  //   this._rows = config.rows
  // } else {
    var i
    this._rows = []
    for (i = 0; i < this.rowsNum; i++) {
      if (config.rows && config.rows[i]) {
        this._rows.push(config.rows[i])
      } else {
        this._rows.push(this._rows[i] || {})
      }
    }
  // }
  // if (config.cols != undefined) {
  //   this._cols = config.cols
  // } else {
    var i
    this._cols = []
    for (i = 0; i < this.colsNum; i++) {
      if (config.cols && config.cols[i]) {
        this._cols.push(config.cols[i])
      } else {
        this._cols.push(this._cols[i] || {})
      }
    }
  // }

  // if (config.cells != undefined) {
  //   // this._cells = config.cells
  // } else {
    let dc = this.getDc()
    var textfont = DataGrid.prototype.getdcfont();
    dc.font = textfont
    dc.fillStyle = '#000000'
    var i,
      j
    this._cells = []
    for (i = 0; i < this._rows.length; i++) {
      this._cells.push([])
      for (j = 0; j < this._cols.length; j++) {
        if (config.cells && config.cells[i] && config.cells[i][j]) {
          let cell = config.cells[i][j]
          // if(cell.value && dc) {
          //   cell.textlength = dc.measureText(cell.value).width
          // }
          this._cells[i].push(cell)
        } else {
          this._cells[i].push({})
        }
      }
    }
  // }
  /* 用于测试的单元格数据*/
  //	this._cells[2][5]={
  //			//lexcel:'<data> <eformat>yyyy-m-d</eformat> </data>',
  //			//fontFamily:"黑体",
  //			cellurl:{newwin: false,
  // url: "http://www.chinaexcel.com"},
  //			t:'1221',
  //			fl: 2048
  //		};
  //	this._cells[2][6]={
  // tag:1
  //		};
  /* 辅助属性*/
  this._sel_startRow = 0 // 默认第一行为1
  this._sel_startCol = 0
  this._sel_endRow = 0
  this._sel_endCol = 0
  this._focusRow = 0
  this._editRow = 0
  this._focusCol = 0
  this._editCol = 0
  this._handThing = 'none'
  this._resizeRow = -1
  this._oldRowBottomY = -1
  this._minRowBottomY = -1
  this._resizeCol = -1
  this._oldColRightX = -1
  this._minColRightX = -1
  this._selLineAll = {
    on: false,
    color: '#0251ff'
  } // 设置光标整行选中
  // glGetRenderTo().appendChild(this._editBox)
  /*
    继承的属性：
    this._type = "component"
    this._dcFlag
    this._dc
    this._x
    this._y
    this._width
    this._height
    this._visible
    this._parent
    this._comItems

    独有属性：
    this._charDic = new Array(a,b,c,d,e,f);
    this._offsetX
    this._offsetY
    this._textHeight
    this._rows
    this._cols
    this._scrollRowNum
    this._scrollColNum
    this._cells
    this._netChartVisible
    this._resizeThing
    this._sel_startRow
    this._sel_startCol
    this._sel_endRow
    this._sel_endCol
    this._focusRow
    this._focusCol

    辅助属性:
	this._resizeThing
    this._sel_startRow
    this._sel_startCol
    this._sel_endRow
    this._sel_endCol
    this._focusRow
    this._focusCol
    this._handThing     row
    this._resizeRow
    this._oldRowBottomY
    this._minRowBottomY
    this._resizeCol
    this._oldColRightX
    this._minColRightX

    函数
    this.getNetChartVisible
    this.setNetChartVisible
    this.setRowHeight
    this.getRowHeight
    this.setRowVisible
    this.getRowVisible
    this.setColWidth
    this.getColWidth
    this.setColVisible
    this.getColVisible
    this.insertRow
    this.deleteRow
    this.insertCol
    this.deleteCol
    this.insertCellTop
    this.deleteCellTopMove
    this.insertCellLeft
    this.deleteCellLeftMove
    this.getCellSize
    this.getRowColByCoor
    this.getRowToTopByDis
    this.getColToLeftByDis
    this.combineCells
    this.combineSelCells
    this.breakupCell
    this.breakupSelCells
    this.getCellLeftTopCoor
    this.getCellRightTopCoor
    this.getCellRigthBottomCoor
    this.getCellLeftBottomCoor
    this.findCombineCellsAroundSelCells
    this.getScrollTopHeight
    this.getScrollLeftWidth
    this.getFullWidth
    this.getFullHeight
    this.getGridZoneWidth
    this.getGridZoneHeight
    this.getScrollRowNum
    this.setScrollRowNum
    this.getScrollColNum
    this.setScrollColNum
    this.getCellValue
    this.setCellValue
    this.getFocusValue
    this.setFocusValue
    this.setCellValueType
    this.setFocusCellValueType
    this.setCellTextAlign
    this.setFocusCellTextAlign
    this.setCellVerticalAlign
    this.setFocusCellVerticalAlign
    this.setCellTopBorder
    this.setFocusCellTopBorder
    this.setCellRightBorder
    this.setFocusCellTopBorder
    this.setCellBottomBorder
    this.setFocusCellBottomBorder
    this.setCellLeftBorder
    this.setFocusCellLeftBorder
    this.setCellFontFamily
    this.setFocusCellFontFamily
    this.setCellFontSize
    this.setFocusCellFontSize
    this.setCellFontColor
    this.setFocusCellFontColor
    this.setCellBackColor
    this.setFocusCellBackColor
    this.setCellBackImage
    this.setFocusCellBackImage

    绘图操作
    继承的方法
    this.getDc
    this.releaseDc
    独有方法
    this.paintHeader                                行头和列头的绘制
    this.paintSelHeader                             绘制选中区域的行头和列头
	this.paintCell									绘制单个的单元格
    this.paintCells                                 绘制所有的单元格
    this.paintSelCells                              绘制选中区域的单元格
    this.paintFocusCell                             绘制焦点单元格
    this.paint                                      整个控件的完整绘制
    this.clear                                      清空整个区域

    this.click
    this.dblclick
    this.mousedown
    this.mousemove
    this.mouseup
    this.mousewheel
    */
}
function extendPrototype(obj){
  function F(){}
  F.prototype =  obj
  return new F()
}

DataGrid.prototype = extendPrototype(Component.prototype)

DataGrid.prototype.constructor = DataGrid

DataGrid.prototype.getTotalWidth = function (){ // this.getWidth 是可视区域的宽度 getTotalWidth是实际需要展示的全部宽度
  let width = 0
  for (let i = 0; i < this._cols.length; i++) {
    let col = this._cols[i] // new DataCol(
    if (DataCol.getVisible(col)) {
      width += DataCol.getWidth(col)
    }
  }
  return width + this._offsetX
}
DataGrid.prototype.getTotalHeight = function (){
  // let height = 0
  // for (let i = 0; i < this._rows.length; i++) {
  //   let row = this._rows[i]
  //   if (DataRow.getVisible(row)) {
  //     height += DataRow.getHeight(row)
  //   }
  // }
  // return height + this._offsetY
}
DataGrid.prototype.redrawCells = function (cells){
  var i,j
  // this._cells = []
  for (i = 0; i < this._rows.length; i++) {
    // this._cells.push([])
    for (j = 0; j < this._cols.length; j++) {
      if (cells && cells[i] && cells[i][j]) {
        if (this._cells[i][j]) {
          this._cells[i][j].copyConfig(cells[i][j],this.getDc())
        } else {
          this._cells[i][j] = new DataCell(cells[i][j],this.getDc())
        }
      } else {
        this._cells[i].push(new DataCell({}))
      }
    }
  }
  this.reDrawChart();
}
export default DataGrid
