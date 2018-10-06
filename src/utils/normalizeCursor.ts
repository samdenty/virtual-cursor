export const normalizeCursor = (type: string) => {
  switch (type) {
    case 'all-scroll':
    case 'grab':
    case 'grabbing':
    case 'move':
      return 'grab'
    case 'e-resize':
    case 'ew-resize':
      return 'e-resize'
    case 'ne-resize':
    case 'sw-resize':
    case 'nesw-resize':
      return 'ne-resize'
    case 'ns-resize':
    case 's-resize':
      return 'ns-resize'
    case 'nw-resize':
    case 'se-resize':
    case 'nwse-resize':
      return 'nw-resize'
    case 'crosshair':
    case 'col-resize':
    case 'help':
    case 'n-resize':
    case 'no-drop':
    case 'not-allowed':
    case 'pointer':
    case 'progress':
    case 'wait':
    case 'text':
    case 'w-resize':
    case 'default':
    case 'row-resize':
      return type
    default:
      return 'default'
  }
}
