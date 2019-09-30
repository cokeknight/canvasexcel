
/* eslint-disable */
export const _gl_mouseState = { mousedownstate: false, focuswin: null, focusel: null }
export const canvas_offset = { x:0, y:0 }
export function glGetMouseState() {
  return _gl_mouseState.mousedownstate
}
export function glSetCanvasOffest({x, y}) {
  canvas_offset.x = x
  canvas_offset.y = y
}
export function glSetMouseState(down) {
  if (typeof (down) === 'boolean') {
    _gl_mouseState.mousedownstate = down
  } else {
    alert('paramter eror:glSetMouseState(down) down should be boolean')
  }
}

export function glGetMouseFocusWin() {
  return _gl_mouseState.focuswin
}

export function glSetMouseFocusWin(pwindow) {
  if (pwindow) {
    if (pwindow.getType() == 'window') {
      _gl_mouseState.focuswin = pwindow
    } else {
      alert('paramter error:pwindow should be window class')
    }
  } else {
    _gl_mouseState.focuswin = null
  }
}
export function glGetMouseFocusEl() {
  return _gl_mouseState.focusel
}

export function glSetMouseFocusEl(pcomponent) {
  if (pcomponent) {
    if (pcomponent.getType() == 'component') {
      _gl_mouseState.focusel = pcomponent
    } else {
      alert('111paramter error:pcomponent should be component class')
    }
  } else {
    _gl_mouseState.focusel = null
  }
}

export function glGetMousePageXY(e) {
  if (e.touches !== undefined) {
    glGetMousePageXY = function(e) {
      return { x: e.touches[0].pageX, y: e.touches[0].pageY }
    }
  } else {
    glGetMousePageXY = function(e) {
      const x = e.pageX ? e.pageX : (document.body.scrollLeft + e.clientX)
      const y = e.pageY ? e.pageY : (document.body.scrollTop + e.clientY)
      return { x, y }
    }
  }
  return glGetMousePageXY(e)
}

export function glGetMouseClientXY(e) {
  if (e.touches !== undefined) {
    glGetMouseClientXY = function(e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  } else {
    glGetMouseClientXY = function(e) {
      const x = e.clientX
      const y = e.clientY
      return { x, y }
    }
  }
  return glGetMouseClientXY(e)
}

export function glGetMouseCanvasXY(e) {
  var x = e.offsetX?e.offsetX:e.layerX;
  var y = e.offsetY?e.offsetY:e.layerY;
  return {x:x,y:y};
}

export function glGetMouseScreenXY(e) {
  if (e.touches !== undefined) {
    glGetMouseScreenXY = function(e) {
      return { x: e.touches[0].screenX, y: e.touches[0].screenY }
    }
  } else {
    glGetMouseScreenXY = function(e) {
      const x = e.screenX
      const y = e.screenY
      return { x, y }
    }
  }
  return glGetMouseScreenXY(e)
}

export function glGetEvent(event) {
  return event || window.event
}
export function glGetTarget(event) {
  return event.target || event.srcElement
}
export function glCaptureDoumentEvent(context){
  document.onmouseup = function (){
    context.sysmouseup()
  }
}
export function glCancelDoumentEvent(){
  document.onmouseup = null
}
