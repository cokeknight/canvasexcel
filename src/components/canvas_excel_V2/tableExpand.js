import DataGrid from './canvasExcel/dataGrid/index'
import _ from 'lodash'
import Config from './canvasExcel/config'

export default {
  getTableSchema(tableProps, tableData, { totalrow, group }) {
    if (tableProps) {
      const { tableSchema } = tableProps
      const showSummary = tableProps['show-summary']
      const { summaryMethod, spanMethod } = tableProps
      let innerTableSchema = tableSchema
      const cells = [[], []]
      const cols = []
      const rows = []
      let fixedWidth
      let headerCombine
      if (innerTableSchema) {
        headerCombine = innerTableSchema.some(item => item.children)
        if (headerCombine) {
          totalrow += 1 // 增加一行
          innerTableSchema = this.flattenColumns(innerTableSchema)
        }
        // fixedWidth = this.getFixedWidth(tableSchema)
        let col_father
        innerTableSchema.forEach((item, colIndex) => {
          item.property = item.name
          if (cells[0][colIndex]) {
            Object.assign(cells[0][colIndex], {
              ...item,
              value: item.parent_title || item.title,
              tableHeader: true,
              frozen: true,
              backColor: '#efdea1a8'
            })
          } else {
            cells[0][colIndex] = {
              ...item,
              value: item.parent_title || item.title,
              tableHeader: true,
              frozen: true,
              backColor: '#efdea1a8'
            }
          }
          if (headerCombine) {
            cells[1][colIndex] = {
              ...item,
              value: item.title,
              tableHeader: true,
              frozen: true,
              backColor: '#efdea1a8'
            }
            if (!item.col_father) {
              cells[0][colIndex].fl = 256
              DataGrid.prototype.combineCellsAdjust(cells, 0, colIndex, 1, colIndex)
            } else {
              if (col_father !== item.col_father) { // 开始合并
                cells[0][colIndex].fl = 256
                DataGrid.prototype.combineCellsAdjust(cells, 0, colIndex, 0, colIndex + 2)
              }
              // eslint-disable-next-line
              col_father = item.col_father
              // cells[0][colIndex].fl = 256
              // DataGrid.prototype.combineCellsAdjust(cells, 0, colIndex, 0, columnIndex)
            }
          }
          // '#808080'
          cols[colIndex] = _.pick(item, 'width')
        })
        rows[0] = { header: true }
      }

      // 分组
      if (group) {
        for (let i = 1; i < totalrow; i += 1) {
          if (group(i)) {
            if (!showSummary || i !== totalrow - 1) {
              rows[i] = { group: true, color: '#808080' }
            }
          } else {
            rows[i] = { groupChild: true, visible: false }
          }
        }
      }
      if (!_.isEmpty(tableData)) {
        const tableDataPropIndexs = this.getTableDataIndex(innerTableSchema, tableData[0])
        tableData.forEach((child, colIndex) => {
          let col = colIndex + 1
          if (headerCombine) {
            col += 1
          }
          // cells[col][]
          Object.keys(child).forEach((prop) => {
            if (!cells[col]) cells[col] = []
            if (tableDataPropIndexs[prop] !== -1) {
              cells[col][tableDataPropIndexs[prop]] = { value: child[prop] }
            }
          })
        })
      }
      /** *加入合计行 */
      if (showSummary) {
        const columns = innerTableSchema
        if (summaryMethod && tableData) {
          const summaryRow = summaryMethod({ columns, data: tableData })
          const summaryRowIndex = cells.length
          cells[summaryRowIndex] = []
          summaryRow.forEach((child, index) => {
            cells[summaryRowIndex][index] = { value: child }
          })
        }
        if (rows[rows.length - 1]) {
          rows[rows.length - 1].summary = true
        } else {
          rows[rows.length - 1] = { summary: true }
        }
      }
      // 合并行 仅仅是首列合并
      if (spanMethod) {
        const totalRows = cells.length
        for (let rowIndex = 1; rowIndex < totalRows; rowIndex += 1) {
          for (let columnIndex = 0; columnIndex < cells[rowIndex].length; columnIndex += 1) {
            const innerRowIndex = rowIndex - 1
            if (tableData[innerRowIndex]) {
              const rowsColSpan = spanMethod({
                row: tableData[innerRowIndex], column: innerTableSchema, rowIndex: innerRowIndex, columnIndex
              })
              if (rowsColSpan && cells[rowIndex][columnIndex]) {
                cells[rowIndex][columnIndex].fl = 256
                DataGrid.prototype.combineCellsAdjust(cells, rowIndex, columnIndex, rowIndex + rowsColSpan.rowspan - 1, columnIndex)
              }
            }
          }
        }
      }
      console.log(386, fixedWidth, 'fixedWidth', cols, '长度', innerTableSchema.length)
      return {
        totalcol: innerTableSchema.length,
        cells,
        cols,
        rows,
        totalrow,
        fixedWidth
        // totalcol
      }
    }
    return {}
  },
  getFixedWidth(tableSchema) { // 计算固定列的宽度
    const cols = tableSchema.filter(item => item.fixed)
    return Config.getWidth({ cols })
  },
  getTableDataIndex(tableSchema, tableData) {
    const propIndexs = {}
    Object.keys(tableData).forEach((prop) => {
      const propIndex = tableSchema.findIndex(child => child.name === prop)
      propIndexs[prop] = propIndex
    })
    return propIndexs
  },
  flattenColumns(tableSchema) {
    const out = []
    for (let i = 0; i < tableSchema.length; i += 1) {
      const parent = tableSchema[i]
      if (parent.children) {
        tableSchema[i].children.forEach((item) => {
          out.push({
            ...item, parent_title: parent.title, col_father: i, col_span: parent.children.length
          })
        })
      } else {
        out.push(tableSchema[i])
      }
    }
    return out
  }
}
