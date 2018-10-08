import { Plugin, Cursor } from '../../..'
import { isNodeFollowing } from './nodePosition';

export class SelectionPlugin implements Plugin {
  constructor(private cursor: Cursor) {}

  private range: Range

  private prevLeftToRight: boolean

  public mouseMove() {
    if (this.range) {
      const {startContainer: currentContainer, startOffset: currentOffset} = document.caretRangeFromPoint(
        this.cursor.x,
        this.cursor.y
      )

      // This logic is bugged, failed to debug
      // Resets the start offset when selection nodes with different children

      const startSameNode = this.range.startContainer === currentContainer
      const endSameNode = this.range.endContainer === currentContainer

      const leftToRight = (startSameNode && endSameNode) ? (this.prevLeftToRight ? this.range.startOffset : this.range.endOffset) < currentOffset : isNodeFollowing(currentContainer, this.range.startContainer)

      if (leftToRight) {
        if (leftToRight !== this.prevLeftToRight) {
          this.range.setStart(this.range.endContainer, this.range.endOffset)
        }

        this.range.setEnd(currentContainer, currentOffset)
      } else {
        if (leftToRight !== this.prevLeftToRight) {
          this.range.setEnd(this.range.startContainer, this.range.startOffset)
        }

        this.range.setStart(currentContainer, currentOffset)
      }

      this.prevLeftToRight = leftToRight

      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(this.range)
    }
  }

  public mouseDown() {
    this.range = document.caretRangeFromPoint(this.cursor.x, this.cursor.y)
  }

  public mouseUp() {
    this.range = null
  }
}
