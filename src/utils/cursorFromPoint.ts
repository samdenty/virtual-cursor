import { nodeFromPoint } from './nodeFromPoint'

export const cursorFromPoint = (x: number, y: number) => {
  const element = nodeFromPoint(x, y)
  const targetElement: HTMLElement =
    element instanceof Text ? element.parentElement : element

  // Shouldn't happen, fallback to auto anyway
  if (!targetElement) return 'auto'

  const { cursor } = window.getComputedStyle(targetElement)

  // Special handling for text elements
  if (element instanceof Text && cursor === 'auto') return 'text'

  return cursor
}
