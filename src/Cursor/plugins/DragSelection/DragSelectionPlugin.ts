import { Plugin, Cursor } from '../../..'
import { isNodeFollowing } from './nodePosition'

export class DragSelectionPlugin implements Plugin {
  constructor(private cursor: Cursor) {}

  private fromRange: Range
  private hasPreviouslySelected: boolean

  private getCaret(x = this.cursor.x, y = this.cursor.y, recurse = true) {
    const range = this.cursor.suppressOverlay(() =>
      document.caretRangeFromPoint(x, y)
    )

    // Cursor isn't on a HTML element, look around for one
    if (recurse && !range) {
      const tadLeft = this.getCaret(x - 1, y - 1, false)
      if (tadLeft) return tadLeft

      const tadRight = this.getCaret(x + 1, y + 1, false)
      if (tadRight) return tadRight
    }

    return range
  }

  public mouseMove() {
    if (this.fromRange) {
      const toRange = this.getCaret()
      if (!toRange) return

      const { startContainer: toContainer, startOffset: toOffset } = toRange
      const {
        startContainer: fromContainer,
        startOffset: fromOffset
      } = this.fromRange

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
    this.fromRange = this.getCaret()
  }

  public mouseUp() {
    this.fromRange = null
    this.hasPreviouslySelected = false
  }
}
