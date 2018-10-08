import { Plugin, Cursor } from '../../..'
import { isNodeFollowing } from './nodePosition';

export class SelectionPlugin implements Plugin {
  constructor(private cursor: Cursor) {}

  private fromRange: Range

  public mouseMove() {
    if (this.fromRange) {
      const { startContainer: fromContainer, startOffset: fromOffset} = this.fromRange
      const { startContainer: toContainer, startOffset: toOffset }= document.caretRangeFromPoint(
        this.cursor.x,
        this.cursor.y
      )

      const leftToRight = (fromContainer === toContainer) ? fromOffset <= toOffset : isNodeFollowing(toContainer, fromContainer)

      const range = new Range()
      if (leftToRight) {
        range.setStart(fromContainer, fromOffset)
        range.setEnd(toContainer, toOffset)
      } else {
        range.setStart(toContainer, toOffset)
        range.setEnd(fromContainer, fromOffset)
      }

      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  public mouseDown() {
    this.fromRange = document.caretRangeFromPoint(this.cursor.x, this.cursor.y)
  }

  public mouseUp() {
    this.fromRange = null
  }
}
