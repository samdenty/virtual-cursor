import { Plugin, Cursor } from '../../..'
import autobind from 'autobind-decorator'

@autobind
export class WindowBoundaryPlugin implements Plugin {
  constructor(private cursor: Cursor) {
    this.cursor.lock()
  }

  public cleanup() {
    this.cursor.unlock()
  }

  public mouseMove() {
    if (this.cursor.x < 0) this.cursor.x = 0
    if (this.cursor.y < 0) this.cursor.y = 0

    if (this.cursor.x >= window.innerWidth) this.cursor.x = window.innerWidth
    if (this.cursor.y >= window.innerHeight) this.cursor.y = window.innerHeight
  }

  public mouseDown() {
    this.cursor.lock()
  }
}
