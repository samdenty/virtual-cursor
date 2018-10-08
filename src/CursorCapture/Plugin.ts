import { Cursor } from '../Cursor'
import {
  WindowBoundaryPlugin,
  DragSelectionPlugin,
  NativeEventsPlugin,
  ClickSelectionPlugin
} from './plugins'

export class Plugin {
  constructor(cursor: Cursor) {}

  mouseMove?(): boolean | void
  mouseDown?(): void
  mouseUp?(): void
}

export const defaultPlugins: (typeof Plugin)[] = [
  WindowBoundaryPlugin,
  DragSelectionPlugin,
  ClickSelectionPlugin,
  NativeEventsPlugin
]
