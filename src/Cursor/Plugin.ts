import { Cursor } from '../Cursor'
import {
  WindowBoundaryPlugin,
  DragSelectionPlugin,
  ClickSelectionPlugin,
  UserInputPlugin,
  NativeEventsPlugin,
  PointerLockPlugin
} from './plugins'

export class Plugin {
  constructor(cursor: Cursor) {}

  mouseMove?(event: MouseEvent): boolean | void
  mouseDown?(event: MouseEvent): void
  click?(event: MouseEvent): void
  mouseUp?(event: MouseEvent): void

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
