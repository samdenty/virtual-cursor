import { Plugin, Pointer} from '../../..'

export class NativeEventsPlugin implements Plugin {
  constructor(private pointer: Pointer) {}

  private startElement: Element

  public mouseUp() {
    const element = this.pointer.hoveredElement

    if (this.startElement === element) this.pointer.click()
    this.startElement = null

    this.pointer.mouseUp()
  }

  public mouseDown() {
    const element = this.pointer.hoveredElement
    this.startElement = element

    this.pointer.mouseDown()
  }
}
