// JavaScript Document
/* eslint-disable */

import GlobalConfig from './config'
// function DataCol(config) {
//   /*
//      属性:
//    this.visible
//    this.width

//    方法:
//    this.getWidth
//    this.getVisible
//    this.ifSave
//    */
//   if (config !== undefined) {
//     if (config.width != undefined) {
//       if (typeof (config.width) === 'number') {
//         this._width = config.width
//       } else {
//         alert('config error: width should be number type')
//       }
//     } else {
//       this._width = GLOBAL.colWidth
//     }

//     if (config.visible != undefined) {
//       if (typeof (config.visible) === 'boolean') {
//         this._visible = config.visible
//       } else {
//         alert('config err: visible should be boolean type')
//       }
//     } else {
//       this._visible = true
//     }
//     if (config.tagval != undefined) {
//       this._tagval = config.tagval
//     }
//   }
// }

// DataCol.prototype.getWidth = function() {
//   return this._width
// }
// DataCol.prototype.getVisible = function() {
//   if (this._tagval !== undefined && (this._tagval >> 9) & 0x01) {
//     return false
//   }
//   return this._visible
// }

// DataCol.prototype.ifSave = function() {
//   if (this._width != 80) {
//     return true
//      }
//   if (!this._visible) {
//     return true
//      }

//   return false

//  }
export default {
  getVisible(config) {
    if (config._tagval !== undefined && (config._tagval >> 9) & 0x01) {
      return false
    }
    return config.visible || true
  },
  getWidth(config) {
    if ('width' in config) return config.width 
    return  GlobalConfig.colWidth 
  }
}

