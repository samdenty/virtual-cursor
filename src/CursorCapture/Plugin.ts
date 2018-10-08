import { Cursor } from '../Cursor'
import {
  WindowBoundaryPlugin,
  SelectionPlugin,
  NativeEventsPlugin
} from './plugins'

export class Plugin {
  constructor(cursor: Cursor) {}

  mouseMove?(event: MouseEvent): boolean | void
  mouseDown?(event: MouseEvent): void
  mouseUp?(event: MouseEvent): void
}

export const defaultPlugins: (typeof Plugin)[] = [
  WindowBoundaryPlugin,
  SelectionPlugin,
  NativeEventsPlugin
]
