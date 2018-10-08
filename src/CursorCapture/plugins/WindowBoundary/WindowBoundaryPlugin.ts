import { Plugin, Cursor } from '../../..'

export class WindowBoundaryPlugin implements Plugin {
  constructor(private cursor: Cursor) {}

  public mouseMove() {
    if (this.cursor.x < 0) this.cursor.x = 0
    if (this.cursor.y < 0) this.cursor.y = 0

    if (this.cursor.x >= window.innerWidth) this.cursor.x = window.innerWidth
    if (this.cursor.y >= window.innerHeight) this.cursor.y = window.innerHeight
  }
}
