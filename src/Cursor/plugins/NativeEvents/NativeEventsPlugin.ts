import { Plugin, Cursor } from '../../..'

export class NativeEventsPlugin implements Plugin {
  constructor(private cursor: Cursor) {}

  private startElement: Element

  public mouseMove(event: MouseEvent) {
    const element = this.cursor.hoveredElement

    element.dispatchEvent(event)
  }

  public mouseUp(event: MouseEvent) {
    const element = this.cursor.hoveredElement

    if (this.startElement === element) this.cursor.click()
    this.startElement = null

    element.dispatchEvent(event)
  }

  public mouseDown(event: MouseEvent) {
    const element = this.cursor.hoveredElement
    this.startElement = element

    element.dispatchEvent(event)
  }

  public click(event: MouseEvent) {
    const element = this.cursor.hoveredElement
    this.startElement = null

    element.dispatchEvent(event)
  }
}
