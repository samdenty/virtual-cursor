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

    const style = css`
      position: fixed;
      height: ${zoomAdjustedSize(icon.size)}px;
      width: ${zoomAdjustedSize(icon.size)}px;
      top: ${this.y}px;
      left: ${this.x}px;
      background-image: url('${icon.url}');
      background-repeat: no-repeat;
      background-size: contain;
      opacity: ${this.visible ? 1 : 0};

      pointer-events: none;

      ${icon.style};
    `

    // Apply styles
    ;(this.canvas.style as any) = style
  }
}
