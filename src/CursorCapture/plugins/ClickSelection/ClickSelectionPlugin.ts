import { Plugin, Cursor } from '../../..'
import { getClosestWord } from './getClosestWord';

const MAX_CLICK_DELAY = 350

export class ClickSelectionPlugin implements Plugin {
  constructor(private cursor: Cursor) {}

  private clickTimer: any
  private clickElement: Element
  private clicks: number

  public mouseDown() {
    this.addClick()
  }

  private addClick() {
    clearTimeout(this.clickTimer)

    const element = this.cursor.hoveredElement
    if (this.clickElement !== element) this.clicks = 0
    this.clickElement = element

    this.clicks++

    const selection = getSelection()
    switch (this.clicks) {
      case 1: {
        selection.removeAllRanges()
        break
      }

      case 2: {
        const range = document.caretRangeFromPoint(
          this.cursor.x,
          this.cursor.y
          )
          if (!range) break

          const text = range.startContainer.textContent
          const match = getClosestWord(text, range.startOffset)

          if (!match) break
            range.setStart(range.startContainer, match.startIndex)
            range.setEnd(range.endContainer, match.endIndex)

            selection.removeAllRanges()
            selection.addRange(range)


        break
      }

      case 3: {
        if (!element) break

        const range = new Range()
        range.selectNode(element)

        selection.removeAllRanges()
        selection.addRange(range)

        break
      }
    }


    this.clickTimer = setTimeout(() => {
      this.clicks = 0
      this.clickElement = null
    }, MAX_CLICK_DELAY)
  }
}
