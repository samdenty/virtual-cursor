import { WindowBoundaryPlugin, SelectionPlugin } from './plugins'
import { Cursor } from '../Cursor'

export class Plugin {
  constructor(cursor: Cursor) {}

  mouseMove?(event: MouseEvent): boolean | void
  mouseDown?(event: MouseEvent): void
  mouseUp?(event: MouseEvent): void
}

export const defaultPlugins: (typeof Plugin)[] = [
  WindowBoundaryPlugin,
  SelectionPlugin
]
