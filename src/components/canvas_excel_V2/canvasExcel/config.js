export default {

  _totalHeight:null,

  _totalWidth:null,

  rowHeight: 25,

  colWidth: 70,
  rowheadwidth: 40,
  colheadheight: 20,
  
  groupFlagWidth: 20,

  getHeight(config) {
    if (this._totalHeight) {
      return this._totalHeight
    }
    let totalHeight
    if (config.height) {
      
      totalHeight =  config.height
    } if (config.totalrow) {
      totalHeight =  config.totalrow * this.rowHeight + this.colheadheight + 1
    }
    this._totalHeight = totalHeight
    return totalHeight
  },
  getMaxRow (maxHeight){

  },
  getWidth(config) {
    if (this._totalWidth) {
      return this._totalWidth
    }
    let totalWidth
    if (config.width) {
      totalWidth = config.width
    }
    if (config.cols) {
      let width = 0
      for (let i = 0; i < config.cols.length; i += 1) {
        const col = config.cols[i] // new DataCol(
        if (col.width) {
          width += col.width
        } else {
          width += this.colWidth
        }
      }
      totalWidth = width + this.rowheadwidth + 1
    } else if (config.totalcol) {
      totalWidth = config.totalcol * this.colWidth + this.rowheadwidth + 1
    }
    if (config.group) {
      totalWidth += this.groupFlagWidth
    }
    this._totalWidth = totalWidth
    return totalWidth
  }
}
