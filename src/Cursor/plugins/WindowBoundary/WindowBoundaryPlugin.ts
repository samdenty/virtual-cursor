import { Plugin, Pointer } from '../../..'
import autobind from 'autobind-decorator';

@autobind
export class WindowBoundaryPlugin implements Plugin {
  constructor(private pointer: Pointer) {
    document.addEventListener('pointerlockchange', this.onPointerLockChange)

    this.onPointerLockChange()
  }

  public cleanup() {
    document.removeEventListener('pointerlockchange', this.onPointerLockChange)
  }

  public mouseMove() {
    if (this.pointer.x < 0) this.pointer.x = 0
    if (this.pointer.y < 0) this.pointer.y = 0

    if (this.pointer.x >= window.innerWidth) this.pointer.x = window.innerWidth
    if (this.pointer.y >= window.innerHeight) this.pointer.y = window.innerHeight
  }

  public mouseDown() {
    this.takeControl()
  }

  public takeControl() {
    this.pointer.canvas.requestPointerLock()
    this.onPointerLockChange()
  }

  private onPointerLockChange() {
    const locked = document.pointerLockElement === this.pointer.canvas

    if (locked) {
      this.pointer.show()
    } else {
       this.pointer.hide()
    }
  }
}
