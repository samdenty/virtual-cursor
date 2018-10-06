import { CursorCapture } from '../src/CursorCapture'

const cursorCapture = new CursorCapture({
  boundaries: []
})
;(window as any).cursorCapture = cursorCapture
