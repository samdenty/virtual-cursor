import { CursorIcon } from '../../Cursor'
import { css, normalizeCursor } from '../../utils'

const cursors = {
  alternate: require('./alternate.apng'),
  crosshair: require('./crosshair.apng'),
  'e-resize': require('./e-resize.apng'),
  help: require('./help.apng'),
  'ne-resize': require('./ne-resize.apng'),
  'not-allowed': require('./not-allowed.apng'),
  'ns-resize': require('./ns-resize.apng'),
  pointer: require('./pointer.apng'),
  'row-resize': require('./row-resize.apng'),
  wait: require('./wait.apng'),
  'col-resize': require('./col-resize.apng'),
  default: require('./default.apng'),
  grab: require('./grab.apng'),
  'no-drop': require('./no-drop.apng'),
  'n-resize': require('./n-resize.apng'),
  'nw-resize': require('./nw-resize.apng'),
  progress: require('./progress.apng'),
  text: require('./text.apng'),
  'w-resize': require('./w-resize.apng')
}

export const MacOS: CursorIcon = cursor => {
  let type = normalizeCursor(cursor.type)
  if (!cursors[type]) type = 'default'

  return {
    url: cursors[type],
    style: css`
      background-position: ${type === 'default' ? '-2px -1px' : null};
    `,
    size: 32
  }
}
