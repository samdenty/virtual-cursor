import { CursorCapture } from '../src/CursorCapture'

const cursorCapture = new CursorCapture({
  hideWhenNotLocked: false
})
;(window as any).cursorCapture = cursorCapture
