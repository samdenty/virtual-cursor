import autobind from 'autobind-decorator'
import { Pointer } from '../Pointer'
import { Plugin, defaultPlugins } from './Plugin'
import { isValidEvent } from '../utils'

export interface ICursorCapture {
  pointer?: Pointer
  plugins?: (typeof Plugin)[]
}

@autobind
export class Cursor {
  public plugins: Set<Plugin>
  public cursor: Pointer

  constructor(
    {
      plugins = defaultPlugins,
      pointer = new Pointer()
    }: ICursorCapture = {} as any
  ) {
    const instantiatedPlugins = plugins.map(Plugin => new Plugin(pointer))

    this.plugins = new Set(instantiatedPlugins)
    this.cursor = pointer

    // Event listeners
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mousedown', this.onMouseDown)
    document.addEventListener('mouseup', this.onMouseUp)
  }

  public cleanup() {
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mousedown', this.onMouseDown)
    document.removeEventListener('mouseup', this.onMouseUp)

    // Give control back to user
    this.ceaseControl()
    this.cursor.cleanup()
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
}
