<template>
 <CanvasExcel :table-schema="report_table" 
 :table-data="budgetRentDataList" style="width:100%;height:100%;"/>
</template>

<script>
import CanvasExcel from './components/canvas_excel'
import budgetRentDataList from './budgetRentDataList.js'
export default {
  name: 'app',
  data(){
    return {
      budgetRentDataList:Object.freeze(budgetRentDataList),
      report_table: Object.freeze({
        type: 'selection',
        selection: {
          align: 'left',
          mode: '-',
          fixed: 'left'
        },
        // tableTree: { children: 'children' },
        'row-class-name': this.handleRowClassName,
        'cell-class-name': this.handleCellClassName,
        tableLayout: 'fixed',
        // spanMethod: this.objectSpanMethod,
        supportEdit: true,
        tableSchema: [
          {
            name: 'core_name',
            title: '所属中心',
            fixed: 'left',
            sortable: false,
            width: 120
          },
          {
            name: 'business_divisions_name',
            title: '所属事业部',
            fixed: 'left',
            sortable: false,
            width: 120
          },
          {
            name: 'department_name',
            title: '所属项目部',
            sortable: false,
            fixed: 'left'
          }, {
            name: 'product_name',
            title: '产品',
            sortable: false,
            fixed: 'left',
            width: 150
          }, {
            name: 'title',
            title: '相关业务项目',
            sortable: false,
            fixed: 'left'
          }, {
            name: 'desc',
            title: '备注说明',
            sortable: false,
            fixed: 'left'
          },{
            name: 'core_name',
            title: '所属中心',
            fixed: 'left',
            sortable: false,
            width: 120
          },
          {
            name: 'business_divisions_name',
            title: '所属事业部',
            fixed: 'left',
            sortable: false,
            width: 120
          },
          {
            name: 'department_name',
            title: '所属项目部',
            sortable: false,
            fixed: 'left'
          }, {
            name: 'product_name',
            title: '产品',
            sortable: false,
            fixed: 'left',
            width: 150
          }, {
            name: 'title',
            title: '相关业务项目',
            sortable: false,
            fixed: 'left'
          }, {
            name: 'desc',
            title: '备注说明',
            sortable: false,
            fixed: 'left'
          },{
            name: 'core_name',
            title: '所属中心',
            fixed: 'left',
            sortable: false,
            width: 120
          },
          {
            name: 'business_divisions_name',
            title: '所属事业部',
            fixed: 'left',
            sortable: false,
            width: 120
          },
          {
            name: 'department_name',
            title: '所属项目部',
            sortable: false,
            fixed: 'left'
          }, {
            name: 'product_name',
            title: '产品',
            sortable: false,
            fixed: 'left',
            width: 150
          }, {
            name: 'title',
            title: '相关业务项目',
            sortable: false,
            fixed: 'left'
          }, {
            name: 'desc',
            title: '备注说明',
            sortable: false,
            fixed: 'left'
          },{
            name: 'core_name',
            title: '所属中心',
            fixed: 'left',
            sortable: false,
            width: 120
          },
          {
            name: 'business_divisions_name',
            title: '所属事业部',
            fixed: 'left',
            sortable: false,
            width: 120
          },
          {
            name: 'department_name',
            title: '所属项目部',
            sortable: false,
            fixed: 'left'
          }, {
            name: 'product_name',
            title: '产品',
            sortable: false,
            fixed: 'left',
            width: 150
          }, {
            name: 'title',
            title: '相关业务项目',
            sortable: false,
            fixed: 'left'
          }, {
            name: 'desc',
            title: '备注说明',
            sortable: false,
            fixed: 'left'
          },{
            name: 'core_name',
            title: '所属中心',
            fixed: 'left',
            sortable: false,
            width: 120
          },
          {
            name: 'business_divisions_name',
            title: '所属事业部',
            fixed: 'left',
            sortable: false,
            width: 120
          },
          {
            name: 'department_name',
            title: '所属项目部',
            sortable: false,
            fixed: 'left'
          }, {
            name: 'product_name',
            title: '产品',
            sortable: false,
            fixed: 'left',
            width: 150
          }, {
            name: 'title',
            title: '相关业务项目',
            sortable: false,
            fixed: 'left'
          }, {
            name: 'desc',
            title: '备注说明',
            sortable: false,
            fixed: 'left'
          }
        ],
        showPagination: false
      })
    }
  },
  components: {
    CanvasExcel
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
html,body{
  width: 100%;
  height:100%;
  overflow: hidden;
}
</style>
