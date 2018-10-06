import { observable, autorun } from 'mobx'

import { MacOS } from '../cursors'
import { css } from '../utils'
import autobind from 'autobind-decorator'

export interface CursorIcon {
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
    const icon = MacOS

    const style = css`
      position: fixed;
      height: ${icon.size}px;
      width: ${icon.size}px;
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
