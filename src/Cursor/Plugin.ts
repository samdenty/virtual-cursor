import { Cursor } from '../Cursor'
import {
  WindowBoundaryPlugin,
  DragSelectionPlugin,
  ClickSelectionPlugin,
  UserInputPlugin,
  NativeEventsPlugin,
  PointerLockPlugin
} from './plugins'

export type PluginMouseEvent = {
  event: MouseEvent
  dispatch: Function
  element: Element
}

export class Plugin {
  constructor(cursor: Cursor) {}

  mouseMove?(event: PluginMouseEvent): boolean | void
  mouseDown?(event: PluginMouseEvent): void
  click?(event: PluginMouseEvent): void
  mouseUp?(event: PluginMouseEvent): void

  render?(): void
  cleanup?(): void
}

export const defaultPlugins: (typeof Plugin)[] = [
  PointerLockPlugin,
  WindowBoundaryPlugin,
  DragSelectionPlugin,
  ClickSelectionPlugin,
  UserInputPlugin,
  NativeEventsPlugin
]
