<template>
 <CanvasExcel :table-schema="report_table" 
 :table-data="budgetRentDataList" style="width:100%;height:100%;" :canvasProps="canvasProps"/>
</template>

<script>
import CanvasExcel from './components/canvas_excel'
import tableSchema from './columns'
// import budgetRentDataList from './budgetRentDataList.js'
export default {
  name: 'app',
  data(){
    return {
      canvasProps:{
         xScroll:true,
          yScroll:true,
          totalrow:4
      },
      budgetRentDataList:[
        {core_name:"xxxxx",business_divisions_name:'ttttt',title:'sassas',product_name:'ppp'},
        {core_name:"xxxxx",business_divisions_name:'ttttt',title:'sassas',product_name:'ppp'}
      ],
      report_table: {
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
        tableSchema,
        showPagination: false
      }
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
