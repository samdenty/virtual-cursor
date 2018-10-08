import autobind from 'autobind-decorator'
import { Cursor } from '../Cursor'
import { Plugin, defaultPlugins } from './Plugin'
import { isValidEvent } from '../utils'

export interface ICursorCapture {
  cursor?: Cursor
  plugins?: (typeof Plugin)[]
  hideWhenNotLocked?: boolean
}

@autobind
export class CursorCapture {
  public plugins: Set<Plugin>
  public cursor: Cursor
  public hideWhenNotLocked: boolean

  constructor(
    {
      hideWhenNotLocked = true,
      plugins = defaultPlugins,
      cursor = new Cursor({ visible: !hideWhenNotLocked })
    }: ICursorCapture = {} as any
  ) {
    const instantiatedPlugins = plugins.map(Plugin => new Plugin(cursor))
    this.plugins = new Set(instantiatedPlugins)

    this.cursor = cursor
    this.hideWhenNotLocked = hideWhenNotLocked

    // Event listeners
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mousedown', this.onMouseDown)
    document.addEventListener('mouseup', this.onMouseUp)
    document.addEventListener('pointerlockchange', this.onPointerLockChange)
  }

  public destroy() {
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mousedown', this.onMouseDown)
    document.removeEventListener('mouseup', this.onMouseUp)
    document.removeEventListener('pointerlockchange', this.onPointerLockChange)

    // Give control back to user
    this.ceaseControl()
    this.cursor.destroy()
  }

  public takeControl() {
    this.cursor.canvas.requestPointerLock()
    this.onPointerLockChange()
  }

  public ceaseControl() {
    // Only exit current canvas
    if (document.pointerLockElement === this.cursor.canvas)
      document.exitPointerLock()
  }

  private onMouseMove(event: MouseEvent) {
    if (!isValidEvent(event)) return

    const prevX = this.cursor.x
    const prevY = this.cursor.y

    if (event.toElement === this.cursor.canvas) {
      this.cursor.x += event.movementX / window.devicePixelRatio
      this.cursor.y += event.movementY / window.devicePixelRatio
    } else {
      this.cursor.x = event.pageX
      this.cursor.y = event.pageY
    }

    // Plugin system
    for (const plugin of this.plugins) {
      if (!plugin.mouseMove) continue
      const shouldCancel = plugin.mouseMove() === false

      if (shouldCancel) {
        this.cursor.x = prevX
        this.cursor.y = prevY
      }
    }
  }

  private onMouseDown(event: MouseEvent) {
    if (!isValidEvent(event)) return

    event.preventDefault()
    event.stopPropagation()

    this.takeControl()

    // Plugin system
    for (const plugin of this.plugins) {
      if (!plugin.mouseDown) continue
      plugin.mouseDown()
    }
  }

  private onMouseUp(event: MouseEvent) {
    if (!isValidEvent(event)) return

    // Plugin system
    for (const plugin of this.plugins) {
      if (!plugin.mouseUp) continue
      plugin.mouseUp()
    }
  }

  private onPointerLockChange() {
    const locked = document.pointerLockElement === this.cursor.canvas

    if (locked) {
      this.cursor.show()
    } else {
      if (this.hideWhenNotLocked) this.cursor.hide()
    }
  }
}
