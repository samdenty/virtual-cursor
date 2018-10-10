import { isValidEvent } from '../../../utils'
import { Plugin, Cursor } from '../../..'
import autobind from 'autobind-decorator'

@autobind
export class UserInputPlugin implements Plugin {
  constructor(private cursor: Cursor) {
    // Event listeners
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mousedown', this.handleMouseDown)
    document.addEventListener('mouseup', this.handleMouseUp)
  }

  public cleanup() {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mousedown', this.handleMouseDown)
    document.removeEventListener('mouseup', this.handleMouseUp)
  }

  private handleMouseMove(event: MouseEvent) {
    if (!isValidEvent(event)) return

    event.stopPropagation()

    if (event.toElement === this.cursor.canvas) {
      const x = this.cursor.x + event.movementX / window.devicePixelRatio
      const y = this.cursor.y + event.movementY / window.devicePixelRatio

      this.cursor.setPosition(x, y, false)
    } else {
      this.cursor.setPosition(event.pageX, event.pageY, false)
    }
  }

  private handleMouseDown(event: MouseEvent) {
    if (!isValidEvent(event)) return

    this.cursor.mouseDown(false)
  }

  private handleMouseUp(event: MouseEvent) {
    if (!isValidEvent(event)) return

    this.cursor.mouseUp(false)
  }
}
