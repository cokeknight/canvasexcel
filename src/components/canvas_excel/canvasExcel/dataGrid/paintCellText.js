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
DataGrid.prototype.paintCellText = function (dc, cell, x, y, width, height) {
  var ftlist = this._ftlist;
  var cellvalue = cell.getValue(),

    textFormat = cell.getTextFormat(this._swty),

    textfont = this.getdcfont(cell.getFtid()),

    textAlign = cell._hag || this._hag,

    textverAlign = cell._vag || this._vag,

    textfontsize = cell.getFontSize(ftlist);

    var horMargin = cell._lspan || 5; //内左边距

    var verMargin = cell._tspan || 3;
  var i, textx, texty, text, textlength, fontstr = "",
    oldvalue = cell._t,
    drawtextlist = new Array,
    config = '',
    textFormat;
  var textwidth;

  if (cellvalue === undefined) {
    cellvalue = ''; //return;
  }
  if ((cell._flex >> 5) & 0x01) { //html单元
    this.showhtmlCell(x, y, cell._t);
    return;
  }
  var is_radiobutton = false,
    is_dropdownbox = false;

  if ((cell._fl >> 10) & 0x01) { //单选框

    is_radiobutton = true;
    config = cell._cellcheck;
  } else if ((cell._fl >> 12) & 0x01) { //下拉框
    is_dropdownbox = true;
    config = cell._clco;
  }

  if (is_dropdownbox === true) {
    var oldtext = drawtextlist[i];
    var tmplen = Math.floor((width - 30) / textlength * cellvalue.length);
    cellvalue = cellvalue.substring(0, tmplen) + '\n' + cellvalue.substring(tmplen, cellvalue.length);

  }
  if (!cellvalue) return
  dc.font = textfont;

  dc.fillStyle = "#000000"; //T.color.getcolorFromByte(cell.get("tcor")) || "#000000";
  textlength = cell.textlength //dc.measureText(cellvalue).width//
  if (cell._swty !== undefined) {
    var swtyArray = [1, 2, 3, 4, 6, 7, 5, 8, 11, 12, 13, 14, 15, 16, 17, 18];

    cell._swty = parseInt(cell._swty, 10);

    if (swtyArray.indexOf(cell._swty) !== -1 || cell._swty >= 128) { //单元数字格式显示

      textFormat = {
        'format': cell._swty,
        'weishu': cell._dpt === undefined ? 2 : parseInt(cell._dpt, 10),
        'nby': 0
      };
      if (textFormat.format >= 128) {
        if (cellvalue === 0) {
          cellvalue = '';
        } else {
          textFormat.format = String(parseInt(textFormat.format, 10) - 128);
          cellvalue = this.turnFormat(textFormat, cellvalue);
        }
      } else {
        cellvalue = this.turnFormat(textFormat, cellvalue);
      }
    }
    if (textAlign === '' || textAlign === undefined) {
      textAlign = '2';
    }
  }
  if (cell._swty === 10 && cell._lexcel !== undefined) { //单元时间格式显示

    var xmldom = null;
    try {
      xmldom = T.xml.parseXml(cell._lexcel);
    } catch (ex) {
      alert(ex.message);
    }
    var format = xmldom.getElementsByTagName("eformat")[0].firstChild.nodeValue;
    var textFormat = {
      'format': format,
      'type': 'lexcel'
    };

    cellvalue = this.turnFormat(textFormat, cellvalue);
    if (textAlign === '' || textAlign === undefined) {
      textAlign = '2';
    }
  }

  if (this._designmode === undefined && cell._note !== 'none' && cell._note !== undefined) { //自定义单元脚本
    var xmldom = null;

    try {
      xmldom = T.xml.parseXml(cell._note);
    } catch (ex) {
      alert(ex.message);
    }

    var dname = T.xml.gXmlPrototype(xmldom, "dname");
    var fieldname = T.xml.gXmlPrototype(xmldom, "fieldname");
    fieldname = fieldname.replace(/%101/g, '&');
    var table = T.xml.gXmlPrototype(xmldom, "table");
    var cmd = parseInt(T.xml.gXmlPrototype(xmldom, "cmd"), 10);
    var type = parseInt(T.xml.gXmlPrototype(xmldom, "type"), 10);
    var showcontent = T.xml.gXmlPrototype(xmldom, "showcontent");
    var sumtype = T.xml.gXmlPrototype(xmldom, "sumtype");

    var insertflag = T.xml.gXmlPrototype(xmldom, "insertflag");
    var vname = T.xml.gXmlPrototype(xmldom, "vname");
    vname = vname.replace(/%101/g, '&');
    if (vname === 'none') vname = fieldname;

    if (sumtype !== 'none' && type !== 8) {
      if (fieldname === "纵向求和") {
        cellvalue = "纵向[求和]";
      } else {
        cellvalue = "求和[" + vname + "]";
      }
    } else if (type === 5 || type === 6 || type === 7 || type === 8) {
      if (type === 5) { //行头字段定义内容：
        cellvalue = "R";
      } else if (type === 6) //列头字段定义内容：
      {
        cellvalue = "C";
      } else if (type === 7) //交叉字段定义内容：
      {
        cellvalue = "RC";
      } else if (type === 8) //交叉字段定义内容：
      {
        cellvalue = "G";
      }
      cellvalue += "[" + vname + "]";

    } else {
      cellvalue = "[" + vname + "]";
    }

  }

  if (cell._tag !== undefined) {
    if ((cell._tag >> 11) & 0x01) { //tag11位上下标
      if (cellvalue.indexOf("&scsup") !== -1)
        cellvalue = cellvalue.replace(/&scsup/g, '');

      if (cellvalue.indexOf("&scsub") !== -1)
        cellvalue = cellvalue.replace(/&scsub/g, '');

      cellvalue = cellvalue.replace(/&scend/g, '');
    }
  }
  if (cell._lscript !== undefined && cell._lscript.indexOf('sf') !== -1) { //单元格序号显示规则
    cellvalue = this.setCellRule(cell._lscript, x, y);
  }


  var turnstring = function (str) {
    var arr = [];
    var i = 0;
    while (i < str.length) {
      arr.push(str[i]);
      i++;
    }
    return arr;
  }
  dc.strokeStyle = '#000000';
  if ((cell._fl >> 8) & 0x01) { //fl 8 自动换行
    //width=textlength+cell._horMargin;

    var textlist = String(cellvalue).split('\n');
    var i, temptext, textwidth, textheight;
    if (textAlign == "0" || textAlign == "2") {
      textwidth = width - horMargin;
    } else {
      textwidth = width;
    }
    textheight = 0;
    if (textwidth > 0) {

      for (i = 0; i < textlist.length && textheight < height; i++) {
        temptext = textlist[i];
        while (dc.measureText(temptext).width > textwidth && dc.measureText(temptext).width > 7) {
          text = temptext.substring(0, textwidth / dc.measureText(temptext).width * temptext.length);
          if (dc.measureText(text).width < 20) {
              temptext = '';
              drawtextlist=turnstring(textlist[i]);
              break;
          }
          if (text.length < 2) text.length = 2;
          while ((dc.measureText(text).width + horMargin) > width) {
              text = text.substring(0, text.length - 1);
          }
          textheight += textfontsize * 4 / 3;
          temptext = temptext.substring(text.length, temptext.length);

          drawtextlist.push(text);
        }
        drawtextlist.push(temptext);
        textheight += textfontsize * 4 / 3;
      }

      if (textverAlign == "0") { //居上
        if (textheight > height) {
          texty = 0;
        } else {
          texty = 0; //width;
        }
      } else if (textverAlign == "6") { //居中
        if (textheight > height) {
          texty = 0;
        } else {
          texty = (height - textheight) / 2;
        }
      } else if (textverAlign == "8") { //居下
        if (textheight + horMargin > height) {
          texty = 0;
        } else {
          texty = height - textheight - horMargin;
        }
      } else {
        if (textheight > height) {
          texty = 0;
        } else {
          texty = 0; //单列显示的文字竖排(height - textheight) / 2
        }
      }

      texty += textfontsize / 2 + 2;

      for (i = 0; i < drawtextlist.length && texty < height; i++) {
        if (textAlign == "0") { //0 居左
          textx = horMargin;
          if (is_radiobutton === true) {
            config.x = x + textx;
            config.y = y + (height - 12) / 2;
            dc.lineWidth = 1;
            dc.strokeRect(x + textx, y + (height - 12) / 2, 12, 12);
            if (config !== cell._controlsItem) this.setCellProperty(this.getRowByDisToTop(y).row, this.getColByDisToLeft(x).col, 'controlsItem', config);
            textx += 14;
          }
        } else if (textAlign == "6") { //6居中
          textx = (width - dc.measureText(drawtextlist[i]).width) / 2;

          if (is_radiobutton === true) {
            config.x = x + textx - 7;
            config.y = y + (height - 12) / 2;
            dc.lineWidth = 1;
            dc.strokeRect(x + textx - 7, y + (height - 12) / 2, 12, 12);
            if (config !== cell._controlsItem) this.setCellProperty(this.getRowByDisToTop(y).row, this.getColByDisToLeft(x).col, 'controlsItem', config);
            textx += 7;
          }
        } else if (textAlign == "2") {
          textx = (width - dc.measureText(drawtextlist[i]).width) - horMargin;

          if (is_radiobutton === true) {
            config.x = x + textx - 14;
            dc.lineWidth = 1;
            dc.strokeRect(x + textx - 14, y + (height - 12) / 2, 12, 12);
            if (config !== cell._controlsItem) this.setCellProperty(this.getRowByDisToTop(y).row, this.getColByDisToLeft(x).col, 'controlsItem', config);
            //textx += 7;
          } else if (is_dropdownbox === true) {

            textx = x + width - horMargin - textlength - 20;
          }
        } else {
          textx = 0;
        }
        if (cell._note !== 'none') {
          /*遮罩区域*/
          dc.save();
          dc.beginPath();
          dc.strokeStyle = "transparent";
          dc.rect(x, y, width, height);
          dc.clip();
          dc.stroke();
          dc.closePath();
          dc.fillText(drawtextlist[i], x + textx, y + texty + horMargin);

          dc.restore();
          /*遮罩区域*/
        } else {
          dc.fillText(drawtextlist[i], x + textx, y + texty + horMargin);
        }
        if (cell._ftid !== undefined) {
          if (this._ftlist[cell._ftid].uline !== undefined) {
            dc.beginPath();
            dc.moveTo(x + textx, y + texty + 2);
            dc.lineTo(x + textx + dc.measureText(drawtextlist[i]).width, y + texty + 2);
            dc.stroke();
          }
        }
        texty += textfontsize * 4 / 3;
      }
    }
  } else {
    var textstrings = 0;

    if (textAlign == "0") { //居左
      textx = x + horMargin;
      width = width - horMargin;
      textstrings = Math.ceil(width / textlength * cellvalue.length);

      if (is_radiobutton === true) {
        config.x = textx;
        dc.lineWidth = 1;
        dc.strokeRect(textx, y + (height - 12) / 2, 12, 12);
        if (config !== cell._cellcheck) this.setCellProperty(this.getRowByDisToTop(y).row, this.getColByDisToLeft(x).col, 'cellcheck', config);
        textx += 14;
      }

    } else if (textAlign == "6") { //居中
      //if (dc.measureText(cellvalue).width > width) {
      // textx = x;
      // } else {
      textx = x + (width - textlength) / 2;
      // }

      // textstrings = Math.ceil((1 + width / dc.measureText(cellvalue).width) * cellvalue.length / 2);

      if (is_radiobutton === true) {
        config.x = textx - 7;
        config.y = y + (height - 12) / 2;

        this.setCellProperty(this.getRowByDisToTop(y).row, this.getColByDisToLeft(x).col, 'controlsItem', config);
        dc.lineWidth = 0;
        dc.strokeRect(textx - 7, y + (height - 12) / 2, 12, 12);

        textx = textx + 7;

      } else if (is_dropdownbox === true) {

        textx = x + (width - textlength) / 2 - 10;
      }

    } else if (textAlign == "2") { //居右
      //if (dc.measureText(cellvalue).width > width) {
      //  textx = x + width -horMargin- textlength;
      //} else {
      textx = x + width - horMargin - textlength;
      //}
      if (is_radiobutton === true) {
        if (textlength + 12 > width) {
          textx = x - 12;
        } else {
          textx = x + width - horMargin - textlength - 12;
        }
        config.x = textx;
        dc.lineWidth = 1;
        dc.strokeRect(textx, y + (height - 12) / 2, 12, 12);
        this.setCellProperty(this.getRowByDisToTop(y).row, this.getColByDisToLeft(x).col, 'controlsItem', config);

        textx = textx + 14;
      } else if (is_dropdownbox === true) {

        textx = x + width - horMargin - textlength - 20;
      }

      textstrings = cellvalue.length;
    } else {
      textx = x;
      if (is_radiobutton === true) {
        if (textlength + 12 > width) {
          textx = x - 12;
        } else {
          textx = x + width - horMargin - textlength - 12;
        }
        config.x = textx;
        dc.lineWidth = 1;
        dc.strokeRect(textx, y + (height - 12) / 2, 12, 12);
        this.setCellProperty(this.getRowByDisToTop(y).row, this.getColByDisToLeft(x).col, 'controlsItem', config);

        textx = textx + 14;
      }
    }

    if (textverAlign == "0") //top
    {
      texty = y + textfontsize + verMargin;
    } else if (textverAlign == "6") //midle
    {
      texty = y + (height + textfontsize) / 2;
    } else if (textverAlign == "8") //bottom
    {
      texty = y + height - verMargin;
    }
    if (textlength <width) { // 优化性能 重绘时 大部门情况不需要检测右侧的单元格
      textwidth = ''
    } else{
      var pos = this.getRowColByCoor(x, y);
      if (textAlign == "2") { //居右
        var nextcell = this._cells[pos.row + 1][pos.col];
      } else {
        var nextcell = this._cells[pos.row + 1][pos.col + 2];
      }
      if ((nextcell !== undefined && !_.isEmpty(nextcell)) || cell._rows !== undefined) {
        textwidth = 'cutdown';
      }
    }

    if (textwidth == 'cutdown') {
      /*遮罩区域*/
      dc.save();
      dc.beginPath();
      dc.strokeStyle = "transparent";
      dc.rect(x, y, width, height);
      dc.clip();
      dc.stroke();
      dc.closePath();
      if (this.customPaintCellText) {
        this.customPaintCellText(dc,this,cellvalue, textx, texty)
      } else {
        dc.fillText(cellvalue, textx, texty);
      }

      dc.restore();
      /*遮罩区域*/
      //var text = String(cellvalue).substr(0, textstrings);

      //dc.fillText(text, textx, texty);

    } else if (is_dropdownbox === true) {

      /*遮罩区域*/
      dc.save();
      dc.beginPath();
      dc.strokeStyle = "transparent";
      dc.rect(x, y, width - 20, height);
      dc.clip();
      dc.stroke();
      dc.closePath();
      dc.fillText(cellvalue, textx, texty);

      dc.restore();
      /*遮罩区域*/
    } else {

      if ((cell._tag >> 11) & 0x01) { //上下标
        var num = 0;
        var cutwidth = dc.measureText("A").width;
        for (var i = 0; i < oldvalue.length; i++) {

          if (oldvalue.substr(i, 6) === '&scsup') {
            dc.save();
            dc.font = "5px sans-serif";

            dc.fillText(oldvalue.substr(i + 6, 1), textx + num * cutwidth, texty - 8);
            dc.restore();
            i = i + 12;
          } else if (oldvalue.substr(i, 6) === '&scsub') {
            dc.save();
            dc.font = "5px sans-serif";

            dc.fillText(oldvalue.substr(i + 6, 1), textx + num * cutwidth, texty);
            dc.restore();
            i = i + 12;
          } else {
            dc.fillText(oldvalue[i], textx + num * cutwidth - 4, texty);
          }
          num++;
        }
      } else {
        if (cell._note !== 'none') {
          /*遮罩区域*/
          dc.save();
          dc.beginPath();
          dc.strokeStyle = "transparent";
          dc.rect(x, y, width, height);
          dc.clip();
          dc.stroke();
          dc.closePath();
          dc.fillStyle = "#80";
          dc.fillText(cellvalue, textx, texty);

          dc.restore();
          /*遮罩区域*/
        } else {
          if (this.customPaintCellText) {
            this.customPaintCellText(dc,this,cellvalue, textx, texty)
          } else {
            dc.fillText(cellvalue, textx, texty);
          }
        }
      }
    }
    if (cell.getuline(ftlist)) { //下划线
      dc.beginPath();
      dc.moveTo(textx, texty + 2);
      dc.lineTo(textx + textlength, texty + 2);
      dc.stroke();
    }

  }
}
