import { Plugin, Cursor } from '../../..'

export class NativeEventsPlugin implements Plugin {
  constructor(private cursor: Cursor) {}

  private startElement: Element

  public mouseUp() {
    const element = this.cursor.hoveredElement

    if (this.startElement === element) this.cursor.click()
    this.startElement = null

    this.cursor.mouseUp()
  }

  public mouseDown() {
    const element = this.cursor.hoveredElement
    this.startElement = element

    this.cursor.mouseDown()
  }
}
