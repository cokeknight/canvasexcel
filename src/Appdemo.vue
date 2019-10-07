<template>
<div>
  <button @click="calculate" style="position:absolute">计算绘制100次的时间</button>
 <CanvasExcel 
 ref="canvasExcel"
 :table-schema="report_table"
 :table-data="budgetRentDataList" style="position:absolute;width:100%;height:100%;"/>
</div>
</template>

<script>
// const markerNameA = "example-marker-a"
// const markerNameB = "example-marker-b"
// const logs= []
// function run(){
// performance.mark(markerNameA);
// for (var i = 0; i < 1000000; ++i) {
 
// }
// performance.mark(markerNameB);
// performance.measure("measure a to b", markerNameA, markerNameB);
// console.log(performance.getEntriesByType("measure")[0].duration);

// // Finally, clean up the entries.
// performance.clearMarks();
// performance.clearMeasures();
// }

import CanvasExcel from './components/canvas_excel_V2'
import budgetRentDataList from './budgetRentDataList.js'
import tableSchema from './columns'
export default {
  name: 'app',
  data(){
    return {
      canvasProps:{
         xScroll:true,
          yScroll:true,
          totalrow:4
      },
      budgetRentDataList,
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
        tableSchema,
        showPagination: false
      })
    }
  },
  components: {
    CanvasExcel
  },
  methods:{
    calculate(){
      const markerNameA = "example-marker-a"
      const markerNameB = "example-marker-b"
      const logs= []
      for (var i = 0; i < 100; ++i) {
         performance.mark(markerNameA);
        this.$refs.canvasExcel.reDrawChart()
        performance.mark(markerNameB);
        performance.measure("measure a to b", markerNameA, markerNameB);
        logs.push(performance.getEntriesByType("measure")[0].duration);
        // Finally, clean up the entries.
        performance.clearMarks();
        performance.clearMeasures();
      }
      console.log(logs)
      
    }
  },
  mounted(){
//     for (var i = 0; i < 100; ++i) {
//  run()
// }
// console.log(logs)

        // var work = new Worker("../jlb.js");      //work文件中不要存在跟ui代码
        // //发送消息
        // work.postMessage("100");
        // // 监听消息
        // work.onmessage = function(event) {
        //     console.log(event.data);
        // };
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
