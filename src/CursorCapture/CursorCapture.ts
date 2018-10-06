import autobind from 'autobind-decorator'
import { Cursor } from '../Cursor'
import { Boundary, defaultBoundaries } from './Boundary'

export interface ICursorCapture {
  cursor?: Cursor
  boundaries?: Boundary[]
  hideWhenNotLocked?: boolean
}

@autobind
export class CursorCapture {
  public boundaries: Set<Boundary>
  public cursor: Cursor
  public hideWhenNotLocked: boolean

  constructor(
    {
      hideWhenNotLocked = true,
      boundaries = defaultBoundaries,
      cursor = new Cursor({ visible: !hideWhenNotLocked })
    }: ICursorCapture = {} as any
  ) {
    this.cursor = cursor
    this.boundaries = new Set(boundaries)
    this.hideWhenNotLocked = hideWhenNotLocked

    // Event listeners
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mousedown', this.takeControl)
    document.addEventListener('pointerlockchange', this.onPointerLockChange)
  }

  public destroy() {
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mousedown', this.takeControl)
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
    if (event.toElement === this.cursor.canvas) {
      this.cursor.x += event.movementX
      this.cursor.y += event.movementY
    } else {
      this.cursor.x = event.pageX
      this.cursor.y = event.pageY
    }

    // Call callbacks
    this.boundaries.forEach(getCoords => getCoords(this.cursor))
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
