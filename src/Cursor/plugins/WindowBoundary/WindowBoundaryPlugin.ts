import { Plugin, Cursor } from '../../..'
import autobind from 'autobind-decorator'

export class WindowBoundaryPlugin implements Plugin {
  constructor(private cursor: Cursor) {}

  public mouseMove() {
    const top = 0
    const bottom = window.innerHeight
    const left = 0
    const right = window.innerWidth

    const atTop = this.cursor.y <= top
    const atBottom = this.cursor.y >= bottom
    const atLeft = this.cursor.x <= left
    const atRight = this.cursor.x >= right

    if (atTop) {
      this.cursor.y = top
    } else if (atBottom) {
      this.cursor.y = bottom
    }

    if (atLeft) {
      this.cursor.x = left
    } else if (atRight) {
      this.cursor.x = right
    }
  }
}
