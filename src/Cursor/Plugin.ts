import { Pointer } from '../Pointer'
import {
  WindowBoundaryPlugin,
  DragSelectionPlugin,
  NativeEventsPlugin,
  ClickSelectionPlugin
} from './plugins'

export class Plugin {
  constructor(pointer: Pointer) {}

  mouseMove?(): boolean | void
  mouseDown?(): void
  mouseUp?(): void

  cleanup?(): void
}

export const defaultPlugins: (typeof Plugin)[] = [
  WindowBoundaryPlugin,
  DragSelectionPlugin,
  ClickSelectionPlugin,
  NativeEventsPlugin
]
