import { ContentRect } from 'resize-observer/lib/ContentRect'
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

  public pointer = document.createElement('canvas')
  public node = document.createElement('div')

  @observable
  public rootRect: ContentRect
  public root: HTMLElement

  @observable
  public locked: boolean

  @observable
  public visible = true

  @observable
  public x = 0

  @observable
  public y = 0

  constructor({
    root = document.documentElement,
    plugins = defaultPlugins
  }: ICursor = {}) {
    this.root = root
    this.rootRect = root.getBoundingClientRect()

    this.node.appendChild(this.pointer)
    document.body.appendChild(this.node)

    const updateRect = setInterval(this.updateRect, 100)

    // Autorunners
    this.autorunners.push(
      autorun(this.renderPointer),
      autorun(this.renderNode),
      () => clearInterval(updateRect)
    )

    // Initiate plugins
    for (const Plugin of plugins) {
      const plugin = new Plugin(this as any)
      this.plugins.add(plugin)

      if (plugin.render) this.autorunners.push(autorun(plugin.render))
    }

    // Add event listeners
    window.addEventListener('resize', this.renderPointer)
    document.addEventListener('pointerlockchange', this.onPointerLockChange)
  }

  public cleanup() {
    // Remove event listeners
    window.removeEventListener('resize', this.renderPointer)
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

  public getPageX = (x = this.x) => this.rootRect.left + x
  public getPageY = (y = this.y) => this.rootRect.top + y

  public lock = () => this.pointer.requestPointerLock()
  public unlock = () => this.locked && document.exitPointerLock()

  public show = () => (this.visible = true)
  public hide = () => (this.visible = false)

  public caretRange(x = this.x, y = this.y) {
    const range = this.suppressOverlay(() =>
      document.caretRangeFromPoint(this.getPageX(x), this.getPageY(y))
    )

    return range
  }

  @computed
  public get hoveredElement() {
    const element =
      this.suppressOverlay(() =>
        document.elementFromPoint(this.getPageX(), this.getPageY())
      ) || this.root

    return element
  }

  @computed
  public get type() {
    const cursor = this.suppressOverlay(() =>
      cursorFromPoint(this.getPageX(), this.getPageY())
    )

    return cursor
  }

  public setPosition(x: number, y: number) {
    this.x = x
    this.y = y

    const event = this.createEvent('mousemove')

    for (const plugin of this.plugins) {
      if (!plugin.mouseMove) continue
      plugin.mouseMove(event)
    }
  }

  public mouseDown() {
    const event = this.createEvent('mousedown')

    for (const plugin of this.plugins) {
      if (!plugin.mouseDown) continue
      plugin.mouseDown(event)
    }
  }

  public mouseUp() {
    const event = this.createEvent('mouseup')

    for (const plugin of this.plugins) {
      if (!plugin.mouseUp) continue
      plugin.mouseUp(event)
    }
  }

  public click() {
    const event = this.createEvent('click')

    for (const plugin of this.plugins) {
      if (!plugin.click) continue
      plugin.click(event)
    }
  }

  public createEvent(type: string, options?: MouseEventInit) {
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

    return event
  }

  private renderNode() {
    ;(this.node.style as any) = css`
      position: fixed;
      cursor: none;
      z-index: 99999999;

      top: ${this.rootRect.top};
      left: ${this.rootRect.left};
      height: ${this.rootRect.height};
      width: ${this.rootRect.width};
    `
  }

  private renderPointer() {
    const icon = MacOS(this)
    const size = zoomAdjustedSize(icon.size)

    // Canvas styles
    ;(this.pointer.style as any) = css`
      position: absolute;
      pointer-events: none;

      height: ${size}px;
      width: ${size}px;
      top: ${this.y}px;
      left: ${this.x}px;

      background-image: url('${icon.url}');
      background-origin: content-box;
      background-repeat: no-repeat;
      background-size: contain;

      opacity: ${this.visible ? 1 : 0};

      ${icon.style};
    `
  }

  private suppressOverlay<T extends () => any>(callback: T): ReturnType<T> {
    const prevState = this.node.style.pointerEvents

    try {
      this.node.style.pointerEvents = 'none'
      return callback()
    } finally {
      this.node.style.pointerEvents = prevState
    }
  }

  private updateRect() {
    const rect = this.root.getBoundingClientRect()

    if (
      this.rootRect.top !== rect.top ||
      this.rootRect.left !== rect.left ||
      this.rootRect.height !== rect.height ||
      this.rootRect.width !== rect.width
    ) {
      this.rootRect = rect
    }
  }

  private onPointerLockChange() {
    const locked = document.pointerLockElement === this.pointer

    this.locked = locked
  }
}
