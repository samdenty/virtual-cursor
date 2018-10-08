import { CursorCapture } from '../src'

const cursorCapture = new CursorCapture({
  hideWhenNotLocked: false
  // boundaries: [
  //   ...defaultBoundaries,
  //   cursor => {
  //     if (cursor.hoveredElement.className === 'no') return false
  //   }
  // ]
})
;(window as any).cursorCapture = cursorCapture
