import { observable, autorun, computed } from 'mobx'

import { MacOS } from '../cursors'
import {
  css,
  cursorFromPoint,
  zoomAdjustedSize,
  syntheticEvents
} from '../utils'
import autobind from 'autobind-decorator'

export type CursorIcon = (
  cursor: Cursor
) => {
  url: string
  size: number
  style?: string
}

@autobind
export class Cursor {
  public canvas = document.createElement('canvas')
  private disposeRenderer = autorun(() => this.render())

  @observable public visible: boolean

  @observable public x: number

  @observable public y: number

  constructor({ x = 0, y = 0, visible = true } = {}) {
    this.y = y
    this.x = x
    this.visible = visible

    document.body.appendChild(this.canvas)
    window.addEventListener('resize', this.render)
  }

  @computed
  public get hoveredElement() {
    const element = document.elementFromPoint(this.x, this.y)

    return element
  }

  @computed
  public get type() {
    const cursor = cursorFromPoint(this.x, this.y)

    return cursor
  }

  public destroy() {
    this.disposeRenderer()
    window.removeEventListener('resize', this.render)
  }

  public show() {
    this.visible = true
  }

  public hide() {
    this.visible = false
  }

  public mouseDown() {
    this.dispatchEvent('mousedown')
  }

  public mouseUp() {
    this.dispatchEvent('mouseup')
  }

  public click() {
    this.dispatchEvent('click')
  }

  public dispatchEvent(type: string, options?: MouseEventInit) {
    const element = this.hoveredElement
    if (!element) return null

    const mouseEvent = new MouseEvent(type, {
      // Correct values
      clientX: this.x,
      clientY: this.y,

      // These will be invalid (no way of generating)
      screenX: this.x,
      screenY: this.y,

      ...options
    })

    syntheticEvents.add(mouseEvent)

    element.dispatchEvent(mouseEvent)
  }

  private render() {
    const icon = MacOS(this)

    const size = zoomAdjustedSize(icon.size)
    const padding = zoomAdjustedSize(10)

    const style = css`
      position: fixed;
      pointer-events: none;

      height: ${size}px;
      width: ${size}px;
      top: ${this.y}px;
      left: ${this.x}px;

      margin: -${padding};
      padding: ${padding}px;

      background-image: url('${icon.url}');
      background-origin: content-box;
      background-repeat: no-repeat;
      background-size: contain;

      opacity: ${this.visible ? 1 : 0};

      ${icon.style};
    `

    // Apply styles
    ;(this.canvas.style as any) = style
  }
}
