import { Plugin, Cursor } from '../../..'

export class SelectionPlugin implements Plugin {
  constructor(private cursor: Cursor) {}

  private startRange: Range

  public mouseMove() {
    if (this.startRange) {
      const endRange = document.caretRangeFromPoint(
        this.cursor.x,
        this.cursor.y
      )

      const selection = window.getSelection()
      const range = document.createRange()

      range.setStart(
        this.startRange.startContainer,
        this.startRange.startOffset
      )
      range.setEnd(endRange.endContainer, endRange.endOffset)

      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  public mouseDown() {
    this.startRange = document.caretRangeFromPoint(this.cursor.x, this.cursor.y)
  }

  public mouseUp() {
    this.startRange = null
  }
}
