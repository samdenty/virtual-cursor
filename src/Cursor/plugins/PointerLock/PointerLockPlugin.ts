import { Plugin, Cursor } from '../../..'
import autobind from 'autobind-decorator'

@autobind
export class PointerLockPlugin implements Plugin {
  constructor(private cursor: Cursor) {
    this.cursor.lock()
  }

  public cleanup() {
    this.cursor.unlock()
  }

  public mouseDown() {
    this.cursor.lock()
  }
}
