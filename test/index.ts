import { Plugin, Cursor } from '../src'

const cursorCapture = new Cursor({})

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

cursorCapture.plugins.add(new MouseStorage(cursorCapture))
;(window as any).cursorCapture = cursorCapture
