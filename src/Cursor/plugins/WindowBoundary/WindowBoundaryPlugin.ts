import { Plugin, Cursor } from '../../..'
import autobind from 'autobind-decorator'

export class WindowBoundaryPlugin implements Plugin {
  constructor(private cursor: Cursor) {}

  public mouseMove() {
    const top = 0
    const bottom = this.cursor.rootRect.height
    const left = 0
    const right = this.cursor.rootRect.width

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
