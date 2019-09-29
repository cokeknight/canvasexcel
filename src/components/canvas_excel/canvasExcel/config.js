export default {
  rowHeight: 25,

  colWidth: 70,
  rowheadwidth: 40,
  colheadheight: 20,

  groupFlagWidth: 20,
  getHeight(config) {
    if (config.height) {
      return config.height
    } if (config.totalrow) {
      return config.totalrow * this.rowHeight + this.colheadheight + 1
    }
  },

  getWidth(config) {
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
    return totalWidth
  }
}
