import { CursorCapture, Plugin, Cursor } from '../src'

const cursorCapture = new CursorCapture({
  hideWhenNotLocked: false
  // boundaries: [
  //   ...defaultBoundaries,
  //   cursor => {
  //     if (cursor.hoveredElement.className === 'no') return false
  //   }
  // ]
})

class MouseStorage implements Plugin {
  constructor(private cursor: Cursor) {
    const restored = localStorage.getItem('mouse')

    if (restored) {
      const json = JSON.parse(restored)

      cursor.x = json.x
      cursor.y = json.y
    }
  }

  public mouseMove() {
    localStorage.setItem(
      'mouse',
      JSON.stringify({ x: this.cursor.x, y: this.cursor.y })
    )
  }
}

cursorCapture.plugins.add(new MouseStorage(cursorCapture.cursor))
;(window as any).cursorCapture = cursorCapture
