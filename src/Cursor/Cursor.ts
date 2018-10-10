import { observable, autorun, computed } from 'mobx'

import { MacOS } from '../cursors'
import {
  css,
  cursorFromPoint,
  zoomAdjustedSize,
  syntheticEvents
} from '../utils'
import autobind from 'autobind-decorator'
import { Plugin, defaultPlugins } from './Plugin'

export interface ICursor {
  x?: number
  y?: number
  visible?: boolean
  root?: HTMLElement
  plugins?: (typeof Plugin)[]
}

@autobind
export class Cursor {
  private autorunners = new Array<Function>()
  public plugins = new Set<Plugin>()

  public root: HTMLElement
  public canvas = document.createElement('canvas')
  public overlay = document.createElement('div')

  @observable
  public locked: boolean

  @observable
  public visible = true

  @observable
  public x = 0

  @observable
  public y = 0

  constructor({
    root = document.body,
    plugins = defaultPlugins
  }: ICursor = {}) {
    this.root = root

    root.appendChild(this.canvas)
    root.appendChild(this.overlay)

    // Autorunners
    this.autorunners.push(autorun(this.render))

    // Initiate plugins
    for (const Plugin of plugins) {
      const plugin = new Plugin(this as any)
      this.plugins.add(plugin)

      if (plugin.render) this.autorunners.push(autorun(plugin.render))
    }

    // Add event listeners
    window.addEventListener('resize', this.render)
    document.addEventListener('pointerlockchange', this.onPointerLockChange)
  }

  public cleanup() {
    // Remove event listeners
    window.removeEventListener('resize', this.render)
    document.removeEventListener('pointerlockchange', this.onPointerLockChange)

    // Call plugin cleanup methods
    for (const plugin of this.plugins) {
      if (!plugin.cleanup) continue
      plugin.cleanup()
    }

    // Dispose of autorunners
    for (const dispose of this.autorunners) {
      dispose()
    }
  }

  public suppressOverlay(callback: Function) {
    const prevHidden = this.overlay.hidden

    try {
      this.overlay.hidden = true
      return callback()
    } finally {
      this.overlay.hidden = prevHidden
    }
  }

  @computed
  public get hoveredElement() {
    const element = this.suppressOverlay(() =>
      document.elementFromPoint(this.x, this.y)
    )

    return element
  }

  @computed
  public get type() {
    const cursor = this.suppressOverlay(() => cursorFromPoint(this.x, this.y))

    return cursor
  }

  public lock() {
    this.canvas.requestPointerLock()
  }

  public unlock() {
    // Only exit current canvas
    if (document.pointerLockElement === this.canvas) {
      document.exitPointerLock()
    }
  }

  public show = () => (this.visible = true)
  public hide = () => (this.visible = false)

  public setPosition(x: number, y: number, dispatch = true) {
    this.x = x
    this.y = y

    const event = this.createEvent('mousemove')

    for (const plugin of this.plugins) {
      if (!plugin.mouseMove) continue
      plugin.mouseMove({ ...event })
    }

    if (dispatch) event.dispatch()
  }

  public mouseDown(dispatch = true) {
    const event = this.createEvent('mousedown')

    for (const plugin of this.plugins) {
      if (!plugin.mouseDown) continue
      plugin.mouseDown({ ...event })
    }

    if (dispatch) event.dispatch()
  }

  public mouseUp(dispatch = true) {
    const event = this.createEvent('mouseup')

    for (const plugin of this.plugins) {
      if (!plugin.mouseUp) continue
      plugin.mouseUp({ ...event })
    }

    if (dispatch) event.dispatch()
  }

  public click(dispatch = true) {
    const event = this.createEvent('click')

    for (const plugin of this.plugins) {
      if (!plugin.click) continue
      plugin.click({ ...event })
    }

    if (dispatch) event.dispatch()
  }

  public createEvent(type: string, options?: MouseEventInit) {
    const element = this.hoveredElement || document

    const event = new MouseEvent(type, {
      // Correct values
      clientX: this.x,
      clientY: this.y,

      // These will be invalid (no way of generating)
      screenX: this.x,
      screenY: this.y,

      ...options
    })

    syntheticEvents.add(event)

    return {
      event,
      element,
      dispatch() {
        element.dispatchEvent(event)
      }
    }
  }

  private onPointerLockChange() {
    const locked = document.pointerLockElement === this.canvas

    this.locked = locked
    this.overlay.hidden = locked
  }

  private render() {
    const zIndex = 9999999
    const icon = MacOS(this)

    const size = zoomAdjustedSize(icon.size)
    const padding = zoomAdjustedSize(10)

    // Mask styles
    ;(this.overlay.style as any) = css`
      position: absolute;
      z-index: ${zIndex};
      cursor: none;

      top: 0;
      left: 0;
      right: 0;

      height: 100%;
      width: 100%;
    `

    // Canvas styles
    ;(this.canvas.style as any) = css`
      position: fixed;
      z-index: ${zIndex + 1};
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
  }
}
