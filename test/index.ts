import {
  Plugin,
  Cursor,
  PointerLockPlugin,
  DragSelectionPlugin,
  ClickSelectionPlugin,
  UserInputPlugin,
  NativeEventsPlugin
} from '../src'

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

class AutoMove implements Plugin {
  constructor(private cursor: Cursor) {
    // setInterval(() => this.cursor.setPosition(this.cursor.x + 1, this.cursor.y))
  }

  public mouseMove() {
    const top = 0
    const bottom = this.cursor.rootRect.height
    const left = 0
    const right = this.cursor.rootRect.width

    const atTop = this.cursor.y <= top
    const atBottom = this.cursor.y >= bottom
    const atLeft = this.cursor.x <= left
    const atRight = this.cursor.x >= right

    if (atTop) {
      this.cursor.y = bottom
    } else if (atBottom) {
      this.cursor.y = top
    }

    if (atLeft) {
      this.cursor.x = right
    } else if (atRight) {
      this.cursor.x = left
      this.cursor.y += 16
    }
  }
}

const cursorCapture = new Cursor({
  root: document.querySelector('.root'),
  plugins: [
    PointerLockPlugin,
    DragSelectionPlugin,
    ClickSelectionPlugin,
    UserInputPlugin,
    NativeEventsPlugin,

    MouseStorage,
    AutoMove
  ]
})

cursorCapture.plugins.add(new MouseStorage(cursorCapture))
;(window as any).cursorCapture = cursorCapture
