import Window from './window'
import ExtDataGrid from './extDataGrid'
import { glSetCanvasOffest } from './glMouseEvent'

export default class CanvasExcel {
  constructor(canvas, config) {
    this.config = config
    this.gl_renderTo = config.renderTo || document.body
    this.gl_canvas = canvas
    this.gl_width = config.width || 550
    this.app = null
    this.gl_items = []
    this.dc = null
    this.datagrid = null
    this.init()
  }

  init() {
    this.initCanvas()
    this.datagrid = new ExtDataGrid({
      ...this.config,
      width: this.config.width,
      height: this.config.height,
      totalWidth: this.config.totalWidth,
      totalHeight: this.config.totalHeight,
      x: this.config.x || 0,
      y: this.config.y || 0,
      canResizeRow: false,
      canResizeCol: false
    }, this.gl_canvas)
    // console.log(this.config.width, this.config.height)
    glSetCanvasOffest({
      x: this.config.offestX || 0,
      y: this.config.offestY || 0
    })
    // 这个是整个窗体能滚动的所有宽高
    this.app = new Window({
      width: this.config.totalWidth, height: this.config.totalHeight, comItems: [this.datagrid]
    })
    this.app.setVisible(true)
    this.glInit()

    // var scrolldemo = new ScrollBar({x:0,y:0,dirType:'y',length:400,scrollBarLength:50});
  }

  run() {
    this.glRun(this.app)
  }

  initCanvas() {
    const { gl_canvas } = this
    gl_canvas.width = this.config.width
    gl_canvas.height = this.config.height
    gl_canvas.style.position = 'relative'
    gl_canvas.style.backgroundColor = '#fff'
    // _gl_canvas.style.border="1px solid #ff0000";
    gl_canvas.style.margin = 'auto'

    this.dc = gl_canvas.getContext('2d')
  }

  glInit(config) {
    const { gl_canvas } = this
    this.app.dc = this.dc
    // this.datagrid.dc = this.dc
    // gl_canvas.addEventListener("mousedown",sysmousedown,false);
    gl_canvas.addEventListener('mousedown', (event) => {
      this.app.sysmousedown(event)
    }, false)
    gl_canvas.addEventListener('dblclick', this.app.sysdblclick.bind(this.app), false)
    gl_canvas.addEventListener('mousemove', this.app.sysmousemove.bind(this.app), false)
    gl_canvas.addEventListener('mouseup', this.app.sysmouseup.bind(this.app), false)
    gl_canvas.addEventListener('mousewheel', this.app.sysmousewheel.bind(this.app), false)
    gl_canvas.addEventListener('DOMMouseScroll', this.app.sysmousewheel.bind(this.app), false)
  }

  glRun(pwindow) {
    this.glItemAdd(pwindow)
    if (pwindow.getVisible()) {
      pwindow.syspaint()
    }
  }

  paint() {
    this.gl_items[0].syspaint()
  }

  glItemAdd(pwindow) {
    let i
    if (pwindow.getType() === 'window') {
      this.gl_items.push(pwindow)
      for (i = 0; i < pwindow.getWinItems().length; i += 1) {
        this.glItemAdd(pwindow.getWinItems()[i])
      }
    } else {
      alert("_gl_items is window array ,you shouldn't put other class in it")
    }
  }

  $on(eventName, callback) {
    this.datagrid.dataGrid.$on(eventName, callback)
  }

  handleScrollX(scrollX) {
    this.datagrid.dataGrid.setScrollX(scrollX)
  }

  handleScrollY(scrollY) {
    this.datagrid.dataGrid.setScrollY(scrollY)
  }
  reDrawChart(){
    this.datagrid.dataGrid.reDrawChart()
  }
  redrawCells(cells) {
    this.datagrid.dataGrid.redrawCells(cells)
  }

  // 外部div变化 重绘
  setSize({ width, height }) {
    this.config.width = width
    this.config.height = height
    this.gl_canvas.width = this.config.width
    this.gl_canvas.height = this.config.height

    this.paint()
  }
}
