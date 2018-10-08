import { Plugin, Cursor } from '../../..'
import { isNodeFollowing } from './nodePosition'

export class DragSelectionPlugin implements Plugin {
  constructor(private cursor: Cursor) {}

  private fromRange: Range
  private hasPreviouslySelected: boolean

  public mouseMove() {
    if (this.fromRange) {
      const {
        startContainer: fromContainer,
        startOffset: fromOffset
      } = this.fromRange
      const {
        startContainer: toContainer,
        startOffset: toOffset
      } = document.caretRangeFromPoint(this.cursor.x, this.cursor.y)

      const leftToRight =
        fromContainer === toContainer
          ? fromOffset <= toOffset
          : isNodeFollowing(toContainer, fromContainer)

      const range = new Range()
      if (leftToRight) {
        range.setStart(fromContainer, fromOffset)
        range.setEnd(toContainer, toOffset)
      } else {
        range.setStart(toContainer, toOffset)
        range.setEnd(fromContainer, fromOffset)
      }

      const selection = getSelection()

      // Don't remove selection unless we've previously selected something
      const shouldClearSelection =
        this.hasPreviouslySelected ||
        fromContainer !== toContainer ||
        fromOffset !== toOffset

      if (shouldClearSelection) {
        this.hasPreviouslySelected = true
        selection.removeAllRanges()

        selection.addRange(range)
      }
    }
  }

  public mouseDown() {
    this.fromRange = document.caretRangeFromPoint(this.cursor.x, this.cursor.y)
  }

  public mouseUp() {
    this.fromRange = null
    this.hasPreviouslySelected = false
  }
}
