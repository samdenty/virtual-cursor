import { observable, autorun, computed } from 'mobx'

import { MacOS } from '../cursors'
import { css, cursorFromPoint, zoomAdjustedSize } from '../utils'
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
  private renderDisposer = autorun(() => this.render())

  @observable
  public visible: boolean

  @observable
  public x: number

  @observable
  public y: number

  constructor({ x = 0, y = 0, visible = true } = {}) {
    this.y = y
    this.x = x
    this.visible = visible

    document.body.appendChild(this.canvas)
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
    this.renderDisposer()
  }

  public show() {
    this.visible = true
  }

  public hide() {
    this.visible = false
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
