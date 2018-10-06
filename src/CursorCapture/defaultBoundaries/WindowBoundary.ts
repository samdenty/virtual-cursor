import { Boundary } from '../Boundary'

export const WindowBoundary: Boundary = cursor => {
  if (cursor.x < 0) cursor.x = 0
  if (cursor.y < 0) cursor.y = 0

  if (cursor.x >= window.innerWidth) cursor.x = window.innerWidth
  if (cursor.y >= window.innerHeight) cursor.y = window.innerHeight

  return cursor
}
