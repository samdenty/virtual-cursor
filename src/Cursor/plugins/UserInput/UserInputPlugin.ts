import { isValidEvent } from '../../../utils'
import { Plugin, Cursor } from '../../..'
import autobind from 'autobind-decorator'

@autobind
export class UserInputPlugin implements Plugin {
  constructor(private cursor: Cursor) {
    // Event listeners
    this.cursor.node.addEventListener('mousemove', this.handleMouseMove)
    this.cursor.node.addEventListener('mousedown', this.handleMouseDown)
    this.cursor.node.addEventListener('mouseup', this.handleMouseUp)
  }

  public cleanup() {
    this.cursor.node.removeEventListener('mousemove', this.handleMouseMove)
    this.cursor.node.removeEventListener('mousedown', this.handleMouseDown)
    this.cursor.node.removeEventListener('mouseup', this.handleMouseUp)
  }

  private handleMouseMove(event: MouseEvent) {
    if (!isValidEvent(event)) return

    event.stopPropagation()

    if (event.toElement === this.cursor.pointer) {
      const x = this.cursor.x + event.movementX / window.devicePixelRatio
      const y = this.cursor.y + event.movementY / window.devicePixelRatio

      this.cursor.setPosition(x, y)
    } else {
      this.cursor.setPosition(
        event.clientX - this.cursor.rootRect.left,
        event.clientY - this.cursor.rootRect.top
      )
    }
  }

  private handleMouseDown(event: MouseEvent) {
    if (!isValidEvent(event)) return

    this.cursor.mouseDown()
  }

  private handleMouseUp(event: MouseEvent) {
    if (!isValidEvent(event)) return

    this.cursor.mouseUp()
  }
}
