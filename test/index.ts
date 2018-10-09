import { Cursor, Plugin, Pointer } from '../src'

const cursorCapture = new Cursor({
  hideWhenNotLocked: false
  // boundaries: [
  //   ...defaultBoundaries,
  //   cursor => {
  //     if (cursor.hoveredElement.className === 'no') return false
  //   }
  // ]
})

class MouseStorage implements Plugin {
  constructor(private pointer: Pointer) {
    const restored = localStorage.getItem('mouse')

    if (restored) {
      const json = JSON.parse(restored)

      pointer.x = json.x
      pointer.y = json.y
    }
  }

  public mouseMove() {
    localStorage.setItem(
      'mouse',
      JSON.stringify({ x: this.pointer.x, y: this.pointer.y })
    )
  }
}

cursorCapture.plugins.add(new MouseStorage(cursorCapture.cursor))
;(window as any).cursorCapture = cursorCapture
