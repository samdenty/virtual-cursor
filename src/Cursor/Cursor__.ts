// import autobind from 'autobind-decorator'
// import { Pointer } from '../Pointer'
// import { Plugin, defaultPlugins } from './Plugin'
// import { isValidEvent } from '../utils'

// export interface ICursorCapture {
//   pointer?: Pointer
//   plugins?: (typeof Plugin)[]
// }

// @autobind
// export class Cursor {
//   public plugins: Set<Plugin>
//   public pointer: Pointer

//   constructor(
//     {
//       plugins = defaultPlugins,
//       pointer = new Pointer()
//     }: ICursorCapture = {} as any
//   ) {
//     const instantiatedPlugins = plugins.map(Plugin => new Plugin(pointer))

//     this.plugins = new Set(instantiatedPlugins)
//     this.pointer = pointer
//   }

//   public cleanup() {
//     // Plugin system
//     for (const plugin of this.plugins) {
//       if (!plugin.cleanup) continue
//       plugin.cleanup()
//     }

//     this.pointer.cleanup()
//   }

//   private onMouseMove(event: MouseEvent) {
//     if (!isValidEvent(event)) return

//     const prevX = this.pointer.x
//     const prevY = this.pointer.y

//     if (event.toElement === this.pointer.canvas) {
//       this.pointer.x += event.movementX / window.devicePixelRatio
//       this.pointer.y += event.movementY / window.devicePixelRatio
//     } else {
//       this.pointer.x = event.pageX
//       this.pointer.y = event.pageY
//     }

//     // Plugin system
//     for (const plugin of this.plugins) {
//       if (!plugin.mouseMove) continue
//       const shouldCancel = plugin.mouseMove() === false

//       if (shouldCancel) {
//         this.pointer.x = prevX
//         this.pointer.y = prevY
//       }
//     }
//   }

//   private onMouseDown(event: MouseEvent) {
//     if (!isValidEvent(event)) return

//     event.preventDefault()
//     event.stopPropagation()

//     // Plugin system
//     for (const plugin of this.plugins) {
//       if (!plugin.mouseDown) continue
//       plugin.mouseDown()
//     }
//   }

//   private onMouseUp(event: MouseEvent) {
//     if (!isValidEvent(event)) return

//     // Plugin system
//     for (const plugin of this.plugins) {
//       if (!plugin.mouseUp) continue
//       plugin.mouseUp()
//     }
//   }
// }
