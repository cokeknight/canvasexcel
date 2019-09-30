/* eslint-disable */
// JavaScript Doment
// JavaScript Document
import DataGrid from './dataGrid'
import Component from './component'
function extendPrototype(obj){
  function F(){}
  F.prototype =  obj
  return new F()
}
// JavaScript Document
function ExtDataGrid(config, canvas) {
  /*property
        datagrid
        scrollX
        scrollY
*/
  Component.call(this, config);

  const $this = this;
  //继承Component
  this.eventHooks = {}
  var data = {
      ...config,
      x: 0.5,
      y: 0.5,
      width: $this.getWidth(),
      height: $this.getHeight()
  };
  if ($this.localStorageName !== undefined) {
      if (localStorage.getItem($this.localStorageName)) {
          data = JSON.parse(localStorage.getItem($this.localStorageName));
      }
  }

  this.dc = canvas.getContext('2d')
  this.dataGrid = new DataGrid(data,canvas)
  // console.log('totalWidth', this.dataGrid.getTotalWidth(), this.dataGrid.getTotalHeight())
  this.comItemAdd(this.dataGrid);
}
ExtDataGrid.prototype = extendPrototype(Component.prototype)
ExtDataGrid.prototype.constructor = ExtDataGrid


export default ExtDataGrid
