import { Plugin, PluginMouseEvent, Cursor } from '../../..'

export class NativeEventsPlugin implements Plugin {
  constructor(private cursor: Cursor) {}

  private startElement: Element

  public mouseMove({ dispatch }: PluginMouseEvent) {
    dispatch()
  }

  public mouseUp({ dispatch }: PluginMouseEvent) {
    const element = this.cursor.hoveredElement

    if (this.startElement === element) this.cursor.click()
    this.startElement = null

    dispatch()
  }

  public mouseDown({ dispatch }: PluginMouseEvent) {
    const element = this.cursor.hoveredElement
    this.startElement = element

    dispatch()
  }
}
