import { observable, autorun, computed } from 'mobx'

import { MacOS } from '../cursors'
import {
  css,
  cursorFromPoint,
  zoomAdjustedSize,
  syntheticEvents
} from '../utils'
import autobind from 'autobind-decorator'

export type PointerIcon = (
  cursor: any
) => {
  url: string
  size: number
  style?: string
}

// @autobind
// export class Pointer {
//   public canvas = document.createElement('canvas')
//   public mask = document.createElement('div')

//   @observable
//   public locked: boolean

//   @observable
//   public visible: boolean

//   @observable
//   public x: number

//   @observable
//   public y: number

//   private disposeRenderer = autorun(() => this.render())

//   constructor({ x = 0, y = 0, visible = true } = {}) {
//     const root = document.body

//     this.y = y
//     this.x = x
//     this.visible = visible

//     root.appendChild(this.canvas)
//     root.appendChild(this.mask)

//     window.addEventListener('resize', this.render)
//     document.addEventListener('pointerlockchange', this.onPointerLockChange)
//   }

//   public cleanup() {
//     this.disposeRenderer()

//     window.removeEventListener('resize', this.render)
//     document.removeEventListener('pointerlockchange', this.onPointerLockChange)
//   }

//   @computed
//   public get hoveredElement() {
//     this.mask.hidden = true
//     const element = document.elementFromPoint(this.x, this.y)
//     this.mask.hidden = false

//     return element
//   }

//   @computed
//   public get type() {
//     this.mask.hidden = true
//     const cursor = cursorFromPoint(this.x, this.y)
//     this.mask.hidden = false

//     return cursor
//   }

//   public isLocked() {}

//   public lock() {
//     this.canvas.requestPointerLock()
//   }

//   public unlock() {
//     // Only exit current canvas
//     if (document.pointerLockElement === this.canvas) {
//       document.exitPointerLock()
//     }
//   }

//   public show = () => (this.visible = true)
//   public hide = () => (this.visible = false)
//   public mouseDown = () => this.dispatchEvent('mousedown')
//   public mouseUp = () => this.dispatchEvent('mouseup')
//   public click = () => this.dispatchEvent('click')

//   public dispatchEvent(type: string, options?: MouseEventInit) {
//     const element = this.hoveredElement
//     if (!element) return null

//     const mouseEvent = new MouseEvent(type, {
//       // Correct values
//       clientX: this.x,
//       clientY: this.y,

//       // These will be invalid (no way of generating)
//       screenX: this.x,
//       screenY: this.y,

//       ...options
//     })

//     syntheticEvents.add(mouseEvent)

//     element.dispatchEvent(mouseEvent)
//   }

//   private onPointerLockChange() {
//     const locked = document.pointerLockElement === this.canvas
//     this.locked = locked
//   }

//   private render() {
//     const zIndex = 9999999
//     const icon = MacOS(this)

//     const size = zoomAdjustedSize(icon.size)
//     const padding = zoomAdjustedSize(10)

//     // Mask styles
//     ;(this.mask.style as any) = css`
//       position: absolute;
//       z-index: ${zIndex};
//       cursor: none;

//       top: 0;
//       left: 0;
//       right: 0;

//       height: 100%;
//       width: 100%;
//     `

//     // Canvas styles
//     ;(this.canvas.style as any) = css`
//       position: fixed;
//       z-index: ${zIndex + 1};
//       pointer-events: none;

//       height: ${size}px;
//       width: ${size}px;
//       top: ${this.y}px;
//       left: ${this.x}px;

//       margin: -${padding};
//       padding: ${padding}px;

//       background-image: url('${icon.url}');
//       background-origin: content-box;
//       background-repeat: no-repeat;
//       background-size: contain;

//       opacity: ${this.visible ? 1 : 0};

//       ${icon.style};
//     `
//   }
// }
